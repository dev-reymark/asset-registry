<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\AssetComponent;
use App\Models\AssetDetail;
use App\Models\ComponentDetail;
use App\Models\Employee;
use App\Models\Location;
use App\Models\Product;
use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\RoundBlockSizeMode;
use Endroid\QrCode\Writer\PngWriter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AssetExtendedController extends Controller
{
    public function create()
    {
        $asset = Asset::with(['employee', 'assetDetails.location', 'assetType', 'assetComponents'])->get();
        $products = Product::with(['assetComponent'])->get();
        $location = Location::all();
        $assetcomponents = AssetComponent::all();

        // Get the last EMPNO and increment it
        $assetno = AssetDetail::max('ASSETNO');
        $newassetno = $assetno ? $assetno + 1 : null;

        // Get the last COMPONENTNUMBER for each EMPLOYEEID and PRODUCTID combination
        $lastComponentNumbers = ComponentDetail::select('EMPLOYEEID', 'PRODUCTID', DB::raw('MAX(COMPONENTNUMBER) as last_component_number'))
            ->groupBy('EMPLOYEEID', 'PRODUCTID')
            ->get()
            ->keyBy(function ($item) {
                return "{$item->EMPLOYEEID}-{$item->PRODUCTID}"; // Unique key for EMPLOYEEID-PRODUCTID combination
            });

        return Inertia::render('AssetsExtended/AddAsset', [
            'asset' => $asset,
            'assetcomponents' => $assetcomponents,
            'location' => $location,
            'products' => $products,
            'assetno' => $newassetno,
            'lastComponentNumbers' => $lastComponentNumbers,
            'title' => 'Add Assets',
            'description' => 'Add a new asset',
        ]);
    }

    public function store(Request $request)
    {
        Log::info('Incoming asset detail request', ['data' => $request->all()]);

        $validated = $request->validate([
            'ASSETSID' => 'required|exists:Assets,ASSETSID',
            'EMPLOYEEID' => 'nullable|numeric',
            'EMPLOYEENAME' => 'nullable|string|max:255',
            'ASSETNO' => 'nullable',
            'PRODUCTID' => 'nullable|exists:products,PRODUCTID',
            'DESCRIPTION' => 'nullable|string|max:255',
            'MODEL' => 'nullable|string|max:255',
            // 'SERIALNO' => 'nullable|unique:AssetDetails,SERIALNO',
            'SERIALNO' => 'nullable|string',
            'ISSUEDTO' => 'nullable|string|max:255',
            'DATEISSUUED' => 'nullable|date',
            'IMAGEPATH' => 'nullable|array',
            'IMAGEPATH.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'STATUS' => 'nullable|string|max:255',
            'CONDITIONS' => 'nullable|string|max:255',
            'WORKSTATION' => 'nullable|string|max:255',
            'TYPESIZE' => 'nullable|string|max:255',
            'NOPRINT' => 'nullable|string|max:255',
            'COMPONENT' => 'nullable|array',
            'COMPONENT.*.ASSETCOMPONENTNAME' => 'required|string|max:255',
            'COMPONENT.*.DESCRIPTION' => 'nullable|string|max:255',
            'COMPONENT.*.ASSETTYPEID' => 'nullable|numeric',
            'COMPONENT.*.ASSETCOMPNETID' => 'nullable|numeric',
            'COMPONENT.*.SYSTEMCOMPONENTID' => 'nullable|string|max:255',
            'WITHCOMPONENTS' => 'nullable|boolean',
            'SYSTEMASSETID' => 'nullable|string|regex:/^[\w-]+$/',
            'SYSTEMCOMPONENTID' => 'nullable|string|max:255',
            'LOCATIONID' => 'nullable|integer|exists:location,LOCATIONID',
        ]);

        Log::info('Validated request data', ['validated' => $validated]);

        DB::beginTransaction();

        try {
            $imagePaths = [];

            if ($request->hasFile('IMAGEPATH')) {
                Log::info('Processing uploaded images');

                foreach ($request->file('IMAGEPATH') as $file) {
                    if ($file->isValid()) {
                        $fileName = uniqid() . '-' . $file->getClientOriginalName();
                        $destinationPath = storage_path('app/public/assets');

                        if (!file_exists($destinationPath)) {
                            mkdir($destinationPath, 0755, true);
                            Log::info('Created assets directory', ['path' => $destinationPath]);
                        }

                        $file->move($destinationPath, $fileName);
                        $relativePath = 'assets/' . $fileName;

                        if (!file_exists(storage_path('app/public/' . $relativePath))) {
                            Log::error('Image upload failed. File not found.', ['path' => $relativePath]);
                            DB::rollBack();
                            return redirect()->route('assetsextended.create')->with('error', 'Image upload failed.');
                        }

                        $imagePaths[] = $relativePath;
                        Log::info('Image uploaded', ['path' => $relativePath]);
                    } else {
                        Log::warning('Skipped invalid image file');
                    }
                }
            }

            $components = $validated['COMPONENT'] ?? [];
            Log::info('Component data prepared', ['components_count' => count($components)]);

            $assetDetail = AssetDetail::create([
                'EMPLOYEEID' => $validated['EMPLOYEEID'] ?? null,
                'ASSETID' => $validated['ASSETSID'],
                'ASSETNO' => $validated['ASSETNO'] ?? null,
                'PRODUCTID' => $validated['PRODUCTID'] ?? null,
                'DESCRIPTION' => $validated['DESCRIPTION'] ?? null,
                'MODEL' => $validated['MODEL'] ?? null,
                'SERIALNO' => $validated['SERIALNO'] ?? null,
                'ISSUEDTO' => $validated['ISSUEDTO'] ?? null,
                'DATEISSUUED' => $validated['DATEISSUUED'] ?? null,
                'IMAGEPATH' => json_encode($imagePaths),
                'STATUS' => $validated['STATUS'] ?? null,
                'CONDITIONS' => $validated['CONDITIONS'] ?? null,
                'WORKSTAION' => $validated['WORKSTATION'] ?? null,
                'TYPESIZE' => $validated['TYPESIZE'] ?? null,
                'NOPRINT' => $validated['NOPRINT'] ?? null,
                'COMPONENT' => null,
                'WITHCOMPONENTS' => $validated['WITHCOMPONENTS'] ?? false,
                'SYSTEMASSETID' => $validated['SYSTEMASSETID'] ?? null,
                'SYSTEMCOMPONENTID' => $validated['SYSTEMCOMPONENTID'] ?? null,
                'archived' => false,
                'LOCATIONID' => $validated['LOCATIONID'] ?? null,
            ]);

            Log::info('AssetDetail record created', ['id' => $assetDetail->id]);

            foreach ($components as $index => $component) {
                $componentDetail = ComponentDetail::create([
                    'EMPLOYEEID' => $validated['EMPLOYEEID'],
                    'PRODUCTID' => $validated['PRODUCTID'],
                    'ASSETNO' => $validated['ASSETNO'],
                    'SYSTEMCOMPONENTID' => $component['SYSTEMCOMPONENTID'] ?? null,
                    'ASSETCOMPNETID' => $component['ASSETCOMPNETID'] ?? null,
                    'COMPONENTDESCRIPTION' => $component['DESCRIPTION'] ?? null,
                ]);
                Log::info("ComponentDetail #{$index} created", ['id' => $componentDetail->id]);
            }

            DB::commit();
            Log::info('Asset detail and components stored successfully');
            return redirect()->route('assetsextended.create')->with('success', 'Asset detail added successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Asset Store Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->route('assetsextended.create')->with('error', 'An error occurred while adding asset details.');
        }
    }

    public function edit($assetNo)
    {
        // Get the asset detail and related data
        $assetDetail = AssetDetail::where('ASSETNO', $assetNo)
            ->with('asset.employee', 'componentDetails.assetComponent', 'location')
            ->firstOrFail();

        $employees = Employee::findOrFail($assetDetail->EMPLOYEEID);
        $products = Product::with(['assetComponent'])->get();
        $locations = Location::all();
        $assetcomponents = AssetComponent::all();

        return Inertia::render('AssetsExtended/EditAsset', [
            'assetDetail' => $assetDetail,
            'assetcomponents' => $assetcomponents,
            'products' => $products,
            'locations' => $locations,
            'employees' => $employees,
            'title' => 'Edit Asset',
            'description' => 'Edit the asset details',
        ]);
    }

    public function update(Request $request, $assetNo)
    {
        Log::debug('Update request data:', ['data' => $request->all()]);

        $validated = $request->validate([
            'ASSETID' => 'required|exists:Assets,ASSETSID',
            'EMPLOYEEID' => 'nullable|numeric',
            'PRODUCTID' => 'nullable|exists:products,PRODUCTID',
            'DESCRIPTION' => 'nullable|string|max:255',
            'MODEL' => 'nullable|string|max:255',
            // 'SERIALNO' => 'nullable|unique:AssetDetails,SERIALNO,' . $assetNo . ',ASSETNO',
            'SERIALNO' => 'nullable|string',
            'ISSUEDTO' => 'nullable|string|max:255',
            'DATEISSUUED' => 'nullable|date',
            'IMAGEPATH' => 'nullable|array',
            'IMAGEPATH.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'STATUS' => 'nullable|string|max:255',
            'CONDITIONS' => 'nullable|string|max:255',
            'WORKSTATION' => 'nullable|string|max:255',
            'TYPESIZE' => 'nullable|string|max:255',
            'NOPRINT' => 'nullable|string|max:255',
            'COMPONENT' => 'nullable|array',
            'COMPONENT.*.COMPONENTDESCRIPTION' => 'nullable|string|max:255',
            'COMPONENT.*.ASSETTYPEID' => 'nullable|numeric',
            'COMPONENT.*.ASSETCOMPNETID' => 'nullable|numeric',
            'COMPONENT.*.SYSTEMCOMPONENTID' => 'nullable|string|max:255',
            'WITHCOMPONENTS' => 'nullable|boolean',
            'SYSTEMASSETID' => 'nullable|string|regex:/^[\w-]+$/',
            'SYSTEMCOMPONENTID' => 'nullable|string|max:255',
            'LOCATIONID' => 'nullable|integer|exists:location,LOCATIONID',
        ]);

        DB::beginTransaction();

        try {
            $assetDetail = AssetDetail::findOrFail($assetNo);

            $existingPaths = json_decode($request->input('existing_images'), true) ?? [];
            $imagePaths = []; // Initialize $imagePaths as an empty array
            $imagePaths = array_merge($imagePaths, $existingPaths);

            if ($request->hasFile('new_images')) {
                foreach ($request->file('new_images') as $file) {
                    if ($file->isValid()) {
                        $fileName = uniqid() . '-' . $file->getClientOriginalName();
                        $destinationPath = storage_path('app/public/assets');

                        if (!file_exists($destinationPath)) {
                            mkdir($destinationPath, 0755, true);
                        }

                        $file->move($destinationPath, $fileName);
                        $relativePath = 'assets/' . $fileName;
                        $imagePaths[] = $relativePath;
                    }
                }
            }

            $components = $validated['COMPONENT'] ?? [];
            $withComponents = is_array($components) && count($components) > 0;

            // Update the main asset detail
            $assetDetail->update([
                'EMPLOYEEID' => $validated['EMPLOYEEID'],
                'ASSETID' => $validated['ASSETID'],
                'PRODUCTID' => $validated['PRODUCTID'],
                'DESCRIPTION' => $validated['DESCRIPTION'],
                'MODEL' => $validated['MODEL'],
                'SERIALNO' => $validated['SERIALNO'],
                'ISSUEDTO' => $validated['ISSUEDTO'],
                'DATEISSUUED' => $validated['DATEISSUUED'],
                'IMAGEPATH' => json_encode($imagePaths),
                'STATUS' => $validated['STATUS'],
                'CONDITIONS' => $validated['CONDITIONS'],
                'WORKSTAION' => $validated['WORKSTATION'],
                'TYPESIZE' => $validated['TYPESIZE'],
                'NOPRINT' => $validated['NOPRINT'],
                'COMPONENT' => null,
                'WITHCOMPONENTS' => $withComponents,
                'SYSTEMASSETID' => $validated['SYSTEMASSETID'],
                'SYSTEMCOMPONENTID' => $validated['SYSTEMCOMPONENTID'],
                'LOCATIONID' => $validated['LOCATIONID'],
            ]);

            // Update related ComponentDetails
            ComponentDetail::where('ASSETNO', $assetNo)->delete(); // Clear old components

            foreach ($components as $component) {
                ComponentDetail::create([
                    'EMPLOYEEID' => $validated['EMPLOYEEID'],
                    'PRODUCTID' => $validated['PRODUCTID'],
                    'ASSETNO' => $assetNo,
                    'SYSTEMCOMPONENTID' => $component['SYSTEMCOMPONENTID'] ?? null,
                    'ASSETCOMPNETID' => $component['ASSETCOMPNETID'] ?? null,
                    'COMPONENTDESCRIPTION' => $component['COMPONENTDESCRIPTION'] ?? null,
                ]);
            }

            DB::commit();
            return redirect()->route('assetsextended.edit', ['assetNo' => $assetNo])->with('success', 'Asset detail updated successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Asset Update Error', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return redirect()->route('assetsextended.edit', ['assetNo' => $assetNo])->with('error', 'An error occurred while updating asset details.');
        }
    }

    public function transfer(Request $request)
    {
        Log::debug('Transfer request data:', ['data' => $request->all()]);

        $validated = $request->validate([
            'asset_nos' => 'array',
            'asset_nos.*' => 'integer',
            'employee_id' => 'integer|exists:employee,EMPLOYEEID',
            'location_id' => 'integer|exists:location,LOCATIONID',
            'status' => 'string',
        ]);

        Log::debug('Validated Data:', ['validated' => $validated]);

        $locationExists = DB::table('location')->where('LOCATIONID', $validated['location_id'])->exists();
        Log::debug('Location Exists:', ['exists' => $locationExists]);

        if (!$locationExists) {
            Log::error('Location ID does not exist.');
            return redirect()->route('assets.index')->with('error', 'Invalid location.');
        }

        DB::transaction(function () use ($validated) {
            $employee = Employee::where('EMPLOYEEID', $validated['employee_id'])->first();
            $asset = Asset::where('EMPLOYEEID', optional($employee)->EMPNO)->first();

            // Step 1: Get old EMPLOYEEIDs before update
            $oldEmployeeIds = AssetDetail::whereIn('ASSETNO', $validated['asset_nos'])
                ->pluck('EMPLOYEEID')
                ->unique()
                ->filter(fn($id) => $id != $validated['employee_id']);

            // Step 2: Update asset ownership
            AssetDetail::whereIn('ASSETNO', $validated['asset_nos'])->update([
                'EMPLOYEEID' => $validated['employee_id'],
                'LOCATIONID' => $validated['location_id'],
                'STATUS' => $validated['status'],
                'ISSUEDTO' => optional($employee)->EMPNO,
                'ASSETID' => optional($asset)->ASSETSID,
            ]);

            // Step 3: Reorder old employee asset numbers
            foreach ($oldEmployeeIds as $oldId) {
                AssetDetail::reorderAssetNumbersForEmployee($oldId);
            }

            // Step 4: Manually reassign ASSETNUMBER to new employee's transferred assets
            $maxAssetNumber = AssetDetail::where('EMPLOYEEID', $validated['employee_id'])
                ->whereNotIn('ASSETNO', $validated['asset_nos']) // exclude transferred ones
                ->where('archived', false)
                ->max('ASSETNUMBER') ?? 0;

            $assetDetails = AssetDetail::whereIn('ASSETNO', $validated['asset_nos'])->get();

            foreach ($assetDetails as $detail) {
                $detail->ASSETNUMBER = ++$maxAssetNumber;
                $detail->SYSTEMASSETID = "{$validated['employee_id']}-{$detail->PRODUCTID}-{$detail->ASSETNUMBER}";
                $detail->save();
            }

            // Step 5: Final cleanup reorder for the new employee (just in case)
            AssetDetail::reorderAssetNumbersForEmployee($validated['employee_id']);
        });

        return redirect()->route('assets.index')->with('success', 'Assets transferred successfully.');
    }

    public function declassify(Request $request)
    {
        Log::debug('Transfer request data:', ['data' => $request->all()]);

        $validated = $request->validate([
            'asset_nos' => 'array',
            'asset_nos.*' => 'integer',
            'location_id' => 'integer|exists:location,LOCATIONID',
            'status' => 'string',
        ]);

        Log::debug('Validated Data:', ['validated' => $validated]);

        // Check if location_id exists and log
        $locationExists = DB::table('location')->where('LOCATIONID', $validated['location_id'])->exists();
        Log::debug('Location Exists:', ['exists' => $locationExists]);

        if (!$locationExists) {
            Log::error('Location ID does not exist.');
            return redirect()->route('assets.index')->with('error', 'Invalid location.');
        }

        // Wrap in transaction for atomicity
        DB::transaction(function () use ($validated) {
            $updated = AssetDetail::whereIn('ASSETNO', $validated['asset_nos'])
                ->update([
                    'LOCATIONID' => $validated['location_id'],
                    'STATUS' => $validated['status']
                ]);

            Log::debug('Number of rows updated:', ['updated' => $updated]);
        });

        return redirect()->route('assets.index')->with('success', 'Assets transferred successfully.');
    }

    public function archive(Request $request, $assetNo)
    {
        Log::debug('Archive request data:', ['data' => $request->all()]);

        $request->validate([
            'archival_reason' => 'required|string|max:255',
            'status' => 'nullable|string|max:255',
            'conditions' => 'nullable|string|max:255',
        ]);

        $asset = AssetDetail::findOrFail($assetNo);

        $asset->archive(
            $request->input('archival_reason'),
            $request->input('status'),
            $request->input('conditions')
        );

        return redirect()->route('assets.index')->with('success', 'Asset archived successfully.');
    }

    public function restore($assetNo)
    {
        $asset = AssetDetail::with('archivedDetail')->findOrFail($assetNo);

        if (!$asset->archived) {
            return redirect()->route('assets.index')->with('error', 'Asset is not archived.');
        }

        $asset->restore();

        return redirect()->route('assets.index')->with('success', 'Asset restored successfully.');
    }

    public function bulkArchive(Request $request)
    {
        $request->validate([
            'asset_nos' => 'array|required',
            'asset_nos.*' => 'integer|exists:asset_details,ASSETNO',
            'archival_reason' => 'required|string|max:255',
            'status' => 'required|string|max:255',
            'conditions' => 'required|string|max:255',
        ]);

        try {
            DB::transaction(function () use ($request) {
                foreach ($request->asset_nos as $assetNo) {
                    $asset = AssetDetail::where('ASSETNO', $assetNo)->firstOrFail();
                    $asset->archive(
                        $request->input('archival_reason'),
                        $request->input('status'),
                        $request->input('conditions')
                    );
                }
            });

            return redirect()->route('assets.index')->with('success', 'Assets archived successfully.');
        } catch (\Exception $e) {
            Log::error('Bulk archive failed', ['error' => $e->getMessage()]);
            return redirect()->route('assets.index')->with('error', 'An error occurred while archiving assets.');
        }
    }

    // public function generateQRCodes(Request $request)
    // {
    //     $validated = $request->validate([
    //         'asset_nos' => 'required|array',
    //         'asset_nos.*' => 'integer',
    //     ]);

    //     $assets = Asset::whereIn('ASSETNO', $validated['asset_nos'])->get();


    //     // Create QR Code
    //     $builder = new Builder(
    //         writer: new PngWriter(),
    //         writerOptions: [],
    //         validateResult: false,
    //         // data: $url,
    //         encoding: new Encoding('UTF-8'),
    //         errorCorrectionLevel: ErrorCorrectionLevel::High,
    //         size: 300,
    //         margin: 10,
    //         roundBlockSizeMode: RoundBlockSizeMode::Margin
    //     );

    //     $result = $builder->build();

    //     return response($result->getString(), 200, ['Content-Type' => 'image/png']);

    //     return response()->json($qrCodes);
    // }

    // public function viewGeneratedQRCodes()
    // {}
}
