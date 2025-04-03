<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Location;
use App\Models\WorkStation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkStationController extends Controller
{
    /**
     * Display a listing of workstations.
     *
     * @return \Inertia\Response
     */
    public function index(): Response
    {
        $workstations = WorkStation::with('department', 'location')->get();

        return Inertia::render('Workstation/Workstation', [
            'workstations' => $workstations,
            'title' => 'Workstations',
            'description' => 'List of all workstations',
        ]);
    }

    /**
     * Show the form for creating a new workstation.
     */
    public function create(): Response
    {
        // Fetch departments and locations for dropdown selection
        $departments = Department::all(['DEPARTMETID', 'DEPARTMENTNAME']);
        $locations = Location::all(['LOCATIONID', 'LOCATIONNAME']);

        return Inertia::render('Workstation/AddWorkstation', [
            'departments' => $departments,
            'locations' => $locations,
            'title' => 'Add Workstation',
            'description' => 'Add a new workstation to the system',
        ]);
    }

    /**
     * Store a newly created workstation in the database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'WORKSTATION' => 'required|string|max:255|unique:WorkStation,WORKSTATION',
            'DEPARTMENTID' => 'required|exists:Department,DEPARTMETID',
            'LOCATIONID' => 'required|exists:Location,LOCATIONID',
        ]);

        $newId = WorkStation::max('WORKSTATIONID') + 1;

        WorkStation::create([
            'WORKSTATIONID' => $newId,
            'WORKSTATION' => $validated['WORKSTATION'],
            'DEPARTMENTID' => $validated['DEPARTMENTID'],
            'LOCATIONID' => $validated['LOCATIONID'],
        ]);

        return redirect()->route('workstations.index')->with('success', 'Workstation added successfully.');
    }
}
