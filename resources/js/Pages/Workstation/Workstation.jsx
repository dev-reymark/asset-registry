import { Head, Link, usePage } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";

export default function Workstation() {
    const { workstations } = usePage().props; // Get workstation data

    return (
        <Authenticated
            auth={usePage().props.auth}
            errors={usePage().props.errors}
        >
            <Head title="Workstations" />
            <div className="p-6 bg-white shadow rounded-lg">
                <h1 className="text-2xl font-bold mb-4">Workstations</h1>
                <Link
                    href={route("workstations.create")}
                    className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    + Add Workstation
                </Link>
                {/* Workstation Table */}
                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">Workstation ID</th>
                            <th className="border px-4 py-2">
                                Workstation Name
                            </th>
                            <th className="border px-4 py-2">Department</th>
                            <th className="border px-4 py-2">Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workstations.length > 0 ? (
                            workstations.map((workstation) => (
                                <tr
                                    key={workstation.WORKSTATIONID}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="border px-4 py-2">
                                        {workstation.WORKSTATIONID}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {workstation.WORKSTATION}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {workstation.department
                                            ? workstation.department
                                                  .DEPARTMENTNAME
                                            : "N/A"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {workstation.location
                                            ? workstation.location.LOCATIONNAME
                                            : "N/A"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="border px-4 py-2 text-center text-gray-500"
                                >
                                    No workstations found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Authenticated>
    );
}
