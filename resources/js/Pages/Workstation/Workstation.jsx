import { Head, Link, usePage } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/react";

export default function Workstation() {
    const { workstations } = usePage().props; // Get workstation data

    return (
        <Authenticated
            auth={usePage().props.auth}
            errors={usePage().props.errors}
        >
            <Head title="Workstations" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Workstations</h1>

                <Table
                    aria-label="Workstations table"
                    className="mt-4"
                    isStriped
                    topContent={
                        <div className="flex justify-between items-center">
                            <Button
                                as={Link}
                                href={route("workstations.create")}
                                color="primary"
                            >
                                Add Workstation
                            </Button>
                        </div>
                    }
                >
                    <TableHeader>
                        <TableColumn>WORKSTATION ID</TableColumn>
                        <TableColumn>WORKSTATION NAME</TableColumn>
                        <TableColumn>DEPARTMENT</TableColumn>
                        <TableColumn>LOCATION</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={"No rows to display."}>
                        {workstations.map((workstation) => (
                            <TableRow key={workstation.WORKSTATIONID}>
                                <TableCell>
                                    {workstation.WORKSTATIONID}
                                </TableCell>
                                <TableCell>{workstation.WORKSTATION}</TableCell>
                                <TableCell>
                                    {workstation.department
                                        ? workstation.department.DEPARTMENTNAME
                                        : "--"}
                                </TableCell>
                                <TableCell>
                                    {workstation.location
                                        ? workstation.location.LOCATIONNAME
                                        : "--"}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Authenticated>
    );
}
