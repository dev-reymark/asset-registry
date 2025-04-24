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

export default function AssetComponent() {
    const { assetComponents } = usePage().props;
    // console.log(assetComponents);

    return (
        <Authenticated>
            <Head title="Asset Components" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Asset Components</h1>

                <Table
                    isVirtualized
                    isStriped
                    aria-label="Asset Components table"
                    className="mt-4"
                    topContent={
                        <div className="flex justify-between items-center">
                            <Button
                                color="primary"
                                as={Link}
                                href={route("assetComponents.create")}
                            >
                                Add Asset Component
                            </Button>
                        </div>
                    }
                >
                    <TableHeader>
                        <TableColumn>ASSET COMPONENT ID</TableColumn>
                        <TableColumn>ASSET TYPE</TableColumn>
                        <TableColumn>ASSET COMPONENT</TableColumn>
                    </TableHeader>
                    <TableBody emptyContent={"No rows to display."}>
                        {assetComponents.map((assetComponent) => (
                            <TableRow key={assetComponent.ASSETCOMPNETID}>
                                <TableCell>
                                    {assetComponent.ASSETCOMPNETID}
                                </TableCell>
                                <TableCell>
                                    {assetComponent.asset_type?.ASSETTYPE}
                                </TableCell>
                                <TableCell>
                                    {assetComponent.ASSETCOMPONENTNAME}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Authenticated>
    );
}
