import { Head, Link, usePage } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";

export default function Locations() {
    const { locations } = usePage().props; // Get location data

    return (
        <Authenticated
            auth={usePage().props.auth}
            errors={usePage().props.errors}
        >
            <Head title="Locations" />
            <div className="p-6 bg-white shadow rounded-lg">
                <h1 className="text-2xl font-bold mb-4">Locations</h1>

                <Link
                    href={route("locations.create")}
                    className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    + Add Location
                </Link>
                {/* Location Table */}
                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">Location ID</th>
                            <th className="border px-4 py-2">Location Name</th>
                            <th className="border px-4 py-2">
                                Department Name
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {locations.length > 0 ? (
                            locations.map((location) => (
                                <tr
                                    key={location.LOCATIONID}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="border px-4 py-2">
                                        {location.LOCATIONID}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {location.LOCATIONNAME}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {location.department
                                            ? location.department.DEPARTMENTNAME
                                            : "--"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="3"
                                    className="border px-4 py-2 text-center text-gray-500"
                                >
                                    No locations found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Authenticated>
    );
}
