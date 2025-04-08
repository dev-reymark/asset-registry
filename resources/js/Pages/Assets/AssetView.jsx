import { Head, Link, router, usePage } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";
import {
    Button,
    Chip,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tabs,
} from "@heroui/react";
import toast from "react-hot-toast";
import { route } from "ziggy-js";

export default function AssetView() {
    const { asset, archivedDetails } = usePage().props; // Get asset
    const userRole = usePage().props.auth?.user?.role;
    // Get the logged-in user's role
    // console.log("User role:", userRole);
    // console.log(asset);

    const archiveAsset = (assetId, assetNo) => {
        router.post(
            route("assets.archive", { assetId, assetNo }),
            {
                _method: "PUT",
            },
            {
                onSuccess: () => toast.success("Asset archived!"),
                onError: () => toast.error("Failed to archive asset."),
            }
        );
        router.reload();
    };

    const restoreAsset = (assetId, assetNo) => {
        router.post(
            route("assets.restore", { assetId, assetNo }),
            {
                _method: "PUT",
            },
            {
                onSuccess: () => toast.success("Asset restored!"),
                onError: () => toast.error("Failed to restore asset."),
            }
        );
        router.reload();
    };

    return (
        <Authenticated
            auth={usePage().props.auth}
            errors={usePage().props.errors}
        >
            <Head title={`Asset Details - ${asset.ASSETSID}`} />
            <div className="p-6">
                <div className="my-6">
                    {userRole === "admin" && (
                        <Button
                            color="primary"
                            variant="flat"
                            as={Link}
                            href={route("assets.index")}
                        >
                            ← Back to Assets
                        </Button>
                    )}
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
                        <strong>{asset?.employee?.EMPLOYEEID ?? "--"}</strong>
                    </p>
                    <p>
                        Employee Name:{" "}
                        <strong>{asset?.employee?.EMPLOYEENAME}</strong>
                    </p>
                </div>

                <Tabs aria-label="Assets Tabs" color="secondary">
                    <Tab key="employee-assets" title="Employee Assets">
                        <Table
                            aria-label="Asset Details table"
                            isStriped
                            topContent={
                                userRole === "admin" && (
                                    <div className="flex justify-end items-center">
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
                                )
                            }
                        >
                            <TableHeader>
                                <TableColumn>Action</TableColumn>
                                <TableColumn>System Asset ID</TableColumn>
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
                                <TableColumn>With Components</TableColumn>
                                <TableColumn>Components</TableColumn>
                            </TableHeader>
                            <TableBody emptyContent={"No rows to display."}>
                                {asset.asset_details.map((detail) => (
                                    <TableRow key={detail.ASSETNO}>
                                        <TableCell className="flex flex-col gap-1">
                                            {(userRole === "admin" && (
                                                <>
                                                    <Button
                                                        as={Link}
                                                        href={route(
                                                            "assets.edit",
                                                            {
                                                                assetId:
                                                                    detail.ASSETID,
                                                                assetNo:
                                                                    detail.ASSETNO,
                                                            }
                                                        )}
                                                        color="success"
                                                        size="sm"
                                                    >
                                                        Update
                                                    </Button>
                                                    <Button
                                                        color="warning"
                                                        size="sm"
                                                        onPress={() =>
                                                            archiveAsset(
                                                                detail.ASSETID,
                                                                detail.ASSETNO
                                                            )
                                                        }
                                                    >
                                                        Archive
                                                    </Button>
                                                </>
                                            )) ||
                                                "--"}
                                        </TableCell>
                                        <TableCell>
                                            {detail.SYSTEMASSETID}
                                        </TableCell>
                                        <TableCell>
                                            {detail.DESCRIPTION}
                                        </TableCell>
                                        <TableCell>{detail.MODEL}</TableCell>
                                        <TableCell>{detail.SERIALNO}</TableCell>
                                        <TableCell>
                                            {detail.SERIALTYPE}
                                        </TableCell>
                                        <TableCell>{detail.ISSUEDTO}</TableCell>
                                        <TableCell>
                                            {detail.DATEISSUUED
                                                ? new Date(
                                                      detail.DATEISSUUED
                                                  ).toLocaleDateString()
                                                : "--"}
                                        </TableCell>
                                        <TableCell>
                                            <Chip>{detail.STATUS}</Chip>
                                        </TableCell>
                                        <TableCell>
                                            {detail.CONDITIONS}
                                        </TableCell>
                                        <TableCell>
                                            {detail.ASSETFROM}
                                        </TableCell>
                                        <TableCell>{detail.TYPESIZE}</TableCell>
                                        <TableCell>
                                            {detail.WORKSTATION}
                                        </TableCell>

                                        <TableCell>
                                            {detail.WITHCOMPONENTS}
                                        </TableCell>
                                        <TableCell>
                                            {detail.COMPONENTS}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Tab>
                    <Tab key="asset-history" title="Asset History">
                        <Table aria-label="Archived Assets table">
                            <TableHeader>
                                <TableColumn>Action</TableColumn>
                                <TableColumn>System Asset ID</TableColumn>
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
                                <TableColumn>With Components</TableColumn>
                                <TableColumn>Components</TableColumn>
                            </TableHeader>
                            <TableBody emptyContent={"No rows to display."}>
                                {archivedDetails.map((detail) => (
                                    <TableRow key={detail.ASSETNO}>
                                        <TableCell className="flex flex-col gap-1">
                                            {(userRole === "admin" && (
                                                <Button
                                                    color="success"
                                                    size="sm"
                                                    onPress={() =>
                                                        restoreAsset(
                                                            detail.ASSETID,
                                                            detail.ASSETNO
                                                        )
                                                    }
                                                >
                                                    Restore
                                                </Button>
                                            )) ||
                                                "--"}
                                        </TableCell>
                                        <TableCell>
                                            {detail.SYSTEMASSETID}
                                        </TableCell>
                                        <TableCell>
                                            {detail.DESCRIPTION}
                                        </TableCell>
                                        <TableCell>{detail.MODEL}</TableCell>
                                        <TableCell>{detail.SERIALNO}</TableCell>
                                        <TableCell>
                                            {detail.SERIALTYPE}
                                        </TableCell>
                                        <TableCell>{detail.ISSUEDTO}</TableCell>
                                        <TableCell>
                                            {detail.DATEISSUUED
                                                ? new Date(
                                                      detail.DATEISSUUED
                                                  ).toLocaleDateString()
                                                : "--"}
                                        </TableCell>
                                        <TableCell>
                                            <Chip>{detail.STATUS}</Chip>
                                        </TableCell>
                                        <TableCell>
                                            {detail.CONDITIONS}
                                        </TableCell>
                                        <TableCell>
                                            {detail.ASSETFROM}
                                        </TableCell>
                                        <TableCell>{detail.TYPESIZE}</TableCell>
                                        <TableCell>
                                            {detail.WORKSTATION}
                                        </TableCell>
                                        <TableCell>
                                            {detail.WITHCOMPONENTS}
                                        </TableCell>
                                        <TableCell>
                                            {detail.COMPONENTS}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Tab>
                </Tabs>
            </div>
        </Authenticated>
    );
}
