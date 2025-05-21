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
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
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
import { Swiper, SwiperSlide } from "swiper/react";

export default function AssetView() {
    const { asset } = usePage().props; // Get asset
    // console.log(asset);
    const userRole = usePage().props.auth?.user?.role;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [reason, setReason] = useState("");
    const [status, setStatus] = useState("");
    const [condition, setCondition] = useState("");
    const [selectedAssetDetail, setSelectedAssetDetail] = useState(null);

    const {
        isOpen: isOpenAsset,
        onOpen: onOpenAsset,
        onClose: onCloseAsset,
    } = useDisclosure();

    const {
        isOpen: isComponentModalOpen,
        onOpen: openComponentModal,
        onClose: onCloseComponentModal,
    } = useDisclosure();

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
                <div className="flex justify-start items-center gap-2 mb-3">
                    {/* <ButtonGroup>
                        <Button
                            color="primary"
                            as={Link}
                            href={route("assets.create", {
                                id: asset.ASSETSID,
                            })}
                        >
                            Add New Asset
                        </Button> */}
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
                    {/* </ButtonGroup> */}
                </div>

                <Table
                    maxTableHeight={"300px"}
                    isVirtualized
                    aria-label="Asset Details table"
                    isStriped
                >
                    <TableHeader>
                        {/* <TableColumn>Employee ID</TableColumn> */}
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
                                {/* <TableCell>{detail.EMPLOYEEID}</TableCell> */}
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
                                            <DropdownItem
                                                key="view"
                                                onPress={() => {
                                                    setSelectedAssetDetail(
                                                        detail
                                                    );
                                                    onOpenAsset();
                                                }}
                                            >
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

                <Modal isOpen={isOpenAsset} onClose={onCloseAsset}>
                    <ModalContent>
                        <ModalHeader>Asset Details</ModalHeader>
                        <ModalBody>
                            {selectedAssetDetail && (
                                <div className="flex flex-wrap gap-6">
                                    {selectedAssetDetail.IMAGEPATH && (
                                        <Swiper
                                            spaceBetween={10}
                                            slidesPerView={1}
                                            className="w-full sm:w-1/2 lg:w-1/3"
                                        >
                                            {JSON.parse(
                                                selectedAssetDetail.IMAGEPATH
                                            ).map((path, index) => (
                                                <SwiperSlide key={index}>
                                                    <img
                                                        src={`/storage/${path}`}
                                                        alt={`Asset Image ${
                                                            index + 1
                                                        }`}
                                                        className="object-cover w-full h-48 rounded-lg"
                                                        onError={(e) =>
                                                            (e.target.src =
                                                                "/assets/placeholder.jpg")
                                                        }
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    )}

                                    <div className="flex-1 space-y-4 text-sm text-gray-700">
                                        <p>
                                            <span className="font-semibold">
                                                Description:
                                            </span>{" "}
                                            {selectedAssetDetail.DESCRIPTION}
                                        </p>
                                        <p>
                                            <span className="font-semibold">
                                                Serial Number:
                                            </span>{" "}
                                            {selectedAssetDetail.SERIALNO}
                                        </p>
                                        <p>
                                            <span className="font-semibold">
                                                Date Issued:
                                            </span>{" "}
                                            {selectedAssetDetail.DATEISSUUED?.trim() ??
                                                "--"}
                                        </p>
                                        <p>
                                            <span className="font-semibold">
                                                Location:
                                            </span>{" "}
                                            {
                                                selectedAssetDetail.location
                                                    .LOCATIONNAME
                                            }
                                        </p>
                                        <p>
                                            <span className="font-semibold">
                                                Condition:
                                            </span>{" "}
                                            {selectedAssetDetail.CONDITIONS ??
                                                "--"}
                                        </p>

                                        <p>
                                            <span className="font-semibold">
                                                Last Audit:
                                            </span>{" "}
                                            {selectedAssetDetail?.latest_scan
                                                ?.changes?.scanned_at
                                                ? new Date(
                                                      selectedAssetDetail.latest_scan.changes.scanned_at
                                                  ).toLocaleString()
                                                : "--"}
                                        </p>

                                        <Button
                                            color="primary"
                                            variant="light"
                                            onPress={() => {
                                                openComponentModal();
                                            }}
                                        >
                                            View components
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </ModalBody>

                        <ModalFooter>
                            <Button color="primary" onPress={onCloseAsset}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
                <Modal
                    size="3xl"
                    isOpen={isComponentModalOpen}
                    onClose={onCloseComponentModal}
                >
                    <ModalContent>
                        <ModalHeader className="flex flex-col gap-1">
                            Components
                        </ModalHeader>
                        <ModalBody>
                            <Table aria-label="Components Table">
                                <TableHeader>
                                    <TableColumn>Component #</TableColumn>
                                    <TableColumn>Component Name</TableColumn>
                                    <TableColumn>Description</TableColumn>
                                    <TableColumn>
                                        System Component ID
                                    </TableColumn>
                                </TableHeader>
                                <TableBody emptyContent="No components to display.">
                                    {(
                                        selectedAssetDetail?.component_details ||
                                        []
                                    ).map((component, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>
                                                {component.COMPONENTNUMBER}
                                            </TableCell>
                                            <TableCell>
                                                {component.asset_component
                                                    ?.ASSETCOMPONENTNAME ??
                                                    "--"}
                                            </TableCell>
                                            <TableCell>
                                                {component.COMPONENTDESCRIPTION ??
                                                    "--"}
                                            </TableCell>
                                            <TableCell>
                                                {component.SYSTEMCOMPONENTID}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={onCloseComponentModal}
                            >
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
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
            </div>
        </Authenticated>
    );
}
