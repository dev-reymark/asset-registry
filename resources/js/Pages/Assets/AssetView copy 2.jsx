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
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    ButtonGroup,
} from "@heroui/react";
import toast from "react-hot-toast";
import { route } from "ziggy-js";
import { useState } from "react";
import { statusColors } from "../../Components/Assets/constants/statusConstants";
import { HiDotsVertical } from "react-icons/hi";

export default function AssetView() {
    const { asset, archivedDetails } = usePage().props; // Get asset
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
                            href={route("employees.index")}
                        >
                            ← Back to Employees
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

                {userRole === "admin" && (
                    <div className="flex justify-start items-center gap-2 mb-3">
                        <ButtonGroup>
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
                                href={route("assets.viewEmployeeAssets", {
                                    id: asset.EMPLOYEEID,
                                })}
                            >
                                View to Print
                            </Button>
                        </ButtonGroup>
                    </div>
                )}
                <Table isVirtualized aria-label="Asset Details table" isStriped>
                    <TableHeader>
                        <TableColumn>Asset #</TableColumn>
                        <TableColumn>System Asset ID</TableColumn>
                        <TableColumn>Description</TableColumn>
                        <TableColumn>Model</TableColumn>
                        <TableColumn>Serial No</TableColumn>
                        <TableColumn>Date Issued</TableColumn>
                        <TableColumn>Status</TableColumn>
                        <TableColumn>Actions</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={"No rows to display."}>
                        {asset.asset_details.map((detail) => (
                            <TableRow key={detail.ASSETNO}>
                                <TableCell>{detail.ASSETNUMBER}</TableCell>
                                <TableCell>{detail.SYSTEMASSETID}</TableCell>
                                <TableCell>{detail.DESCRIPTION}</TableCell>
                                <TableCell>{detail.MODEL}</TableCell>
                                <TableCell>{detail.SERIALNO}</TableCell>

                                <TableCell>
                                    {detail.DATEISSUUED
                                        ? new Date(
                                              detail.DATEISSUUED
                                          ).toLocaleDateString()
                                        : "--"}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        color={
                                            statusColors[
                                                detail.STATUS?.trim()
                                            ] || "default"
                                        }
                                        variant="dot"
                                        className="capitalize border-none gap-1 text-default-600"
                                    >
                                        {detail.STATUS}
                                    </Chip>
                                </TableCell>

                                <TableCell>
                                    <Dropdown>
                                        <DropdownTrigger>
                                            <Button
                                                isIconOnly
                                                size="sm"
                                                variant="light"
                                            >
                                                <HiDotsVertical
                                                    size={20}
                                                    className="text-default-800"
                                                />
                                            </Button>
                                        </DropdownTrigger>
                                        <DropdownMenu>
                                            <DropdownItem key="view" as={Link}>
                                                View
                                            </DropdownItem>

                                            <DropdownItem
                                                as={Link}
                                                href={route("assets.edit", {
                                                    assetId: detail.ASSETID,
                                                    assetNo: detail.ASSETNO,
                                                })}
                                                key="update"
                                            >
                                                Update
                                            </DropdownItem>
                                            <DropdownItem
                                                className="text-danger"
                                                color="danger"
                                                key="dispose"
                                                onPress={() => {
                                                    setReason("");
                                                    setStatus("");
                                                    setCondition("");
                                                    onOpen();
                                                }}
                                            >
                                                Dispose
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Modal isOpen={isOpen} onClose={onClose} onOpenChange={onClose}>
                    <ModalContent>
                        <ModalHeader className="text-danger-500">
                            Are you sure you want to dispose this asset?
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                isRequired
                                label="Reason for disposal"
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
                                Confirm
                            </Button>
                            <Button
                                color="danger"
                                variant="light"
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
                        <ModalHeader>Asset Details</ModalHeader>
                        <ModalBody>
                            <Input
                                type="date"
                                isReadOnly
                                label="Disposed Date"
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
                                label="Reason for disposal"
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
