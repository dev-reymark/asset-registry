import { Head, Link, router, usePage } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";
import { Button } from "@heroui/react";
import toast from "react-hot-toast";

export default function AssetView() {
    const { asset } = usePage().props; // Get asset
    // console.log(asset);

    return (
        <Authenticated
            auth={usePage().props.auth}
            errors={usePage().props.errors}
        >
            <Head title={`Asset Details - ${asset.ASSETSID}`} />
            <div className="p-6 bg-white shadow rounded-lg">
                <div className="mt-6">
                    <Link
                        href={route("assets.index")}
                        className="text-blue-500 hover:underline"
                    >
                        ← Back to Assets
                    </Link>
                </div>
                <h1 className="text-2xl font-bold mb-4">
                    General Asset Information
                </h1>

                {/* General Asset Info */}
                <div className="border p-4 rounded-lg mb-6">
                    <p>
                        <strong>Asset ID:</strong> {asset?.ASSETSID}
                    </p>
                    <p>
                        <strong>Employee ID:</strong>
                        {asset?.EMPLOYEEID}
                    </p>
                    <p>
                        <strong>Employee Name:</strong>
                        {asset.EMPLOYEENAME}
                    </p>
                </div>

                {/* Asset Details Table */}
                <h2 className="text-xl font-bold mb-2">Asset Details</h2>
                <Button
                    as={Link}
                    color="primary"
                    href={route("assets.create", { id: asset.ASSETSID })}
                >
                    Add New Asset
                </Button>
                <table className="w-full border-collapse border border-gray-200 mb-6">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">Action</th>
                            <th className="border px-4 py-2">Asset No</th>
                            <th className="border px-4 py-2">Asset ID</th>
                            <th className="border px-4 py-2">Product ID</th>
                            <th className="border px-4 py-2">Description</th>
                            <th className="border px-4 py-2">Model</th>
                            <th className="border px-4 py-2">Serial No</th>
                            <th className="border px-4 py-2">Serial Type</th>
                            <th className="border px-4 py-2">Issued To</th>
                            <th className="border px-4 py-2">Date Issued</th>
                            <th className="border px-4 py-2">Status</th>
                            <th className="border px-4 py-2">Condition</th>
                            <th className="border px-4 py-2">Asset From</th>
                            <th className="border px-4 py-2">Type/Size</th>
                            <th className="border px-4 py-2">Workstation</th>
                            <th className="border px-4 py-2">
                                System Asset ID
                            </th>
                            <th className="border px-4 py-2">
                                System Component ID
                            </th>
                            <th className="border px-4 py-2">
                                With Components
                            </th>
                            <th className="border px-4 py-2">Component</th>
                            <th className="border px-4 py-2">No Print</th>
                            <th className="border px-4 py-2">Image Path</th>
                        </tr>
                    </thead>
                    <tbody>
                        {asset?.asset_details?.length > 0 ? (
                            asset.asset_details.map((detail) => (
                                <tr
                                    key={detail.ASSETNO}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="border px-4 py-2 gap-2">
                                        <Button
                                            as={Link}
                                            href={route("assets.edit", {
                                                assetId: detail.ASSETID,
                                                assetNo: detail.ASSETNO,
                                            })}
                                            color="primary"
                                            size="sm"
                                        >
                                            Update
                                        </Button>
                                        <Button
                                            as="button"
                                            onPress={() => {
                                                axios
                                                    .post(
                                                        route(
                                                            "assets.destroy",
                                                            {
                                                                assetId:
                                                                    detail.ASSETID,
                                                                assetNo:
                                                                    detail.ASSETNO,
                                                            }
                                                        ),
                                                        {
                                                            _method: "DELETE", // Spoofing DELETE method
                                                        }
                                                    )
                                                    .then((response) => {
                                                        toast.success(
                                                            "Asset deleted successfully"
                                                        );
                                                        router.reload();
                                                    })
                                                    .catch((error) => {
                                                        toast.error(
                                                            "Failed to delete asset"
                                                        );
                                                        console.error(
                                                            error.response
                                                                ?.data ||
                                                                error.message
                                                        );
                                                    });
                                            }}
                                            color="danger"
                                            size="sm"
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                    <td className="border px-4 py-2">
                                        {detail.ASSETNO || "--"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {detail.ASSETID || "--"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {detail.PRODUCTID || "--"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {detail.DESCRIPTION?.trim() || "--"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {detail.MODEL?.trim() || "--"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {detail.SERIALNO?.trim() || "--"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {detail.SERIALTYPE || "--"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {detail.ISSUEDTO?.trim() || "--"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {detail.DATEISSUUED?.trim() || "--"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {detail.STATUS?.trim() || "--"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {detail.CONDITIONS?.trim() || "--"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {detail.ASSETFROM?.trim() || "--"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {detail.TYPESIZE?.trim() || "--"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {detail.WORKSTAION || "--"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {detail.SYSTEMASSETID?.trim() || "--"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {detail.SYSTEMCOMPONENTID?.trim() ||
                                            "--"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {detail.WITHCOMPONENTS || "--"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {detail.COMPONENT?.trim() || "--"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {detail.NOPRINT || "--"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {detail.IMAGEPATH || "--"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="20"
                                    className="border px-4 py-2 text-center text-gray-500"
                                >
                                    No asset details found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Asset Components Table */}
                <h2 className="text-xl font-bold mb-2">Asset Components</h2>
                <table className="w-full border-collapse border border-gray-200 mb-6">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">Component ID</th>
                            <th className="border px-4 py-2">Component Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {asset?.assetComponents?.length > 0 ? (
                            asset.assetComponents.map((component) => (
                                <tr
                                    key={component.ASSETCOMPNETID}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="border px-4 py-2">
                                        {component.ASSETCOMPNETID || "--"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {component.ASSETCOMPONENTNAME || "--"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="2"
                                    className="border px-4 py-2 text-center text-gray-500"
                                >
                                    No components found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Authenticated>
    );
}
