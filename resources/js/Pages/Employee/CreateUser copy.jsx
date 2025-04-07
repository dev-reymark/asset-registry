import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";
import { Button, Form, Input } from "@heroui/react";
import toast from "react-hot-toast";

const CreateUser = ({ employee, title, description }) => {
    console.log(employee);
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("employees.createUser", { employee: employee.EMPNO }), {
            onSuccess: () => {
                toast.success("User created successfully");
            },
        });
    };

    return (
        <Authenticated>
            <Head title={title} />

            <div className="p-6">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-gray-600">{description}</p>

                <h2 className="text-2xl font-bold mt-6">
                    Employee: {employee.EMPLOYEENAME}
                </h2>

                <Form
                    onSubmit={handleSubmit}
                    validationErrors={errors}
                    className="w-full flex flex-col gap-4 my-4"
                >
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        id="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        isRequired
                    />

                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        id="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        isRequired
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        name="password_confirmation"
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        isRequired
                    />

                    <Button
                        color="primary"
                        type="submit"
                        isDisabled={processing}
                    >
                        {processing ? "Creating..." : "Create User"}
                    </Button>
                </Form>
            </div>
        </Authenticated>
    );
};

export default CreateUser;
