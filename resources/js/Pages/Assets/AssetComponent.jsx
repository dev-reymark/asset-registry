import { Head, Link, usePage } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";
import { Button } from "@heroui/react";

export default function AssetComponent() {
    const { assetComponents } = usePage().props;
    console.log(assetComponents);

    return (
        <Authenticated>
            <Head title="Asset Components" />
            <div className="p-6 bg-white shadow rounded-lg">
                <h1 className="text-2xl font-bold mb-4">Asset Components</h1>

                <Link
                    href={route("assetComponents.create")}
                    className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    + Add Asset Component
                </Link>

                {/* Asset Component Table */}
                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">
                                Asset Component ID
                            </th>
                            <th className="border px-4 py-2">Asset Type</th>
                            <th className="border px-4 py-2">
                                Asset Component
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {assetComponents.length > 0 ? (
                            assetComponents.map((assetComponent) => (
                                <tr
                                    key={assetComponent.ASSETCOMPNETID}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="border px-4 py-2">
                                        {assetComponent.ASSETCOMPNETID}
                                    </td>
                                    <td className="border px-4 py-2 text-center">
                                        {assetComponent.asset_type?.ASSETTYPE}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {assetComponent.ASSETCOMPONENTNAME}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="border px-4 py-2 text-center text-gray-500"
                                >
                                    No asset components found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Authenticated>
    );
}
