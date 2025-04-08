import { Link, router } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";
import {
    Button,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
    Input,
} from "@heroui/react";
import { useMemo, useState } from "react";
import { route } from "ziggy-js";
import toast from "react-hot-toast";
import { CiSearch } from "react-icons/ci";

export default function ArchivedEmployees({ employees }) {
    console.log("Archived Employees:", employees);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;

    // Filter and sort employees first
    const filteredEmployees = useMemo(() => {
        return employees
            .filter((emp) =>
                emp.EMPLOYEENAME.toLowerCase().includes(search.toLowerCase())
            )
            .sort((a, b) => a.EMPLOYEENAME.localeCompare(b.EMPLOYEENAME));
    }, [employees, search]);

    const pages = Math.ceil(filteredEmployees.length / rowsPerPage);

    const paginatedEmployees = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredEmployees.slice(start, end);
    }, [filteredEmployees, page]);

    const restoreEmployee = async (id) => {
        try {
            await toast.promise(
                axios.post(route("employees.restore", { employee: id }), {
                    _method: "PATCH",
                }),
                {
                    loading: "Restoring employee...",
                    success: <b>Employee restored successfully!</b>,
                    error: <b>Failed to restore employee.</b>,
                }
            );
            router.reload();
        } catch (error) {
            console.error("Error restoring employee:", error);
        }
    };

    const onClearSearch = () => {
        setSearch("");
        setPage(1);
    };

    return (
        <Authenticated>
            <div className="container mt-4">
                <div className="my-6">
                    <Button
                        color="primary"
                        variant="flat"
                        as={Link}
                        href={route("employees.index")}
                    >
                        ← Back to Employees
                    </Button>
                </div>

                <Table
                    isStriped
                    aria-label="Archived Employees"
                    topContent={
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold">
                                Archived Employees
                            </h2>
                            <Input
                                isClearable
                                value={search}
                                onClear={onClearSearch}
                                className="w-full sm:max-w-[44%]"
                                placeholder="Search by name..."
                                startContent={<CiSearch className="size-5" />}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1); // Reset page on search change
                                }}
                            />
                        </div>
                    }
                    bottomContent={
                        <div className="flex w-full justify-center">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="secondary"
                                page={page}
                                total={pages}
                                onChange={(page) => setPage(page)}
                            />
                        </div>
                    }
                    classNames={{
                        wrapper: "min-h-[222px]",
                    }}
                >
                    <TableHeader>
                        <TableColumn>EMPLOYEE ID</TableColumn>
                        <TableColumn>EMPLOYEE NAME</TableColumn>
                        <TableColumn>DEPARTMENT</TableColumn>
                        <TableColumn>LOCATION</TableColumn>
                        <TableColumn>WORKSTATION</TableColumn>
                        <TableColumn>ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={"No archived employees found."}>
                        {paginatedEmployees.map((employee) => (
                            <TableRow key={employee.EMPNO}>
                                <TableCell>{employee.EMPLOYEEID}</TableCell>
                                <TableCell>{employee.EMPLOYEENAME}</TableCell>
                                <TableCell>
                                    {employee.department?.DEPARTMENTNAME ||
                                        "--"}
                                </TableCell>
                                <TableCell>
                                    {employee.location?.LOCATIONNAME || "--"}
                                </TableCell>
                                <TableCell>
                                    {employee.workstation?.WORKSTATION || "--"}
                                </TableCell>
                                <TableCell className="flex gap-2">
                                    <Button
                                        color="primary"
                                        size="sm"
                                        as={Link}
                                        href={`/assets/${employee.EMPNO}`}
                                    >
                                        View Assets
                                    </Button>
                                    <Button
                                        color="success"
                                        size="sm"
                                        onPress={() =>
                                            restoreEmployee(employee.EMPNO)
                                        }
                                    >
                                        Restore
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
