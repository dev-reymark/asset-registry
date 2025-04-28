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

const status = [
    { label: "Active", value: "Active" },
    { label: "Defective", value: "Defective" },
    { label: "For Aquisition", value: "For Aquisition" },
    { label: "For Repair", value: "For Repair" },
    { label: "For Replacement", value: "For Replacement" },
];

const condition = [
    { label: "Good", value: "Good" },
    { label: "Defective", value: "Defective" },
    { label: "For return to shell", value: "For return to shell" },
    { label: "Stolen", value: "Stolen" },
];

export default function AddAsset() {
    const {
        asset = [],
        products = [],
        assetno,
        location,
        title,
        description,
    } = usePage().props;
    // console.log("Asset Data:", asset);
    // console.log("Products Data:", products);

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [generatedSystemAssetId, setGeneratedSystemAssetId] = useState("");
    const [componentChips, setComponentChips] = useState([]);
    const [newComponent, setNewComponent] = useState("");
    const [loading, setLoading] = useState(false);

    const getNextAssetNumber = (employee) => {
        if (!employee || !employee.asset_details?.length) return 1;
        const assetNumbers = employee.asset_details
            .map((a) => parseInt(a.ASSETNUMBER))
            .filter((num) => !isNaN(num));
        return assetNumbers.length ? Math.max(...assetNumbers) + 1 : 1;
    };

    const { data, setData, post, errors, processing, reset } = useForm({
        EMPLOYEEID: "",
        EMPLOYEENAME: "",
        ASSETSID: "",
        ASSETNO: assetno,
        PRODUCTID: "",
        DESCRIPTION: "",
        MODEL: "",
        SERIALNO: "",
        ISSUEDTO: "",
        DATEISSUUED: "",
        IMAGEPATH: "",
        STATUS: "",
        CONDITIONS: "",
        WORKSTATION: "",
        TYPESIZE: "",
        NOPRINT: "",
        COMPONENT: "",
        WITHCOMPONENTS: false,
        SYSTEMASSETID: "",
        SYSTEMCOMPONENTID: "",
        LOCATIONID: "",
    });

    useEffect(() => {
        if (selectedEmployee && selectedProduct) {
            const nextNumber = getNextAssetNumber(selectedEmployee);

            const employeeId =
                selectedEmployee.employee?.EMPLOYEEID ||
                selectedEmployee.EMPLOYEEID;
            const productId = selectedProduct.PRODUCTID;

            const componentId = selectedProduct.asset_component?.ASSETCOMPNETID;
            const componentName =
                selectedProduct.asset_component?.ASSETCOMPONENTNAME;

            const newId = componentId
                ? `${employeeId}-${productId}-${componentId}-${nextNumber}`
                : `${employeeId}-${productId}-${nextNumber}`;

            setGeneratedSystemAssetId(newId);
            setData("SYSTEMASSETID", newId);
            setData("SYSTEMCOMPONENTID", componentId || "");
            setData("WITHCOMPONENTS", !!componentId);

            // Add base component to chip display
            if (componentName) {
                setComponentChips([componentName]);
            } else {
                setComponentChips([]);
            }
        }
    }, [selectedEmployee, selectedProduct]);

    const handleEmployeeSelect = (employeeId) => {
        const employee = asset.find(
            (emp) => String(emp.EMPLOYEEID) === String(employeeId)
        );
        setSelectedEmployee(employee);
        setData("EMPLOYEEID", employee?.EMPLOYEEID || "");
        setData("EMPLOYEENAME", employee?.EMPLOYEENAME?.trim() || "");
        setData("ASSETSID", employee?.ASSETSID || "");
        setData("ISSUEDTO", employee?.EMPLOYEENAME?.trim() || "");
        console.log("Selected Employee:", employee);
    };

    const handleProductChange = (e) => {
        const selectedProductId = e.target.value;
        const product = products.find(
            (p) => String(p.PRODUCTID) === String(selectedProductId)
        );

        setSelectedProduct(product);
        setData("PRODUCTID", selectedProductId);
        setData("DESCRIPTION", product?.DESCRIPTION?.trim() || "");

        const componentName = product?.asset_component?.ASSETCOMPONENTNAME;
        setComponentChips(componentName ? [componentName] : []);

        console.log("Selected Product:", product);
    };

    const handleStatusChange = (e) => setData("STATUS", e.target.value);
    const handleConditionChange = (e) => setData("CONDITIONS", e.target.value);

    // const submit = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);

    //     // Ensure COMPONENT is updated before submit
    //     setData("COMPONENT", JSON.stringify(componentChips));

    //     try {
    //         await post(route("assetsextended.store"), {
    //             forceFormData: true,
    //         });
    //         toast.success("Asset added successfully");
    //         router.visit(route("assets.index"));
    //         setSelectedEmployee(null);
    //         setSelectedProduct(null);
    //         setGeneratedSystemAssetId("");
    //     } catch (error) {
    //         toast.error("An error occurred while adding the asset.");
    //         console.error("Submit Error:", error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const trimmedChips = componentChips.map((c) => c.trim());

        const updatedFormData = {
            ...data,
            COMPONENT: JSON.stringify(trimmedChips),
        };

        try {
            await router.post(route("assetsextended.store"), updatedFormData, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    toast.success("Asset added successfully");
                    router.visit(route("assets.index"));
                    setSelectedEmployee(null);
                    setSelectedProduct(null);
                    setGeneratedSystemAssetId("");
                },
                onError: (err) => {
                    console.error("Form Errors:", err);
                    toast.error("An error occurred while adding the asset.");
                },
            });
        } catch (error) {
            toast.error("An unexpected error occurred.");
            console.error("Submit Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Authenticated>
            <Head title={title} />

            <div>
                <Button
                    color="primary"
                    variant="flat"
                    as={Link}
                    href={route("assets.index")}
                >
                    ← Back
                </Button>
            </div>

            <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
                <p className="text-gray-600 mb-4">{description}</p>

                <Form
                    onSubmit={submit}
                    className="w-full flex flex-col gap-y-4"
                    validationErrors={errors}
                    encType="multipart/form-data"
                >
                    <p className="text-sm text-gray-600">
                        Fields marked with{" "}
                        <span className="text-red-500">*</span> are required.
                    </p>

                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Autocomplete
                            isRequired
                            label="Select Employee"
                            selectedKey={data.EMPLOYEEID}
                            onSelectionChange={handleEmployeeSelect}
                        >
                            {asset.map((emp) => (
                                <AutocompleteItem
                                    key={emp.EMPLOYEEID}
                                    value={emp.EMPLOYEEID}
                                    textValue={emp.EMPLOYEENAME}
                                >
                                    {(emp.EMPLOYEENAME || "").trim()}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
                        <Select
                            isRequired
                            label="Select Product"
                            value={data.PRODUCTID}
                            onChange={handleProductChange}
                        >
                            <SelectItem value="">Select a product</SelectItem>

                            {products.map((product) => (
                                <SelectItem
                                    key={product.PRODUCTID}
                                    value={product.PRODUCTID}
                                >
                                    {(product.DESCRIPTION || "").trim()}
                                </SelectItem>
                            ))}
                        </Select>

                        <Input
                            label="Description"
                            isReadOnly
                            value={data.DESCRIPTION}
                        />

                        <div className="flex gap-2 flex-wrap mt-2">
                            {componentChips.map((comp, index) => (
                                <Chip
                                    key={index}
                                    color="success"
                                    variant="flat"
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

                    <Input
                        label="New Components"
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
                        description="Want to add a new component? Press Enter to add."
                    />

                    <div className="w-full flex gap-4">
                        <Input
                            label="System Asset ID"
                            value={generatedSystemAssetId}
                            isReadOnly
                            description="Auto-generated"
                        />
                        <Input
                            label="Model"
                            value={data.MODEL}
                            onChange={(e) => setData("MODEL", e.target.value)}
                            isRequired
                        />

                        <Input
                            label="Serial Number"
                            value={data.SERIALNO}
                            onChange={(e) =>
                                setData("SERIALNO", e.target.value)
                            }
                            isRequired
                        />
                    </div>

                    <div className="w-full flex gap-4">
                        <Select
                            isRequired
                            label="Status"
                            value={data.STATUS}
                            onChange={handleStatusChange}
                        >
                            {status.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </Select>
                        <Select
                            isRequired
                            label="Condition"
                            value={data.CONDITIONS}
                            onChange={handleConditionChange}
                        >
                            {condition.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </Select>
                        <Select
                            isRequired
                            label="Location"
                            value={data.LOCATIONID}
                            onChange={(e) =>
                                setData("LOCATIONID", e.target.value)
                            }
                        >
                            {location.map((loc) => (
                                <SelectItem
                                    key={loc.LOCATIONID}
                                    value={loc.LOCATIONID}
                                >
                                    {loc.LOCATIONNAME}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>

                    <div className="w-full flex gap-4">
                        <Input
                            label="Date Issued"
                            type="date"
                            value={data.DATEISSUUED}
                            onChange={(e) =>
                                setData("DATEISSUUED", e.target.value)
                            }
                            isRequired
                        />
                        <Input
                            label="Upload Images"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) =>
                                setData("IMAGEPATH", Array.from(e.target.files))
                            }
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            type="submit"
                            color="primary"
                            isLoading={loading}
                            isDisabled={processing}
                        >
                            {loading ? "Adding..." : "Add Asset"}
                        </Button>
                        <Button
                            type="button"
                            color="warning"
                            variant="flat"
                            onPress={() => {
                                reset();
                                setSelectedEmployee(null);
                                setSelectedProduct(null);
                                setGeneratedSystemAssetId("");
                            }}
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
