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
import { CiSearch } from "react-icons/ci";
import { useDebounce } from "../../hooks/useDebounce";
import { useState } from "react";
import { route } from "ziggy-js";

export default function Products() {
    const { products, filters } = usePage().props; // get products
    // console.log(products); // Log products to console for

    const [search, setSearch] = useState(filters.search || "");
    const [sort, setSort] = useState(filters.sort || "");

    const handleSearch = (value) => {
        router.get(
            route("products.index"),
            { search: value, sort }, // Send search query
            { preserveState: true, replace: true }
        );
    };

    const debouncedSearch = useDebounce(handleSearch, 300);

    const onSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        debouncedSearch(value); // Apply debouncing for performance
    };

    const onClear = () => {
        setSearch("");
        router.get(route("products.index"), { search: "", sort });
    };

    return (
        <Authenticated>
            <Head title="Products" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Products</h1>
                <Table
                    isStriped
                    className="mt-4"
                    topContent={
                        <div className="flex justify-between items-center mb-4">
                            <Button
                                as={Link}
                                color="primary"
                                href={route("products.create")}
                            >
                                Add Product
                            </Button>
                            <Input
                                isClearable
                                className="w-full sm:max-w-[44%]"
                                placeholder="Search by description..."
                                startContent={<CiSearch className="size-5" />}
                                value={search}
                                onClear={onClear}
                                onChange={onSearchChange}
                            />
                        </div>
                    }
                >
                    <TableHeader>
                        <TableColumn>PRODUCT ID</TableColumn>
                        <TableColumn>DESCRIPTION</TableColumn>
                        <TableColumn>ASSET TYPE</TableColumn>
                        <TableColumn>ASSET COMPONENT</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={"No rows to display."}>
                        {products.map((product) => (
                            <TableRow key={product.PRODUCTID}>
                                <TableCell>{product.PRODUCTID}</TableCell>
                                <TableCell>{product.DESCRIPTION}</TableCell>
                                <TableCell>
                                    {product.asset_type?.ASSETTYPE || "--"}
                                </TableCell>
                                <TableCell>
                                    {product.asset_component
                                        ?.ASSETCOMPONENTNAME || "--"}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Authenticated>
    );
}
