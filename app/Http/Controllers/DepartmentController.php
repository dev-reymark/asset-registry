<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;


class DepartmentController extends Controller
{
    /**
     * Display a listing of departments.
     *
     * @return \Inertia\Response
     */
    public function index(): Response
    {
        $departments = Department::all(); // Fetch all departments

        return Inertia::render('Department/Department', [
            'departments' => $departments,
            'title' => 'Departments',
            'description' => 'List of all departments',
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Department/AddDepartment', [
            'title' => 'Add Department',
            'description' => 'Add a new department to the system',
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'DEPARTMENTNAME' => 'required|string|max:255|unique:Department,DEPARTMENTNAME',
        ]);

        // Generate a new ID manually (find the max ID and add 1)
        $newId = Department::max('DEPARTMETID') + 1;

        Department::create([
            'DEPARTMETID' => $newId,
            'DEPARTMENTNAME' => $validated['DEPARTMENTNAME'],
        ]);

        return redirect()->route('departments.index')->with('success', 'Department added successfully.');
    }
}
