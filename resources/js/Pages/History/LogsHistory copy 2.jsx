import React from "react";
import { Head, router, usePage } from "@inertiajs/react";
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
    Input,
    DateRangePicker,
    Tabs,
    Tab,
} from "@heroui/react";
import { route } from "ziggy-js";
import { CiSearch } from "react-icons/ci";
import { parseZonedDateTime } from "@internationalized/date";

export default function LogsHistory({ histories, filters, actions }) {
    const [search, setSearch] = React.useState(filters.search || "");
    const [actionFilter, setActionFilter] = React.useState(
        filters.action || ""
    );
    const [dateRange, setDateRange] = React.useState({
        start: filters.start_date
            ? parseZonedDateTime(filters.start_date + "T00:00[UTC]")
            : null,
        end: filters.end_date
            ? parseZonedDateTime(filters.end_date + "T23:59[UTC]")
            : null,
    });

    const rowsPerPage = histories.per_page || 10;
    const pages =
        histories.last_page || Math.ceil(histories.total / rowsPerPage);

    const fetchData = ({
        page = 1,
        search = null,
        action = null,
        start_date = null,
        end_date = null,
    } = {}) => {
        router.get(
            route("history.index"),
            {
                page,
                search: search ?? filters.search,
                action: action ?? filters.action,
                start_date: start_date ?? filters.start_date,
                end_date: end_date ?? filters.end_date,
            },
            { preserveState: true, replace: true }
        );
    };

    const handlePageChange = (newPage) => {
        fetchData({ page: newPage });
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        fetchData({ search: e.target.value, page: 1 });
    };

    const handleActionChange = (action) => {
        setActionFilter(action);
        fetchData({ action, page: 1 });
    };

    const handleDateChange = (range) => {
        setDateRange(range);
        if (range?.start && range?.end) {
            fetchData({
                page: 1,
                start_date: range.start.toString().slice(0, 10),
                end_date: range.end.toString().slice(0, 10),
            });
        }
    };

    const renderTable = () => {
        return (
            <Table
                isStriped
                aria-label="Audit log table with pagination"
                topContent={
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <Input
                            className="w-full md:max-w-sm"
                            placeholder="Search user..."
                            startContent={<CiSearch className="size-5" />}
                            value={search}
                            onChange={handleSearchChange}
                        />
                        <div className="w-full flex flex-col gap-4 md:flex-row md:items-center md:justify-end">
                            <DateRangePicker
                                hideTimeZone
                                label="Filter by Date"
                                visibleMonths={2}
                                value={dateRange}
                                onChange={handleDateChange}
                                className="w-full md:w-auto"
                            />
                        </div>
                    </div>
                }
                bottomContent={
                    <div className="flex w-full justify-center">
                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="secondary"
                            page={histories.current_page}
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
                    <TableColumn key="user.name">User</TableColumn>
                    <TableColumn key="action">Action</TableColumn>
                    <TableColumn key="changes">Description</TableColumn>
                    <TableColumn key="created_at">Date Created</TableColumn>
                </TableHeader>
                <TableBody
                    items={histories.data}
                    emptyContent="No history found"
                >
                    {(history) => (
                        <TableRow key={history.id}>
                            {(columnKey) => {
                                if (columnKey === "changes") {
                                    const changes = history.changes;
                                    const from = changes?.from || {};
                                    const to = changes?.to || {};
                                    const fieldLabels = {
                                        ASSETNUMBER: "Asset Number",
                                        EMPLOYEENAME: "Employee Name",
                                        SYSTEMASSETID: "System Asset ID",
                                        LOCATIONNAME: "Location Name",
                                        LOCATIONID: "Location ID",
                                        EMPLOYEEID: "Employee ID",
                                        STATUS: "Status",
                                    };

                                    const formattedChanges = [];

                                    if (history.action === "archive") {
                                        formattedChanges.push(
                                            <li
                                                key="archived_flag"
                                                className="text-red-600 font-semibold"
                                            >
                                                📦 Asset Archived
                                            </li>
                                        );

                                        const keyFields = ["SYSTEMASSETID"];
                                        keyFields.forEach((key) => {
                                            if (to[key]) {
                                                formattedChanges.push(
                                                    <li key={key}>
                                                        <strong>
                                                            {fieldLabels[key] ||
                                                                key}
                                                            :
                                                        </strong>{" "}
                                                        {to[key]}
                                                    </li>
                                                );
                                            }
                                        });

                                        if (from.STATUS !== to.STATUS) {
                                            formattedChanges.push(
                                                <li key="status">
                                                    Status from{" "}
                                                    <em>
                                                        {from.STATUS || "—"}
                                                    </em>{" "}
                                                    to{" "}
                                                    <strong>
                                                        {to.STATUS || "—"}
                                                    </strong>
                                                </li>
                                            );
                                        }

                                        if (from.CONDITIONS !== to.CONDITIONS) {
                                            formattedChanges.push(
                                                <li key="conditions">
                                                    Condition from{" "}
                                                    <em>
                                                        {from.CONDITIONS || "—"}
                                                    </em>{" "}
                                                    to{" "}
                                                    <strong>
                                                        {to.CONDITIONS || "—"}
                                                    </strong>
                                                </li>
                                            );
                                        }

                                        if (to.archival_reason) {
                                            formattedChanges.push(
                                                <li key="reason">
                                                    Reason:{" "}
                                                    <strong>
                                                        {to.archival_reason}
                                                    </strong>
                                                </li>
                                            );
                                        }
                                    } else if (history.action === "create") {
                                        formattedChanges.push(
                                            <li
                                                key="created_flag"
                                                className="text-green-600 font-semibold"
                                            >
                                                ✅ Asset Created
                                            </li>
                                        );

                                        const displayFields = [
                                            "SYSTEMASSETID",
                                            "ASSETNO",
                                            "EMPLOYEENAME",
                                            "STATUS",
                                            "CONDITIONS",
                                            "LOCATIONID",
                                            "PRODUCTID",
                                            "DESCRIPTION",
                                            "MODEL",
                                            "SERIALNO",
                                            "ISSUEDTO",
                                            "DATEISSUUED",
                                        ];

                                        displayFields.forEach((key) => {
                                            if (to[key]) {
                                                formattedChanges.push(
                                                    <li key={key}>
                                                        <strong>
                                                            {fieldLabels[key] ||
                                                                key}
                                                            :
                                                        </strong>{" "}
                                                        {to[key]}
                                                    </li>
                                                );
                                            }
                                        });

                                        if (to.COMPONENTS?.length) {
                                            formattedChanges.push(
                                                <li
                                                    key="components"
                                                    className="mt-2 font-medium"
                                                >
                                                    Components:
                                                    <ul className="list-disc ml-6 text-gray-700">
                                                        {to.COMPONENTS.map(
                                                            (comp, index) => (
                                                                <li key={index}>
                                                                    {
                                                                        comp.ASSETCOMPONENTNAME
                                                                    }{" "}
                                                                    {comp.DESCRIPTION
                                                                        ? `– ${comp.DESCRIPTION}`
                                                                        : ""}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </li>
                                            );
                                        }
                                    } else if (history.action === "update") {
                                        formattedChanges.push(
                                            <li
                                                key="updated_flag"
                                                className="text-blue-600 font-semibold"
                                            >
                                                ✏️ Asset Updated
                                            </li>
                                        );

                                        Object.entries(changes).forEach(
                                            ([key, val]) => {
                                                const fromValue = (
                                                    val.from ?? ""
                                                )
                                                    .toString()
                                                    .trim();
                                                const toValue = (val.to ?? "")
                                                    .toString()
                                                    .trim();
                                                const label =
                                                    fieldLabels[key] || key;

                                                if (fromValue !== toValue) {
                                                    formattedChanges.push(
                                                        <li key={key}>
                                                            <strong>
                                                                {label}:
                                                            </strong>{" "}
                                                            {fromValue || "—"}{" "}
                                                            &rarr;{" "}
                                                            {toValue || "—"}
                                                        </li>
                                                    );
                                                }
                                            }
                                        );
                                    } else if (
                                        history.action === "scanned_qr"
                                    ) {
                                        formattedChanges.push(
                                            <li
                                                key="scanned_flag"
                                                className="text-indigo-600 font-semibold"
                                            >
                                                📷 QR Code Scanned
                                            </li>
                                        );

                                        if (changes.scanned_by) {
                                            formattedChanges.push(
                                                <li key="scanned_by">
                                                    <strong>Scanned By:</strong>{" "}
                                                    {changes.scanned_by}
                                                </li>
                                            );
                                        }

                                        if (changes.scanned_at) {
                                            const formattedDate = new Date(
                                                changes.scanned_at
                                            ).toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "numeric",
                                                minute: "2-digit",
                                                hour12: true,
                                            });

                                            formattedChanges.push(
                                                <li key="scanned_at">
                                                    <strong>Scanned At:</strong>{" "}
                                                    {formattedDate}
                                                </li>
                                            );
                                        }

                                        if (changes.system_asset_id) {
                                            formattedChanges.push(
                                                <li key="system_asset_id">
                                                    <strong>
                                                        System Asset ID:
                                                    </strong>{" "}
                                                    {changes.system_asset_id}
                                                </li>
                                            );
                                        }
                                    } else {
                                        Object.keys(to).forEach((key) => {
                                            const fromValue = (from[key] ?? "")
                                                .toString()
                                                .trim();
                                            const toValue = (to[key] ?? "")
                                                .toString()
                                                .trim();
                                            const label =
                                                fieldLabels[key] || key;

                                            if (fromValue !== toValue) {
                                                formattedChanges.push(
                                                    <li key={key}>
                                                        <strong>
                                                            Transferred {label}
                                                        </strong>{" "}
                                                        from{" "}
                                                        <em>
                                                            {fromValue || "—"}
                                                        </em>{" "}
                                                        to{" "}
                                                        <strong>
                                                            {toValue || "—"}
                                                        </strong>
                                                    </li>
                                                );
                                            }
                                        });
                                    }

                                    return (
                                        <TableCell>
                                            <ul className="text-sm space-y-1 max-w-xs overflow-auto">
                                                {formattedChanges}
                                            </ul>
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
                                        {columnKey === "user.name"
                                            ? history.user?.name || "—"
                                            : history[columnKey]}
                                    </TableCell>
                                );
                            }}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
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

                <div className="flex w-full flex-col">
                    <Tabs
                        aria-label="Action tabs"
                        selectedKey={actionFilter}
                        onSelectionChange={handleActionChange}
                    >
                        <Tab key="" title="All">
                            {renderTable()}
                        </Tab>
                        {actions.map((action) => (
                            <Tab key={action} title={action}>
                                {renderTable()}
                            </Tab>
                        ))}
                    </Tabs>
                </div>
            </div>
        </Authenticated>
    );
}
