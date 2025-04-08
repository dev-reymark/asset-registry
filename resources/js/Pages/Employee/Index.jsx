import { Head, Link, router, usePage } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";
import {
    addToast,
    Button,
    cn,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableCell,
    TableRow,
    Input,
} from "@heroui/react";
import toast from "react-hot-toast";
import { route } from "ziggy-js";
import { GoArchive } from "react-icons/go";
import { CiSearch } from "react-icons/ci";
import { useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";

export default function Employees() {
    const { employees, title, filters } = usePage().props; // Get employees data
    // console.log("Employees:", employees);
    const [search, setSearch] = useState(filters.search || "");
    const [sort, setSort] = useState(filters.sort || "");

    const handleSearch = (value) => {
        router.get(
            route("employees.index"),
            { search: value, sort },
            { preserveState: true, replace: true }
        );
    };

    const debouncedSearch = useDebounce(handleSearch, 300);

    const onSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        debouncedSearch(value);
    };

    const onClear = () => {
        setSearch("");
        router.get(route("employees.index"), { search: "", sort });
    };

    const toggleSort = () => {
        const newSort = sort === "name_asc" ? "name_desc" : "name_asc";
        setSort(newSort);
        router.get(
            route("employees.index"),
            { search, sort: newSort },
            { preserveState: true, replace: true }
        );
    };

    const handleDelete = (employeeId) => {
        if (
            confirm(
                "Are you sure you want to delete this employee? Deleting the employee will also delete the associated asset."
            )
        ) {
            // Send the DELETE request with _method
            axios
                .post(route("employees.destroy", { employee: employeeId }), {
                    _method: "DELETE",
                })
                .then((response) => {
                    toast.success("Asset deleted successfully");
                    router.reload();
                })
                .catch((error) => {
                    console.error(
                        "There was an error deleting the employee.",
                        error
                    );
                    toast.error("Failed to delete employee");
                });
        }
    };

    const confirmArchive = (id, name) => {
        const toastId = "archive-confirmation";

        toast.dismiss(toastId);

        toast(
            (t) => (
                <span className="flex flex-col gap-2">
                    <span>
                        Are you sure you want to archive <b>{name}</b>?
                    </span>
                    <div className="flex gap-2 justify-end">
                        <Button
                            onPress={() => {
                                toast.dismiss(t.id);
                                archiveEmployee(id);
                            }}
                            color="primary"
                        >
                            Yes
                        </Button>
                        <Button
                            color="danger"
                            variant="flat"
                            onPress={() => {
                                toast.dismiss(t.id);
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </span>
            ),
            {
                id: toastId,
                duration: 10000,
            }
        );
    };

    const archiveEmployee = async (id) => {
        try {
            await toast.promise(
                axios.post(route("employees.archive", { employee: id }), {
                    _method: "PATCH",
                }),
                {
                    loading: "Archiving employee...",
                    success: <b>Employee archived successfully!</b>,
                    error: <b>Failed to archive employee.</b>,
                }
            );
            router.reload();
        } catch (error) {
            console.error("Error archiving employee:", error);
        }
    };

    return (
        <Authenticated>
            <Head title="Employees" />
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold mb-4">{title}</h2>

                    <Button
                        as={Link}
                        href={route("employees.archived")}
                        color="warning"
                        variant="flat"
                        startContent={<GoArchive className="size-5" />}
                    >
                        Archived Employees
                    </Button>
                </div>

                <Table
                    aria-label="Employee Table"
                    className="mt-4"
                    isStriped
                    topContent={
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex gap-2">
                                <Button
                                    as={Link}
                                    href={route("employees.create")}
                                    color="primary"
                                >
                                    Add Employee
                                </Button>
                                <Button
                                    as={Link}
                                    href={route("assets.showForm")}
                                    color="success"
                                    variant="flat"
                                >
                                    Import Data
                                </Button>
                            </div>
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
                    }
                >
                    <TableHeader>
                        <TableColumn>EMPLOYEE ID</TableColumn>
                        <TableColumn
                            onClick={toggleSort}
                            className="cursor-pointer select-none"
                        >
                            EMPLOYEE NAME
                            {sort === "name_asc"
                                ? " 🔼"
                                : sort === "name_desc"
                                ? " 🔽"
                                : ""}
                        </TableColumn>
                        <TableColumn>DEPARTMENT</TableColumn>
                        <TableColumn>LOCATION</TableColumn>
                        <TableColumn>WORKSTATION</TableColumn>
                        <TableColumn>ACTION</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={"No rows to display."}>
                        {employees.map((employee) => (
                            <TableRow key={employee.EMPNO}>
                                <TableCell>
                                    {employee.EMPLOYEEID || "--"}
                                </TableCell>
                                <TableCell>{employee.EMPLOYEENAME}</TableCell>
                                <TableCell>
                                    {employee.department?.DEPARTMENTNAME}
                                </TableCell>
                                <TableCell>
                                    {employee.location?.LOCATIONNAME}
                                </TableCell>
                                <TableCell>
                                    {employee.workstation?.WORKSTATION}
                                </TableCell>
                                <TableCell className="flex gap-1">
                                    {/* <Button
                                        color="danger"
                                        onPress={() =>
                                            handleDelete(employee.EMPNO)
                                        }
                                    >
                                        Delete
                                    </Button> */}

                                    <Button
                                        className="w-full"
                                        size="sm"
                                        color="secondary"
                                        variant="flat"
                                        as={Link}
                                        href={`/assets/${employee.EMPNO}`}
                                    >
                                        View Assets
                                    </Button>
                                    <Button
                                        className="w-full"
                                        size="sm"
                                        color="success"
                                        as={Link}
                                        href={route(
                                            "employees.edit",
                                            employee.EMPNO
                                        )}
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        className="w-full"
                                        size="sm"
                                        color="warning"
                                        onPress={() =>
                                            confirmArchive(
                                                employee.EMPNO,
                                                employee.EMPLOYEENAME
                                            )
                                        }
                                    >
                                        Archive
                                    </Button>
                                    <Button
                                        as={Link}
                                        className="w-full"
                                        size="sm"
                                        color="primary"
                                        href={route(
                                            "employees.createUser",
                                            employee.EMPNO
                                        )}
                                    >
                                        Grant Access
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
