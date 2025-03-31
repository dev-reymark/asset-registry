import { IoPeopleCircleOutline } from "react-icons/io5";
import { Card, Image } from "@heroui/react";
import { TbFileImport } from "react-icons/tb";
import { FcPrint } from "react-icons/fc";
import { Link } from "@inertiajs/react";
import QRScanner from "../Components/QRScanner";

export default function Home() {
    return (
        <div className="bg-gray-200 h-screen w-full flex flex-col items-center justify-center">
            <div className="flex flex-col mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    Asset Registry Information
                </h1>
            </div>

            <div className="max-w-[900px] gap-2 grid grid-cols-12 grid-rows-2 px-8">
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
                    as={Link}
                    className="w-full h-[230px] col-span-12 sm:col-span-5 flex flex-col justify-center items-center"
                >
                    <div className="p-4 flex flex-col justify-center items-center gap-3 text-center">
                        <h3 className="text-xl font-medium text-gray-800 dark:text-neutral-200">
                            EXPORT ASSETS TO PDF
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
                    isFooterBlurred
                    isPressable
                    as={Link}
                    href="/assets/all"
                    className="w-full h-[250px] col-span-12 sm:col-span-5 flex flex-col justify-center items-center"
                >
                    <div className="p-5 flex flex-col justify-center items-center gap-4 text-center">
                        <h3 className="text-xl font-medium text-gray-800 dark:text-neutral-200">
                            PRINT ASSETS
                        </h3>
                        <div className="flex justify-center items-center size-14 bg-blue-600 text-white rounded-full dark:bg-blue-900 dark:text-blue-200">
                            <FcPrint className="w-10 h-10" />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
