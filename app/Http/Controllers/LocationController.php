<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LocationController extends Controller
{
    /**
     * Display a listing of locations.
     *
     * @return \Inertia\Response
     */
    public function index(): Response
    {
        $locations = Location::with('department')->get();

        return Inertia::render('Location', [
            'locations' => $locations,
            'title' => 'Locations',
            'description' => 'List of all locations',
        ]);
    }
}
