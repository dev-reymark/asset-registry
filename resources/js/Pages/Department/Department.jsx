import { Head, Link, usePage } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
} from "@heroui/react";

export default function Department() {
    const { departments, title, description } = usePage().props; // Get department data

    return (
        <Authenticated
            auth={usePage().props.auth}
            errors={usePage().props.errors}
        >
            <Head title="Departments" />
            <div className="p-6">
                <Table
                    isVirtualized
                    aria-label="Departments table"
                    isStriped
                    topContent={
                        <div className="flex items-center justify-between mb-4">
                            <div className="gap-y-2">
                                <h1 className="text-2xl font-bold">{title}</h1>
                                <p className="text-gray-600">{description}</p>
                            </div>

                            <Button
                                as={Link}
                                href={route("departments.create")}
                                color="primary"
                            >
                                Add Department
                            </Button>
                        </div>
                    }
                >
                    <TableHeader>
                        <TableColumn>DEPARTMENT ID</TableColumn>
                        <TableColumn>DEPARTMENT NAME</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={"No rows to display."}>
                        {departments.map((department) => (
                            <TableRow key={department.DEPARTMETID}>
                                <TableCell>{department.DEPARTMETID}</TableCell>
                                <TableCell>
                                    {department.DEPARTMENTNAME}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Authenticated>
    );
}
