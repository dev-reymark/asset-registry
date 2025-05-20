import React from "react";
import { Head, router } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";
import {
    Button,
    Link,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
    getKeyValue,
} from "@heroui/react";
import { route } from "ziggy-js";

export default function LogsHistory({ histories }) {
    const [page, setPage] = React.useState(histories.current_page || 1);
    const rowsPerPage = histories.per_page || 10;
    const items = histories.data;
    const pages =
        histories.last_page || Math.ceil(histories.total / rowsPerPage);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        // Request new page from server via Inertia
        router.get(
            route("assetsextended.history"),
            { page: newPage },
            { preserveState: true, replace: true }
        );
    };

    return (
        <Authenticated>
            <Head title="Audit Log" />
            <div className="container mx-auto p-4">
                <div className="my-6">
                    <Button
                        color="primary"
                        variant="flat"
                        as={Link}
                        href={route("employees.index")}
                    >
                        ← Back
                    </Button>
                </div>
                <h1 className="text-2xl font-bold mb-4">Audit Log</h1>

                <Table
                    aria-label="Audit log table with pagination"
                    bottomContent={
                        <div className="flex w-full justify-center">
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="secondary"
                                page={page}
                                total={pages}
                                onChange={handlePageChange}
                            />
                        </div>
                    }
                    classNames={{
                        wrapper: "min-h-[222px]",
                    }}
                >
                    <TableHeader>
                        <TableColumn key="user_id">User</TableColumn>
                        <TableColumn key="action">Action</TableColumn>
                        <TableColumn key="model_type">Model</TableColumn>
                        <TableColumn key="model_id">Model ID</TableColumn>
                        <TableColumn key="changes">Changes</TableColumn>
                        <TableColumn key="created_at">Date</TableColumn>
                    </TableHeader>
                    <TableBody items={items}>
                        {(history) => (
                            <TableRow key={history.id}>
                                {(columnKey) => {
                                    if (columnKey === "changes") {
                                        return (
                                            <TableCell>
                                                <pre className="whitespace-pre-wrap max-w-xs overflow-auto">
                                                    {JSON.stringify(
                                                        history.changes,
                                                        null,
                                                        2
                                                    )}
                                                </pre>
                                            </TableCell>
                                        );
                                    }
                                    if (columnKey === "created_at") {
                                        return (
                                            <TableCell>
                                                {new Date(
                                                    history.created_at
                                                ).toLocaleString()}
                                            </TableCell>
                                        );
                                    }
                                    return (
                                        <TableCell>
                                            {getKeyValue(history, columnKey)}
                                        </TableCell>
                                    );
                                }}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </Authenticated>
    );
}
