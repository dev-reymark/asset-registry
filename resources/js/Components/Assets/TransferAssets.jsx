import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
} from "@heroui/react";
import React from "react";

export const TransferAssets = ({
    isTransferOpen,
    onTransferOpenChange,
    employees,
    location,
    selectedEmployeeId,
    setSelectedEmployeeId,
    selectedLocationId,
    setSelectedLocationId,
    statusToTransfer,
    setStatusToTransfer,
    newStatus,
    selectedKeys,
    handleTransferAssets,
    loading,
}) => {
    return (
        <Modal isOpen={isTransferOpen} onOpenChange={onTransferOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <h1 className="text-lg font-semibold">
                                Transfer Assets
                            </h1>
                            <p className="text-sm text-gray-500">
                                Select a location to transfer the selected
                                assets.
                            </p>
                        </ModalHeader>
                        <ModalBody>
                            <Select
                                label="Select Employee"
                                value={selectedEmployeeId}
                                onChange={(e) =>
                                    setSelectedEmployeeId(e.target.value)
                                }
                            >
                                {employees.map((employee, index) => {
                                    if (!employee.EMPLOYEEID) return null; // Skip invalid employee

                                    return (
                                        <SelectItem
                                            key={employee.EMPLOYEEID}
                                            value={employee.EMPLOYEEID}
                                        >
                                            {employee.EMPLOYEENAME}
                                        </SelectItem>
                                    );
                                })}
                            </Select>
                            <Select
                                label="Select Location"
                                value={selectedLocationId}
                                onChange={(e) =>
                                    setSelectedLocationId(e.target.value)
                                }
                            >
                                {location.map((location) => (
                                    <SelectItem
                                        key={location.LOCATIONID}
                                        value={location.LOCATIONID}
                                    >
                                        {location.LOCATIONNAME}
                                    </SelectItem>
                                ))}
                            </Select>
                            <Select
                                label="Select Status"
                                value={statusToTransfer}
                                onChange={(e) =>
                                    setStatusToTransfer(e.target.value)
                                }
                            >
                                {newStatus.map((status) => (
                                    <SelectItem
                                        key={status.value}
                                        value={status.value}
                                    >
                                        {status.label}
                                    </SelectItem>
                                ))}
                            </Select>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                onPress={() => {
                                    handleTransferAssets(
                                        Array.from(selectedKeys),
                                        selectedLocationId,
                                        selectedEmployeeId
                                    );
                                    onClose();
                                }}
                                isDisabled={
                                    !selectedLocationId || !selectedEmployeeId
                                }
                                isLoading={loading}
                            >
                                {loading ? "Transferring..." : "Transfer"}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
