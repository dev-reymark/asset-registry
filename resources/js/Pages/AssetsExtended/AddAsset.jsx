import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";
import {
    Autocomplete,
    AutocompleteItem,
    Button,
    Form,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    useDisclosure,
} from "@heroui/react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { route } from "ziggy-js";
import {
    condition,
    status,
} from "../../Components/Assets/constants/statusConstants";

export default function AddAsset() {
    const {
        asset = [],
        assetcomponents = [],
        products = [],
        assetno,
        location,
        title,
        description,
    } = usePage().props;

    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [generatedSystemAssetId, setGeneratedSystemAssetId] = useState("");
    const [loading, setLoading] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedComponentId, setSelectedComponentId] = useState("");
    const [componentDescription, setComponentDescription] = useState("");
    const [addedComponents, setAddedComponents] = useState([]);

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
        COMPONENT: null,
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
    };

    const handleProductChange = (e) => {
        const selectedProductId = e.target.value;
        const product = products.find(
            (p) => String(p.PRODUCTID) === String(selectedProductId)
        );

        setSelectedProduct(product);
        setData("PRODUCTID", selectedProductId);
        setData("DESCRIPTION", product?.DESCRIPTION?.trim() || "");
    };
    const handleStatusChange = (e) => setData("STATUS", e.target.value);
    const handleConditionChange = (e) => setData("CONDITIONS", e.target.value);

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const updatedFormData = {
            ...data,
        };

        try {
            router.post(route("assetsextended.store"), updatedFormData, {
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

    const handleAddComponent = () => {
        const component = assetcomponents.find(
            (comp) =>
                Number(comp.ASSETCOMPNETID) === Number(selectedComponentId)
        );

        if (component) {
            const employeeId = selectedEmployee?.EMPLOYEEID;
            const productId = selectedProduct?.PRODUCTID;

            if (!employeeId || !productId) {
                toast.error("Employee or Product not selected properly.");
                return;
            }

            // Generate the key for employee-product-component combination
            const key = `${employeeId}-${productId}-${component.ASSETCOMPNETID}`;

            // Find the last component number used for this combination
            const lastComponent = addedComponents
                .filter((comp) => comp.SYSTEMCOMPONENTID.startsWith(key))
                .reduce((max, comp) => {
                    const componentNumber = parseInt(
                        comp.SYSTEMCOMPONENTID.split("-").pop(),
                        10
                    );
                    return componentNumber > max ? componentNumber : max;
                }, 0);

            // Increment the component number by 1
            const nextComponentNumber = lastComponent + 1;

            // Create the SYSTEMCOMPONENTID
            const systemComponentId = `${employeeId}-${productId}-${component.ASSETCOMPNETID}-${nextComponentNumber}`;

            const newComponent = {
                ...component,
                DESCRIPTION: componentDescription,
                SYSTEMCOMPONENTID: systemComponentId,
            };

            // Add the new component to the added components
            setAddedComponents((prev) => [...prev, newComponent]);
            setComponentDescription("");
            toast.success(`Component ${systemComponentId} added successfully.`);
        } else {
            toast.error("Component not found.");
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
                            <SelectItem value="" isReadOnly>
                                Select a product
                            </SelectItem>

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
                    </div>

                    <Button
                        isDisabled={!data.PRODUCTID || !data.EMPLOYEEID}
                        color="primary"
                        onPress={onOpen}
                    >
                        Add Component
                    </Button>

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
                <Modal
                    hideCloseButton
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    size="2xl"
                >
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                    Add Component
                                </ModalHeader>
                                <ModalBody>
                                    <Select
                                        isRequired
                                        label="Select Component"
                                        value={selectedComponentId}
                                        onChange={(e) =>
                                            setSelectedComponentId(
                                                e.target.value
                                            )
                                        }
                                    >
                                        {assetcomponents.map((component) => (
                                            <SelectItem
                                                key={component.ASSETCOMPNETID}
                                                value={component.ASSETCOMPNETID}
                                            >
                                                {component.ASSETCOMPONENTNAME}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    <Input
                                        label="Component Description"
                                        value={componentDescription}
                                        onChange={(e) =>
                                            setComponentDescription(
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Button
                                        color="primary"
                                        isDisabled={!selectedComponentId}
                                        onPress={handleAddComponent}
                                    >
                                        Add
                                    </Button>

                                    <Table aria-label="Components Table">
                                        <TableHeader>
                                            {/* <TableColumn>
                                                ASSETCOMPNETID
                                            </TableColumn> */}
                                            <TableColumn>
                                                Component Name
                                            </TableColumn>
                                            <TableColumn>
                                                Description
                                            </TableColumn>
                                            <TableColumn>
                                                System Component ID
                                            </TableColumn>
                                        </TableHeader>
                                        <TableBody emptyContent="No rows to display.">
                                            {addedComponents.map(
                                                (component) => (
                                                    <TableRow
                                                        key={
                                                            component.ASSETCOMPNETID
                                                        }
                                                    >
                                                        {/* <TableCell>
                                                            {
                                                                component.ASSETCOMPNETID
                                                            }
                                                        </TableCell> */}
                                                        <TableCell>
                                                            {
                                                                component.ASSETCOMPONENTNAME
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                component.DESCRIPTION
                                                            }
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                component.SYSTEMCOMPONENTID
                                                            }
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={onClose}
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        color="primary"
                                        onPress={() => {
                                            setData(
                                                "COMPONENT",
                                                addedComponents
                                            );
                                            setData(
                                                "WITHCOMPONENTS",
                                                addedComponents.length > 0
                                            );
                                            onClose();
                                            toast.success(
                                                "Components added successfully."
                                            );
                                        }}
                                    >
                                        Continue
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
        </Authenticated>
    );
}
