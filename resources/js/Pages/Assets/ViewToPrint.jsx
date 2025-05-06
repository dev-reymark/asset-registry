import { Link } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";
import { Button } from "@heroui/react";
export default function ViewToPrint({ employee }) {
    // console.log(employee); // Check if employee is not null

    const assets = employee?.assets ?? [];

    const printPage = () => {
        window.print(); // Trigger print dialog
    };

    return (
        <Authenticated>
            <div className="p-5">
                <Button
                    as={Link}
                    size="sm"
                    color="primary"
                    variant="flat"
                    href={route("assets.show", employee?.EMPNO)}
                >
                    ← Back to Assets
                </Button>
                <h2 className="text-2xl font-semibold my-5">
                    {employee?.EMPLOYEENAME.trim() ?? "Employee Name"}
                </h2>

                <Button size="sm" color="primary" onPress={printPage}>
                    Print
                </Button>

                {assets.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 my-5">
                        {assets.map((asset) =>
                            asset.asset_details?.map((detail) => (
                                <div
                                    key={detail.ASSETNO} // Using ASSETNO as the key
                                    className="flex items-center border border-gray-300 rounded-lg bg-gray-100 shadow-md p-3 hover:transform hover:translate-y-1 hover:shadow-lg transition-all"
                                    style={{ height: "120px" }}
                                >
                                    {/* QR Code Section */}
                                    <div className="mr-4 flex-shrink-0">
                                        <img
                                            src={detail.qr_code ?? "#"}
                                            alt="QR Code"
                                            className="w-16 h-16 object-contain"
                                        />
                                    </div>

                                    {/* Asset Details Section */}
                                    <div className="flex flex-col justify-between w-full">
                                        <p className="text-md font-bold mb-1">
                                            {detail.DESCRIPTION?.trim() ?? "--"}
                                        </p>
                                        <p className="text-sm">
                                            {detail.MODEL?.trim() ?? "--"}
                                        </p>
                                        <p className="text-sm font-semibold">
                                            <span className="font-normal">
                                                SN:
                                            </span>{" "}
                                            {detail.SERIALNO?.trim() ?? "--"}
                                        </p>
                                        <p className="text-sm font-semibold">
                                            <span className="font-normal">
                                                Issued To:
                                            </span>{" "}
                                            {detail.ISSUEDTO?.trim() ?? "--"}
                                        </p>
                                        <p className="text-sm font-semibold">
                                            <span className="font-normal">
                                                Date Issued:
                                            </span>{" "}
                                            {detail.DATEISSUED ?? "--"}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <p className="text-lg font-medium text-gray-600">
                        No active assets assigned to this employee.
                    </p>
                )}
            </div>
        </Authenticated>
    );
}
