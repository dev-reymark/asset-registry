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

        return Inertia::render('Department', [
            'departments' => $departments,
            'title' => 'Departments',
            'description' => 'List of all departments',
        ]);
    }
}
