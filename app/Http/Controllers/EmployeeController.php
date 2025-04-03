<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\Department;
use App\Models\Employee;
use App\Models\Location;
use App\Models\WorkStation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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

        return Inertia::render('Employee/Index', [
            'employees' => $employees,
            'employeesCount' => $employeesCount,
            'title' => 'Employees',
            'description' => 'List of all employees',
        ]);
    }

    /**
     * Show the form for creating a new employee.
     *
     * @return \Inertia\Response
     */
    public function create(): Response
    {
        $departments = Department::all();
        $locations = Location::all();
        $workstations = WorkStation::all();

        // Get the last EMPNO and increment it
        $lastEmpno = Employee::max('EMPNO');
        $nextEmpno = $lastEmpno ? $lastEmpno + 1 : null;


        return Inertia::render('Employee/AddEmployee', [
            'departments' => $departments,
            'locations' => $locations,
            'workstations' => $workstations,
            'nextEmpno' => $nextEmpno,
            'title' => 'Add Employee',
            'description' => 'Add a new employee to the system',
        ]);
    }

    /**
     * Store a newly created employee in the database.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'EMPNO' => 'required|unique:Employee,EMPNO',
            'EMPLOYEEID' => 'required|unique:Employee,EMPLOYEEID',
            'EMPLOYEENAME' => 'required|string|max:255',
            'DEPARTMENT' => 'required|exists:Department,DEPARTMETID',
            'LOCATION' => 'required|exists:Location,LOCATIONID',
            'WORKSTATION' => 'required|exists:WorkStation,WORKSTATIONID',
        ]);

        Employee::create($validated);
        // Log the creation of the employee
        Log::info('Employee created: ', $validated);

        // Save Employee details to Asset table
        Asset::create([
            'EMPLOYEEID' => $validated['EMPLOYEEID'],
            'EMPLOYEENAME' => $validated['EMPLOYEENAME'],
        ]);
        // Log the creation of the asset
        Log::info('Asset created for employee: ', [
            'EMPLOYEEID' => $validated['EMPNO'],
            'EMPLOYEENAME' => $validated['EMPLOYEENAME'],
        ]);

        return redirect(route('employees.index'))->with('success', 'Employee added successfully!');
    }

    /**
     * Delete a specific employee.
     *
     * @param  \App\Models\Employee  $employee
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Employee $employee)
    {
        // Log the employee and associated asset to debug
        Log::info('Attempting to delete employee:', ['employee_id' => $employee->EMPNO]);

        // Delete related asset first using the correct column EMPLOYEEID
        $asset = Asset::where('EMPLOYEEID', $employee->EMPNO)->first();

        if ($asset) {
            // Log asset before deletion
            Log::info('Found associated asset, deleting asset:', ['asset_id' => $asset->ASSETSID]);

            $asset->delete();  // Make sure this deletes the asset
            Log::info('Asset deleted for employee: ', ['EMPLOYEEID' => $employee->EMPNO]);
        } else {
            // Log if no asset was found
            Log::warning('No asset found for employee:', ['employee_id' => $employee->EMPNO]);
        }

        // Delete the employee
        $employee->delete();
        Log::info('Employee deleted:', ['employee_id' => $employee->EMPNO]);

        return redirect(route('employees.index'))->with('success', 'Employee and related asset deleted successfully!');
    }

    public function edit($id)
    {
        // Fetch the employee and its related data
        $employee = Employee::with(['department', 'location', 'workstation'])->findOrFail($id);
        $departments = Department::all();
        $locations = Location::all();
        $workstations = WorkStation::all();

        return Inertia::render('Employee/EditEmployee', [
            'employee' => $employee,
            'departments' => $departments,
            'locations' => $locations,
            'workstations' => $workstations,
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'EMPLOYEEID' => 'nullable|numeric|integer',
            'EMPLOYEENAME' => 'required|string|max:255',
            'DEPARTMENT' => 'required|exists:department,DEPARTMETID',
            'LOCATION' => 'required|exists:location,LOCATIONID',
            'WORKSTATION' => 'required|exists:workstation,WORKSTATIONID',
        ]);

        $employee = Employee::findOrFail($id);
        $employee->update([
            'EMPLOYEEID' => $request->EMPLOYEEID,
            'EMPLOYEENAME' => $request->EMPLOYEENAME,
            'DEPARTMENT' => $request->DEPARTMENT,
            'LOCATION' => $request->LOCATION,
            'WORKSTATION' => $request->WORKSTATION,
        ]);

        return redirect()->route('employees.index')->with('success', 'Employee updated successfully!');
    }
}
