import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { Button, Form, Input, Select, SelectItem } from "@heroui/react";
import Authenticated from "../../Layouts/Authenticated";
import toast from "react-hot-toast";
import { route } from "ziggy-js";

export default function EditEmployee() {
    const { employee, departments, locations, workstations } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        EMPNO: employee.EMPNO,
        EMPLOYEEID: employee.EMPLOYEEID,
        EMPLOYEENAME: employee.EMPLOYEENAME,
        DEPARTMENT: employee.DEPARTMENT,
        LOCATION: employee.LOCATION,
        WORKSTATION: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Send the PUT request with _method spoofing
        axios
            .post(route("employees.update", { employee: data.EMPNO }), {
                _method: "PUT", // Spoofing the PUT method
                EMPNO: data.EMPNO,
                EMPLOYEEID: data.EMPLOYEEID,
                EMPLOYEENAME: data.EMPLOYEENAME,
                DEPARTMENT: data.DEPARTMENT,
                LOCATION: data.LOCATION,
                WORKSTATION: null,
            })
            .then((response) => {
                router.visit(route("employees.index"));
                toast.success("Employee updated successfully");
            })
            .catch((error) => {
                console.error(
                    "There was an error updating the employee.",
                    error
                );
            });
    };

    return (
        <Authenticated>
            <Head title="Edit Employee" />
            <div className="p-6">
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
                <h1 className="text-3xl font-bold mb-4">Edit Employee</h1>
                <Form
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col gap-4"
                >
                    {/* <Input
                            label="Employee ID"
                            value={data.EMPNO}
                            disabled
                        /> */}
                    <Input
                        isRequired
                        label="Employee ID"
                        value={data.EMPLOYEEID}
                        onChange={(e) => setData("EMPLOYEEID", e.target.value)}
                    />
                    <Input
                        isRequired
                        label="Employee Name"
                        value={data.EMPLOYEENAME}
                        onChange={(e) =>
                            setData("EMPLOYEENAME", e.target.value)
                        }
                    />

                    <Select
                        isRequired
                        label="Department"
                        value={data.DEPARTMENT}
                        onChange={(e) => setData("DEPARTMENT", e.target.value)}
                        selectedKeys={data.DEPARTMENT}
                    >
                        {departments.map((department) => (
                            <SelectItem
                                key={department.DEPARTMETID}
                                value={department.DEPARTMETID}
                            >
                                {department.DEPARTMENTNAME}
                            </SelectItem>
                        ))}
                    </Select>

                    <Select
                        isRequired
                        label="Location"
                        value={data.LOCATION}
                        onChange={(e) => setData("LOCATION", e.target.value)}
                        selectedKeys={data.LOCATION}
                    >
                        {locations.map((location) => (
                            <SelectItem
                                key={location.LOCATIONID}
                                value={location.LOCATIONID}
                            >
                                {location.LOCATIONNAME}
                            </SelectItem>
                        ))}
                    </Select>

                    {/* <Select
                        isRequired
                        label="Workstation"
                        value={data.WORKSTATION}
                        onChange={(e) => setData("WORKSTATION", e.target.value)}
                        selectedKeys={data.WORKSTATION}
                    >
                        {workstations.map((workstation) => (
                            <SelectItem
                                key={workstation.WORKSTATIONID}
                                value={workstation.WORKSTATIONID}
                            >
                                {workstation.WORKSTATION}
                            </SelectItem>
                        ))}
                    </Select> */}

                    <div className="flex gap-2 mt-4">
                        <Button
                            type="submit"
                            color="primary"
                            isDisabled={processing}
                        >
                            {processing ? "Updating..." : "Update"}
                        </Button>
                        <Button
                            type="button"
                            color="warning"
                            variant="flat"
                            onPress={() => window.history.back()}
                            isDisabled={processing}
                        >
                            Cancel
                        </Button>
                    </div>
                </Form>
            </div>
        </Authenticated>
    );
}
