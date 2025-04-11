import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";
import {
    Button,
    Chip,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalFooter,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tabs,
    Textarea,
    useDisclosure,
} from "@heroui/react";
import toast from "react-hot-toast";
import { route } from "ziggy-js";
import { useState } from "react";

export default function AssetView() {
    const { asset, archivedDetails } = usePage().props; // Get asset
    // const { data, setData } = useForm({});
    // console.log(archivedDetails);
    const userRole = usePage().props.auth?.user?.role;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [reason, setReason] = useState("");
    const [status, setStatus] = useState("");
    const [condition, setCondition] = useState("");
    const [selectedArchivedDetail, setSelectedArchivedDetail] = useState(null);
    const {
        isOpen: isDetailOpen,
        onOpen: onDetailOpen,
        onClose: onDetailClose,
    } = useDisclosure();

    const viewAssetDetail = (assetNo) => {
        // console.log(assetNo);
        const detail = archivedDetails.find((d) => d.ASSETNO === assetNo);
        if (detail?.archived_detail) {
            setSelectedArchivedDetail(detail.archived_detail);
            onDetailOpen();
        } else {
            toast.error("Archived detail not found.");
        }
    };

    const archiveAsset = (assetId, assetNo, reason, status, condition) => {
        if (!reason || !status || !condition) {
            toast.error("Please fill in all fields.");
            return;
        }
        router.post(
            route("assets.archive", { assetId, assetNo }),
            {
                _method: "PUT",
                reason,
                status,
                condition,
            },
            {
                onSuccess: () => {
                    toast.success("Asset archived!");
                    onClose();
                },
                onError: (err) => {
                    toast.error(
                        "Failed to archive asset. " + (err?.message || "")
                    );
                },
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
                onSuccess: () => {
                    toast.success("Asset restored!");
                    setIsLoading(false); // Stop loading
                },
                onError: () => {
                    toast.error("Failed to restore asset.");
                    setIsLoading(false); // Stop loading
                },
            }
        );
        router.reload();
    };

    return (
        <Authenticated
            auth={usePage().props.auth}
            errors={usePage().props.errors}
        >
            <Head title={`Assets by ${asset.employee?.EMPLOYEENAME}`} />
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
                                    <div className="flex justify-start items-center gap-2">
                                        <Button
                                            color="primary"
                                            as={Link}
                                            href={route("assets.create", {
                                                id: asset.ASSETSID,
                                            })}
                                        >
                                            Add New Asset
                                        </Button>
                                        <Button
                                            as={Link}
                                            color="success"
                                            variant="flat"
                                            href={route(
                                                "assets.viewEmployeeAssets",
                                                {
                                                    id: asset.EMPLOYEEID,
                                                }
                                            )}
                                        >
                                            View to Print
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
                                                        onPress={() => {
                                                            // Open modal
                                                            setReason("");
                                                            setStatus("");
                                                            setCondition("");
                                                            onOpen();
                                                        }}
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
                                            {
                                                asset.employee?.workstation
                                                    ?.WORKSTATION
                                            }
                                        </TableCell>

                                        <TableCell>
                                            {detail.WITHCOMPONENTS}
                                        </TableCell>
                                        <TableCell>
                                            {detail.COMPONENTS || "--"}
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
                                                    color="primary"
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

                                            <Button
                                                color="success"
                                                variant="flat"
                                                size="sm"
                                                onPress={() =>
                                                    viewAssetDetail(
                                                        detail.ASSETNO
                                                    )
                                                }
                                                isDisabled={
                                                    detail.archived_detail ===
                                                    null
                                                }
                                                className={
                                                    detail.archived_detail ===
                                                    null
                                                        ? "cursor-not-allowed"
                                                        : ""
                                                }
                                            >
                                                Details
                                            </Button>
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

                <Modal isOpen={isOpen} onClose={onClose} onOpenChange={onClose}>
                    <ModalContent>
                        <ModalHeader>
                            Are you sure you want to archive?
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                isRequired
                                label="Reason for Archiving"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                            <Textarea
                                variant="faded"
                                isRequired
                                label="Asset Status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            />
                            <Textarea
                                variant="faded"
                                isRequired
                                label="Asset Condition"
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="warning"
                                onPress={() =>
                                    archiveAsset(
                                        asset.asset_details[0].ASSETID,
                                        asset.asset_details[0].ASSETNO,
                                        reason,
                                        status,
                                        condition
                                    )
                                }
                            >
                                Archive
                            </Button>
                            <Button
                                color="danger"
                                variant="flat"
                                onPress={onClose}
                            >
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                <Modal
                    isOpen={isDetailOpen}
                    onClose={onDetailClose}
                    onOpenChange={onDetailClose}
                >
                    <ModalContent>
                        <ModalHeader>Archived Details</ModalHeader>
                        <ModalBody>
                            <Input
                                type="date"
                                isReadOnly
                                label="Date Archived"
                                value={
                                    selectedArchivedDetail?.created_at
                                        ? new Date(
                                              selectedArchivedDetail.created_at
                                          )
                                              .toISOString()
                                              .split("T")[0]
                                        : ""
                                }
                            />
                            <Input
                                isReadOnly
                                label="Reason for Archiving"
                                value={
                                    selectedArchivedDetail?.archival_reason ||
                                    ""
                                }
                            />
                            <Textarea
                                variant="faded"
                                isReadOnly
                                label="Asset Status"
                                value={selectedArchivedDetail?.status || ""}
                            />
                            <Textarea
                                variant="faded"
                                isReadOnly
                                label="Asset Condition"
                                value={selectedArchivedDetail?.conditions || ""}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="flat"
                                onPress={onDetailClose}
                            >
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>
        </Authenticated>
    );
}
