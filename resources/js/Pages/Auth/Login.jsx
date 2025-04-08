"use client";

import { useState } from "react";
import axios from "axios";
import { Head, router } from "@inertiajs/react";
import toast from "react-hot-toast";
import QRScanner from "../../Components/QRScanner";
import React from "react";
import { Button, Input, Form, Card, CardBody } from "@heroui/react";
import { Icon } from "@iconify/react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isVisible, setIsVisible] = React.useState(false);
    const [loading, setLoading] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                .getAttribute("content");

            const response = await axios.post(
                "/login",
                { email, password },
                { headers: { "X-CSRF-TOKEN": csrfToken } }
            );

            const user = response.data.user;

            toast.success("Logged in successfully");

            if (user.role === "admin") {
                router.visit("/");
            } else if (user.role === "employee") {
                router.visit(`/assets/${user.employee_id}`);
            }
        } catch (error) {
            toast.error("Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="Login" />
            <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
                <Card className="flex items-center justify-center w-full max-w-sm gap-1">
                    <div className="flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6">
                        <p className="pb-4 text-left text-3xl font-semibold">
                            Log In
                            <span
                                aria-label="emoji"
                                className="ml-2"
                                role="img"
                            >
                                👋
                            </span>
                        </p>
                        <Form
                            className="flex flex-col gap-4"
                            validationBehavior="native"
                            onSubmit={handleSubmit}
                        >
                            <Input
                                isRequired
                                label="Email"
                                labelPlacement="outside"
                                name="email"
                                placeholder="Enter your email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                variant="bordered"
                                autoComplete="email"
                            />

                            <Input
                                isRequired
                                endContent={
                                    <button
                                        type="button"
                                        onClick={toggleVisibility}
                                    >
                                        {isVisible ? (
                                            <Icon
                                                className="pointer-events-none text-2xl text-default-400"
                                                icon="solar:eye-closed-linear"
                                            />
                                        ) : (
                                            <Icon
                                                className="pointer-events-none text-2xl text-default-400"
                                                icon="solar:eye-bold"
                                            />
                                        )}
                                    </button>
                                }
                                label="Password"
                                labelPlacement="outside"
                                name="password"
                                placeholder="Enter your password"
                                type={isVisible ? "text" : "password"}
                                variant="bordered"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                            />

                            <Button
                                isLoading={loading}
                                className="w-full"
                                color="primary"
                                type="submit"
                            >
                                {loading ? (
                                    <Icon
                                        icon="solar:loading-2-linear"
                                        className="w-6"
                                    />
                                ) : (
                                    "Log In"
                                )}
                            </Button>
                        </Form>
                        <div className="flex items-center justify-center mt-6">
                            <span className="w-1/5 border-b dark:border-gray-600"></span>
                            <span className="mx-2 text-xs text-gray-500 uppercase dark:text-gray-400">
                                or scan qr code
                            </span>
                            <span className="w-1/5 border-b dark:border-gray-600"></span>
                        </div>

                        <div className="flex justify-center mt-4">
                            <QRScanner />
                        </div>
                    </div>
                </Card>
            </div>
        </>
    );
}
