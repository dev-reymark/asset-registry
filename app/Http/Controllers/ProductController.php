<?php

namespace App\Http\Controllers;

use App\Models\AssetComponent;
use App\Models\AssetType;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{

    public function index(Request $request): Response
    {
        $search = $request->get('search', '');

        $products = Product::with(['assetType', 'assetComponent'])
            ->when($search, function ($query) use ($search) {
                return $query->where('DESCRIPTION', 'like', '%' . $search . '%');
            })
            ->get();

        return Inertia::render('Product/Products', [
            'products' => $products,
            'title' => 'Products',
            'description' => 'List of Products',
            'filters' => [
                'search' => $search,
            ]
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create(): Response
    {
        // Fetch asset types and components for dropdowns
        $assetTypes = AssetType::all(['ASSETTYPEID', 'ASSETTYPE']);
        $assetComponents = AssetComponent::all(['ASSETCOMPNETID', 'ASSETCOMPONENTNAME']);

        return Inertia::render('Product/AddProduct', [
            'assetTypes' => $assetTypes,
            'assetComponents' => $assetComponents,
            'title' => 'Add Product',
            'description' => 'Add a new product to the system',
        ]);
    }

    /**
     * Store a newly created product in the database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'DESCRIPTION' => 'required|string|max:255|unique:products,DESCRIPTION',
            'ASSETTYPE' => 'required|exists:AssetType,ASSETTYPEID',
            'ASSETCOMPONENT' => 'required|exists:AssetComponents,ASSETCOMPNETID',
        ]);

        $newId = Product::max('PRODUCTID') + 1;

        Product::create([
            'PRODUCTID' => $newId,
            'DESCRIPTION' => $validated['DESCRIPTION'],
            'ASSETTYPE' => $validated['ASSETTYPE'],
            'ASSETCOMPONENT' => $validated['ASSETCOMPONENT'],
        ]);

        return redirect()->route('products.index')->with('success', 'Product added successfully.');
    }
}
