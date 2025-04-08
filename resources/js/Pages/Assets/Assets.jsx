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
} from "@heroui/react";
import { useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { CiSearch } from "react-icons/ci";
import { route } from "ziggy-js";

export default function Assets() {
    const { assets, filters = {} } = usePage().props; // Get assets
    const [search, setSearch] = useState(filters.search || "");
    const [sort, setSort] = useState(filters.sort || "");

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

    return (
        <Authenticated>
            <Head title="Employee Assets" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Employee Assets</h1>

                {/* Search Input */}
                <div className="flex justify-end mb-4">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Search by name..."
                        startContent={<CiSearch className="size-5" />}
                        value={search}
                        onClear={onClear}
                        onChange={onSearchChange}
                    />
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
                            {sort === "name_asc"
                                ? " 🔼"
                                : sort === "name_desc"
                                ? " 🔽"
                                : ""}
                        </TableColumn>
                        <TableColumn>ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={"No rows to display."}>
                        {assets.map((asset) => (
                            <TableRow key={asset.ASSETSID}>
                                <TableCell>{asset.ASSETSID}</TableCell>
                                <TableCell>
                                    {asset?.employee?.EMPLOYEEID || "--"}
                                </TableCell>
                                <TableCell>{asset.EMPLOYEENAME}</TableCell>
                                <TableCell className="flex gap-2">
                                    <Button
                                        as={Link}
                                        size="sm"
                                        color="primary"
                                        href={`/assets/${asset.ASSETSID}`}
                                    >
                                        View Assets
                                    </Button>
                                    <Button
                                        as={Link}
                                        color="success"
                                        size="sm"
                                        href={route("employee.asset.report", {
                                            id: asset.EMPLOYEEID,
                                        })}
                                        target="_blank"
                                        onPress={(e) => {
                                            e.preventDefault(); // Prevent default link behavior
                                            const link = e.target.closest("a");
                                            link.setAttribute(
                                                "download",
                                                "asset_report.pdf"
                                            ); // Force download attribute
                                            link.click(); // Trigger download
                                        }}
                                    >
                                        Print
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Authenticated>
    );
}
