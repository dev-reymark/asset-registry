import { useForm } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";

export default function AddDepartment({ title, description }) {
    const { data, setData, post, errors, processing } = useForm({
        DEPARTMENTNAME: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("departments.store"));
    };

    return (
        <Authenticated>
            <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <p className="mb-4">{description}</p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700">
                            Department Name
                        </label>
                        <input
                            required
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded"
                            value={data.DEPARTMENTNAME}
                            onChange={(e) =>
                                setData("DEPARTMENTNAME", e.target.value)
                            }
                        />
                        {errors.DEPARTMENTNAME && (
                            <p className="text-red-500 text-sm">
                                {errors.DEPARTMENTNAME}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        disabled={processing}
                    >
                        {processing ? "Saving..." : "Add Department"}
                    </button>
                </form>
            </div>
        </Authenticated>
    );
}
