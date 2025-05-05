import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";
import {
    Button,
    Form,
    Input,
    useDisclosure,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Select,
    SelectItem,
    Image,
    Autocomplete,
    AutocompleteItem,
} from "@heroui/react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { route } from "ziggy-js";
import {
    conditionOptions,
    statusOptions,
} from "../../Components/Assets/constants/statusConstants";
import { AiOutlineDelete } from "react-icons/ai";

export default function EditAsset() {
    const {
        assetDetail = {},
        assetcomponents = [],
        products = [],
        locations = [],
        employees = {},
        title,
        description,
    } = usePage().props;
    // console.log("Asset Detail: ", assetDetail);
    const [loading, setLoading] = useState(false);
    const {
        isOpen: isComponentModalOpen,
        onOpen: openComponentModal,
        onOpenChange: onComponentModalChange,
    } = useDisclosure();

    const {
        isOpen: isAddComponentModalOpen,
        onOpen: openAddComponentModal,
        onOpenChange: onAddComponentModalChange,
    } = useDisclosure();

    const [addedComponents, setAddedComponents] = useState([]);
    const [components, setComponents] = useState([
        ...(assetDetail.component_details || []),
    ]);
    const [selectedComponentId, setSelectedComponentId] = useState("");
    const [componentDescription, setComponentDescription] = useState("");

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
        SYSTEMCOMPONENTID: "",
        LOCATIONID: assetDetail.LOCATIONID || "",
    });

    const employeeName = employees?.EMPLOYEENAME?.trim() || "";

    const handleProductChange = (e) => {
        const productId = e.target.value;
        const product = products.find(
            (p) => String(p.PRODUCTID) === String(productId)
        );
        setData("PRODUCTID", productId);
        setData("DESCRIPTION", product?.DESCRIPTION?.trim() || "");

        // Fallback to assetDetail.asset.employee.EMPLOYEEID if EMPLOYEEID not available
        const employeeId =
            assetDetail?.asset?.employee?.EMPLOYEEID || data.EMPLOYEEID;

        const componentId = product?.asset_component?.ASSETCOMPNETID;
        const assetParts = [
            employeeId,
            productId,
            componentId ? componentId : null,
            assetDetail.ASSETNUMBER,
        ];

        const newSystemAssetId = assetParts.filter(Boolean).join("-");
        setData("SYSTEMASSETID", newSystemAssetId);
    };

    const handleAddComponent = () => {
        if (!selectedComponentId) {
            toast.error("Please select a component.");
            return;
        }

        const selectedAssetComponent = assetcomponents.find(
            (comp) =>
                String(comp.ASSETCOMPNETID) === String(selectedComponentId)
        );

        const allComponents = [...components];
        const sameComponentCount = allComponents.filter(
            (comp) =>
                String(comp.ASSETCOMPNETID) === String(selectedComponentId)
        ).length;

        const nextNumber = sameComponentCount + 1;

        const newComponent = {
            ASSETCOMPNETID: selectedComponentId,
            COMPONENTNUMBER: nextNumber,
            COMPONENTDESCRIPTION: componentDescription,
            SYSTEMCOMPONENTID: `${data.EMPLOYEEID}-${data.PRODUCTID}-${selectedComponentId}-${nextNumber}`,
            asset_component: selectedAssetComponent,
        };

        setComponents((prev) => [...prev, newComponent]);
        setComponentDescription("");
        setSelectedComponentId("");
        toast.success("Component added.");
    };

    const handleRemoveComponent = (indexToRemove) => {
        setComponents((prev) =>
            prev.filter((_, index) => index !== indexToRemove)
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            router.post(
                route("assetsextended.update", assetDetail.ASSETNO),
                {
                    ...data,
                    COMPONENT: components,
                    WITHCOMPONENTS: addedComponents.length > 0,
                    existing_images: JSON.stringify(existingImages),
                    new_images: imageFiles,
                    _method: "PUT",
                },
                {
                    forceFormData: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success("Asset updated successfully!");
                        router.visit(route("assets.index"));
                    },
                    onError: () => toast.error("Failed to update asset."),
                }
            );
        } catch {
            toast.error("Unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const [imagePreviews, setImagePreviews] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [existingImages, setExistingImages] = useState(() => {
        try {
            if (Array.isArray(assetDetail.IMAGEPATH))
                return assetDetail.IMAGEPATH;
            return assetDetail.IMAGEPATH
                ? JSON.parse(assetDetail.IMAGEPATH)
                : [];
        } catch {
            return [];
        }
    });

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        // Update image files in state for submission
        setImageFiles(files);

        // Generate image previews
        const previewUrls = files.map((file) => URL.createObjectURL(file));
        setImagePreviews(previewUrls);
    };
    const handleRemoveImage = (indexToRemove) => {
        const updatedFiles = imageFiles.filter(
            (_, index) => index !== indexToRemove
        );
        const updatedPreviews = imagePreviews.filter(
            (_, index) => index !== indexToRemove
        );
        const updatedExistingImages = existingImages.filter(
            (_, index) => index !== indexToRemove
        );

        if (indexToRemove < existingImages.length) {
            // Removing an existing image
            setExistingImages(updatedExistingImages);
        } else {
            // Removing a newly added image
            const adjustedIndex = indexToRemove - existingImages.length;
            setImageFiles(updatedFiles);
            setImagePreviews(updatedPreviews);
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
                <Form
                    onSubmit={handleSubmit}
                    className="w-full mx-auto space-y-4"
                >
                    <div className="flex w-full gap-4">
                        <Input
                            label="Employee Name"
                            value={employeeName}
                            isReadOnly
                        />
                        <Autocomplete
                            label="Select Product"
                            selectedKey={data.PRODUCTID ?? null}
                            onSelectionChange={(key) => {
                                setData("PRODUCTID", key);
                                handleProductChange({ target: { value: key } });
                            }}
                            onChange={handleProductChange}
                        >
                            {products.map((product) => (
                                <AutocompleteItem
                                    key={product.PRODUCTID}
                                    value={product.PRODUCTID}
                                >
                                    {product.DESCRIPTION}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
                    </div>
                    <div className="w-full flex gap-4">
                        <Input
                            className="w-1/2"
                            label="Description"
                            value={data.DESCRIPTION}
                            readOnly
                        />
                        <Button
                            color="success"
                            variant="flat"
                            onPress={openComponentModal}
                        >
                            ({components.length}) Components
                        </Button>
                    </div>
                    <div className="flex gap-2">
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
                        <Input
                            label="System Asset ID"
                            value={data.SYSTEMASSETID}
                            isReadOnly
                        />
                    </div>
                    <div className="w-full flex gap-4">
                        <Select
                            label="Status"
                            selectedKeys={
                                data.STATUS ? [data.STATUS.trim()] : []
                            }
                            onSelectionChange={
                                (keys) => setData("STATUS", Array.from(keys)[0]) // Convert set to value
                            }
                        >
                            {statusOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </Select>
                        <Select
                            label="Condition"
                            selectedKeys={
                                data.CONDITIONS ? [data.CONDITIONS.trim()] : []
                            }
                            onSelectionChange={
                                (keys) =>
                                    setData("CONDITIONS", Array.from(keys)[0]) // Convert set to value
                            }
                            value={data.CONDITIONS}
                            onChange={(e) =>
                                setData("CONDITIONS", e.target.value)
                            }
                        >
                            {conditionOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>
                    <div className="w-full flex gap-4">
                        <Input
                            type="date"
                            label="Date Issued"
                            value={
                                data.DATEISSUUED
                                    ? new Date(data.DATEISSUUED.trim())
                                          .toISOString()
                                          .split("T")[0]
                                    : ""
                            }
                            onChange={(e) =>
                                setData("DATEISSUUED", e.target.value)
                            }
                        />
                        <Select
                            label="Location"
                            selectedKeys={[data.LOCATIONID]}
                            onSelectionChange={(key) =>
                                setData("LOCATIONID", key.currentKey)
                            }
                            onChange={(e) =>
                                setData("LOCATIONID", e.target.value)
                            }
                        >
                            {locations.map((loc) => (
                                <SelectItem
                                    key={loc.LOCATIONID}
                                    value={loc.LOCATIONID}
                                >
                                    {loc.LOCATIONNAME}
                                </SelectItem>
                            ))}
                        </Select>
                    </div>

                    <div className="flex gap-4 flex-wrap mb-2">
                        {existingImages.map((imageUrl, index) => (
                            <div key={index} className="relative">
                                <Image
                                    src={`/storage/${imageUrl}`}
                                    alt={`Asset Image ${index + 1}`}
                                    className="w-32 h-32 object-cover rounded border"
                                />
                                <Button
                                    color="danger"
                                    variant="light"
                                    className="z-50 absolute top-0 right-0"
                                    onPress={() => handleRemoveImage(index)}
                                    isIconOnly
                                >
                                    <AiOutlineDelete className="size-4" />
                                </Button>
                            </div>
                        ))}

                        {imagePreviews.map((imageUrl, index) => (
                            <div key={index} className="relative">
                                <Image
                                    src={imageUrl}
                                    alt={`New Image Preview ${index + 1}`}
                                    className="w-32 h-32 object-cover rounded border"
                                />
                                <Button
                                    color="danger"
                                    variant="light"
                                    isIconOnly
                                    className="z-50 absolute top-0 right-0"
                                    onPress={() => handleRemoveImage(index)}
                                >
                                    <AiOutlineDelete className="size-4" />
                                </Button>
                            </div>
                        ))}
                        <Input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
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
                            onPress={reset}
                        >
                            Reset
                        </Button>
                    </div>
                </Form>
            </div>

            {/* View Components Modal */}
            <Modal
                size="3xl"
                isOpen={isComponentModalOpen}
                onOpenChange={onComponentModalChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Components</ModalHeader>
                            <ModalBody>
                                <Table
                                    aria-label="Component Table"
                                    topContent={
                                        <Button
                                            color="primary"
                                            onPress={openAddComponentModal}
                                        >
                                            Add New Component
                                        </Button>
                                    }
                                >
                                    <TableHeader>
                                        <TableColumn>
                                            COMPONENTNUMBER
                                        </TableColumn>
                                        <TableColumn>COMPONENTNAME</TableColumn>
                                        <TableColumn>DESCRIPTION</TableColumn>
                                        <TableColumn>
                                            SYSTEMCOMPONENTID
                                        </TableColumn>
                                        <TableColumn>Actions</TableColumn>
                                    </TableHeader>
                                    <TableBody emptyContent="No components yet.">
                                        {components.map((comp, i) => (
                                            <TableRow key={i}>
                                                <TableCell>
                                                    {comp.COMPONENTNUMBER}
                                                </TableCell>
                                                <TableCell>
                                                    {comp.asset_component
                                                        ?.ASSETCOMPONENTNAME ||
                                                        "—"}
                                                </TableCell>
                                                <TableCell>
                                                    {comp.COMPONENTDESCRIPTION}
                                                </TableCell>
                                                <TableCell>
                                                    {comp.SYSTEMCOMPONENTID}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        size="sm"
                                                        color="danger"
                                                        variant="light"
                                                        onPress={() =>
                                                            handleRemoveComponent(
                                                                i
                                                            )
                                                        }
                                                    >
                                                        Remove
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
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
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Add Component Modal */}
            <Modal
                size="xl"
                isOpen={isAddComponentModalOpen}
                onOpenChange={onAddComponentModalChange}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Add Component</ModalHeader>
                            <ModalBody>
                                <Select
                                    label="Select Component"
                                    selectedKeys={[selectedComponentId]}
                                    onSelectionChange={(key) =>
                                        setSelectedComponentId(key.currentKey)
                                    }
                                >
                                    {assetcomponents.map((comp) => (
                                        <SelectItem
                                            key={comp.ASSETCOMPNETID}
                                            value={comp.ASSETCOMPNETID}
                                        >
                                            {comp.ASSETCOMPONENTNAME}
                                        </SelectItem>
                                    ))}
                                </Select>
                                <Input
                                    label="Component Description"
                                    value={componentDescription}
                                    onChange={(e) =>
                                        setComponentDescription(e.target.value)
                                    }
                                />
                                <Button
                                    color="primary"
                                    onPress={handleAddComponent}
                                >
                                    Add
                                </Button>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                >
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </Authenticated>
    );
}
