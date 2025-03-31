import { Head, usePage } from "@inertiajs/react";
import Authenticated from "../Layouts/Authenticated";

export default function Dashboard({ message }) {
    return (
        <Authenticated
            auth={usePage().props.auth}
            errors={usePage().props.errors}
        >
            <div>
                <Head title="Dashboard" />
                <h1 className="text-2xl font-bold">{message}!</h1>
            </div>
        </Authenticated>
    );
}
