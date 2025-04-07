import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { Button, Form, Input, Select, SelectItem } from "@heroui/react";
import Authenticated from "../../Layouts/Authenticated";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function AddEmployee() {
    const { data, setData, post, processing, errors } = useForm({
        EMPNO: "",
        EMPLOYEEID: "",
        EMPLOYEENAME: "",
        DEPARTMENT: "",
        LOCATION: "",
        WORKSTATION: "",
    });
    const { departments, locations, workstations, nextEmpno } = usePage().props; // Get departments, locations, and workstations

    useEffect(() => {
        setData("EMPNO", nextEmpno);
    }, [nextEmpno, setData]);

    // console.log(departments, locations, workstations, nextEmpno); // Debugging line
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await post(route("employees.store"));
            toast.success("Employee added successfully");
        } catch (error) {
            console.error("Error adding employee:", error);
            toast.error("Failed to add employee. Please try again.");
        }
    };

    return (
        <Authenticated>
            <Head title="Create Employee" />
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

                <h1 className="text-2xl font-bold mb-4">Create Employee</h1>
                <Form
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col gap-4"
                    validationErrors={errors}
                    onReset={() => {
                        setData({
                            EMPNO: "",
                            EMPLOYEEID: "",
                            EMPLOYEENAME: "",
                            DEPARTMENT: "",
                            LOCATION: "",
                            WORKSTATION: "",
                        });
                    }}
                >
                    {/* Employee No (Auto-generated) */}
                    {/* <Input
                            label="Employee No"
                            value={data.EMPNO}
                            onChange={(e) => setData("EMPNO", e.target.value)}
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

                    {/* Department Select */}
                    <Select
                        isRequired
                        label="Department"
                        value={data.DEPARTMENT}
                        onChange={(e) => setData("DEPARTMENT", e.target.value)}
                    >
                        <SelectItem value="" disabled>
                            Select Department
                        </SelectItem>
                        {departments.map((department) => (
                            <SelectItem
                                key={department.DEPARTMETID}
                                value={department.DEPARTMETID}
                            >
                                {department.DEPARTMENTNAME}
                            </SelectItem>
                        ))}
                    </Select>

                    {/* Location Select */}
                    <Select
                        isRequired
                        label="Location"
                        value={data.LOCATION}
                        onChange={(e) => setData("LOCATION", e.target.value)}
                    >
                        <SelectItem value="" disabled>
                            Select Location
                        </SelectItem>
                        {locations.map((location) => (
                            <SelectItem
                                key={location.LOCATIONID}
                                value={location.LOCATIONID}
                            >
                                {location.LOCATIONNAME}
                            </SelectItem>
                        ))}
                    </Select>

                    {/* Workstation Select */}
                    <Select
                        isRequired
                        label="Workstation"
                        value={data.WORKSTATION}
                        onChange={(e) => setData("WORKSTATION", e.target.value)}
                    >
                        <SelectItem value="" disabled>
                            Select Workstation
                        </SelectItem>
                        {workstations.map((workstation) => (
                            <SelectItem
                                key={workstation.WORKSTATIONID}
                                value={workstation.WORKSTATIONID}
                            >
                                {workstation.WORKSTATION}
                            </SelectItem>
                        ))}
                    </Select>

                    <div className="flex gap-2 mt-4">
                        <Button
                            type="submit"
                            color="primary"
                            isDisabled={processing}
                        >
                            {processing ? "Creating..." : "Create"}
                        </Button>
                        <Button
                            color="warning"
                            variant="flat"
                            type="reset"
                            isDisabled={processing}
                        >
                            Reset
                        </Button>
                    </div>
                </Form>
            </div>
        </Authenticated>
    );
}
