import { Head, Link, useForm, usePage } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";
import { Button, Form, Input, Select, SelectItem } from "@heroui/react";
import toast from "react-hot-toast";

export default function AddAsset() {
    const { asset, products, assetno, workstations } = usePage().props;
    // console.log(workstations);
    console.log(asset,products);
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
        SYSTEMASSETID: `${asset?.employee?.EMPLOYEEID}-${products?.PRODUCTID}-${asset?.asset_details?.ASSETNUMBER}`,
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

    const submit = async (e) => {
        e.preventDefault();
        try {
            await post(route("assets.store", { id: asset?.ASSETSID }));
            toast.success("Asset added successfully");
        } catch (error) {
            toast.error("An error occurred while adding the asset.");
            console.error("An error occurred while adding the asset:", error);
        }
    };

    return (
        <Authenticated>
            <Head title="Add New Asset" />
            <div className="my-4">
                <Button
                    color="primary"
                    variant="light"
                    as={Link}
                    href={route("assets.show", { id: asset?.ASSETSID })}
                >
                    ← Back to {asset?.EMPLOYEENAME}
                </Button>
            </div>
            <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    Add New Asset
                </h2>

                <Form
                    onSubmit={submit}
                    className="w-full flex flex-col gap-y-4"
                    validationErrors={errors}
                    onReset={() => {
                        setData({
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
                            SYSTEMASSETID: `${asset?.employee?.EMPLOYEEID}-${asset?.ASSETSID}-${assetno}`,
                            SYSTEMCOMPONENTID: "",
                        });
                    }}
                >
                    <div className="w-full border p-4 rounded-lg mb-4">
                        <p>
                            <strong>Asset ID:</strong> {asset?.ASSETSID || "--"}
                        </p>
                        <p>
                            <strong>Employee Name:</strong>{" "}
                            {asset?.EMPLOYEENAME || "--"}
                        </p>
                    </div>

                    <p>Please fill required fields.</p>

                    <div className="w-full flex gap-4">
                        {/* Product Selection Dropdown */}
                        <Select
                            isRequired
                            label="Product"
                            value={data.PRODUCTID}
                            onChange={handleProductChange}
                        >
                            <SelectItem value="">Select a product</SelectItem>
                            {products.map((product) => (
                                <SelectItem
                                    key={product.PRODUCTID}
                                    value={product.PRODUCTID}
                                >
                                    {product.DESCRIPTION}
                                </SelectItem>
                            ))}
                        </Select>

                        {/* Description */}
                        <Input
                            label="Description"
                            isRequired
                            isReadOnly
                            value={data.DESCRIPTION}
                            onChange={(e) =>
                                setData("DESCRIPTION", e.target.value)
                            }
                        />
                    </div>

                    <div className="w-full flex gap-4">
                        {/* System Asset ID */}
                        <Input
                            isRequired
                            isReadOnly
                            label="System Asset ID"
                            value={data.SYSTEMASSETID}
                            onChange={(e) =>
                                setData("SYSTEMASSETID", e.target.value)
                            }
                            description="This will be generated automatically."
                        />

                        {/* Date Issued */}
                        <Input
                            label="Date Issued"
                            type="date"
                            isRequired
                            value={data.DATEISSUUED}
                            onChange={(e) =>
                                setData("DATEISSUUED", e.target.value)
                            }
                        />
                    </div>

                    <div className="w-full flex gap-4">
                        {/* Model */}
                        <Input
                            label="Model"
                            isRequired
                            value={data.MODEL}
                            onChange={(e) => setData("MODEL", e.target.value)}
                        />

                        {/* Serial No */}
                        <Input
                            description="Serial Number must be unique."
                            label="Serial Number"
                            isRequired
                            value={data.SERIALNO}
                            onChange={(e) =>
                                setData("SERIALNO", e.target.value)
                            }
                        />
                    </div>

                    <div className="w-full flex gap-4">
                        {/* Status */}
                        <Input
                            isRequired
                            label="Status"
                            value={data.STATUS}
                            onChange={(e) => setData("STATUS", e.target.value)}
                        />

                        {/* CONDITIONS */}
                        <Input
                            label="Conditions"
                            isRequired
                            value={data.CONDITIONS}
                            onChange={(e) =>
                                setData("CONDITIONS", e.target.value)
                            }
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            type="submit"
                            color="primary"
                            isDisabled={processing}
                        >
                            {processing ? "Adding..." : "Add Asset"}
                        </Button>
                        <Button
                            type="reset"
                            color="warning"
                            variant="flat"
                            isDisabled={processing}
                        >
                            Reset
                        </Button>
                    </div>
                </Form>
            </div>
        </Authenticated>
    );
}
