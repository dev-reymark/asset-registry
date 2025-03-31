<?php

namespace App\Http\Controllers;

use App\Exports\AssetsExport;
use App\Imports\AssetsImport;
use App\Models\Asset;
use App\Models\AssetDetail;
use App\Models\Employee;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\Writer\PngWriter;
use Illuminate\Support\Facades\URL;
use Endroid\QrCode\RoundBlockSizeMode;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;

class AssetController extends Controller
{
    /**
     * Display a paginated listing of assets assigned to employees.
     *
     * @return \Inertia\Response
     */
    public function index(): Response
    {
        $assets = Asset::with('employee')->get();

        return Inertia::render('Assets', [
            'assets' => $assets,
            'title' => 'Assets',
            'description' => 'List of all employee assets',
        ]);
    }

    /**
     * Display a specific asset by ID.
     *
     * @param int $id
     * @return \Inertia\Response
     */
    public function show($id): Response
    {
        $asset = Asset::with(['employee', 'assetDetails', 'assetType', 'assetComponents'])->findOrFail($id);

        return Inertia::render('AssetView', [
            'asset' => $asset,
            'title' => 'Asset Details',
            'description' => 'Detailed view of asset',
        ]);
    }

    /**
     * Generate QR code for an asset.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function generateQrCodeByAssetID($id)
    {
        $asset = Asset::findOrFail($id);
        $url = URL::route('assets.show', ['id' => $id]);

        // Create QR Code
        $builder = new Builder(
            writer: new PngWriter(),
            writerOptions: [],
            validateResult: false,
            data: $url,
            encoding: new Encoding('UTF-8'),
            errorCorrectionLevel: ErrorCorrectionLevel::High,
            size: 300,
            margin: 10,
            roundBlockSizeMode: RoundBlockSizeMode::Margin
        );

        $result = $builder->build();

        return response($result->getString(), 200, ['Content-Type' => 'image/png']);
    }

    /**
     * Show an asset using QR code scan.
     *
     * @param int $id
     * @return \Inertia\Response
     */
    public function showAssetQrByAssetID($id): Response
    {
        $asset = Asset::with(['employee', 'assetDetails'])->findOrFail($id);

        return Inertia::render('AssetQrView', [
            'asset' => $asset,
            'title' => 'Asset Details via QR',
            'description' => 'View of asset details',
        ]);
    }

    /**
     * Generate QR code for each asset via SYSTEMASSETID.
     *
     * @param int $systemAssetId
     * @return \Illuminate\Http\Response
     */
    public function generateQrCode($systemAssetId)
    {
        $assetDetail = AssetDetail::where('SYSTEMASSETID', $systemAssetId)->firstOrFail();
        $url = URL::route('assets.detail', ['systemAssetId' => $systemAssetId], true);

        // Create QR Code
        $builder = new Builder(
            writer: new PngWriter(),
            writerOptions: [],
            validateResult: false,
            data: $url,
            encoding: new Encoding('UTF-8'),
            errorCorrectionLevel: ErrorCorrectionLevel::High,
            size: 300,
            margin: 10,
            roundBlockSizeMode: RoundBlockSizeMode::Margin
        );

        $result = $builder->build();

        return response($result->getString(), 200, ['Content-Type' => 'image/png']);
    }

    /**
     * Show detailed asset information via QR.
     *
     * @param int $systemAssetId
     * @return \Inertia\Response
     */
    public function showAssetDetail($systemAssetId): Response
    {
        $assetDetail = AssetDetail::where('SYSTEMASSETID', $systemAssetId)
            ->with('asset')
            ->firstOrFail();

        return Inertia::render('AssetDetailView', [
            'assetDetail' => $assetDetail,
            'title' => 'Asset Detail',
            'description' => 'View of specific asset detail',
        ]);
    }

    public function generateEmployeeAssetReport($employeeId)
    {
        $employee = Employee::with('assets.assetDetails')->findOrFail($employeeId);

        foreach ($employee->assets as $asset) {
            $url = URL::route('assets.show', ['id' => $asset->ASSETSID]); // Fixing the ID reference

            $builder = new Builder(
                writer: new PngWriter(),
                writerOptions: [],
                validateResult: false,
                data: $url,
                encoding: new Encoding('UTF-8'),
                errorCorrectionLevel: ErrorCorrectionLevel::High,
                size: 150,
                margin: 5,
                roundBlockSizeMode: RoundBlockSizeMode::Margin
            );

            $asset->qr_code = 'data:image/png;base64,' . base64_encode($builder->build()->getString());
        }

        Log::info($employee->assets);

        // Generate PDF
        $pdf = Pdf::loadView('pdf.employee_asset_report', compact('employee'));
        $fileName = preg_replace('/\s+/', '_', trim($employee->EMPLOYEENAME)) . ".pdf";
        return $pdf->download($fileName);
    }

    public function exportAssets()
    {
        $year = now()->year;
        return Excel::download(new AssetsExport, "DSC_Assets_{$year}.xlsx");
    }

    public function importAssets(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,csv'
        ]);

        Excel::import(new AssetsImport, $request->file('file'));

        return back()->with('success', 'Assets imported successfully.');
    }
}
