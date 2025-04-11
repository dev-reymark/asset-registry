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
} from "@heroui/react";
import { useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { CiCirclePlus, CiFilter, CiSearch } from "react-icons/ci";
import { route } from "ziggy-js";

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
    // console.log(assets);
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
                        placeholder="Search..."
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

                <Table aria-label="Employee Assets table" isStriped>
                    <TableHeader>
                        <TableColumn>ASSET ID</TableColumn>
                        <TableColumn>EMPLOYEE ID</TableColumn>
                        <TableColumn
                            onClick={toggleSort}
                            style={{ cursor: "pointer" }}
                        >
                            EMPLOYEE NAME
                            {sort === "name_asc" && " 🔼"}
                            {sort === "name_desc" && " 🔽"}
                            {!["name_asc", "name_desc"].includes(sort) && " ⏺️"}
                        </TableColumn>
                        <TableColumn>Department</TableColumn>
                        <TableColumn>Asset Location</TableColumn>
                        <TableColumn>Workstation</TableColumn>
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
                        {/* <TableColumn>Workstation</TableColumn> */}
                        <TableColumn>With Components</TableColumn>
                        <TableColumn>Components</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={"No rows to display."}>
                        {assets.map((asset) => (
                            <TableRow key={asset.ASSETSID}>
                                <TableCell>{asset.ASSETSID}</TableCell>
                                <TableCell>
                                    {asset?.employee?.EMPLOYEEID || "--"}
                                </TableCell>
                                <TableCell>{asset.EMPLOYEENAME}</TableCell>
                                <TableCell>
                                    {
                                        asset?.employee?.department
                                            ?.DEPARTMENTNAME
                                    }
                                </TableCell>
                                <TableCell>
                                    {asset?.employee?.location?.LOCATIONNAME}
                                </TableCell>
                                <TableCell>
                                    {asset?.employee?.workstation?.WORKSTATION}
                                </TableCell>
                                <TableCell>
                                    {asset.asset_details[0]?.SYSTEMASSETID}
                                </TableCell>
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
                                    {asset.asset_details[0]?.SERIALTYPE}
                                </TableCell>
                                <TableCell>
                                    {asset.asset_details[0]?.ISSUEDTO}
                                </TableCell>
                                <TableCell>
                                    {asset.asset_details[0]?.DATEISSUED}
                                </TableCell>
                                <TableCell>
                                    {asset.asset_details[0]?.STATUS}
                                </TableCell>
                                <TableCell>
                                    {asset.asset_details[0]?.CONDITION}
                                </TableCell>
                                <TableCell>
                                    {asset.asset_details[0]?.ASSETFROM}
                                </TableCell>
                                <TableCell>
                                    {asset.asset_details[0]?.TYPE}
                                </TableCell>
                                {/* <TableCell>
                                    {asset.employee?.workstation?.WORKSTATION}
                                </TableCell> */}
                                <TableCell>
                                    {asset.asset_details[0]?.WITHCOMPONENTS}
                                </TableCell>
                                <TableCell>
                                    {asset.asset_details[0]?.COMPONENTS}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Authenticated>
    );
}

const FilterDropdown = ({
    statuses,
    status,
    setStatus,
    descriptions,
    description,
    setDescription,
    issuedTos,
    issuedTo,
    applyFilters,
    setIssuedTo,
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false); // Toggle for Status filter
    const [descriptionOpen, setDescriptionOpen] = useState(false); // Toggle for Description filter
    const [issuedToOpen, setIssuedToOpen] = useState(false); // Toggle for Issued To filter

    const handleDropdownToggle = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className="relative">
            {/* Button to trigger dropdown */}
            <Button
                color="primary"
                isIconOnly
                variant="flat"
                onPress={handleDropdownToggle}
            >
                <CiFilter className="size-5" />
            </Button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
                <div className="absolute top-12 bg-white border p-4 w-60 shadow-lg z-50">
                    <form>
                        {/* Status Filter */}
                        <fieldset>
                            <div className="flex justify-between">
                                <legend>Status</legend>
                                <Button
                                    variant="light"
                                    onPress={() => setStatusOpen(!statusOpen)} // Toggle Status filter visibility
                                    isIconOnly
                                >
                                    <CiCirclePlus className="size-5" />
                                </Button>
                            </div>
                            {statusOpen && // Show/Hide Status filter options
                                (statuses || []).map((item) => (
                                    <div key={item}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={status === item}
                                                onChange={() => {
                                                    setStatus(item);
                                                    applyFilters({
                                                        status: item,
                                                    });
                                                }}
                                            />
                                            {item}
                                        </label>
                                    </div>
                                ))}
                        </fieldset>

                        {/* Description Filter */}
                        <fieldset className="mt-4">
                            <div className="flex justify-between">
                                <legend>Description</legend>
                                <Button
                                    variant="light"
                                    onPress={() =>
                                        setDescriptionOpen(!descriptionOpen)
                                    } // Toggle Description filter visibility
                                    isIconOnly
                                >
                                    <CiCirclePlus className="size-5" />
                                </Button>
                            </div>
                            {descriptionOpen && // Show/Hide Description filter options
                                (descriptions || []).map((item) => (
                                    <div key={item}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={description === item}
                                                onChange={() => {
                                                    setDescription(item);
                                                    applyFilters({
                                                        description: item,
                                                    });
                                                }}
                                            />
                                            {item}
                                        </label>
                                    </div>
                                ))}
                        </fieldset>

                        {/* Issued To Filter */}
                        <fieldset className="mt-4">
                            <div className="flex justify-between">
                                <legend>Issued To</legend>
                                <Button
                                    variant="light"
                                    onPress={() =>
                                        setIssuedToOpen(!issuedToOpen)
                                    } // Toggle Issued To filter visibility
                                    isIconOnly
                                >
                                    <CiCirclePlus className="size-5" />
                                </Button>
                            </div>
                            {issuedToOpen && // Show/Hide Issued To filter options
                                (issuedTos || []).map((item) => (
                                    <div key={item}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={issuedTo === item}
                                                onChange={() => {
                                                    setIssuedTo(item);
                                                    applyFilters({
                                                        issued_to: item,
                                                    });
                                                }}
                                            />
                                            {item}
                                        </label>
                                    </div>
                                ))}
                        </fieldset>

                        {/* Clear Filters Button */}
                        <div className="mt-4 text-center">
                            <button
                                type="button"
                                className="text-red-500"
                                onClick={() => {
                                    setIssuedTo("");
                                    setDescription("");
                                    setStatus("");
                                    applyFilters({
                                        issued_to: "",
                                        description: "",
                                        status: "",
                                    });
                                }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};
