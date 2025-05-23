<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\AssetComponent;
use App\Models\AssetDetail;
use App\Models\Employee;
use App\Models\Location;
use App\Models\Product;
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

        return Inertia::render('AssetsExtended/AddAsset', [
            'asset' => $asset,
            'assetcomponents' => $assetcomponents,
            'location' => $location,
            'products' => $products,
            'assetno' => $newassetno,
            'title' => 'Add Assets',
            'description' => 'Add a new asset',
        ]);
    }

    public function store(Request $request)
    {
        Log::debug('Incoming request data:', ['data' => $request->all()]);
        // Log::debug('IMAGEPATH from file()', ['file' => $request->file('IMAGEPATH')]);

        $validated = $request->validate([
            'ASSETSID' => 'required|exists:Assets,ASSETSID',
            'EMPLOYEEID' => 'nullable|numeric',
            'EMPLOYEENAME' => 'nullable|string|max:255',
            'ASSETNO' => 'nullable',
            'PRODUCTID' => 'nullable|exists:products,PRODUCTID',
            'DESCRIPTION' => 'nullable|string|max:255',
            'MODEL' => 'nullable|string|max:255',
            'SERIALNO' => 'nullable|unique:AssetDetails,SERIALNO',
            'ISSUEDTO' => 'nullable|string|max:255',
            'DATEISSUUED' => 'nullable|date',
            'IMAGEPATH' => 'nullable|array',
            'IMAGEPATH.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'STATUS' => 'nullable|string|max:255',
            'CONDITIONS' => 'nullable|string|max:255',
            'WORKSTATION' => 'nullable|string|max:255',
            'TYPESIZE' => 'nullable|string|max:255',
            'NOPRINT' => 'nullable|string|max:255',
            'COMPONENT' => 'nullable|string|max:255',
            'WITHCOMPONENTS' => 'nullable|boolean',
            'SYSTEMASSETID' => 'nullable|string|regex:/^[\w-]+$/',
            'SYSTEMCOMPONENTID' => 'nullable|string|max:255',
            'LOCATIONID' => 'nullable|integer|exists:location,LOCATIONID',
        ]);

        DB::beginTransaction();

        try {
            // $imagePath = null;

            // if ($request->hasFile('IMAGEPATH') && $request->file('IMAGEPATH')->isValid()) {
            //     $file = $request->file('IMAGEPATH');
            //     $fileName = uniqid() . '-' . $file->getClientOriginalName();
            //     $destinationPath = storage_path('app/public/assets');

            //     $file->move($destinationPath, $fileName);
            //     $imagePath = 'assets/' . $fileName;

            //     if (!file_exists(storage_path('app/public/' . $imagePath))) {
            //         Log::error('Image upload failed. File not found.', ['path' => $imagePath]);
            //         DB::rollBack();
            //         return redirect()->route('assetsextended.create')->with('error', 'Image upload failed.');
            //     }
            // }

            $imagePaths = [];

            if ($request->hasFile('IMAGEPATH')) {
                foreach ($request->file('IMAGEPATH') as $file) {
                    if ($file->isValid()) {
                        $fileName = uniqid() . '-' . $file->getClientOriginalName();
                        $destinationPath = storage_path('app/public/assets');
                        $file->move($destinationPath, $fileName);
                        $relativePath = 'assets/' . $fileName;

                        if (!file_exists(storage_path('app/public/' . $relativePath))) {
                            Log::error('Image upload failed. File not found.', ['path' => $relativePath]);
                            DB::rollBack();
                            return redirect()->route('assetsextended.create')->with('error', 'Image upload failed.');
                        }

                        $imagePaths[] = $relativePath;
                    }
                }
            }

            $components = $validated['COMPONENT'] ? json_decode($validated['COMPONENT'], true) : [];
            $withComponents = is_array($components) && count($components) > 0;

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
                'COMPONENT' => $withComponents ? json_encode($components) : null,
                'WITHCOMPONENTS' => $withComponents,
                'SYSTEMASSETID' => $validated['SYSTEMASSETID'] ?? null,
                'SYSTEMCOMPONENTID' => $validated['SYSTEMCOMPONENTID'] ?? null,
                'archived' => false,
                'LOCATIONID' => $validated['LOCATIONID'] ?? null,
            ]);

            DB::commit();
            return redirect()->route('assetsextended.create')->with('success', 'Asset detail added successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Asset Store Error', ['message' => $e->getMessage()]);
            return redirect()->route('assetsextended.create')->with('error', 'An error occurred while adding asset details.');
        }
    }

    public function edit($assetNo)
    {
        // Fetch the asset detail and related data
        $assetDetail = AssetDetail::where('ASSETNO', $assetNo)
            ->with('asset.employee')
            ->firstOrFail();

        // Fetch employee details
        $employees = Employee::findOrFail($assetDetail->EMPLOYEEID);
        $products = Product::with(['assetComponent'])->get();
        $locations = Location::all();

        return Inertia::render('AssetsExtended/EditAsset', [
            'assetDetail' => $assetDetail,
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

        // Validate request
        $validated = $request->validate([
            'ASSETID' => 'required|exists:Assets,ASSETSID',
            'EMPLOYEEID' => 'nullable|numeric',
            'PRODUCTID' => 'nullable|exists:products,PRODUCTID',
            'DESCRIPTION' => 'nullable|string|max:255',
            'MODEL' => 'nullable|string|max:255',
            'SERIALNO' => 'nullable|unique:AssetDetails,SERIALNO,' . $assetNo . ',ASSETNO',
            'ISSUEDTO' => 'nullable|string|max:255',
            'DATEISSUUED' => 'nullable|date',
            'IMAGEPATH' => 'nullable|array',
            'IMAGEPATH.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'STATUS' => 'nullable|string|max:255',
            'CONDITIONS' => 'nullable|string|max:255',
            'WORKSTATION' => 'nullable|string|max:255',
            'TYPESIZE' => 'nullable|string|max:255',
            'NOPRINT' => 'nullable|string|max:255',
            'COMPONENT' => 'nullable|string|max:255',
            'WITHCOMPONENTS' => 'nullable|boolean',
            'SYSTEMASSETID' => 'nullable|string|regex:/^[\w-]+$/',
            'SYSTEMCOMPONENTID' => 'nullable|string|max:255',
            'LOCATIONID' => 'nullable|integer|exists:location,LOCATIONID',
        ]);

        DB::beginTransaction();

        try {
            // Log validated data for debugging
            Log::debug('Validated data:', ['validated' => $validated]);

            // Handle image uploads if present
            $imagePaths = [];
            if ($request->hasFile('IMAGEPATH')) {
                foreach ($request->file('IMAGEPATH') as $file) {
                    if ($file->isValid()) {
                        $fileName = uniqid() . '-' . $file->getClientOriginalName();
                        $destinationPath = storage_path('app/public/assets');
                        $file->move($destinationPath, $fileName);
                        $relativePath = 'assets/' . $fileName;

                        if (!file_exists(storage_path('app/public/' . $relativePath))) {
                            Log::error('Image upload failed. File not found.', ['path' => $relativePath]);
                            DB::rollBack();
                            return redirect()->route('assetsextended.edit', ['assetNo' => $assetNo])
                                ->with('error', 'Image upload failed.');
                        }

                        $imagePaths[] = $relativePath;
                    }
                }
            }

            // Log image paths after processing
            Log::debug('Image paths after upload:', ['imagePaths' => $imagePaths]);

            // Handle COMPONENT field (ensure it's decoded correctly)
            $components = $validated['COMPONENT'] ? json_decode($validated['COMPONENT'], true) : [];
            $withComponents = is_array($components) && count($components) > 0;

            // Log the decoded components and the 'withComponents' flag
            Log::debug('Decoded COMPONENT field:', ['components' => $components, 'withComponents' => $withComponents]);

            // Find the asset detail to be updated
            $assetDetail = AssetDetail::findOrFail($assetNo);

            // Log the existing asset details before updating
            Log::debug('Existing asset details before update:', ['assetDetail' => $assetDetail]);

            // Update asset detail
            $assetDetail->update([
                'EMPLOYEEID' => $validated['EMPLOYEEID'] ?? $assetDetail->EMPLOYEEID,
                'ASSETID' => $validated['ASSETID'],
                'PRODUCTID' => $validated['PRODUCTID'] ?? $assetDetail->PRODUCTID,
                'DESCRIPTION' => $validated['DESCRIPTION'] ?? $assetDetail->DESCRIPTION,
                'MODEL' => $validated['MODEL'] ?? $assetDetail->MODEL,
                'SERIALNO' => $validated['SERIALNO'] ?? $assetDetail->SERIALNO,
                'ISSUEDTO' => $validated['ISSUEDTO'] ?? $assetDetail->ISSUEDTO,
                'DATEISSUUED' => $validated['DATEISSUUED'] ?? $assetDetail->DATEISSUUED,
                'IMAGEPATH' => $imagePaths ? json_encode($imagePaths) : $assetDetail->IMAGEPATH,
                'STATUS' => $validated['STATUS'] ?? $assetDetail->STATUS,
                'CONDITIONS' => $validated['CONDITIONS'] ?? $assetDetail->CONDITIONS,
                'WORKSTAION' => $validated['WORKSTATION'] ?? $assetDetail->WORKSTATION,
                'TYPESIZE' => $validated['TYPESIZE'] ?? $assetDetail->TYPESIZE,
                'NOPRINT' => $validated['NOPRINT'] ?? $assetDetail->NOPRINT,
                'COMPONENT' => $withComponents ? json_encode($components) : $assetDetail->COMPONENT,
                'WITHCOMPONENTS' => $withComponents,
                'SYSTEMASSETID' => $validated['SYSTEMASSETID'] ?? $assetDetail->SYSTEMASSETID,
                'SYSTEMCOMPONENTID' => $validated['SYSTEMCOMPONENTID'] ?? $assetDetail->SYSTEMCOMPONENTID,
                'LOCATIONID' => $validated['LOCATIONID'] ?? $assetDetail->LOCATIONID,
            ]);

            // Log after successful update
            Log::debug('Asset detail updated successfully:', ['assetDetail' => $assetDetail]);

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
}
