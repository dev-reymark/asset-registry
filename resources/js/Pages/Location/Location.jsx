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

export default function Locations() {
    const { locations } = usePage().props; // Get location data

    return (
        <Authenticated>
            <Head title="Asset Locations" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Asset Locations</h1>

                {/* Location Table */}
                <Table
                isStriped
                    aria-label="Locations table"
                    className="mt-4"
                    topContent={
                        <div className="flex justify-start items-center mb-4">
                            <Button
                                as={Link}
                                color="primary"
                                href={route("locations.create")}
                            >
                                Add Location
                            </Button>
                        </div>
                    }
                >
                    <TableHeader>
                        <TableColumn>LOCATION ID</TableColumn>
                        <TableColumn>LOCATION NAME</TableColumn>
                        <TableColumn>DEPARTMENT</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={"No rows to display."}>
                        {locations.map((location) => (
                            <TableRow key={location.LOCATIONID}>
                                <TableCell>{location.LOCATIONID}</TableCell>
                                <TableCell>{location.LOCATIONNAME}</TableCell>
                                <TableCell>
                                    {location.department
                                        ? location.department.DEPARTMENTNAME
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
