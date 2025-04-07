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

export default function Assets() {
    const { assets } = usePage().props; // Get assets data
    // console.log(assets);

    return (
        <Authenticated>
            <Head title="Employee Assets" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Employee Assets</h1>

                <Table aria-label="Employee Assets table" isStriped>
                    <TableHeader>
                        <TableColumn>ASSET ID</TableColumn>
                        <TableColumn>EMPLOYEE ID</TableColumn>
                        <TableColumn>EMPLOYEE NAME</TableColumn>
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
                                        View
                                    </Button>
                                    <Button
                                        as={Link}
                                        color="success"
                                        size="sm"
                                        href={route("employee.asset.report", {
                                            id: asset.EMPLOYEEID,
                                        })}
                                        target="_blank"
                                        download
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
