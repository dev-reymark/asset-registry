// resources/js/Pages/Employee/CreateUser.jsx

import React from "react";
import { Head } from "@inertiajs/react";
import Authenticated from "../../Layouts/Authenticated";

const CreateUser = ({ employee, user, title, description, employee_id }) => {
    return (
        <Authenticated>
            <Head title={title} />

            <h1>{title}</h1>
            <p>{description}</p>

            <h2>Employee: {employee.EMPLOYEENAME}</h2>
            <p>Email: {user.email}</p>

            <h3>User Info</h3>
            <p>
                User created for employee {employee_id} with the role:{" "}
                {user.user_role}
            </p>

            {/* Optionally, you can display more details or provide options like go back */}
            <button onClick={() => window.history.back()}>Back</button>
        </Authenticated>
    );
};

export default CreateUser;
