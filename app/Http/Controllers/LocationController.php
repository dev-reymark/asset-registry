<?php

namespace App\Http\Controllers;

use App\Models\Department;
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

        return Inertia::render('Location/Location', [
            'locations' => $locations,
            'title' => 'Locations',
            'description' => 'List of all locations',
        ]);
    }

    /**
     * Show the form for creating a new location.
     */
    public function create(): Response
    {
        $departments = Department::all(['DEPARTMETID', 'DEPARTMENTNAME']);

        return Inertia::render('Location/AddLocation', [
            'departments' => $departments,
            'title' => 'Add Location',
            'description' => 'Add a new location to the system',
        ]);
    }

    /**
     * Store a newly created location in the database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'LOCATIONNAME' => 'required|string|max:255|unique:Location,LOCATIONNAME',
            'DEPARTMETID' => 'required|exists:Department,DEPARTMETID',
        ]);

        $newId = Location::max('LOCATIONID') + 1;

        Location::create([
            'LOCATIONID' => $newId,
            'LOCATIONNAME' => $validated['LOCATIONNAME'],
            'DEPARTMETID' => $validated['DEPARTMETID'],
        ]);

        return redirect()->route('locations.index')->with('success', 'Location added successfully.');
    }
}
