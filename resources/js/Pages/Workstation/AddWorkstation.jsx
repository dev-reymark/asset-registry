import { useForm } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";

export default function AddWorkstation({
    departments,
    locations,
    title,
    description,
}) {
    const { data, setData, post, errors, processing } = useForm({
        WORKSTATION: "",
        DEPARTMENTID: "",
        LOCATIONID: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("workstations.store"));
    };

    return (
        <Authenticated>
            <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <p className="mb-4">{description}</p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">
                            Workstation Name
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={data.WORKSTATION}
                            onChange={(e) =>
                                setData("WORKSTATION", e.target.value)
                            }
                        />
                        {errors.WORKSTATION && (
                            <p className="text-red-500 text-sm">
                                {errors.WORKSTATION}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">
                            Department
                        </label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded"
                            value={data.DEPARTMENTID}
                            onChange={(e) =>
                                setData("DEPARTMENTID", e.target.value)
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
                        {errors.DEPARTMENTID && (
                            <p className="text-red-500 text-sm">
                                {errors.DEPARTMENTID}
                            </p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Location</label>
                        <select
                            className="w-full p-2 border border-gray-300 rounded"
                            value={data.LOCATIONID}
                            onChange={(e) =>
                                setData("LOCATIONID", e.target.value)
                            }
                        >
                            <option value="">Select Location</option>
                            {locations.map((loc) => (
                                <option
                                    key={loc.LOCATIONID}
                                    value={loc.LOCATIONID}
                                >
                                    {loc.LOCATIONNAME}
                                </option>
                            ))}
                        </select>
                        {errors.LOCATIONID && (
                            <p className="text-red-500 text-sm">
                                {errors.LOCATIONID}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        disabled={processing}
                    >
                        {processing ? "Saving..." : "Add Workstation"}
                    </button>
                </form>
            </div>
        </Authenticated>
    );
}
