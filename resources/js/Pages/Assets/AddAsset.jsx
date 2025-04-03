import { Head, useForm, usePage } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";

export default function AddAsset() {
    const { asset, products, assetno } = usePage().props;
    console.log(asset, products, assetno);
    const { data, setData, post, processing, errors } = useForm({
        ASSETSID: asset.ASSETSID,
        ASSETNO: assetno,
        PRODUCTID: "",
        DESCRIPTION: "",
        MODEL: "",
        SERIALNO: "",
        ISSUEDTO: asset?.EMPLOYEENAME,
        DATEISSUUED: "",
        IMAGEPATH: "",
        SERIALTYPE: "",
        STATUS: "",
        ASSETFROM: "",
        CONDITIONS: "",
        WORKSTATION: "",
        TYPESIZE: "",
        NOPRINT: "",
        COMPONENT: "",
        WITHCOMPONENTS: "",
        SYSTEMASSETID: `${asset?.EMPLOYEEID}-${asset?.ASSETSID}`,
        SYSTEMCOMPONENTID: "",
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

    const submit = (e) => {
        e.preventDefault();
        post(route("assets.store", { id: asset?.ASSETSID }));
    };

    return (
        <Authenticated>
            <Head title="Add New Asset" />
            <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    Add New Asset
                </h2>

                <form onSubmit={submit} className="space-y-4">
                    <div className="border p-4 rounded-lg mb-6">
                        <p>
                            <strong>Asset ID:</strong> {asset?.ASSETSID || "--"}
                        </p>
                        <p>
                            <strong>Employee Name:</strong>{" "}
                            {asset?.EMPLOYEENAME || "--"}
                        </p>
                    </div>

                    {/* Asset No */}
                    {/* <div>
                        <label className="block text-gray-600 text-sm font-medium">
                            Asset No
                        </label>
                        <input
                            type="text"
                            value={assetno}
                            onChange={(e) => setData("ASSETNO", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                            readOnly
                        />
                    </div> */}

                    {/* Product Selection Dropdown */}
                    <div>
                        <label className="block text-gray-600 text-sm font-medium">
                            Product
                        </label>
                        <select
                            value={data.PRODUCTID}
                            onChange={handleProductChange}
                            required
                            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                        >
                            <option value="">Select a product</option>
                            {products.map((product) => (
                                <option
                                    key={product.PRODUCTID}
                                    value={product.PRODUCTID}
                                >
                                    {product.DESCRIPTION}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-gray-600 text-sm font-medium">
                            Description
                        </label>
                        <input
                            type="text"
                            value={data.DESCRIPTION}
                            onChange={(e) =>
                                setData("DESCRIPTION", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                            readOnly
                        />
                    </div>

                    {/* Model */}
                    <div>
                        <label className="block text-gray-600 text-sm font-medium">
                            Model
                        </label>
                        <input
                            type="text"
                            value={data.MODEL}
                            onChange={(e) => setData("MODEL", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                        />
                    </div>

                    {/* Serial No */}
                    <div>
                        <label className="block text-gray-600 text-sm font-medium">
                            Serial No
                        </label>
                        <input
                            type="text"
                            value={data.SERIALNO}
                            onChange={(e) =>
                                setData("SERIALNO", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                        />
                    </div>

                    {/* Issued To */}
                    <div>
                        <label className="block text-gray-600 text-sm font-medium">
                            Issued To
                        </label>
                        <input
                            readOnly
                            type="text"
                            value={data.ISSUEDTO}
                            onChange={(e) =>
                                setData("ISSUEDTO", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                        />
                    </div>

                    {/* Date Issued */}
                    <div>
                        <label className="block text-gray-600 text-sm font-medium">
                            Date Issued
                        </label>
                        <input
                            type="date"
                            value={data.DATEISSUUED}
                            onChange={(e) =>
                                setData("DATEISSUUED", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                        />
                    </div>

                    {/* Image Path */}
                    <div>
                        <label className="block text-gray-600 text-sm font-medium">
                            Image Path
                        </label>
                        <input
                            type="text"
                            value={data.IMAGEPATH}
                            onChange={(e) =>
                                setData("IMAGEPATH", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                        />
                    </div>

                    {/* Serial Type */}
                    <div>
                        <label className="block text-gray-600 text-sm font-medium">
                            Serial Type
                        </label>
                        <input
                            type="number"
                            value={data.SERIALTYPE}
                            onChange={(e) =>
                                setData("SERIALTYPE", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-gray-600 text-sm font-medium">
                            Status
                        </label>
                        <input
                            type="text"
                            value={data.STATUS}
                            onChange={(e) => setData("STATUS", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                        />
                    </div>

                    {/* Asset From */}
                    <div>
                        <label className="block text-gray-600 text-sm font-medium">
                            Asset From
                        </label>
                        <input
                            type="text"
                            value={data.ASSETFROM}
                            onChange={(e) =>
                                setData("ASSETFROM", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                        />
                    </div>

                    {/* CONDITIONS */}
                    <div>
                        <label className="block text-gray-600 text-sm font-medium">
                            CONDITIONS
                        </label>
                        <input
                            type="text"
                            value={data.CONDITIONS}
                            onChange={(e) =>
                                setData("CONDITIONS", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                        />
                    </div>

                    {/* Workstation */}
                    <div>
                        <label className="block text-gray-600 text-sm font-medium">
                            Workstation
                        </label>
                        <input
                            type="number"
                            value={data.WORKSTATION}
                            onChange={(e) =>
                                setData("WORKSTATION", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                        />
                    </div>

                    {/* Type Size */}
                    <div>
                        <label className="block text-gray-600 text-sm font-medium">
                            Type Size
                        </label>
                        <input
                            type="text"
                            value={data.TYPESIZE}
                            onChange={(e) =>
                                setData("TYPESIZE", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                        />
                    </div>

                    {/* No Print */}
                    <div>
                        <label className="block text-gray-600 text-sm font-medium">
                            No Print
                        </label>
                        <input
                            type="number"
                            value={data.NOPRINT}
                            onChange={(e) => setData("NOPRINT", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                        />
                    </div>

                    {/* Component */}
                    <div>
                        <label className="block text-gray-600 text-sm font-medium">
                            Component
                        </label>
                        <input
                            type="text"
                            value={data.COMPONENT}
                            onChange={(e) =>
                                setData("COMPONENT", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                        />
                    </div>

                    {/* With Components */}
                    <div>
                        <label className="block text-gray-600 text-sm font-medium">
                            With Components
                        </label>
                        <input
                            type="number"
                            value={data.WITHCOMPONENTS}
                            onChange={(e) =>
                                setData("WITHCOMPONENTS", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                        />
                    </div>

                    {/* System Asset ID */}
                    <div>
                        <label className="block text-gray-600 text-sm font-medium">
                            System Asset ID
                        </label>
                        <input
                            readOnly
                            type="text"
                            value={data.SYSTEMASSETID}
                            onChange={(e) =>
                                setData("SYSTEMASSETID", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                        />
                    </div>

                    {/* System Component ID */}
                    <div>
                        <label className="block text-gray-600 text-sm font-medium">
                            System Component ID
                        </label>
                        <input
                            type="text"
                            value={data.SYSTEMCOMPONENTID}
                            onChange={(e) =>
                                setData("SYSTEMCOMPONENTID", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 mt-1"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                        disabled={processing}
                    >
                        {processing ? "Adding..." : "Add Asset"}
                    </button>
                </form>
            </div>
        </Authenticated>
    );
}
