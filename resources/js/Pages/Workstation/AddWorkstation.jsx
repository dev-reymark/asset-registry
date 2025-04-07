import { Head, Link, useForm } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";
import { Button, Form, Input, Select, SelectItem } from "@heroui/react";
import toast from "react-hot-toast";

export default function AddWorkstation({
    departments,
    locations,
    title,
    description,
}) {
    const { data, setData, post, errors, processing } = useForm({
        WORKSTATION: "",
        DEPARTMENTID: "",
        LOCATIONID: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await post(route("workstations.store"));
            toast.success("Workstation added successfully!");
        } catch (error) {
            toast.error("Failed to add workstation.");
            console.error(
                "An error occurred while saving the workstation:",
                error
            );
        }
    };

    return (
        <Authenticated>
            <Head title="Add Workstation" />
            <div className="p-6">
                <div className="my-6">
                    <Button
                        color="primary"
                        variant="flat"
                        as={Link}
                        href={route("workstations.index")}
                    >
                        ← Back to Workstations
                    </Button>
                </div>
                <h2 className="text-xl font-bold">{title}</h2>
                <p className="mb-4">{description}</p>

                <Form
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col space-y-2"
                    validationErrors={errors}
                    onReset={() => {
                        setData({
                            WORKSTATION: "",
                            DEPARTMENTID: "",
                            LOCATIONID: "",
                        });
                    }}
                >
                    <Input
                        isRequired
                        label="Workstation Name"
                        value={data.WORKSTATION}
                        onChange={(e) => setData("WORKSTATION", e.target.value)}
                    />

                    <Select
                        isRequired
                        label="Department"
                        value={data.DEPARTMENTID}
                        onChange={(e) =>
                            setData("DEPARTMENTID", e.target.value)
                        }
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

                    <Select
                        isRequired
                        label="Location"
                        value={data.LOCATIONID}
                        onChange={(e) => setData("LOCATIONID", e.target.value)}
                    >
                        <SelectItem value="" disabled>
                            Select Location
                        </SelectItem>
                        {locations.map((loc) => (
                            <SelectItem
                                key={loc.LOCATIONID}
                                value={loc.LOCATIONID}
                            >
                                {loc.LOCATIONNAME}
                            </SelectItem>
                        ))}
                    </Select>

                    <div className="mt-4 flex justify-between gap-2">
                        <Button
                            color="primary"
                            type="submit"
                            isDisabled={processing}
                        >
                            {processing ? "Saving..." : "Add Workstation"}
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
