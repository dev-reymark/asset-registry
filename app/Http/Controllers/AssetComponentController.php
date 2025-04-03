<?php

namespace App\Http\Controllers;

use App\Models\AssetComponent;
use App\Models\AssetType;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AssetComponentController extends Controller
{
    public function index(): Response
    {
        // Eager load products and assetType
        $assetComponents = AssetComponent::with('products.assetType')->get();

        return Inertia::render('Assets/AssetComponent', [
            'assetComponents' => $assetComponents,
            'title' => 'Asset Component',
            'description' => '',
        ]);
    }

    // Show the form for creating a new Asset Component
    public function create(): Response
    {
        // Get all AssetTypes to display in the dropdown
        $assetTypes = AssetType::all();

        return Inertia::render('Assets/CreateAssetComponent', [
            'assetTypes' => $assetTypes,
        ]);
    }

    // Store a newly created Asset Component in the database
    public function store(Request $request): Response
    {
        $request->validate([
            'ASSETCOMPONENTNAME' => 'required|string|max:255',
            'ASSETTYPEID' => 'required|exists:AssetType,ASSETTYPEID',
        ]);

        $newId = AssetComponent::max('ASSETCOMPNETID') + 1;

        // Create the AssetComponent
        AssetComponent::create([
            'ASSETCOMPNETID' => $newId,
            'ASSETCOMPONENTNAME' => $request->ASSETCOMPONENTNAME,
            'ASSETTYPEID' => $request->ASSETTYPEID,
        ]);

        $assetComponents = AssetComponent::with('products.assetType')->get();

        return Inertia::render('Assets/AssetComponent', [
            'assetComponents' => $assetComponents,
            'title' => 'Asset Component',
            'description' => 'Asset Component created successfully',
        ]);
    }
}
