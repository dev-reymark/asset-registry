import { useForm } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";

export default function AddProduct({
    assetTypes,
    assetComponents,
    title,
    description,
}) {
    const { data, setData, post, errors, processing } = useForm({
        DESCRIPTION: "",
        ASSETTYPE: "",
        ASSETCOMPONENT: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("products.store"));
    };

    return (
        <Authenticated>
            <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <p className="mb-4">{description}</p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">
                            Product Description
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={data.DESCRIPTION}
                            onChange={(e) =>
                                setData("DESCRIPTION", e.target.value)
                            }
                        />
                        {errors.DESCRIPTION && (
                            <p className="text-red-500 text-sm">
                                {errors.DESCRIPTION}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">
                            Asset Type
                        </label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded"
                            value={data.ASSETTYPE}
                            onChange={(e) =>
                                setData("ASSETTYPE", e.target.value)
                            }
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
                        {errors.ASSETTYPE && (
                            <p className="text-red-500 text-sm">
                                {errors.ASSETTYPE}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">
                            Asset Component
                        </label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded"
                            value={data.ASSETCOMPONENT}
                            onChange={(e) =>
                                setData("ASSETCOMPONENT", e.target.value)
                            }
                        >
                            <option value="">Select Asset Component</option>
                            {assetComponents.map((component) => (
                                <option
                                    key={component.ASSETCOMPNETID}
                                    value={component.ASSETCOMPNETID}
                                >
                                    {component.ASSETCOMPONENTNAME}
                                </option>
                            ))}
                        </select>
                        {errors.ASSETCOMPONENT && (
                            <p className="text-red-500 text-sm">
                                {errors.ASSETCOMPONENT}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        disabled={processing}
                    >
                        {processing ? "Saving..." : "Add Product"}
                    </button>
                </form>
            </div>
        </Authenticated>
    );
}
