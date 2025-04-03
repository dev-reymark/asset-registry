import { Head, router, useForm, usePage } from "@inertiajs/react";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import Authenticated from "../../Layouts/Authenticated";
import toast from "react-hot-toast";

export default function EditEmployee() {
    const { employee, departments, locations, workstations } = usePage().props;
    const { data, setData, put, processing, errors } = useForm({
        EMPNO: employee.EMPNO,
        EMPLOYEEID: employee.EMPLOYEEID,
        EMPLOYEENAME: employee.EMPLOYEENAME,
        DEPARTMENT: employee.DEPARTMENT,
        LOCATION: employee.LOCATION,
        WORKSTATION: employee.WORKSTATION,
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
                WORKSTATION: data.WORKSTATION,
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
            <div className="p-6 bg-white shadow rounded-lg">
                <h1 className="text-2xl font-bold mb-4">Edit Employee</h1>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* <Input
                            label="Employee ID"
                            value={data.EMPNO}
                            disabled
                        /> */}
                        <Input
                            isReadOnly
                            label="Employee ID"
                            value={data.EMPLOYEEID}
                            onChange={(e) =>
                                setData("EMPLOYEEID", e.target.value)
                            }
                            error={errors.EMPLOYEEID}
                        />
                        <Input
                            isReadOnly
                            label="Employee Name"
                            value={data.EMPLOYEENAME}
                            onChange={(e) =>
                                setData("EMPLOYEENAME", e.target.value)
                            }
                            error={errors.EMPLOYEENAME}
                        />

                        <Select
                            className="max-w-xs"
                            label="Department"
                            value={data.DEPARTMENT}
                            onChange={(e) =>
                                setData("DEPARTMENT", e.target.value)
                            }
                            error={errors.DEPARTMENT}
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
                            className="max-w-xs"
                            label="Location"
                            value={data.LOCATION}
                            onChange={(e) =>
                                setData("LOCATION", e.target.value)
                            }
                            error={errors.LOCATION}
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

                        <Select
                            className="max-w-xs"
                            label="Workstation"
                            value={data.WORKSTATION}
                            onChange={(e) =>
                                setData("WORKSTATION", e.target.value)
                            }
                            error={errors.WORKSTATION}
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
                        </Select>

                        <Button
                            type="submit"
                            color="primary"
                            isDisabled={processing}
                        >
                            Update
                        </Button>
                        <Button
                            type="button"
                            color="warning"
                            onPress={() => window.history.back()}
                            isDisabled={processing}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </Authenticated>
    );
}
