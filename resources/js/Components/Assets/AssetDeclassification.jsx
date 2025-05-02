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

export const AssetDeclassification = ({
    location,
    selectedLocationId,
    setSelectedLocationId,
    statusToTransfer,
    setStatusToTransfer,
    newStatus,
    selectedKeys,
    isDeclassificationOpen,
    onDeclassificationOpenChange,
    handleDeclassification,
    loading,
}) => {
    return (
        <Modal
            isOpen={isDeclassificationOpen}
            onOpenChange={onDeclassificationOpenChange}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <h1 className="text-lg font-semibold">
                                Declassify Assets
                            </h1>
                            <p className="text-sm text-gray-500">
                                Select a location and status to declassify the
                                selected assets.
                            </p>
                        </ModalHeader>
                        <ModalBody>
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
                                    handleDeclassification(
                                        Array.from(selectedKeys),
                                        selectedLocationId
                                    );
                                    onClose();
                                }}
                                isDisabled={
                                    !selectedLocationId || !statusToTransfer
                                }
                                isLoading={loading}
                            >
                                {loading ? "Declassifying..." : "Declassify"}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

