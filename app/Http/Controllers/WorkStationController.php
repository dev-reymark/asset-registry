<?php

namespace App\Http\Controllers;

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

        return Inertia::render('Workstation', [
            'workstations' => $workstations,
            'title' => 'Workstations',
            'description' => 'List of all workstations',
        ]);
    }
}
