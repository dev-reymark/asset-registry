import { Head, usePage } from "@inertiajs/react";
import Authenticated from "../Layouts/Authenticated";
import { Button, Link } from "@heroui/react";

export default function AssetDetailView() {
    const { assetDetail, title, description, error } = usePage().props;
    // console.log(assetDetail, title, description, error); // Debugging

    if (error) {
        return (
            <div className="p-6 bg-white shadow-md rounded-lg">
                <Head title="Error" />
                <h1 className="text-2xl font-bold text-red-600">Error</h1>
                <p className="text-gray-600">{error}</p>
            </div>
        );
    }

    if (!assetDetail) {
        return (
            <div className="p-6 bg-white shadow-md rounded-lg">
                <Head title="Loading..." />
                <h1 className="text-2xl font-bold text-gray-600">Loading...</h1>
                <p>Please wait while we fetch asset details.</p>
            </div>
        );
    }

    return (
        // <Authenticated>
        <div className="p-6 bg-white shadow-md rounded-lg">
            <Head title={title} />

            <div className="my-6">
                <Button
                    color="primary"
                    variant="flat"
                    as={Link}
                    href="https://172.16.13.215"
                >
                    ← Back to Home
                </Button>
            </div>

            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-gray-600">{description}</p>

            <div className="mt-4 p-4 border rounded">
                {/* <h2 className="text-xl font-semibold">
                        Asset ID: {assetDetail?.asset?.ASSETSID || "N/A"}
                    </h2> */}
                <p>
                    <strong>Issued To:</strong>{" "}
                    {assetDetail?.asset?.EMPLOYEENAME || "N/A"}
                </p>

                <div className="border p-2 mt-2">
                    <p>
                        <strong>Description:</strong> {assetDetail.DESCRIPTION}
                    </p>
                    <p>
                        <strong>Model:</strong> {assetDetail.MODEL}
                    </p>
                    <p>
                        <strong>Serial No:</strong>{" "}
                        {assetDetail.SERIALNO || "N/A"}
                    </p>
                    <p>
                        <strong>Condition:</strong> {assetDetail.CONDITIONS}
                    </p>
                </div>
            </div>
        </div>
        // </Authenticated>
    );
}
