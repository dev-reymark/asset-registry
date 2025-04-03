import { useForm } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";

export default function AddLocation({ departments, title, description }) {
    const { data, setData, post, errors, processing } = useForm({
        LOCATIONNAME: "",
        DEPARTMETID: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("locations.store"));
    };

    return (
        <Authenticated>
            <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <p className="mb-4">{description}</p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">
                            Location Name
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={data.LOCATIONNAME}
                            onChange={(e) =>
                                setData("LOCATIONNAME", e.target.value)
                            }
                        />
                        {errors.LOCATIONNAME && (
                            <p className="text-red-500 text-sm">
                                {errors.LOCATIONNAME}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">
                            Department
                        </label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded"
                            value={data.DEPARTMETID}
                            onChange={(e) =>
                                setData("DEPARTMETID", e.target.value)
                            }
                        >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                                <option
                                    key={dept.DEPARTMETID}
                                    value={dept.DEPARTMETID}
                                >
                                    {dept.DEPARTMENTNAME}
                                </option>
                            ))}
                        </select>
                        {errors.DEPARTMETID && (
                            <p className="text-red-500 text-sm">
                                {errors.DEPARTMETID}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        disabled={processing}
                    >
                        {processing ? "Saving..." : "Add Location"}
                    </button>
                </form>
            </div>
        </Authenticated>
    );
}
