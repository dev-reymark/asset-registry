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
    useDisclosure,
    Chip,
    ButtonGroup,
} from "@heroui/react";
import { useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { CiSearch } from "react-icons/ci";
import { route } from "ziggy-js";
import FilterDropdown from "../../Components/Assets/FilterDropdown";
import toast from "react-hot-toast";
import { HiDotsVertical } from "react-icons/hi";
import { AssetComponents } from "../../Components/Assets/AssetComponents";
import {
    newStatus,
    statusColors,
} from "../../Components/Assets/constants/statusConstants";
import { AssetDetails } from "../../Components/Assets/AssetDetails";
import { TransferAssets } from "../../Components/Assets/TransferAssets";
import { ArchiveAsset } from "../../Components/Assets/ArchiveAsset";
import { AssetDeclassification } from "../../Components/Assets/AssetDeclassification";
import { FiCornerUpRight, FiPlus } from "react-icons/fi";
import { MdMoveDown } from "react-icons/md";

export default function Assets() {
    const {
        employees,
        assets,
        location,
        title,
        desc,
        filters = {},
        descriptions,
        statuses,
        issuedTos,
    } = usePage().props;
    // console.log("Assets", assets);
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
    const {
        isOpen: isDeclassificationOpen,
        onOpen: openDeclassificationModal,
        onOpenChange: onDeclassificationOpenChange,
    } = useDisclosure();

    const [selectedLocationId, setSelectedLocationId] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

    const handleTransferAssets = (assetNos, locationId, employeeId) => {
        const assetNosAsIntegers = assetNos.map(Number);
        setLoading(true);
        router.post(
            route("assetsextended.transfer"),
            {
                asset_nos: assetNosAsIntegers,
                location_id: locationId,
                employee_id: employeeId,
                status: statusToTransfer,
            },
            {
                preserveState: true,
                replace: true,
                onSuccess: () => {
                    setSelectedKeys(new Set());
                    setSelectedLocationId("");
                    setSelectedEmployeeId("");
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

    const handleAssetDeclassification = (assetNos, locationId) => {
        const assetNosAsIntegers = assetNos.map(Number);
        setLoading(true);
        router.post(
            route("assetsextended.declassify"),
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

    const handleArchiveAssets = (assetNo) => {
        setArchiveLoading(true);
        router.post(
            route("assetsextended.archive", { assetNo: assetNo }),
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

    const {
        isOpen: isComponentModalOpen,
        onOpen: onComponentModalOpen,
        onOpenChange: onComponentModalOpenChange,
    } = useDisclosure();

    return (
        <Authenticated>
            <Head title={title} />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">{title}</h1>
                <p className="text-gray-600 mb-4">{desc}</p>

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

                <div className="flex w-full flex-col">
                    <div className="flex justify-start items-center mb-4 gap-2">
                        <ButtonGroup>
                            <Button
                                color="primary"
                                as={Link}
                                variant="flat"
                                startContent={<FiPlus className="size-5" />}
                                href={route("assetsextended.create")}
                            >
                                Add Asset
                            </Button>
                            <Button
                                color="success"
                                variant="flat"
                                startContent={
                                    <FiCornerUpRight className="size-5" />
                                }
                                onPress={openTransferModal}
                                isDisabled={selectedKeys.size === 0}
                            >
                                Transfer Asset
                            </Button>
                            <Button
                                color="secondary"
                                variant="flat"
                                startContent={<MdMoveDown className="size-5" />}
                                onPress={openDeclassificationModal}
                                isDisabled={selectedKeys.size === 0}
                            >
                                Declassify
                            </Button>
                        </ButtonGroup>
                    </div>
                    <Table
                        isCompact
                        isHeaderSticky
                        isVirtualized
                        maxTableHeight={"calc(100vh - 300px)"}
                        selectionMode="multiple"
                        selectedKeys={selectedKeys}
                        onSelectionChange={setSelectedKeys}
                        aria-label="Employee Assets table"
                        isStriped
                    >
                        <TableHeader className="sticky top-0 bg-white z-10">
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
                                {!["name_asc", "name_desc"].includes(sort) &&
                                    " ⏺️"}
                            </TableColumn>
                            <TableColumn>Location</TableColumn>
                            <TableColumn>Status</TableColumn>
                            <TableColumn>Date Issued</TableColumn>
                            <TableColumn>Actions</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent={"No rows to display."}>
                            {assets
                                .filter((asset) =>
                                    asset.asset_details.some(
                                        (detail) =>
                                            parseInt(detail.archived) === 0 // Filter out assets that have archived detail
                                    )
                                )
                                .map((asset) =>
                                    asset.asset_details
                                        .filter(
                                            (detail) =>
                                                parseInt(detail.archived) === 0
                                        ) // Ensure only active asset details are displayed
                                        .map((detail, index) => (
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
                                                                    setSelectedAsset(
                                                                        {
                                                                            ...asset,
                                                                            asset_details:
                                                                                [
                                                                                    detail,
                                                                                ],
                                                                        }
                                                                    );
                                                                    onOpen();
                                                                }}
                                                            >
                                                                View
                                                            </DropdownItem>

                                                            <DropdownItem
                                                                as={Link}
                                                                href={route(
                                                                    "assetsextended.edit",
                                                                    detail.ASSETNO
                                                                )}
                                                                key="update"
                                                            >
                                                                Update
                                                            </DropdownItem>
                                                            <DropdownItem
                                                                className="text-danger"
                                                                color="danger"
                                                                key="dispose"
                                                                onPress={() => {
                                                                    setSelectedAsset(
                                                                        {
                                                                            ...asset,
                                                                            asset_details:
                                                                                [
                                                                                    detail,
                                                                                ],
                                                                        }
                                                                    );
                                                                    openArchiveModal();
                                                                }}
                                                            >
                                                                Dispose
                                                            </DropdownItem>
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                )}
                        </TableBody>
                    </Table>
                </div>

                <AssetDetails
                    selectedAsset={selectedAsset}
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    onComponentModalOpen={onComponentModalOpen}
                />

                <AssetComponents
                    onComponentModalOpenChange={onComponentModalOpenChange}
                    selectedAsset={selectedAsset}
                    isComponentModalOpen={isComponentModalOpen}
                />

                <TransferAssets
                    isTransferOpen={isTransferOpen}
                    onTransferOpenChange={onTransferOpenChange}
                    employees={employees}
                    location={location}
                    selectedEmployeeId={selectedEmployeeId}
                    setSelectedEmployeeId={setSelectedEmployeeId}
                    selectedLocationId={selectedLocationId}
                    setSelectedLocationId={setSelectedLocationId}
                    statusToTransfer={statusToTransfer}
                    setStatusToTransfer={setStatusToTransfer}
                    newStatus={newStatus}
                    selectedKeys={selectedKeys}
                    handleTransferAssets={handleTransferAssets}
                    loading={loading}
                />

                <AssetDeclassification
                    location={location}
                    selectedLocationId={selectedLocationId}
                    setSelectedLocationId={setSelectedLocationId}
                    statusToTransfer={statusToTransfer}
                    setStatusToTransfer={setStatusToTransfer}
                    newStatus={newStatus}
                    selectedKeys={selectedKeys}
                    isDeclassificationOpen={isDeclassificationOpen}
                    onDeclassificationOpenChange={onDeclassificationOpenChange}
                    handleDeclassification={handleAssetDeclassification}
                    loading={loading}
                />

                <ArchiveAsset
                    isArchiveOpen={isArchiveOpen}
                    onArchiveOpenChange={onArchiveOpenChange}
                    reason={reason}
                    setReason={setReason}
                    statusToArchive={statusToArchive}
                    setStatusToArchive={setStatusToArchive}
                    condition={condition}
                    setCondition={setCondition}
                    handleArchiveAssets={handleArchiveAssets}
                    loading={archiveLoading}
                    selectedAsset={selectedAsset}
                    archiveLoading={archiveLoading}
                    newStatus={newStatus}
                />
            </div>
        </Authenticated>
    );
}
