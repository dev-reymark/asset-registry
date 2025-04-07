import { Head, Link, useForm } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";
import { Button, Form, Input } from "@heroui/react";
import toast from "react-hot-toast";

export default function AddDepartment({ title, description }) {
    const { data, setData, post, errors, processing } = useForm({
        DEPARTMENTNAME: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await post(route("departments.store"));
            toast.success("Department added successfully");
        } catch (error) {
            toast.error("Failed to add department. Please try again.");
            console.error(
                "An error occurred while adding the department:",
                error
            );
        }
    };

    return (
        <Authenticated>
            <Head title="Add Department" />
            <div className="p-6">
                <div className="my-6">
                    <Button
                        color="primary"
                        variant="flat"
                        as={Link}
                        href={route("departments.index")}
                    >
                        ← Back to Departments
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
                            DEPARTMENTNAME: "",
                        });
                    }}
                >
                    <Input
                        isRequired
                        label="Department Name"
                        value={data.DEPARTMENTNAME}
                        onChange={(e) =>
                            setData("DEPARTMENTNAME", e.target.value)
                        }
                    />

                    <div className="mt-4 gap-2 flex justify-end">
                        <Button
                            type="submit"
                            color="primary"
                            disabled={processing}
                        >
                            {processing ? "Saving..." : "Add Department"}
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
