import { useState } from "react";
import axios from "axios";
import { router } from "@inertiajs/react";
import ApplicationLogo from "../../Components/ApplicationLogo";
import { Button, Form, Input, Link } from "@heroui/react";
import toast from "react-hot-toast";
import { BsQrCodeScan } from "react-icons/bs";
import QRScanner from "../../Components/QRScanner";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute("content");
            const response = await axios.post(
                "/login",
                { email, password },
                { headers: { "X-CSRF-TOKEN": csrfToken } }
            );
            localStorage.setItem("token", response.data.token);
            router.visit("/");
            toast.success("Logged in successfully");
        } catch (error) {
            toast.error("Invalid email or password");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                <div className="flex justify-center mb-6">
                    <ApplicationLogo className="w-auto" />
                </div>
                <p className="text-center text-lg text-gray-600 dark:text-gray-200">
                    Welcome back! Please sign in to proceed.
                </p>
                <Form onSubmit={handleSubmit} className="mt-6 w-full">
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        isRequired
                        errorMessage="Please enter a valid email"
                        label="Email"
                        variant="flat"
                    />
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        isRequired
                        errorMessage="Invalid password"
                        label="Password"
                        variant="flat"
                    />

                    <Button color="primary" type="submit" className="w-full">
                        Sign In
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
                    {/* <Button
                        startContent={<BsQrCodeScan className="w-6 h-6" />}
                        as={Link}
                        href="/qrcode"
                        className="w-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        variant="flat"
                    >
                        Scan QR Code
                    </Button> */}
                    <QRScanner />
                </div>
            </div>
        </div>
    );
}
