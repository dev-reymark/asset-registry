import { Head, Link, usePage } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";

export default function Products() {
    const { products } = usePage().props; // Fetch products
    console.log(products); // Log products to console for debugging

    return (
        <Authenticated
            auth={usePage().props.auth}
            errors={usePage().props.errors}
        >
            <Head title="Products" />
            <div className="p-6 bg-white shadow rounded-lg">
                <h1 className="text-2xl font-bold mb-4">Products</h1>
                <Link
                    href={route("products.create")}
                    className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    + Add Product
                </Link>

                {/* Products Table */}
                <table className="w-full border-collapse border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">Product ID</th>
                            <th className="border px-4 py-2">Description</th>
                            <th className="border px-4 py-2">Asset Type</th>
                            <th className="border px-4 py-2">
                                Asset Component
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr
                                    key={product.PRODUCTID}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="border px-4 py-2">
                                        {product.PRODUCTID}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {product.DESCRIPTION}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {product.asset_type?.ASSETTYPE || "--"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {product.asset_component
                                            ?.ASSETCOMPONENTNAME || "--"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="border px-4 py-2 text-center text-gray-500"
                                >
                                    No products found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Authenticated>
    );
}
