import { Head, useForm, usePage } from "@inertiajs/react";
import { Button, Input, Select, SelectItem } from "@heroui/react";
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
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("employees.store"));
        toast.success("Employee added successfully");
    };

    return (
        <Authenticated
            auth={usePage().props.auth}
            errors={usePage().props.errors}
        >
            <Head title="Add Employee" />
            <div className="p-6 bg-white shadow rounded-lg">
                <h1 className="text-2xl font-bold mb-4">Add New Employee</h1>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* <Input
                            label="Employee No"
                            value={data.EMPNO}
                            onChange={(e) => setData("EMPNO", e.target.value)}
                            error={errors.EMPNO}
                            isReadOnly
                        /> */}
                        <Input
                            isRequired
                            label="Employee ID"
                            value={data.EMPLOYEEID}
                            onChange={(e) =>
                                setData("EMPLOYEEID", e.target.value)
                            }
                            error={errors.EMPLOYEEID ? errors.EMPLOYEEID : ""}
                        />
                        <Input
                            isRequired
                            label="Employee Name"
                            value={data.EMPLOYEENAME}
                            onChange={(e) =>
                                setData("EMPLOYEENAME", e.target.value)
                            }
                            error={errors.EMPLOYEENAME}
                        />

                        {/* Department Select */}
                        <Select
                            isRequired
                            className="max-w-xs"
                            label="Department"
                            value={data.DEPARTMENT}
                            onChange={(e) =>
                                setData("DEPARTMENT", e.target.value)
                            }
                            error={errors.DEPARTMENT}
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
                            className="max-w-xs"
                            label="Location"
                            value={data.LOCATION}
                            onChange={(e) =>
                                setData("LOCATION", e.target.value)
                            }
                            error={errors.LOCATION}
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
                            className="max-w-xs"
                            label="Workstation"
                            value={data.WORKSTATION}
                            onChange={(e) =>
                                setData("WORKSTATION", e.target.value)
                            }
                            error={errors.WORKSTATION}
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

                        <Button
                            type="submit"
                            color="primary"
                            disabled={processing}
                        >
                            Add Employee
                        </Button>
                        <Button
                            type="button"
                            color="secondary"
                            onPress={() => window.history.back()}
                            isDisabled={processing}
                        >
                            Cancel
                        </Button>

                        {errors.message && (
                            <div className="text-red-500 text-xs italic">
                                {errors.message}
                            </div>
                        )}
                        {processing && (
                            <div className="text-gray-500 text-xs italic">
                                Processing...
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </Authenticated>
    );
}
