<?php

namespace App\Http\Controllers;

use App\Exports\AssetsExport;
use App\Imports\AssetsImport;
use App\Models\ArchivedAssetDetail;
use App\Models\Asset;
use App\Models\AssetDetail;
use App\Models\Employee;
use App\Models\Product;
use App\Models\WorkStation;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\Writer\PngWriter;
use Illuminate\Support\Facades\URL;
use Endroid\QrCode\RoundBlockSizeMode;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;

class AssetController extends Controller
{
    /**
     * Display a paginated listing of assets assigned to employees.
     *
     * @return \Inertia\Response
     */
    // public function index(): Response
    // {
    //     $assets = Asset::with('employee')->active()->get();

    //     return Inertia::render('Assets/Assets', [
    //         'assets' => $assets,
    //         'title' => 'Assets',
    //         'description' => 'List of all employee assets',
    //     ]);
    // }

    // public function index(Request $request): Response
    // {
    //     $query = Asset::with('employee')->active();

    //     // Apply search filter if search query is provided
    //     if ($request->has('search') && $request->search !== '') {
    //         $query->where(function ($q) use ($request) {
    //             $q->where('ASSETSID', 'like', '%' . $request->search . '%')
    //                 ->orWhere('EMPLOYEENAME', 'like', '%' . $request->search . '%');
    //         });
    //     }

    //     // Apply sorting if sort query is provided
    //     if ($request->has('sort') && $request->sort !== '') {
    //         $sortDirection = $request->sort === 'name_asc' ? 'asc' : 'desc';
    //         $query->orderBy('EMPLOYEENAME', $sortDirection);
    //     }

    //     // Get the filtered and sorted assets
    //     $assets = $query->get();

    //     return Inertia::render('Assets/Assets', [
    //         'assets' => $assets,
    //         'filters' => [
    //             'search' => $request->search, // Make sure search is passed correctly
    //             'sort' => $request->sort,
    //         ],
    //         'title' => 'Assets',
    //         'description' => 'List of all employee assets',
    //     ]);
    // }

    public function index(Request $request): Response
    {
        $query = Asset::with('assetDetails', 'employee.workstation')->active();

        // Apply search filter if search query is provided
        if ($request->has('search') && $request->search !== '') {
            $query->where(function ($q) use ($request) {
                $q->where('ASSETSID', 'like', '%' . $request->search . '%')
                    ->orWhere('EMPLOYEENAME', 'like', '%' . $request->search . '%');
            });
        }

        // Apply sorting if sort query is provided
        if ($request->has('sort') && $request->sort !== '') {
            $sortDirection = $request->sort === 'name_asc' ? 'asc' : 'desc';
            $query->orderBy('EMPLOYEENAME', $sortDirection);
        }

        // Apply date range filter
        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereHas('assetDetails', function ($q) use ($request) {
                $q->whereBetween('DATEISSUUED', [
                    Carbon::parse($request->start_date)->startOfDay(),
                    Carbon::parse($request->end_date)->endOfDay(),
                ]);
            });
        }

        if ($request->filled('description')) {
            $query->whereHas('assetDetails', function ($q) use ($request) {
                $q->where('DESCRIPTION', $request->description);
            });
        }

        if ($request->filled('status')) {
            $query->whereHas('assetDetails', function ($q) use ($request) {
                $q->where('STATUS', $request->status);
            });
        }

        if ($request->filled('issued_to')) {
            $query->whereHas('assetDetails', function ($q) use ($request) {
                $q->where('ISSUEDTO', $request->issued_to);
            });
        }

        $descriptions = AssetDetail::distinct()->pluck('DESCRIPTION');
        $statuses = AssetDetail::distinct()->pluck('STATUS');
        $issuedTos = AssetDetail::distinct()->pluck('ISSUEDTO');

        // Get the filtered and sorted assets
        $assets = $query->get();

