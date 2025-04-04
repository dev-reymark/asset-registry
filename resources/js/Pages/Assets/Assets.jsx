import { Head, Link, usePage } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";
import { Button } from "@heroui/react";

export default function Assets() {
    const { assets } = usePage().props; // Get assets data
    console.log(assets);

    return (
        <Authenticated>
            <Head title="Employee Assets" />
            <div className="p-6 bg-white shadow rounded-lg">
                <h1 className="text-2xl font-bold mb-4">Employee Assets</h1>

                {/* Assets Table */}
                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">Asset ID</th>
                            <th className="border px-4 py-2">Employee ID</th>
                            <th className="border px-4 py-2">Employee Name</th>
                            <th className="border px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assets.length > 0 ? (
                            assets.map((asset) => (
                                <tr
                                    key={asset.ASSETSID}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="border px-4 py-2">
                                        {asset.ASSETSID}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {asset.EMPLOYEEID}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {asset.EMPLOYEENAME}
                                    </td>
                                    <td className="border px-4 py-2 gap-2 flex justify-center">
                                        <Button
                                            as={Link}
                                            size="sm"
                                            color="primary"
                                            href={`/assets/${asset.ASSETSID}`}
                                        >
                                            VIEW
                                        </Button>
                                        <Button
                                            as={Link}
                                            color="success"
                                            size="sm"
                                            href={route(
                                                "employee.asset.report",
                                                { id: asset.EMPLOYEEID }
                                            )}
                                            target="_blank"
                                            download
                                        >
                                            PRINT
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="border px-4 py-2 text-center text-gray-500"
                                >
                                    No assets found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Authenticated>
    );
}
