import { Head, Link, useForm } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";
import { Button, Form, Input, Select, SelectItem, Chip } from "@heroui/react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

export default function AddProduct({
    assetTypes,
    assetComponents,
    title,
    description,
}) {
    const { data, setData, post, errors, processing } = useForm({
        DESCRIPTION: "",
        ASSETTYPE: "",
        ASSETCOMPONENT: "",
    });

    const [filteredComponents, setFilteredComponents] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("products.store"), {
            onSuccess: () => toast.success("Product added successfully"),
        });
    };

    useEffect(() => {
        if (data.ASSETTYPE) {
            setFilteredComponents(
                assetComponents.filter(
                    (comp) => comp.ASSETTYPEID.toString() === data.ASSETTYPE
                )
            );
        } else {
            setFilteredComponents([]);
        }
    }, [data.ASSETTYPE, assetComponents]);

    const handleComponentSelect = (componentId) => {
        if (data.ASSETCOMPONENT === componentId) {
            // Clicking the selected chip again or closing it removes it
            setData("ASSETCOMPONENT", "");
        } else {
            setData("ASSETCOMPONENT", componentId);
        }
    };

    return (
        <Authenticated>
            <Head title="Add Product" />
            <div className="p-6">
                <div className="my-6">
                    <Button
                        color="primary"
                        variant="flat"
                        as={Link}
                        href={route("products.index")}
                    >
                        ← Back to Products
                    </Button>
                </div>

                <h2 className="text-xl font-bold">{title}</h2>
                <p className="mb-4">{description}</p>

                <Form
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col gap-4"
                    validationErrors={errors}
                    onReset={() => {
                        setData({
                            DESCRIPTION: "",
                            ASSETTYPE: "",
                            ASSETCOMPONENT: "",
                        });
                    }}
                >
                    <Input
                        label="Product Description"
                        isRequired
                        value={data.DESCRIPTION}
                        onChange={(e) => setData("DESCRIPTION", e.target.value)}
                    />

                    <Select
                        isRequired
                        label="Asset Type"
                        value={data.ASSETTYPE}
                        onChange={(e) => {
                            const selectedTypeId = e.target.value;
                            setData("ASSETTYPE", selectedTypeId);
                            setData("ASSETCOMPONENT", "");
                        }}
                    >
                        <SelectItem value="" disabled>
                            Select Asset Type
                        </SelectItem>
                        {assetTypes.map((type) => (
                            <SelectItem
                                key={type.ASSETTYPEID}
                                value={type.ASSETTYPEID}
                            >
                                {type.ASSETTYPE}
                            </SelectItem>
                        ))}
                    </Select>

                    {data.ASSETTYPE && (
                        <div>
                            <label className="block font-medium mb-2">
                                Asset Component{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {filteredComponents.map((component) => {
                                    const isSelected =
                                        data.ASSETCOMPONENT ===
                                        component.ASSETCOMPNETID.toString();

                                    return (
                                        <Chip
                                            key={component.ASSETCOMPNETID}
                                            variant="flat"
                                            color="success"
                                            onClose={() =>
                                                handleComponentSelect(
                                                    component.ASSETCOMPNETID.toString()
                                                )
                                            }
                                            className="cursor-pointer"
                                        >
                                            {component.ASSETCOMPONENTNAME}
                                        </Chip>
                                    );
                                })}
                            </div>
                            {errors.ASSETCOMPONENT && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.ASSETCOMPONENT}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="flex gap-2 mt-4">
                        <Button
                            type="submit"
                            color="primary"
                            isDisabled={processing}
                        >
                            {processing ? "Saving..." : "Add Product"}
                        </Button>
                        <Button type="reset" color="warning" variant="flat">
                            Reset
                        </Button>
                    </div>
                </Form>
            </div>
        </Authenticated>
    );
}
