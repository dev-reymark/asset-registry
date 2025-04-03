import { Head, Link, usePage } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";

export default function Department() {
    const { departments, title, description } = usePage().props; // Get department data

    return (
        <Authenticated
            auth={usePage().props.auth}
            errors={usePage().props.errors}
        >
            <Head title="Departments" />
            <div className="p-6 bg-white shadow rounded-lg">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-gray-600">{description}</p>

                <Link
                    href={route("departments.create")}
                    className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    + Add Department
                </Link>

                {/* Department Table */}
                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">Department ID</th>
                            <th className="border px-4 py-2">
                                Department Name
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.length > 0 ? (
                            departments.map((department) => (
                                <tr
                                    key={department.DEPARTMETID}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="border px-4 py-2">
                                        {department.DEPARTMETID}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {department.DEPARTMENTNAME}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="2"
                                    className="border px-4 py-2 text-center text-gray-500"
                                >
                                    No departments found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Authenticated>
    );
}
