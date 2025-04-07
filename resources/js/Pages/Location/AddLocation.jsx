import { Head, Link, useForm } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";
import { Button, Form, Input, Select, SelectItem } from "@heroui/react";
import toast from "react-hot-toast";

export default function AddLocation({ departments, title, description }) {
    const { data, setData, post, errors, processing } = useForm({
        LOCATIONNAME: "",
        DEPARTMETID: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await post(route("locations.store"));
            toast.success("Location added successfully");
        } catch (error) {
            toast.error("Failed to add , " + error.message);
            console.error(
                "An error occurred while adding the location:",
                error
            );
        }
    };

    return (
        <Authenticated>
            <Head title="Add Location" />
            <div className="p-6">
                <div className="my-6">
                    <Button
                        color="primary"
                        variant="flat"
                        as={Link}
                        href={route("locations.index")}
                    >
                        ← Back to Locations
                    </Button>
                </div>
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <p className="mb-4">{description}</p>

                <Form
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col gap-2"
                    onReset={() => {
                        setData({
                            LOCATIONNAME: "",
                            DEPARTMETID: "",
                        });
                    }}
                    validationErrors={errors}
                >
                    <Input
                        label="Location Name"
                        isRequired
                        value={data.LOCATIONNAME}
                        onChange={(e) =>
                            setData("LOCATIONNAME", e.target.value)
                        }
                    />

                    <Select
                        isRequired
                        label="Department"
                        value={data.DEPARTMETID}
                        onChange={(e) => setData("DEPARTMETID", e.target.value)}
                    >
                        <SelectItem value="" disabled>
                            Select Department
                        </SelectItem>
                        {departments.map((dept) => (
                            <SelectItem
                                key={dept.DEPARTMETID}
                                value={dept.DEPARTMETID}
                            >
                                {dept.DEPARTMENTNAME}
                            </SelectItem>
                        ))}
                    </Select>

                    <div className="flex gap-2 mt-4">
                        <Button
                            color="primary"
                            type="submit"
                            isDisabled={processing}
                        >
                            {processing ? "Saving..." : "Add Location"}
                        </Button>
                        <Button
                            color="warning"
                            variant="flat"
                            type="reset"
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
