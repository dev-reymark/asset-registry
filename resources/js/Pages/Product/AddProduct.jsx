import { Head, Link, useForm } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";
import { Button, Form, Input } from "@heroui/react";
import toast from "react-hot-toast";

export default function AddProduct({ title, description }) {
    const { data, setData, post, errors, processing, reset } = useForm({
        DESCRIPTION: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("products.store"), {
            onSuccess: () => {
                toast.success("Product added successfully");
                reset();
            },
        });
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
                    onReset={() => reset()}
                >
                    <Input
                        label="Product Description"
                        isRequired
                        value={data.DESCRIPTION}
                        onChange={(e) => setData("DESCRIPTION", e.target.value)}
                    />

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
