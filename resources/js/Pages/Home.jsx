import { IoLogOut, IoPeopleCircleOutline } from "react-icons/io5";
import { Button, Card, Image } from "@heroui/react";
import { TbFileImport } from "react-icons/tb";
import { FcPrint } from "react-icons/fc";
import QRScanner from "../Components/QRScanner";
import { useState } from "react";
import toast from "react-hot-toast";
import ApplicationLogo from "../Components/ApplicationLogo";
import { Link, router } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function Home() {
    const [loading, setLoading] = useState(false);

    const handleExportAssets = async () => {
        setLoading(true);
        try {
            const response = await axios.get(route("assets.export"), {
                responseType: "blob", // Important for downloading files
            });

            // Create a download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                "DSC_Assets_Registry_Information.xlsx"
            );
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success("Assets exported successfully");
        } catch (error) {
            toast.error("Failed to export assets");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        router.post("/logout");
        router.visit("/login");
        localStorage.removeItem("token");
        toast.success("Logged out successfully");
    };

    return (
        <div className="bg-gray-200 min-h-screen w-full flex flex-col items-center justify-center p-4">
            <div className="flex mb-8 text-center justify-center items-center flex-col">
                <ApplicationLogo className="w-24 h-24 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Asset Registry Information
                </h1>
            </div>

            <div className="max-w-3xl gap-4 grid grid-cols-12 grid-rows-2 px-4 w-full">
                <Card
                    isFooterBlurred
                    isPressable
                    className="w-full h-[300px] col-span-12 sm:col-span-7 flex flex-col justify-center items-center"
                >
                    <Image
                        removeWrapper
                        alt="Card background"
                        className="absolute inset-0 z-0 w-full h-full object-cover"
                        src="/assets/QR.gif"
                    />
                    <div className="relative z-10 w-full h-full flex justify-center items-center bg-white bg-opacity-80 p-4">
                        <QRScanner />
                    </div>
                </Card>

                <Card
                    isPressable
                    as={Button}
                    isLoading={loading}
                    onPress={handleExportAssets}
                    className="w-full h-[230px] col-span-12 sm:col-span-5 flex flex-col justify-center items-center"
                >
                    <div className="p-4 flex flex-col justify-center items-center gap-3 text-center">
                        <h3 className="text-xl font-medium text-gray-800 dark:text-neutral-200">
                            EXPORT ASSETS
                        </h3>
                        <div className="flex justify-center items-center size-14 bg-blue-600 text-white rounded-full dark:bg-blue-900 dark:text-blue-200">
                            <TbFileImport className="text-3xl" />
                        </div>
                    </div>
                </Card>

                <Card
                    as={Link}
                    href="/employees"
                    isFooterBlurred
                    isPressable
                    className="w-full h-[200px] col-span-12 sm:col-span-5 flex flex-col justify-center items-center"
                >
                    <div className="p-4 flex flex-col justify-center items-center gap-3 text-center">
                        <h3 className="text-xl font-medium text-gray-800 dark:text-neutral-200">
                            VIEW EMPLOYEES
                        </h3>
                        <div className="flex justify-center items-center size-14 bg-blue-600 text-white rounded-full dark:bg-blue-900 dark:text-blue-200">
                            <IoPeopleCircleOutline className="w-10 h-10" />
                        </div>
                    </div>
                </Card>
                <Card
                    onPress={handleLogout}
                    isFooterBlurred
                    isPressable
                    className="bg-danger-50 w-full h-[200px] col-span-12 sm:col-span-5 flex flex-col justify-center items-center"
                >
                    <div className="p-4 flex flex-col justify-center items-center gap-3 text-center">
                        <h3 className="text-xl font-medium text-gray-800 dark:text-neutral-200">
                            SIGN OUT
                        </h3>
                        <div className="flex justify-center items-center size-14 bg-danger-600 text-white rounded-full dark:bg-blue-900 dark:text-blue-200">
                            <IoLogOut className="w-10 h-10" />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
