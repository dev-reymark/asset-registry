import { Link, router, useForm } from "@inertiajs/react";
import { useEffect } from "react";
import axios from "axios";
import Authenticated from "../../Layouts/Authenticated";
import toast from "react-hot-toast";
import { route } from "ziggy-js";

const formatDate = (dateString) => {
    // parse the date
    const date = new Date(dateString);
    if (!isNaN(date)) {
        return date.toISOString().split("T")[0]; // Returns date in yyyy-MM-dd format
    }
    return ""; // If invalid date, return empty string
};

export default function EditAsset({ assetDetail, products, employee }) {
    console.log(assetDetail, products, employee);
    const { data, setData, put, processing, errors } = useForm({
        PRODUCTID: assetDetail.PRODUCTID || "",
        DESCRIPTION: assetDetail.DESCRIPTION || "",
        MODEL: assetDetail.MODEL || "",
        SERIALNO: assetDetail.SERIALNO || "",
        ISSUEDTO: assetDetail.ISSUEDTO || "",
        DATEISSUUED: formatDate(assetDetail.DATEISSUUED) || "",
        IMAGEPATH: assetDetail.IMAGEPATH || "",
        SERIALTYPE: assetDetail.SERIALTYPE || "",
        STATUS: assetDetail.STATUS || "",
        ASSETFROM: assetDetail.ASSETFROM || "",
        CONDITIONS: assetDetail.CONDITIONS || "",
        WORKSTAION: assetDetail.WORKSTAION || "",
        TYPESIZE: assetDetail.TYPESIZE || "",
        NOPRINT: assetDetail.NOPRINT || "",
        COMPONENT: assetDetail.COMPONENT || "",
        WITHCOMPONENTS: assetDetail.WITHCOMPONENTS || "",
        SYSTEMASSETID: assetDetail.SYSTEMASSETID || "",
        SYSTEMCOMPONENTID: assetDetail.SYSTEMCOMPONENTID || "",
    });

    const handleProductChange = (e) => {
        const selectedProductId = e.target.value;
        const selectedProduct = products.find(
            (product) => String(product.PRODUCTID) === String(selectedProductId)
        );

        setData({
            ...data,
            PRODUCTID: selectedProductId,
            DESCRIPTION: selectedProduct ? selectedProduct.DESCRIPTION : "",
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios
            .post(
                route("assets.update", {
                    assetId: assetDetail.ASSETID,
                    assetNo: assetDetail.ASSETNO,
                }),
                {
                    ...data,
                    _method: "PUT", // Spoofing PUT method
                }
            )
            .then(() => {
                toast.success("Asset updated successfully");
                router.push(
                    route("assets.show", {
                        id: assetDetail.ASSETID,
                    })
                );
            })
            .catch((error) => {
                // Check if the error has a response object
                if (error.response) {
                    console.error("Update failed:", error.response.data);
                    toast.error("Failed to update asset");
                } else if (error.request) {
                    // Network error (request sent but no response received)
                    console.error("No response received:", error.request);
                    toast.error("Network error, please try again");
                } else {
                    // Something went wrong in setting up the request
                    console.error("Error setting up request:", error.message);
                    toast.error("An error occurred while updating the asset");
                }
            });
    };

    return (
        <Authenticated>
            <div className="mt-6">
                <Link
                    href={route("assets.show", {
                        id: assetDetail.ASSETID,
                    })}
                    className="text-blue-500 hover:underline"
                >
                    ← Back
                </Link>
            </div>
            <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Edit Asset</h2>
                <div className="border p-4 rounded-lg mb-6">
                    <p>
                        <strong>Asset ID:</strong>{" "}
                        {assetDetail?.ASSETID || "--"}
                    </p>
                    {/* <p>
                        <strong>Asset Number:</strong>{" "}
                        {assetDetail?.ASSETNO || "--"}
                    </p> */}
                    <p>
                        <strong>Asset Owner:</strong>{" "}
                        {employee?.EMPLOYEENAME || "--"}
                    </p>
                </div>
                <form onSubmit={handleSubmit}>
                    {/* System Asset ID */}
                    <label className="block text-sm font-medium text-gray-700">
                        System Asset ID
                    </label>
                    <input
                        type="text"
                        value={data.SYSTEMASSETID}
                        readOnly
                        onChange={(e) =>
                            setData("SYSTEMASSETID", e.target.value)
                        }
                        className="w-full border-gray-300 rounded-md p-2 mb-3"
                    />
                    {/* Product Dropdown */}
                    <label className="block text-sm font-medium text-gray-700">
                        Product
                    </label>
                    <select
                        value={data.PRODUCTID}
                        onChange={handleProductChange}
                        className="w-full border-gray-300 rounded-md p-2 mb-3"
                    >
                        <option value="">Select Product</option>
                        {products.map((product) => (
                            <option
                                key={product.PRODUCTID}
                                value={product.PRODUCTID}
                            >
                                {product.DESCRIPTION}
                            </option>
                        ))}
                    </select>

                    {/* Description */}
                    <label className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <input
                        type="text"
                        value={data.DESCRIPTION}
                        onChange={(e) => setData("DESCRIPTION", e.target.value)}
                        className="w-full border-gray-300 rounded-md p-2 mb-3"
                    />

                    {/* Model */}
                    <label className="block text-sm font-medium text-gray-700">
                        Model
                    </label>
                    <input
                        type="text"
                        value={data.MODEL}
                        onChange={(e) => setData("MODEL", e.target.value)}
                        className="w-full border-gray-300 rounded-md p-2 mb-3"
                    />

                    {/* Serial Number */}
                    <label className="block text-sm font-medium text-gray-700">
                        Serial Number
                    </label>
                    <input
                        type="text"
                        value={data.SERIALNO}
                        onChange={(e) => setData("SERIALNO", e.target.value)}
                        className="w-full border-gray-300 rounded-md p-2 mb-3"
                    />

                    {/* Issued To */}
                    {/* <label className="block text-sm font-medium text-gray-700">
                        Issued To
                    </label>
                    <input
                        type="text"
                        readOnly
                        value={data.ISSUEDTO}
                        onChange={(e) => setData("ISSUEDTO", e.target.value)}
                        className="w-full border-gray-300 rounded-md p-2 mb-3"
                    /> */}

                    {/* Date Issued */}
                    <label className="block text-sm font-medium text-gray-700">
                        Date Issued
                    </label>
                    <input
                        type="date"
                        value={data.DATEISSUUED}
                        onChange={(e) => setData("DATEISSUUED", e.target.value)}
                        className="w-full border-gray-300 rounded-md p-2 mb-3"
                    />

                    {/* Image Path */}
                    {/* <label className="block text-sm font-medium text-gray-700">
                        Image Path
                    </label>
                    <input
                        type="text"
                        value={data.IMAGEPATH}
                        onChange={(e) => setData("IMAGEPATH", e.target.value)}
                        className="w-full border-gray-300 rounded-md p-2 mb-3"
                    /> */}

                    {/* Serial Type */}
                    {/* <label className="block text-sm font-medium text-gray-700">
                        Serial Type
                    </label>
                    <input
                        type="text"
                        value={data.SERIALTYPE}
                        onChange={(e) => setData("SERIALTYPE", e.target.value)}
                        className="w-full border-gray-300 rounded-md p-2 mb-3"
                    /> */}

                    {/* Status */}
                    <label className="block text-sm font-medium text-gray-700">
                        Status
                    </label>
                    <input
                        type="text"
                        value={data.STATUS}
                        onChange={(e) => setData("STATUS", e.target.value)}
                        className="w-full border-gray-300 rounded-md p-2 mb-3"
                    />

                    {/* Asset From */}
                    {/* <label className="block text-sm font-medium text-gray-700">
                        Asset From
                    </label>
                    <input
                        type="text"
                        value={data.ASSETFROM}
                        onChange={(e) => setData("ASSETFROM", e.target.value)}
                        className="w-full border-gray-300 rounded-md p-2 mb-3"
                    /> */}

                    {/* Conditions */}
                    <label className="block text-sm font-medium text-gray-700">
                        Conditions
                    </label>
                    <input
                        type="text"
                        value={data.CONDITIONS}
                        onChange={(e) => setData("CONDITIONS", e.target.value)}
                        className="w-full border-gray-300 rounded-md p-2 mb-3"
                    />

                    {/* Workstation */}
                    {/* <label className="block text-sm font-medium text-gray-700">
                        Workstation
                    </label>
                    <input
                        type="text"
                        value={data.WORKSTAION}
                        onChange={(e) => setData("WORKSTATION", e.target.value)}
                        className="w-full border-gray-300 rounded-md p-2 mb-3"
                    /> */}

                    {/* Type Size */}
                    {/* <label className="block text-sm font-medium text-gray-700">
                        Type Size
                    </label>
                    <input
                        type="text"
                        value={data.TYPESIZE}
                        onChange={(e) => setData("TYPESIZE", e.target.value)}
                        className="w-full border-gray-300 rounded-md p-2 mb-3"
                    /> */}

                    {/* No Print */}
                    {/* <label className="block text-sm font-medium text-gray-700">
                        No Print
                    </label>
                    <input
                        type="text"
                        value={data.NOPRINT}
                        onChange={(e) => setData("NOPRINT", e.target.value)}
                        className="w-full border-gray-300 rounded-md p-2 mb-3"
                    /> */}

                    {/* Component */}
                    {/* <label className="block text-sm font-medium text-gray-700">
                        Component
                    </label>
                    <input
                        type="text"
                        value={data.COMPONENT}
                        onChange={(e) => setData("COMPONENT", e.target.value)}
                        className="w-full border-gray-300 rounded-md p-2 mb-3"
                    /> */}

                    {/* With Components */}
                    {/* <label className="block text-sm font-medium text-gray-700">
                        With Components
                    </label>
                    <input
                        type="text"
                        value={data.WITHCOMPONENTS}
                        onChange={(e) =>
                            setData("WITHCOMPONENTS", e.target.value)
                        }
                        className="w-full border-gray-300 rounded-md p-2 mb-3"
                    /> */}

                    {/* System Component ID */}
                    {/* <label className="block text-sm font-medium text-gray-700">
                        System Component ID
                    </label>
                    <input
                        type="text"
                        value={data.SYSTEMCOMPONENTID}
                        onChange={(e) =>
                            setData("SYSTEMCOMPONENTID", e.target.value)
                        }
                        className="w-full border-gray-300 rounded-md p-2 mb-3"
                    /> */}

                    {/* Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                        >
                            {processing ? "Updating..." : "Update"}
                        </button>
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </Authenticated>
    );
}
