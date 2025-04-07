import { Head, Link, router, useForm } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";
import { Button, Form, Input, Select, SelectItem } from "@heroui/react";
import toast from "react-hot-toast";
import { route } from "ziggy-js";

export default function CreateAssetComponent({ assetTypes }) {
    const { data, setData, post, processing, errors } = useForm({
        ASSETCOMPONENTNAME: "",
        ASSETTYPEID: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await post(route("assetComponents.store"), {
                onFinish: () => {
                    toast.success("Asset component created successfully");
                    router.get(route("assetComponents.index"));
                },
            });
        } catch (error) {
            toast.error("Failed to create asset component");
            console.error("Error creating asset component:", error);
        }
    };

    const handleAssetTypeChange = (e) => {
        const selectedTypeId = Number(e.target.value); // Convert to number
        const selectedType = assetTypes.find(
            (type) => type.ASSETTYPEID === selectedTypeId
        );

        setData({
            ...data,
            ASSETTYPEID: selectedTypeId,
            ASSETCOMPONENTNAME: selectedType
                ? `${selectedType.ASSETTYPE}-`
                : "",
        });
    };

    return (
        <Authenticated>
            <Head title="Create Asset Component" />
            <div className="p-6">
                <div className="my-6">
                    <Button
                        color="primary"
                        variant="flat"
                        as={Link}
                        href={route("assetComponents.index")}
                    >
                        ← Back
                    </Button>
                </div>
                <h1 className="text-2xl font-bold mb-4">
                    Create Asset Component
                </h1>

                <Form
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col space-y-2"
                    validationErrors={errors}
                    onReset={() => setData({ ASSETCOMPONENTNAME: "" })}
                >
                    <Select
                        label="Asset Type"
                        isRequired
                        id="ASSETTYPEID"
                        name="ASSETTYPEID"
                        value={data.ASSETTYPEID}
                        onChange={handleAssetTypeChange}
                    >
                        <SelectItem value="">Select Asset Type</SelectItem>
                        {assetTypes.map((type) => (
                            <SelectItem
                                key={type.ASSETTYPEID}
                                value={type.ASSETTYPEID}
                            >
                                {type.ASSETTYPE}
                            </SelectItem>
                        ))}
                    </Select>

                    <Input
                        isRequired
                        label="Asset Component Name"
                        id="ASSETCOMPONENTNAME"
                        name="ASSETCOMPONENTNAME"
                        value={data.ASSETCOMPONENTNAME}
                        onChange={(e) =>
                            setData("ASSETCOMPONENTNAME", e.target.value)
                        }
                    />

                    <div className="mb-4 flex gap-2">
                        <Button
                            type="submit"
                            disabled={processing}
                            color="primary"
                        >
                            {processing
                                ? "Creating..."
                                : "Create Asset Component"}
                        </Button>
                        <Button
                            type="reset"
                            isDisabled={processing}
                            color="warning"
                            variant="flat"
                        >
                            Reset
                        </Button>
                    </div>
                </Form>
            </div>
        </Authenticated>
    );
}
