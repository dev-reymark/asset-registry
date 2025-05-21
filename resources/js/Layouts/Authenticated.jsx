import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { IoPeopleCircleOutline } from "react-icons/io5";
import { Button } from "@heroui/react";
import {
    FaBoxOpen,
    FaDesktop,
    FaHistory,
    FaMapMarkerAlt,
    FaProductHunt,
} from "react-icons/fa";
import ApplicationLogo from "../Components/ApplicationLogo";
import { MdCorporateFare } from "react-icons/md";
import toast from "react-hot-toast";
import { LuMenu } from "react-icons/lu";
import { route } from "ziggy-js";
import { BiSolidComponent } from "react-icons/bi";
import { RxDashboard } from "react-icons/rx";

export default function Authenticated({ children }) {
    const { url, props } = usePage();
    const user = props.auth?.user;
    // console.log(user);
    // console.log(props);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        router.post(route("logout"), {
            onSuccess: () => {
                localStorage.removeItem("token");
                toast.success("Logged out successfully");
            },
            onError: () => {
                toast.error("Logout failed. Please try again.");
            },
        });
    };

    return (
        <div className="flex min-h-screen relative">
            {/* Mobile Menu Button */}
            <Button
                color="primary"
                variant="light"
                onPress={() => setIsSidebarOpen(true)}
                className="md:hidden absolute top-4 left-4 z-50"
                isIconOnly
            >
                <RxDashboard className="size-8" />
            </Button>

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 w-64 bg-indigo-700 border-r h-screen transform transition-transform z-50 ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0 md:flex md:flex-col`}
            >
                <div className="flex items-center p-5 gap-2">
                    <ApplicationLogo />
                    <div className="flex flex-col">
                        <Link
                            href="/"
                            className="text-xl font-bold text-white hover:text-white"
                        >
                            Asset Registry
                        </Link>
                    </div>
                    {/* Close Button (Mobile) */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="md:hidden text-white ml-auto"
                    >
                        ✕
                    </button>
                </div>

                <nav className="flex flex-col flex-grow px-4 mt-5 space-y-1">
                    <Link
                        className={`flex items-center px-4 py-2 text-base text-white rounded-lg ${
                            route().current("assets.index")
                                ? "bg-indigo-600"
                                : "hover:bg-indigo-600"
                        }`}
                        href={route("assets.index")}
                    >
                        <FaBoxOpen className="w-5 h-5" />
                        <span className="ml-4">Assets</span>
                    </Link>
                    <Link
                        className={`flex items-center px-4 py-2 text-base text-white rounded-lg ${
                            url.startsWith("/employees")
                                ? "bg-indigo-600"
                                : "hover:bg-indigo-600"
                        }`}
                        href="/employees"
                    >
                        <IoPeopleCircleOutline className="w-5 h-5" />
                        <span className="ml-4">Employees</span>
                    </Link>
                    <Link
                        className={`flex items-center px-4 py-2 text-base text-white rounded-lg ${
                            url.startsWith(route("departments.index"))
                                ? "bg-indigo-600"
                                : "hover:bg-indigo-600"
                        }`}
                        href={route("departments.index")}
                    >
                        <MdCorporateFare className="w-5 h-5" />
                        <span className="ml-4">Department</span>
                    </Link>
                    <Link
                        className={`flex items-center px-4 py-2 text-base text-white rounded-lg ${
                            url.startsWith("/locations")
                                ? "bg-indigo-600"
                                : "hover:bg-indigo-600"
                        }`}
                        href="/locations"
                    >
                        <FaMapMarkerAlt className="w-5 h-5" />
                        <span className="ml-4">Asset Location</span>
                    </Link>
                    <Link
                        className={`flex items-center px-4 py-2 text-base text-white rounded-lg ${
                            url.startsWith("/products")
                                ? "bg-indigo-600"
                                : "hover:bg-indigo-600"
                        }`}
                        href="/products"
                    >
                        <FaProductHunt className="w-5 h-5" />
                        <span className="ml-4">Products</span>
                    </Link>
                    <Link
                        className={`flex items-center px-4 py-2 text-base text-white rounded-lg ${
                            route().current("assetComponents.index")
                                ? "bg-indigo-600"
                                : "hover:bg-indigo-600"
                        }`}
                        href={route("assetComponents.index")}
                    >
                        <BiSolidComponent className="w-5 h-5" />
                        <span className="ml-4">Product Components</span>
                    </Link>
                    <Link
                        className={`flex items-center px-4 py-2 text-base text-white rounded-lg ${
                            route().current("history.index")
                                ? "bg-indigo-600"
                                : "hover:bg-indigo-600"
                        }`}
                        href={route("history.index")}
                    >
                        <FaHistory className="w-5 h-5" />
                        <span className="ml-4">Audit Log</span>
                    </Link>
                    {/* <Link
                        className={`flex items-center px-4 py-2 text-base text-white rounded-lg ${
                            url.startsWith("/workstations")
                                ? "bg-indigo-600"
                                : "hover:bg-indigo-600"
                        }`}
                        href="/workstations"
                    >
                        <FaDesktop className="w-5 h-5" />
                        <span className="ml-4">Workstations</span>
                    </Link> */}
                </nav>
                <div className="p-4">
                    <Button
                        onPress={handleLogout}
                        color="danger"
                        className="w-full"
                        radius="none"
                    >
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Overlay when Sidebar is Open */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Main Content - Scrollable */}
            <div className="flex flex-col flex-1 md:ml-64 h-screen overflow-hidden">
                <main className="flex-1 overflow-y-auto p-2 mt-10">
                    <div className="mx-auto max-w-7xl">{children}</div>
                </main>
            </div>
        </div>
    );
}
