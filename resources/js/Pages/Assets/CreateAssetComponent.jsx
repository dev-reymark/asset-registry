import { Head, useForm } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";

export default function CreateAssetComponent({ assetTypes }) {
    const { data, setData, post, processing, errors } = useForm({
        ASSETCOMPONENTNAME: "",
        ASSETTYPEID: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("assetComponents.store"), {
            onFinish: () => {
                setData({ ASSETCOMPONENTNAME: "", ASSETTYPEID: "" });
            },
        });
    };

    return (
        <Authenticated>
            <Head title="Create Asset Component" />
            <div className="p-6 bg-white shadow rounded-lg">
                <h1 className="text-2xl font-bold mb-4">
                    Create Asset Component
                </h1>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="ASSETCOMPONENTNAME"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Asset Component Name
                        </label>
                        <input
                            type="text"
                            id="ASSETCOMPONENTNAME"
                            name="ASSETCOMPONENTNAME"
                            value={data.ASSETCOMPONENTNAME}
                            onChange={(e) =>
                                setData("ASSETCOMPONENTNAME", e.target.value)
                            }
                            className="mt-1 p-2 block w-full border-gray-300 rounded-md"
                        />
                        {errors.ASSETCOMPONENTNAME && (
                            <div className="text-red-500 text-xs mt-1">
                                {errors.ASSETCOMPONENTNAME}
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="ASSETTYPEID"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Asset Type
                        </label>
                        <select
                            id="ASSETTYPEID"
                            name="ASSETTYPEID"
                            value={data.ASSETTYPEID}
                            onChange={(e) =>
                                setData("ASSETTYPEID", e.target.value)
                            }
                            className="mt-1 p-2 block w-full border-gray-300 rounded-md"
                        >
                            <option value="">Select Asset Type</option>
                            {assetTypes.map((type) => (
                                <option
                                    key={type.ASSETTYPEID}
                                    value={type.ASSETTYPEID}
                                >
                                    {type.ASSETTYPE}
                                </option>
                            ))}
                        </select>
                        {errors.ASSETTYPEID && (
                            <div className="text-red-500 text-xs mt-1">
                                {errors.ASSETTYPEID}
                            </div>
                        )}
                    </div>

                    <div className="mb-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md"
                        >
                            {processing
                                ? "Creating..."
                                : "Create Asset Component"}
                        </button>
                    </div>
                </form>
            </div>
        </Authenticated>
    );
}
