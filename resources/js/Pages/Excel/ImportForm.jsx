import React, { useState, useEffect } from "react";
import axios from "axios";
import { route } from "ziggy-js";
import Authenticated from "../../Layouts/Authenticated";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@heroui/react";

const ImportForm = ({ flash }) => {
    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState();
    const [errorMessage, setErrorMessage] = useState();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("file", file);

        try {
            await axios.post(route("assets.import"), formData, {
                onSuccess: () => {
                    setSuccessMessage("Assets imported successfully!");
                    setErrorMessage("");
                },
                onError: (error) => {
                    setErrors(error?.response?.data?.errors || {});
                    setSuccessMessage("");
                    setErrorMessage(
                        "An error occurred during the import process."
                    );
                },
            });
        } catch (err) {
            setErrorMessage("An unexpected error occurred.");
        }
    };

    return (
        <Authenticated>
            <Head title="Import Asset Data" />
            <div className="container mx-auto p-4">
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
                <h1 className="text-2xl font-bold mb-4">Import Asset Data</h1>
                {successMessage && (
                    <div className="bg-green-500 text-white p-4 rounded-md mb-4">
                        {successMessage}
                    </div>
                )}
                {errorMessage && (
                    <div className="bg-red-500 text-white p-4 rounded-md mb-4">
                        {errorMessage}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    encType="multipart/form-data"
                    className="space-y-4"
                >
                    <div>
                        <label
                            htmlFor="file"
                            className="block text-sm font-semibold"
                        >
                            Select Excel File
                        </label>
                        <input
                            type="file"
                            name="file"
                            id="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileChange}
                            className="mt-2 block w-full border-gray-300 rounded-md"
                        />
                        {errors.file && (
                            <span className="text-red-500 text-sm">
                                {errors.file}
                            </span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded-md"
                        disabled={!file}
                    >
                        Import
                    </button>
                </form>
            </div>
        </Authenticated>
    );
};

export default ImportForm;
