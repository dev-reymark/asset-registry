<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\Department;
use App\Models\Employee;
use App\Models\Location;
use App\Models\User;
use App\Models\WorkStation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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
    // public function index(): Response
    // {
    //     $employees = Employee::with(['department', 'location', 'workstation'])->active()->get();
    //     $employeesCount = Employee::active()->count();

    //     return Inertia::render('Employee/Index', [
    //         'employees' => $employees,
    //         'employeesCount' => $employeesCount,
    //         'title' => 'Employees',
    //         'description' => 'List of all employees',
    //     ]);
    // }

    public function index(Request $request)
    {
        $search = $request->input('search');
        $sort = $request->input('sort');

        $query = Employee::active()->with(['department', 'location', 'workstation']);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('EMPLOYEENAME', 'like', '%' . $search . '%')
                    ->orWhereHas('department', function ($q) use ($search) {
                        $q->where('DEPARTMENTNAME', 'like', '%' . $search . '%');
                    })
                    ->orWhereHas('location', function ($q) use ($search) {
                        $q->where('LOCATIONNAME', 'like', '%' . $search . '%');
                    })
                    ->orWhereHas('workstation', function ($q) use ($search) {
                        $q->where('WORKSTATION', 'like', '%' . $search . '%');
                    });
            });
        }

        if ($sort === 'name_asc') {
            $query->orderBy('EMPLOYEENAME', 'asc');
        } elseif ($sort === 'name_desc') {
            $query->orderBy('EMPLOYEENAME', 'desc');
        }

        $employees = $query->get();
        // $employees = $query->paginate(10)->withQueryString();

        return Inertia::render('Employee/Index', [
            'employees' => $employees,
            'title' => 'Employees List',
            'filters' => [
                'search' => $search,
                'sort' => $sort,
            ],
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
            'WORKSTATION' => 'nullable|exists:WorkStation,WORKSTATIONID',
        ]);

        Employee::create($validated);
        // Log the creation of the employee
        Log::info('Employee created: ', $validated);

        // $lastAsset = Asset::orderBy('ASSETSID', 'desc')->first();
        // $nextAssetId = $lastAsset ? $lastAsset->ASSETSID + 1 : 1;

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

            $asset->delete();
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
            'WORKSTATION' => 'nullable|exists:workstation,WORKSTATIONID',
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

    public function archive(Employee $employee)
    {
        $employee->update(['archived' => true]);

        Log::info('Employee archived:', ['employee_id' => $employee->EMPNO]);

        // Archive the associated asset (if exists)
        $asset = Asset::where('EMPLOYEEID', $employee->EMPNO)->first();

        if ($asset) {
            // Log asset before archiving
            Log::info('Found associated asset, archiving asset:', ['asset_id' => $asset->ASSETSID]);

            // Archive the asset
            $asset->update(['archived' => true]);

            // Log after archiving the asset
            Log::info('Asset archived for employee:', ['EMPLOYEEID' => $employee->EMPNO]);
        } else {
            // Log if no asset was found
            Log::warning('No asset found for employee to archive:', ['employee_id' => $employee->EMPNO]);
        }

        return redirect()->route('employees.index')->with('success', 'Employee archived successfully!');
    }

    public function restore(Employee $employee)
    {
        $employee->update(['archived' => false]);
        Log::info('Employee restored:', ['employee_id' => $employee->EMPNO]);

        $asset = Asset::where('EMPLOYEEID', $employee->EMPNO)->first();

        if ($asset) {
            // Log asset before restoring
            Log::info('Found associated asset, restoring asset:', ['asset_id' => $asset->ASSETSID]);

            // Restore the asset
            $asset->update(['archived' => false]);

            // Log after restoring the asset
            Log::info('Asset restored for employee:', ['EMPLOYEEID' => $employee->EMPNO]);
        } else {
            // Log if no asset was found
            Log::warning('No asset found for employee to restore:', ['employee_id' => $employee->EMPNO]);
        }

        return redirect()->route('employees.index')->with('success', 'Employee restored successfully!');
    }

    public function archived(): Response
    {
        $employees = Employee::with(['department', 'location', 'workstation'])
            ->archived()
            ->get();

        return Inertia::render('Employee/Archived', [
            'employees' => $employees,
            'title' => 'Archived Employees',
            'description' => 'List of all archived employees',
        ]);
    }

    public function createUserForm(Employee $employee)
    {
        $user = User::where('name', $employee->EMPLOYEENAME)->first(); // or use a more reliable link if available

        return Inertia::render('Employee/CreateUser', [
            'employee' => $employee,
            'user' => $user,
            'title' => 'Create User',
            'description' => 'Create a user account for the employee.',
        ]);
    }


    public function createUser(Request $request, Employee $employee)
    {
        // Validate the form input
        $validated = $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',
        ]);

        // Create the new user associated with the employee
        $user = User::create([
            'name' => $employee->EMPLOYEENAME,
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'user_role' => 'employee',
            'EMPLOYEEID' => $employee->EMPNO,
        ]);

        // Redirect to the employee's page or list with a success message
        return redirect()->route('employees.index')->with('success', 'User account created successfully for employee.');
    }

    public function updateUserPassword(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'password' => 'required|min:6|confirmed',
        ]);

        $user = User::where('name', $employee->EMPLOYEENAME)->first(); // or link via foreign key if available

        if (!$user) {
            return redirect()->back()->withErrors(['user' => 'User not found for this employee.']);
        }

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Password updated successfully.');
    }
}
