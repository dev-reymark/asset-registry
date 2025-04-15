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
} from "@heroui/react";
import { useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { CiCirclePlus, CiFilter, CiSearch } from "react-icons/ci";
import { route } from "ziggy-js";
import FilterDropdown from "../../Components/Assets/FilterDropdown";

export default function Assets() {
    const {
        assets,
        title,
        desc,
        filters = {},
        descriptions,
        statuses,
        issuedTos,
    } = usePage().props;
    // Get assets
    console.log(assets);
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
                        placeholder="Search by name, description, department..."
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
                    selectionMode="multiple"
                    aria-label="Employee Assets table"
                    isStriped
                    topContent={
                        <div className="flex justify-start items-center mb-4 gap-2">
                            <Button color="primary" as={Link}>
                                Add New Asset
                            </Button>
                            <Button color="secondary" variant="flat" as={Link}>
                                Transfer Asset
                            </Button>
                        </div>
                    }
                >
                    <TableHeader>
                        <TableColumn>System Asset ID</TableColumn>
                        <TableColumn
                            onClick={toggleSort}
                            style={{ cursor: "pointer" }}
                        >
                            EMPLOYEE NAME
                            {sort === "name_asc" && " 🔼"}
                            {sort === "name_desc" && " 🔽"}
                            {!["name_asc", "name_desc"].includes(sort) && " ⏺️"}
                        </TableColumn>
                        <TableColumn>Description</TableColumn>
                        <TableColumn>Model</TableColumn>
                        <TableColumn>Serial No</TableColumn>
                        <TableColumn>Date Issued</TableColumn>
                        <TableColumn>Status</TableColumn>
                        <TableColumn>Actions</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={"No rows to display."}>
                        {assets.map((asset) => (
                            <TableRow key={asset.ASSETSID}>
                                <TableCell>
                                    {asset.asset_details[0]?.SYSTEMASSETID}
                                </TableCell>
                                <TableCell>{asset.EMPLOYEENAME}</TableCell>
                                <TableCell>
                                    {asset.asset_details[0]?.DESCRIPTION}
                                </TableCell>
                                <TableCell>
                                    {asset.asset_details[0]?.MODEL}
                                </TableCell>
                                <TableCell>
                                    {asset.asset_details[0]?.SERIALNO}
                                </TableCell>
                                <TableCell>
                                    {asset.asset_details[0]?.DATEISSUUED
                                        ? new Date(
                                              asset.asset_details[0].DATEISSUUED.trim()
                                          ).toLocaleDateString()
                                        : "--"}
                                </TableCell>
                                <TableCell>
                                    {asset.asset_details[0]?.STATUS}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        color="success"
                                        variant="flat"
                                        onPress={() => {
                                            setSelectedAsset(asset);
                                            onOpen();
                                        }}
                                    >
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Modal
                    isOpen={isOpen}
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
                                        <div>
                                            <p>
                                                Asset ID:{" "}
                                                {selectedAsset.ASSETSID}
                                            </p>
                                            <p>
                                                Employee Name:{" "}
                                                {selectedAsset.EMPLOYEENAME}
                                            </p>
                                            <p>
                                                Employee ID:{" "}
                                                {
                                                    selectedAsset.employee
                                                        ?.EMPLOYEEID
                                                }
                                            </p>
                                            <p>
                                                Description:{" "}
                                                {
                                                    selectedAsset
                                                        .asset_details[0]
                                                        ?.DESCRIPTION
                                                }
                                            </p>
                                            <p>
                                                Serial Number:{" "}
                                                {
                                                    selectedAsset
                                                        .asset_details[0]
                                                        ?.SERIALNO
                                                }
                                            </p>
                                            <p>
                                                Date Issued:{" "}
                                                {selectedAsset.asset_details[0]?.DATEISSUUED?.trim()}
                                            </p>

                                            <p>
                                                Status:{" "}
                                                {
                                                    selectedAsset
                                                        .asset_details[0]
                                                        ?.STATUS
                                                }
                                            </p>
                                            <p>
                                                Condition:{" "}
                                                {
                                                    selectedAsset
                                                        .asset_details[0]
                                                        ?.CONDITION
                                                }
                                            </p>
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
            </div>
        </Authenticated>
    );
}