        return Inertia::render('Assets/Assets', [
            'assets' => $assets,
            'filters' => [
                'search' => $request->search, // Make sure search is passed correctly
                'sort' => $request->sort,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
            ],
            'descriptions' => $descriptions,
            'statuses' => $statuses,
            'issuedTos' => $issuedTos,
            'title' => 'Assets',
            'desc' => 'List of all employee assets',
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
        $asset = Asset::with(['employee.workstation', 'assetType', 'assetComponents'])->findOrFail($id);

        $asset->load([
            'assetDetails' => function ($q) {
                $q->where('archived', false);
            }
        ]);

        $archivedDetails = $asset->assetDetails()
            ->where('archived', true)
            ->get();

        $user = Auth::user();

        return Inertia::render('Assets/AssetView', [
            'auth' => [
                'user' => [
                    'id' => $user->id,
                    'role' => $user->user_role,
                    'employee_id' => $user->employee ? $user->employee->EMPNO : null,
                ]
            ],
            'asset' => $asset,
            'archivedDetails' => $archivedDetails,
            'title' => 'Asset Details',
            'description' => 'Detailed view of asset',
        ]);
    }

    public function create($id): Response
    {
        $asset = Asset::with(['employee.workstation', 'assetDetails', 'assetType', 'assetComponents'])->findOrFail($id);
        $products = Product::all();
        // $workstations = WorkStation::all();

        // Get the last EMPNO and increment it
        $assetno = AssetDetail::max('ASSETNO');
        $newassetno = $assetno ? $assetno + 1 : null;

        return Inertia::render('Assets/AddAsset', [
            'asset' => $asset,
            'products' => $products,
            'assetno' => $newassetno,
            // 'workstations' => $workstations,
            'title' => 'Add Assets',
            'description' => 'Add a new asset',
        ]);
    }

    public function store(Request $request, $employeeId)
    {
        Log::info($request);

        $validator = Validator::make($request->all(), [
            'ASSETSID' => 'nullable|integer',
            'ASSETNO' => 'required|integer|unique:AssetDetails,ASSETNO',
            'PRODUCTID' => 'nullable|string',
            'DESCRIPTION' => 'nullable|string',
            'MODEL' => 'nullable|string',
            'SERIALNO' => 'nullable|string',
            'STATUS' => 'nullable|string',
            'SYSTEMASSETID' => 'nullable|string|unique:AssetDetails,SYSTEMASSETID',
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed: ' . implode(', ', $validator->errors()->all()));
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // Find the employee
        $employee = Employee::findOrFail($employeeId);

        try {
            $assetdetail = AssetDetail::create([
                'ASSETID' => $request->ASSETSID,
                'EMPLOYEEID' => $employee->EMPNO,
                'ASSETNO' => $request->ASSETNO,
                'PRODUCTID' => $request->PRODUCTID,
                'DESCRIPTION' => $request->DESCRIPTION,
                'MODEL' => $request->MODEL,
                'SERIALNO' => $request->SERIALNO,
                'ISSUEDTO' => $request->ISSUEDTO,
                'DATEISSUUED' => $request->DATEISSUUED,
                'SERIALTYPE' => $request->SERIALTYPE,
                'STATUS' => $request->STATUS,
                'ASSETFROM' => $request->ASSETFROM,
                'CONDITIONS' => $request->CONDITIONS,
                'SYSTEMASSETID' => $request->SYSTEMASSETID,
                'WORKSTATION' => $request->WORKSTATION,
            ]);
            Log::info('AssetDetails to save', $assetdetail->toArray());
        } catch (\Exception $e) {
            Log::error('Error saving AssetDetail: ' . $e->getMessage());
            return redirect()->back()->with('error', 'There was an error saving the asset.');
        }

        return redirect(route('assets.show', ['id' => $request->ASSETSID]))->with('success', 'Asset added successfully.');
    }

    /**
     * Delete a specific asset.
     *
     * @param  \App\Models\
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($assetId, $assetNo)
    {
        Log::info("Attempting to delete asset detail with ASSETNO: $assetNo within ASSETID: $assetId");

        $assetDetail = AssetDetail::where('ASSETID', $assetId)
            ->where('ASSETNO', $assetNo)
            ->firstOrFail();

        Log::info("Found AssetDetail to delete: " . json_encode($assetDetail));

        $assetDetail->delete();

        return redirect(route('assets.index'))->with('success', 'Asset detail deleted successfully!');
    }

    public function edit($assetId, $assetNo)
    {
        // Fetch the asset detail and related data
        $assetDetail = AssetDetail::where('ASSETID', $assetId)
            ->where('ASSETNO', $assetNo)
            ->with('asset.employee')
            ->firstOrFail();

        // Fetch employee details
        $employee = Employee::findOrFail($assetDetail->EMPLOYEEID);

        $products = Product::all();

        return Inertia::render('Assets/EditAsset', [
            'assetDetail' => $assetDetail,
            'employee' => $employee,
            'products' => $products,
            'title' => 'Edit Asset',
            'description' => 'Update asset details',
        ]);
    }

    public function update(Request $request, $assetId, $assetNo)
    {
        // Log the request
        Log::info($request);

        Log::info("Attempting to update asset detail with ASSETNO: $assetNo within ASSETID: $assetId");

        // Validate incoming request
        $validator = Validator::make($request->all(), [
            'PRODUCTID' => 'nullable|string',
            'DESCRIPTION' => 'nullable|string',
            'MODEL' => 'nullable|string',
            'SERIALNO' => 'nullable|string|unique:AssetDetails,SERIALNO,' . $assetNo . ',ASSETNO',
            'ISSUEDTO' => 'nullable|string',
            'DATEISSUUED' => 'nullable|date',
            'IMAGEPATH' => 'nullable|string',
            'SERIALTYPE' => 'nullable|string',
            'STATUS' => 'nullable|string',
            'ASSETFROM' => 'nullable|string',
            'CONDITIONS' => 'nullable|string',
            'WORKSTAION' => 'nullable|string',
            'TYPESIZE' => 'nullable|string',
            'NOPRINT' => 'nullable|integer',
            'COMPONENT' => 'nullable|string',
            'WITHCOMPONENTS' => 'nullable|integer',
            'SYSTEMASSETID' => 'nullable|string|unique:AssetDetails,SYSTEMASSETID,' . $assetNo . ',ASSETNO',
            'SYSTEMCOMPONENTID' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed: ' . implode(', ', $validator->errors()->all()));
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // Find the specific asset detail
        $assetDetail = AssetDetail::where('ASSETID', $assetId)
            ->where('ASSETNO', $assetNo)
            ->firstOrFail();

        Log::info("Found AssetDetail to update: " . json_encode($assetDetail));

        $assetDetail->update([
            'PRODUCTID' => $request->PRODUCTID,
            'DESCRIPTION' => $request->DESCRIPTION,
            'MODEL' => $request->MODEL,
            'SERIALNO' => $request->SERIALNO,
            'ISSUEDTO' => $request->ISSUEDTO,
            'DATEISSUUED' => $request->DATEISSUUED,
            'IMAGEPATH' => $request->IMAGEPATH,
            'SERIALTYPE' => $request->SERIALTYPE,
            'STATUS' => $request->STATUS,
            'ASSETFROM' => $request->ASSETFROM,
            'CONDITIONS' => $request->CONDITIONS,
            'WORKSTAION' => $request->WORKSTAION,
            'TYPESIZE' => $request->TYPESIZE,
            'NOPRINT' => $request->NOPRINT,
            'COMPONENT' => $request->COMPONENT,
            'WITHCOMPONENTS' => $request->WITHCOMPONENTS,
            'SYSTEMASSETID' => $request->SYSTEMASSETID,
            'SYSTEMCOMPONENTID' => $request->SYSTEMCOMPONENTID,
        ]);

        Log::info("Updated AssetDetail: " . json_encode($assetDetail));

        return redirect(route('assets.index'))->with('success', 'Asset detail updated successfully!');
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

    // public function generateEmployeeAssetReport($employeeId)
    // {
    //     $employee = Employee::with('assets.assetDetails')->findOrFail($employeeId);

    //     foreach ($employee->assets as $asset) {
    //         $url = URL::route('assets.show', ['id' => $asset->ASSETSID]); // Fixing the ID reference

    //         $builder = new Builder(
    //             writer: new PngWriter(),
    //             writerOptions: [],
    //             validateResult: false,
    //             data: $url,
    //             encoding: new Encoding('UTF-8'),
    //             errorCorrectionLevel: ErrorCorrectionLevel::High,
    //             size: 150,
    //             margin: 5,
    //             roundBlockSizeMode: RoundBlockSizeMode::Margin
    //         );

    //         $asset->qr_code = 'data:image/png;base64,' . base64_encode($builder->build()->getString());
    //     }

    //     Log::info($employee->assets);

    //     // Generate PDF
    //     $pdf = Pdf::loadView('pdf.employee_asset_report', compact('employee'));
    //     $fileName = preg_replace('/\s+/', '_', trim($employee->EMPLOYEENAME)) . '_Asset_Registry_Information.pdf';
    //     return $pdf->download($fileName);
    // }

    public function generateEmployeeAssetReport($employeeId)
    {
        // Fetch employee with only active assets (i.e., assets that are not archived)
        $employee = Employee::with(['assets' => function ($query) {
            $query->where('archived', false); // Exclude archived assets
        }, 'assets.assetDetails' => function ($query) {
            $query->where('archived', false); // Exclude archived asset details
        }])->findOrFail($employeeId);

        // Loop through the assets assigned to the employee and generate QR codes
        foreach ($employee->assets as $asset) {
            foreach ($asset->assetDetails as $detail) {
                // Generate the QR code based on SYSTEMASSETID
                $url = URL::route('assets.show', ['id' => $detail->SYSTEMASSETID]);

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

                $detail->qr_code = 'data:image/png;base64,' . base64_encode($builder->build()->getString());
            }
        }

        // Generate PDF
        $pdf = Pdf::loadView('pdf.employee_asset_report', compact('employee'));
        $fileName = preg_replace('/\s+/', '_', trim($employee->EMPLOYEENAME)) . '_Asset_Registry_Information.pdf';
        return $pdf->download($fileName);
    }

    // public function viewEmployeeAssets($employeeId)
    // {
    //     // Fetch employee with only active assets (i.e., assets that are not archived)
    //     $employee = Employee::with(['assets' => function ($query) {
    //         $query->where('archived', false); // Exclude archived assets
    //     }, 'assets.assetDetails' => function ($query) {
    //         $query->where('archived', false); // Exclude archived asset details
    //     }])->findOrFail($employeeId);

    //     // Loop through the assets assigned to the employee and generate QR codes
    //     foreach ($employee->assets as $asset) {
    //         foreach ($asset->assetDetails as $detail) {
    //             // Generate the QR code based on SYSTEMASSETID
    //             $url = URL::route('assets.show', ['id' => $detail->SYSTEMASSETID]);

    //             $builder = new Builder(
    //                 writer: new PngWriter(),
    //                 writerOptions: [],
    //                 validateResult: false,
    //                 data: $url,
    //                 encoding: new Encoding('UTF-8'),
    //                 errorCorrectionLevel: ErrorCorrectionLevel::High,
    //                 size: 150,
    //                 margin: 5,
    //                 roundBlockSizeMode: RoundBlockSizeMode::Margin
    //             );

    //             $detail->qr_code = 'data:image/png;base64,' . base64_encode($builder->build()->getString());
    //         }
    //     }

    //     // Return the Blade view as normal HTML
    //     // return view('pdf.employee_asset_report', compact('employee'));
    // }

    public function viewEmployeeAssets($employeeId)
    {
        // Fetch employee with only active assets (i.e., assets that are not archived)
        $employee = Employee::with(['assets' => function ($query) {
            $query->where('archived', false); // Exclude archived assets
        }, 'assets.assetDetails' => function ($query) {
            $query->where('archived', false); // Exclude archived asset details
        }])->findOrFail($employeeId);

        // Loop through the assets assigned to the employee and generate QR codes
        foreach ($employee->assets as $asset) {
            foreach ($asset->assetDetails as $detail) {
                // Generate the QR code based on SYSTEMASSETID
                $url = URL::route('assets.show', ['id' => $detail->SYSTEMASSETID]);

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

                $detail->qr_code = 'data:image/png;base64,' . base64_encode($builder->build()->getString());
            }
        }

        // Pass employee data to the Inertia component
        return Inertia::render('Assets/ViewToPrint', [
            'employee' => $employee,  // Pass the employee data here
            'title' => '',
            'description' => '',
        ]);
    }

    public function exportAssets()
    {
        $year = now()->year;
        return Excel::download(new AssetsExport, "DSC_Assets_Registry_Information_{$year}.xlsx");
    }

    public function showForm()
    {
        return Inertia::render('Excel/ImportForm');
    }

    public function importAssets(Request $request)
    {
        // Validate the uploaded file
        $request->validate([
            'file' => 'required|mimes:xlsx,csv|max:2048'
        ]);

        // Get the uploaded file
        $file = $request->file('file');

        // Ensure the file is valid
        if (!$file->isValid()) {
            Log::error('Invalid file uploaded');
            return redirect()->route('assets.showForm')->with('error', 'Invalid file uploaded.');
        }

        DB::beginTransaction(); // Start the transaction for the whole process

        try {
            // Generate a unique file name
            $fileName = uniqid() . '-' . $file->getClientOriginalName();

            // Move the file manually to storage/app/public/assets
            $destinationPath = storage_path('app/public/assets');
            $file->move($destinationPath, $fileName);
            $filePath = 'assets/' . $fileName;

            // Ensure the file exists before proceeding
            if (!file_exists(storage_path('app/public/' . $filePath))) {
                Log::error('File does not exist at path:', [storage_path('app/public/' . $filePath)]);
                return redirect()->route('assets.showForm')->with('error', 'File does not exist.');
            }

            // Import the Excel file using the AssetsImport class
            Excel::import(new AssetsImport, storage_path('app/public/' . $filePath));

            DB::commit(); // Commit the transaction if everything is successful

            // Redirect back with success message
            return redirect()->route('assets.showForm')->with('success', 'Assets imported successfully!');
        } catch (\Exception $e) {
            DB::rollBack(); // Rollback the transaction if any error occurs
            Log::error('Error importing file:', ['error' => $e->getMessage()]);
            return redirect()->route('assets.showForm')->with('error', 'An error occurred during the import process.');
        }
    }

    public function archive(Request $request, $assetId, $assetNo)
    {
        Log::info('Archiving request:', $request->all());

        $assetDetail = AssetDetail::where('ASSETID', $assetId)
            ->where('ASSETNO', $assetNo)
            ->firstOrFail();

        // Store archival details
        ArchivedAssetDetail::create([
            'asset_detail_id' => $assetDetail->ASSETNO,
            'archival_reason' => $request->reason,
            'status' => $request->status,
            'conditions' => $request->condition,
            'archived_at' => now(),
        ]);

        $assetDetail->update(['archived' => true]);

        return redirect()->back()->with('success', 'Asset archived successfully.');
    }

    public function restore($assetId, $assetNo)
    {
        $assetDetail = AssetDetail::where('ASSETID', $assetId)
            ->where('ASSETNO', $assetNo)
            ->firstOrFail();

        $assetDetail->update(['archived' => false]);

        return redirect()->back()->with('success', 'Asset restored successfully.');
    }
}
