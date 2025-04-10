import { Head, Link, useForm } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";
import { Button, Form, Input, Select, SelectItem } from "@heroui/react";
import toast from "react-hot-toast";

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

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("products.store"));
        toast.success("Product added successfully");
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
                    className="w-full flex flex-col gap-2"
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
                        onChange={(e) => setData("ASSETTYPE", e.target.value)}
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

                    <Select
                        isRequired
                        label="Asset Component"
                        value={data.ASSETCOMPONENT}
                        onChange={(e) =>
                            setData("ASSETCOMPONENT", e.target.value)
                        }
                    >
                        <SelectItem value="" disabled>
                            Select Asset Component
                        </SelectItem>
                        {assetComponents.map((component) => (
                            <SelectItem
                                key={component.ASSETCOMPNETID}
                                value={component.ASSETCOMPNETID}
                            >
                                {component.ASSETCOMPONENTNAME}
                            </SelectItem>
                        ))}
                    </Select>

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
