import { Head, usePage } from "@inertiajs/react";
import Authenticated from "../Layouts/Authenticated";

export default function Employees() {
    const { employees } = usePage().props; // Get employees data

    return (
        <Authenticated
            auth={usePage().props.auth}
            errors={usePage().props.errors}
        >
            <Head title="Employees" />
            <div className="p-6 bg-white shadow rounded-lg">
                <h1 className="text-2xl font-bold mb-4">Employees</h1>

                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">Employee ID</th>
                            <th className="border px-4 py-2">Employee Name</th>
                            <th className="border px-4 py-2">Department</th>
                            <th className="border px-4 py-2">Location</th>
                            <th className="border px-4 py-2">Workstation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.length > 0 ? (
                            employees.map((employee, index) => (
                                <tr
                                    key={employee.EMPNO}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="border px-4 py-2">
                                        {index + 1}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {employee.EMPLOYEENAME}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {employee.department
                                            ? employee.department.DEPARTMENTNAME
                                            : "--"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {employee.location
                                            ? employee.location.LOCATIONNAME
                                            : "--"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {employee.workstation
                                            ? employee.workstation.WORKSTATION
                                            : "--"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="border px-4 py-2 text-center text-gray-500"
                                >
                                    No employees found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Authenticated>
    );
}
