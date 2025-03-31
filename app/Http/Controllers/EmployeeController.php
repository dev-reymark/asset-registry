<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the employees.
     *
     * @return \Inertia\Response
     */
    public function index(): Response
    {
        $employees = Employee::with(['department', 'location', 'workstation'])->get();
        $employeesCount = Employee::count();

        return Inertia::render('Employees', [
            'employees' => $employees,
            'employeesCount' => $employeesCount,
            'title' => 'Employees',
            'description' => 'List of all employees',
        ]);
    }
}
