import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";
import {
    Autocomplete,
    AutocompleteItem,
    Button,
    Chip,
    Form,
    Input,
    Select,
    SelectItem,
} from "@heroui/react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { route } from "ziggy-js";
import { BiChevronDown } from "react-icons/bi";

const statusOptions = [
    { label: "Active", value: "Active" },
    { label: "Defective", value: "Defective" },
    { label: "For Aquisition", value: "For Aquisition" },
    { label: "For Repair", value: "For Repair" },
    { label: "For Replacement", value: "For Replacement" },
];

const conditionOptions = [
    { label: "Good", value: "Good" },
    { label: "Defective", value: "Defective" },
    { label: "For return to shell", value: "For return to shell" },
    { label: "Stolen", value: "Stolen" },
];

export default function EditAsset() {
    const {
        assetDetail = {},
        products = [],
        locations = [],
        employees = [],
        title,
        description,
    } = usePage().props;
    console.log("Asset Detail:", assetDetail);  

    const [componentChips, setComponentChips] = useState([]);
    const [newComponent, setNewComponent] = useState("");
    const [loading, setLoading] = useState(false);

    const { data, setData, patch, errors, processing, reset } = useForm({
        EMPLOYEEID: assetDetail.EMPLOYEEID || "",
        ASSETID: assetDetail.ASSETID || "",
        ASSETNO: assetDetail.ASSETNO || "",
        PRODUCTID: assetDetail.PRODUCTID || "",
        DESCRIPTION: assetDetail.DESCRIPTION || "",
        MODEL: assetDetail.MODEL || "",
        SERIALNO: assetDetail.SERIALNO || "",
        ISSUEDTO: assetDetail.ISSUEDTO || "",
        DATEISSUUED: assetDetail.DATEISSUUED || "",
        IMAGEPATH: "",
        STATUS: assetDetail.STATUS || "",
        CONDITIONS: assetDetail.CONDITIONS || "",
        WORKSTATION: assetDetail.WORKSTATION || "",
        TYPESIZE: assetDetail.TYPESIZE || "",
        NOPRINT: assetDetail.NOPRINT || "",
        COMPONENT: assetDetail.COMPONENT || "",
        WITHCOMPONENTS: assetDetail.WITHCOMPONENTS || false,
        SYSTEMASSETID: assetDetail.SYSTEMASSETID || "",
        SYSTEMCOMPONENTID: assetDetail.SYSTEMCOMPONENTID || "",
        LOCATIONID: assetDetail.LOCATIONID || "",
    });

    useEffect(() => {
        if (assetDetail.COMPONENT) {
            try {
                const parsed = JSON.parse(assetDetail.COMPONENT);
                setComponentChips(Array.isArray(parsed) ? parsed : []);
            } catch {
                setComponentChips([]);
            }
        }
    }, [assetDetail]);

    const employeeName = employees?.EMPLOYEENAME?.trim();

    const handleProductChange = (e) => {
        const productId = e.target.value;
        const product = products.find(
            (p) => String(p.PRODUCTID) === String(productId)
        );

        // Update form data
        setData("PRODUCTID", productId);
        setData("DESCRIPTION", product?.DESCRIPTION?.trim() || "");

        // Generate new SYSTEMASSETID
        const componentId = product?.asset_component?.ASSETCOMPNETID;
        const assetParts = [
            data.EMPLOYEEID,
            productId,
            componentId ? componentId : null,
            assetDetail.ASSETNUMBER,
        ];

        // Filter out null/undefined parts and join them with "-"
        const newSystemAssetId = assetParts.filter(Boolean).join("-");
        setData("SYSTEMASSETID", newSystemAssetId);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const trimmedChips = componentChips.map((c) => c.trim());
        const updatedData = {
            ...data,
            COMPONENT: JSON.stringify(trimmedChips),
        };

        try {
            router.post(
                route("assetsextended.update", assetDetail.ASSETNO),
                {
                    ...updatedData,
                    _method: "PUT", // 👈 Method Spoofing here
                },
                {
                    forceFormData: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success("Asset updated successfully!");
                        router.visit(route("assets.index"));
                    },
                    onError: (err) => {
                        console.error(err);
                        toast.error("Failed to update asset.");
                    },
                }
            );
        } catch (err) {
            toast.error("Unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Authenticated>
            <Head title={title} />

            <div className="p-6">
                <Button
                    as={Link}
                    href={route("assets.index")}
                    variant="flat"
                    color="primary"
                >
                    ← Back
                </Button>

                <h2 className="text-xl font-bold mt-4">{title}</h2>
                <p className="text-gray-600 mb-4">{description}</p>

                <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex gap-4">
                        <Input
                            label="Employee Name"
                            value={employeeName}
                            isReadOnly
                        />
                        <select
                            className="w-full p-3 bg-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={data.PRODUCTID}
                            onChange={handleProductChange}
                        >
                            <option value="" disabled className="text-gray-500">
                                Select a product
                            </option>
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

                    <div className="flex gap-4">
                        <Input
                            label="Description"
                            value={data.DESCRIPTION}
                            readOnly
                        />
                        <Input
                            label="Model"
                            value={data.MODEL}
                            onChange={(e) => setData("MODEL", e.target.value)}
                        />
                        <Input
                            label="Serial No."
                            value={data.SERIALNO}
                            onChange={(e) =>
                                setData("SERIALNO", e.target.value)
                            }
                        />
                    </div>

                    <div className="flex gap-4">
                        <Input
                            label="Add New Component"
                            value={newComponent}
                            onChange={(e) => setNewComponent(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && newComponent.trim()) {
                                    e.preventDefault();
                                    if (
                                        !componentChips.includes(
                                            newComponent.trim()
                                        )
                                    ) {
                                        setComponentChips([
                                            ...componentChips,
                                            newComponent.trim(),
                                        ]);
                                        setNewComponent("");
                                    }
                                }
                            }}
                        />
                        <div className="flex gap-2 flex-wrap">
                            {componentChips.map((comp, index) => (
                                <Chip
                                    color="success"
                                    variant="flat"
                                    key={index}
                                    onClose={() =>
                                        setComponentChips(
                                            componentChips.filter(
                                                (c) => c !== comp
                                            )
                                        )
                                    }
                                >
                                    {comp}
                                </Chip>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <Input
                            description="Auto-generated"
                            label="System Asset ID"
                            isReadOnly
                            value={data.SYSTEMASSETID}
                            onChange={(e) =>
                                setData("SYSTEMASSETID", e.target.value)
                            }
                        />

                        <select
                            className="w-full p-3 bg-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            label="Status"
                            value={data.STATUS}
                            onChange={(e) => setData("STATUS", e.target.value)}
                        >
                            {statusOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>

                        <select
                            className="w-full p-3 bg-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            label="Condition"
                            value={data.CONDITIONS}
                            onChange={(e) =>
                                setData("CONDITIONS", e.target.value)
                            }
                        >
                            {conditionOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>

                        <select
                            className="w-full p-3 bg-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            label="Location"
                            value={data.LOCATIONID}
                            onChange={(e) =>
                                setData("LOCATIONID", e.target.value)
                            }
                        >
                            {locations.map((loc) => (
                                <option
                                    key={loc.LOCATIONID}
                                    value={loc.LOCATIONID}
                                >
                                    {loc.LOCATIONNAME}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-4">
                        <Input
                            type="date"
                            label="Date Issued"
                            value={data.DATEISSUUED}
                            onChange={(e) =>
                                setData("DATEISSUUED", e.target.value)
                            }
                        />

                        <Input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) =>
                                setData("IMAGEPATH", Array.from(e.target.files))
                            }
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            color="primary"
                            type="submit"
                            isLoading={loading}
                            isDisabled={processing}
                        >
                            {loading ? "Saving..." : "Update Asset"}
                        </Button>
                        <Button
                            type="button"
                            variant="flat"
                            color="warning"
                            onPress={() => {
                                reset();
                                setComponentChips([]);
                            }}
                        >
                            Reset
                        </Button>
                    </div>
                </Form>
            </div>
        </Authenticated>
    );
}
