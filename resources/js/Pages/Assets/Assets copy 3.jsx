import { Head, Link, router, usePage } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";
import {
    Button,
    Input,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    DropdownSection,
    Checkbox,
    useDisclosure,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Image,
    Chip,
    Tooltip,
    SelectItem,
    Select,
    Textarea,
} from "@heroui/react";
import { useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { CiSearch } from "react-icons/ci";
import { route } from "ziggy-js";
import FilterDropdown from "../../Components/Assets/FilterDropdown";
import { BsThreeDots } from "react-icons/bs";
import toast from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import { HiDotsVertical } from "react-icons/hi";
import { s } from "framer-motion/client";

const statusColors = {
    Active: "success",
    Defective: "danger",
    "For Aquisition": "warning",
    "For Repair": "secondary",
    "For Replacement": "primary",
    Archived: "default",
};

const newStatus = [
    { label: "Active", value: "Active" },
    { label: "Defective", value: "Defective" },
    { label: "For Aquisition", value: "For Aquisition" },
    { label: "For Repair", value: "For Repair" },
    { label: "For Replacement", value: "For Replacement" },
];

export default function Assets() {
    const {
        assets,
        location,
        title,
        desc,
        filters = {},
        descriptions,
        statuses,
        issuedTos,
    } = usePage().props;
    const [search, setSearch] = useState(filters.search || "");
    const [sort, setSort] = useState(filters.sort || "");
    const [startDate, setStartDate] = useState(filters.start_date || "");
    const [endDate, setEndDate] = useState(filters.end_date || "");
    const [description, setDescription] = useState(filters.description || "");
    const [status, setStatus] = useState(filters.status || "");
    const [issuedTo, setIssuedTo] = useState(filters.issued_to || "");
    const [sortField, setSortField] = useState(filters.sort_field || "");
    const [sortDirection, setSortDirection] = useState(
        filters.sort_direction || ""
    );
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [selectedKeys, setSelectedKeys] = useState(new Set());
    const [statusToTransfer, setStatusToTransfer] = useState("");

    const handleDateFilter = (start, end) => {
        router.get(
            route("assets.index"),
            { search, sort, start_date: start, end_date: end },
            { preserveState: true, replace: true }
        );
    };

    const onStartDateChange = (e) => {
        const value = e.target.value;
        setStartDate(value);
        handleDateFilter(value, endDate);
    };

    const onEndDateChange = (e) => {
        const value = e.target.value;
        setEndDate(value);
        handleDateFilter(startDate, value);
    };

    // Update the search term in the URL
    const handleSearch = (value) => {
        router.get(
            route("assets.index"),
            { search: value, sort },
            { preserveState: true, replace: true }
        );
    };

    // Debounce search
    const debouncedSearch = useDebounce(handleSearch, 300);

    const onSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        debouncedSearch(value); // Debounced search request
    };

    const onClear = () => {
        setSearch("");
        router.get(route("assets.index"), { search: "", sort });
    };

    const toggleSort = () => {
        const newSort = sort === "name_asc" ? "name_desc" : "name_asc";
        setSort(newSort);
        router.get(
            route("assets.index"),
            { search, sort: newSort },
            { preserveState: true, replace: true }
        );
    };

    const applyFilters = (updated) => {
        router.get(
            route("assets.index"),
            {
                search,
                sortField,
                sortDirection,
                start_date: startDate,
                end_date: endDate,
                description,
                status,
                issued_to: issuedTo,
                ...updated,
            },
            { preserveState: true, replace: true }
        );
    };

    const {
        isOpen: isTransferOpen,
        onOpen: openTransferModal,
        onOpenChange: onTransferOpenChange,
    } = useDisclosure();

    const [selectedLocationId, setSelectedLocationId] = useState("");
    const [loading, setLoading] = useState(false);

    const handleTransferAssets = (assetNos, locationId) => {
        const assetNosAsIntegers = assetNos.map(Number);
        setLoading(true);
        router.post(
            route("assetsextended.transfer"),
            {
                asset_nos: assetNosAsIntegers,
                location_id: locationId,
                status: statusToTransfer,
            },
            {
                preserveState: true,
                replace: true,
                onSuccess: () => {
                    setSelectedKeys(new Set());
                    setSelectedLocationId("");
                    setStatusToTransfer("");
                    toast.success("Assets transferred successfully.");
                },
                onError: (errors) => {
                    console.error("Transfer failed:", errors);
                    toast.error("Failed to transfer assets.");
                },
                onFinish: () => {
                    setLoading(false);
                },
            }
        );
    };

    const {
        isOpen: isArchiveOpen,
        onOpen: openArchiveModal,
        onOpenChange: onArchiveOpenChange,
    } = useDisclosure();
    const [reason, setReason] = useState("");
    const [condition, setCondition] = useState("");
    const [archiveLoading, setArchiveLoading] = useState(false);
    const [statusToArchive, setStatusToArchive] = useState("");

    const handleArchiveAssets = (assetNos) => {
        setArchiveLoading(true);
        const assetNosAsIntegers = assetNos.map(Number);
        router.post(
            route("assetsextended.archive", { assetNo: assetNosAsIntegers }),
            {
                status: statusToArchive,
                archival_reason: reason,
                conditions: condition,
            },
            {
                preserveState: true,
                replace: true,
                onSuccess: () => {
                    setSelectedKeys(new Set());
                    setStatusToArchive("");
                    setReason("");
                    setCondition("");
                    toast.success("Assets archived successfully.");
                },
                onError: (errors) => {
                    console.error("Archive failed:", errors);
                    toast.error("Failed to archive assets.");
                },
                onFinish: () => {
                    setArchiveLoading(false);
                },
            }
        );
    };

    //     router.post(
    //     route("assetsextended.bulkArchive"),
    //     {
    //         asset_nos: assetNosAsIntegers,
    //         status: statusToArchive,
    //         archival_reason: reason,
    //         conditions: condition,
    //     },
    //     { ... }
    // );

    // const handleRestore = () => {
    //     if (!confirm("Are you sure you want to restore this asset?")) return;

    //     router.post(`/assets/${assets.ASSETNO}/restore`);
    // };

    return (
        <Authenticated>
            <Head title="Employee Assets" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">{title}</h1>
                <p className="text-gray-600 mb-4">{desc}</p>

                {/* Search Input */}
                <div className="flex justify-between mb-4">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Search by name, description..."
                        startContent={<CiSearch className="size-5" />}
                        value={search}
                        onClear={onClear}
                        onChange={onSearchChange}
                    />

                    <div className="flex gap-2">
                        <FilterDropdown
                            statuses={statuses}
                            status={status}
                            setStatus={setStatus}
                            descriptions={descriptions}
                            description={description}
                            setDescription={setDescription}
                            issuedTos={issuedTos}
                            issuedTo={issuedTo}
                            applyFilters={applyFilters}
                            setIssuedTo={setIssuedTo}
                        />

                        {/* Date Filter Dropdown */}
                        <Dropdown>
                            <DropdownTrigger>
                                <Button variant="bordered">
                                    Filter by Date Issued
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="Filter by Date Issued"
                                className="p-2 w-72"
                                closeOnSelect={false}
                            >
                                <DropdownItem
                                    key="filter"
                                    className="cursor-default"
                                >
                                    <div className="flex flex-col gap-3">
                                        <Input
                                            type="date"
                                            label="Start Date"
                                            value={startDate}
                                            onChange={onStartDateChange}
                                        />
                                        <Input
                                            type="date"
                                            label="End Date"
                                            value={endDate}
                                            onChange={onEndDateChange}
                                        />

                                        <div className="flex justify-end gap-2 mt-2">
                                            <Button
                                                color="primary"
                                                onPress={() =>
                                                    handleDateFilter(
                                                        startDate,
                                                        endDate
                                                    )
                                                }
                                            >
                                                Apply
                                            </Button>
                                            <Button
                                                color="warning"
                                                variant="flat"
                                                onPress={() => {
                                                    setStartDate("");
                                                    setEndDate("");
                                                    handleDateFilter("", "");
                                                }}
                                            >
                                                Clear
                                            </Button>
                                        </div>
                                    </div>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>

                <Table
                    isVirtualized
                    selectionMode="multiple"
                    selectedKeys={selectedKeys}
                    onSelectionChange={setSelectedKeys}
                    aria-label="Employee Assets table"
                    isStriped
                    topContent={
                        <div className="flex justify-start items-center mb-4 gap-2">
                            <Button
                                color="primary"
                                as={Link}
                                href={route("assetsextended.create")}
                            >
                                Add New Asset
                            </Button>
                            <Button
                                color="success"
                                variant="flat"
                                onPress={openTransferModal}
                                isDisabled={selectedKeys.size === 0}
                            >
                                Transfer Asset
                            </Button>
                        </div>
                    }
                >
                    <TableHeader>
                        <TableColumn>Asset #</TableColumn>
                        <TableColumn>System Asset ID</TableColumn>

                        <TableColumn>Description</TableColumn>
                        <TableColumn>Model</TableColumn>
                        <TableColumn>Serial No</TableColumn>
                        <TableColumn
                            onClick={toggleSort}
                            style={{ cursor: "pointer" }}
                        >
                            EMPLOYEE
                            {sort === "name_asc" && " 🔼"}
                            {sort === "name_desc" && " 🔽"}
                            {!["name_asc", "name_desc"].includes(sort) && " ⏺️"}
                        </TableColumn>
                        <TableColumn>Location</TableColumn>
                        <TableColumn>Status</TableColumn>
                        <TableColumn>Date Issued</TableColumn>
                        <TableColumn>Actions</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={"No rows to display."}>
                        {assets.map((asset) =>
                            asset.asset_details.map((detail, index) => (
                                <TableRow key={detail.ASSETNO}>
                                    <TableCell>
                                        {detail.ASSETNUMBER?.trim()}
                                    </TableCell>
                                    <TableCell>
                                        {detail.SYSTEMASSETID?.trim()}
                                    </TableCell>
                                    <TableCell>
                                        {detail.DESCRIPTION?.trim()}
                                    </TableCell>
                                    <TableCell>
                                        {detail.MODEL?.trim()}
                                    </TableCell>
                                    <TableCell>
                                        {detail.SERIALNO?.trim()}
                                    </TableCell>
                                    <TableCell>
                                        {asset.EMPLOYEENAME?.trim()}
                                    </TableCell>
                                    <TableCell>
                                        {detail?.location.LOCATIONNAME?.trim()}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            variant="flat"
                                            color={
                                                statusColors[
                                                    detail.STATUS?.trim()
                                                ] || "default"
                                            }
                                            radius="md"
                                        >
                                            {detail.STATUS?.trim()}
                                        </Chip>
                                    </TableCell>
                                    <TableCell>
                                        {detail.DATEISSUUED
                                            ? new Date(
                                                  detail.DATEISSUUED.trim()
                                              ).toLocaleDateString()
                                            : "--"}
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
                                                        setSelectedAsset({
                                                            ...asset,
                                                            asset_details: [
                                                                detail,
                                                            ],
                                                        });
                                                        onOpen();
                                                    }}
                                                >
                                                    View
                                                </DropdownItem>

                                                <DropdownItem key="update">
                                                    Update
                                                </DropdownItem>
                                                <DropdownItem
                                                    className="text-danger"
                                                    color="danger"
                                                    key="dispose"
                                                    onPress={() => {
                                                        setSelectedAsset({
                                                            ...asset,
                                                            asset_details: [
                                                                detail,
                                                            ],
                                                        });
                                                        openArchiveModal();
                                                    }}
                                                >
                                                    Dispose
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                        {/* <Tooltip
                                            showArrow
                                            // placement="right"
                                            color="primary"
                                            content="More"
                                        >
                                            <Button
                                                // color="primary"
                                                variant="light"
                                                isIconOnly
                                                onPress={() => {
                                                    setSelectedAsset({
                                                        ...asset,
                                                        asset_details: [detail],
                                                    });
                                                    onOpen();
                                                }}
                                            >
                                                <BsThreeDots size={20} />
                                            </Button>
                                        </Tooltip> */}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <Modal
                    isOpen={isOpen}
                    size="xl"
                    placement="top-center"
                    onOpenChange={(open) => {
                        if (!open) setSelectedAsset(null);
                        onOpenChange(open);
                    }}
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                    Assets Details
                                </ModalHeader>
                                <ModalBody>
                                    {selectedAsset && (
                                        <div className="flex flex-wrap gap-6">
                                            <Swiper
                                                spaceBetween={10}
                                                slidesPerView={1}
                                                className="w-full sm:w-1/2 lg:w-1/3"
                                            >
                                                {selectedAsset?.asset_details[0]
                                                    ?.IMAGEPATH &&
                                                    JSON.parse(
                                                        selectedAsset
                                                            .asset_details[0]
                                                            .IMAGEPATH
                                                    ).map((path, index) => (
                                                        <SwiperSlide
                                                            key={index}
                                                        >
                                                            <Image
                                                                src={`/storage/${path}`}
                                                                alt={`Asset Image ${
                                                                    index + 1
                                                                }`}
                                                                className="object-cover"
                                                                width={400}
                                                                height={200}
                                                                onError={(e) =>
                                                                    (e.target.src =
                                                                        "/assets/placeholder.jpg")
                                                                }
                                                            />
                                                        </SwiperSlide>
                                                    ))}
                                            </Swiper>

                                            <div className="flex-1 space-y-4 text-sm text-gray-700">
                                                {/* <p>
                                                    <span className="font-semibold">
                                                        Asset ID:
                                                    </span>{" "}
                                                    {selectedAsset.ASSETSID}
                                                </p> */}
                                                {/* <p>
                                                    <span className="font-semibold">
                                                        Issued To:
                                                    </span>{" "}
                                                    {selectedAsset.EMPLOYEENAME}
                                                </p>
                                                <p>
                                                    <span className="font-semibold">
                                                        Employee ID:
                                                    </span>{" "}
                                                    {
                                                        selectedAsset.employee
                                                            ?.EMPLOYEEID
                                                    }
                                                </p> */}
                                                <p>
                                                    <span className="font-semibold">
                                                        Description:
                                                    </span>{" "}
                                                    {
                                                        selectedAsset
                                                            .asset_details[0]
                                                            ?.DESCRIPTION
                                                    }
                                                </p>
                                                <p>
                                                    <span className="font-semibold">
                                                        Serial Number:
                                                    </span>{" "}
                                                    {
                                                        selectedAsset
                                                            .asset_details[0]
                                                            ?.SERIALNO
                                                    }
                                                </p>
                                                <p>
                                                    <span className="font-semibold">
                                                        Date Issued:
                                                    </span>{" "}
                                                    {selectedAsset.asset_details[0]?.DATEISSUUED?.trim()}
                                                </p>
                                                {/* <p>
                                                    <span className="font-semibold">
                                                        Status:
                                                    </span>{" "}
                                                    {
                                                        selectedAsset
                                                            .asset_details[0]
                                                            ?.STATUS
                                                    }
                                                </p> */}
                                                <p>
                                                    <span className="font-semibold">
                                                        Condition:
                                                    </span>{" "}
                                                    {
                                                        selectedAsset
                                                            .asset_details[0]
                                                            ?.CONDITIONS
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </ModalBody>

                                <ModalFooter>
                                    <Button
                                        color="danger"
                                        variant="flat"
                                        onPress={onClose}
                                    >
                                        Close
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
                <Modal
                    isOpen={isTransferOpen}
                    onOpenChange={onTransferOpenChange}
                    size="md"
                    placement="top-center"
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                    <h1 className="text-lg font-semibold">
                                        Transfer Assets
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        Select a location to transfer the
                                        selected assets.
                                    </p>
                                </ModalHeader>
                                <ModalBody>
                                    <Select
                                        label="Select Location"
                                        value={selectedLocationId}
                                        onChange={(e) =>
                                            setSelectedLocationId(
                                                e.target.value
                                            )
                                        }
                                    >
                                        {location.map((location) => (
                                            <SelectItem
                                                key={location.LOCATIONID}
                                                value={location.LOCATIONID}
                                            >
                                                {location.LOCATIONNAME}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    <Select
                                        label="Select Status"
                                        value={statusToTransfer}
                                        onChange={(e) =>
                                            setStatusToTransfer(e.target.value)
                                        }
                                    >
                                        {newStatus.map((status) => (
                                            <SelectItem
                                                key={status.value}
                                                value={status.value}
                                            >
                                                {status.label}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={onClose}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        color="primary"
                                        onPress={() => {
                                            handleTransferAssets(
                                                Array.from(selectedKeys),
                                                selectedLocationId
                                            );
                                            onClose();
                                        }}
                                        isDisabled={!selectedLocationId}
                                        isLoading={loading}
                                    >
                                        {loading
                                            ? "Transferring..."
                                            : "Transfer"}
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
                <Modal
                    isOpen={isArchiveOpen}
                    onOpenChange={onArchiveOpenChange}
                    placement="top-center"
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                    <h1 className="text-lg font-semibold text-danger-500">
                                        Are you sure you want to dispose?
                                    </h1>
                                    <ModalBody className="">
                                        <Textarea
                                            isRequired
                                            label="Reason for disposal"
                                            value={reason}
                                            onChange={(e) =>
                                                setReason(e.target.value)
                                            }
                                        />
                                        <Select
                                            isRequired
                                            variant="faded"
                                            label="Select Status"
                                            value={statusToArchive}
                                            onChange={(e) =>
                                                setStatusToArchive(
                                                    e.target.value
                                                )
                                            }
                                        >
                                            {newStatus.map((status) => (
                                                <SelectItem
                                                    key={status.value}
                                                    value={status.value}
                                                >
                                                    {status.label}
                                                </SelectItem>
                                            ))}
                                        </Select>
                                        <Textarea
                                            variant="faded"
                                            isRequired
                                            label="Asset Condition"
                                            value={condition}
                                            onChange={(e) =>
                                                setCondition(e.target.value)
                                            }
                                        />
                                    </ModalBody>
                                </ModalHeader>
                                <ModalFooter>
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={onClose}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        color="primary"
                                        onPress={() => {
                                            handleArchiveAssets(
                                                Array.from(selectedKeys)
                                            );
                                            onClose();
                                        }}
                                        isDisabled={!reason || !condition}
                                        isLoading={archiveLoading}
                                    >
                                        {archiveLoading
                                            ? "Disposing..."
                                            : "Dispose"}
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
        </Authenticated>
    );
}
