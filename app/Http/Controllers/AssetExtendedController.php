<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\AssetDetail;
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
        $products = Product::all();
        $location = Location::all();

        // Get the last EMPNO and increment it
        $assetno = AssetDetail::max('ASSETNO');
        $newassetno = $assetno ? $assetno + 1 : null;

        return Inertia::render('AssetsExtended/AddAsset', [
            'asset' => $asset,
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
                'COMPONENT' => $validated['COMPONENT'] ?? null,
                'WITHCOMPONENTS' => $validated['WITHCOMPONENTS'] ?? false,
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

    public function transfer(Request $request)
    {
        // Log::debug('Transfer request data:', ['data' => $request->all()]);

        $validated = $request->validate([
            'asset_nos' => 'array',
            'asset_nos.*' => 'integer',
            'location_id' => 'integer|exists:location,LOCATIONID',
        ]);

        // Log::debug('Validated Data:', ['validated' => $validated]);

        // Check if location_id exists and log
        $locationExists = DB::table('location')->where('LOCATIONID', $validated['location_id'])->exists();
        // Log::debug('Location Exists:', ['exists' => $locationExists]);

        if (!$locationExists) {
            // Log::error('Location ID does not exist.');
            return redirect()->route('assets.index')->with('error', 'Invalid location.');
        }

        // Wrap in transaction for atomicity
        DB::transaction(function () use ($validated) {
            $updated = AssetDetail::whereIn('ASSETNO', $validated['asset_nos'])
                ->update(['LOCATIONID' => $validated['location_id']]);

            // Log::debug('Number of rows updated:', ['updated' => $updated]);
        });

        return redirect()->route('assets.index')->with('success', 'Assets transferred successfully.');
    }
}
