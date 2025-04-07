import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";
import { Button, Form, Input } from "@heroui/react";
import toast from "react-hot-toast";

const CreateUser = ({ employee, user, title, description }) => {
    // console.log(user);
    const isUserCreated = !!user;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        email: user?.email || "",
        password: "",
        password_confirmation: "",
    });

    const [showUpdate, setShowUpdate] = useState(false);

    const handleCreate = (e) => {
        e.preventDefault();
        post(route("employees.createUser", { employee: employee.EMPNO }), {
            onSuccess: () => {
                toast.success("User created successfully");
            },
        });
    };

    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        put(route("employees.updatePassword", { employee: employee.EMPNO }), {
            onSuccess: () => {
                toast.success("Password updated successfully");
                reset("password", "password_confirmation");
                setShowUpdate(false);
            },
        });
    };

    return (
        <Authenticated>
            <Head title={title} />

            <div className="p-6">
                <div className="my-6">
                    <Button
                        color="primary"
                        variant="flat"
                        as={Link}
                        href={route("employees.index")}
                    >
                        ← Back to Employees
                    </Button>
                </div>
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-gray-600">{description}</p>

                <h2 className="text-xl font-semibold mt-6">
                    Employee: {employee.EMPLOYEENAME}
                </h2>

                {isUserCreated ? (
                    <div className="mt-4 space-y-4">
                        <Input label="Email" value={user.email} />
                        <Input label="Email" value={user.user_role} />
                        <Button
                            color="primary"
                            onPress={() => setShowUpdate(!showUpdate)}
                        >
                            {showUpdate ? "Cancel" : "Update Password"}
                        </Button>

                        {showUpdate && (
                            <Form
                                onSubmit={handlePasswordUpdate}
                                validationErrors={errors}
                                className="flex flex-col gap-4 mt-4"
                            >
                                <Input
                                    label="New Password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    isRequired
                                />
                                <Input
                                    label="Confirm Password"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                    isRequired
                                />
                                <Button
                                    color="primary"
                                    type="submit"
                                    isDisabled={processing}
                                >
                                    {processing
                                        ? "Updating..."
                                        : "Update Password"}
                                </Button>
                            </Form>
                        )}
                    </div>
                ) : (
                    <Form
                        onSubmit={handleCreate}
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
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
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
                )}
            </div>
        </Authenticated>
    );
};

export default CreateUser;
