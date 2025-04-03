import { Head, Link, router, usePage } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";
import { Button } from "@heroui/react";
import toast from "react-hot-toast";
import { route } from "ziggy-js";

export default function Employees() {
    const { employees } = usePage().props; // Get employees data

    const handleDelete = (employeeId) => {
        if (
            confirm(
                "Are you sure you want to delete this employee? Deleting the employee will also delete the associated asset."
            )
        ) {
            // Send the DELETE request with _method
            axios
                .post(route("employees.destroy", { employee: employeeId }), {
                    _method: "DELETE", // This ensures Laravel treats the request as a DELETE method
                })
                .then((response) => {
                    toast.success("Asset deleted successfully");
                    router.reload();
                })
                .catch((error) => {
                    console.error(
                        "There was an error deleting the employee.",
                        error
                    );
                    toast.error("Failed to delete employee");
                });
        }
    };

    return (
        <Authenticated>
            <Head title="Employees" />
            <div className="p-6 bg-white shadow rounded-lg">
                <h1 className="text-2xl font-bold mb-4">Employees</h1>
                <Button
                    as={Link}
                    href={route("employees.create")}
                    color="primary"
                >
                    Add Employee
                </Button>
                <table className="w-full mt-4 border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">Employee ID</th>
                            {/* <th className="border px-4 py-2">Employee ID</th> */}
                            <th className="border px-4 py-2">Employee Name</th>
                            <th className="border px-4 py-2">Department</th>
                            <th className="border px-4 py-2">Location</th>
                            <th className="border px-4 py-2">Workstation</th>
                            <th className="border px-4 py-2">Action</th>
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
                                        {employee.EMPLOYEEID}
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
                                    <td className="border px-4 py-2">
                                        <div className="flex gap-2">
                                            {/* <Button
                                            size="sm"
                                            color="danger"
                                            onPress={() =>
                                                handleDelete(employee.EMPNO)
                                            }
                                        >
                                            Delete
                                        </Button> */}
                                            <Button size="sm" color="warning">
                                                Archive
                                            </Button>
                                            <Button
                                                size="sm"
                                                color="primary"
                                                as={Link}
                                                href={route(
                                                    "employees.edit",
                                                    employee.EMPNO
                                                )}
                                            >
                                                Update
                                            </Button>
                                        </div>
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
