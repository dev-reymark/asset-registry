import { Head, usePage } from "@inertiajs/react";

export default function AssetQrView() {
    const { asset, title, description, error } = usePage().props;

    console.log(asset, title, description, error); // Debugging

    if (error) {
        return (
            <div className="p-6 bg-white shadow-md rounded-lg">
                <Head title="Error" />
                <h1 className="text-2xl font-bold text-red-600">Error</h1>
                <p className="text-gray-600">{error}</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <Head title={title} />
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-gray-600">{description}</p>

            <div className="mt-4 p-4 border rounded">
                <h2 className="text-xl font-semibold">
                    Asset ID: {asset.ASSETSID}
                </h2>
                <p>
                    <strong>Issued To:</strong> {asset.EMPLOYEENAME}
                </p>

                {asset.asset_details?.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300 shadow-sm mt-2">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="border px-4 py-2 text-left">
                                        #
                                    </th>
                                    <th className="border px-4 py-2 text-left">
                                        Description
                                    </th>
                                    <th className="border px-4 py-2 text-left">
                                        Model
                                    </th>
                                    <th className="border px-4 py-2 text-left">
                                        Serial No.
                                    </th>
                                    <th className="border px-4 py-2 text-left">
                                        Date Issued
                                    </th>
                                    <th className="border px-4 py-2 text-left">
                                        Condition
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {asset.asset_details.map((detail, index) => (
                                    <tr key={index} className="odd:bg-gray-100">
                                        <td className="border px-4 py-2">
                                            {index + 1}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {detail.DESCRIPTION.trim()}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {detail.MODEL.trim()}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {detail.SERIALNO.trim() || "N/A"}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {detail.DATEISSUUED.trim()}
                                        </td>
                                        <td className="border px-4 py-2">
                                            {detail.CONDITIONS.trim()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No Details Available</p>
                )}
            </div>
        </div>
    );
}
