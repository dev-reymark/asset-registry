import { Head, Link, router, usePage } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/react";
import toast from "react-hot-toast";
import { route } from "ziggy-js";

export default function AssetView() {
    const { asset } = usePage().props; // Get asset
    console.log(asset);

    return (
        <Authenticated
            auth={usePage().props.auth}
            errors={usePage().props.errors}
        >
            <Head title={`Asset Details - ${asset.ASSETSID}`} />
            <div className="p-6 bg-white shadow rounded-lg">
                <div className="my-6">
                    <Button
                        color="primary"
                        variant="flat"
                        as={Link}
                        href={route("assets.index")}
                    >
                        ← Back to Assets
                    </Button>
                </div>
                <h1 className="text-2xl font-bold mb-4">
                    General Asset Information
                </h1>

                {/* General Asset Info */}
                <div className="border p-4 rounded-lg mb-6">
                    <p>
                        Asset ID: <strong>{asset?.ASSETSID}</strong>
                    </p>
                    <p>
                        Employee ID:{" "}
                        <strong>{asset?.employee?.EMPLOYEEID}</strong>
                    </p>
                    <p>
                        Employee Name:{" "}
                        <strong>{asset?.employee?.EMPLOYEENAME}</strong>
                    </p>
                </div>

                {/* Asset Details Table */}

                <Table
                    aria-label="Asset Details table"
                    isStriped
                    topContent={
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold mb-2">
                                Asset Details
                            </h2>

                            <Button
                                color="primary"
                                as={Link}
                                href={route("assets.create", {
                                    id: asset.ASSETSID,
                                })}
                            >
                                Add New Asset
                            </Button>
                        </div>
                    }
                >
                    <TableHeader>
                        <TableColumn>Action</TableColumn>
                        <TableColumn>Asset No</TableColumn>
                        <TableColumn>Asset ID</TableColumn>
                        <TableColumn>Product ID</TableColumn>
                        <TableColumn>Description</TableColumn>
                        <TableColumn>Model</TableColumn>
                        <TableColumn>Serial No</TableColumn>
                        <TableColumn>Serial Type</TableColumn>
                        <TableColumn>Issued To</TableColumn>
                        <TableColumn>Date Issued</TableColumn>
                        <TableColumn>Status</TableColumn>
                        <TableColumn>Condition</TableColumn>
                        <TableColumn>Asset From</TableColumn>
                        <TableColumn>Type/Size</TableColumn>
                        <TableColumn>Workstation</TableColumn>
                        <TableColumn>System Asset ID</TableColumn>
                        <TableColumn>System Component ID</TableColumn>
                        <TableColumn>With Components</TableColumn>
                        <TableColumn>Components</TableColumn>
                        <TableColumn>No Print</TableColumn>
                        <TableColumn>Image Path</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={"No rows to display."}>
                        {asset.asset_details.map((detail) => (
                            <TableRow key={detail.ASSETNO}>
                                <TableCell className="flex gap-2">
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
                                    {/* <Button
                                        onPress={() => {
                                            axios
                                                .post(
                                                    route("assets.destroy", {
                                                        assetId: detail.ASSETID,
                                                        assetNo: detail.ASSETNO,
                                                    }),
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
                                                        error.response?.data ||
                                                            error.message
                                                    );
                                                });
                                        }}
                                        color="danger"
                                        size="sm"
                                    >
                                        Delete
                                    </Button> */}
                                </TableCell>
                                <TableCell>{detail.ASSETNO}</TableCell>
                                <TableCell>{detail.ASSETID}</TableCell>
                                <TableCell>{detail.PRODUCTID}</TableCell>
                                <TableCell>{detail.DESCRIPTION}</TableCell>
                                <TableCell>{detail.MODEL}</TableCell>
                                <TableCell>{detail.SERIALNO}</TableCell>
                                <TableCell>{detail.SERIALTYPE}</TableCell>
                                <TableCell>{detail.ISSUEDTO}</TableCell>
                                <TableCell>{detail.DATEISSUED}</TableCell>
                                <TableCell>{detail.STATUS}</TableCell>
                                <TableCell>{detail.CONDITIONS}</TableCell>
                                <TableCell>{detail.ASSETFROM}</TableCell>
                                <TableCell>{detail.TYPESIZE}</TableCell>
                                <TableCell>{detail.WORKSTATION}</TableCell>
                                <TableCell>{detail.SYSTEMASSETID}</TableCell>
                                <TableCell>
                                    {detail.SYSTEMCOMPONENTID}
                                </TableCell>
                                <TableCell>{detail.WITHCOMPONENTS}</TableCell>
                                <TableCell>{detail.COMPONENTS}</TableCell>
                                <TableCell>{detail.NOPRINT}</TableCell>
                                <TableCell>{detail.IMAGEPATH}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Asset Components Table */}
                {/* <h2 className="text-xl font-bold mb-2">Asset Components</h2>
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
                </table> */}
            </div>
        </Authenticated>
    );
}
