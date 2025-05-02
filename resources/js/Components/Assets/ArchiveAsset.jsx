import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    Textarea,
} from "@heroui/react";
import React from "react";

export const ArchiveAsset = ({
    isArchiveOpen,
    onArchiveOpenChange,
    statusToArchive,
    setStatusToArchive,
    reason,
    setReason,
    condition,
    setCondition,
    handleArchiveAssets,
    selectedAsset,
    archiveLoading,
    newStatus,
}) => {
    return (
        <Modal
            isOpen={isArchiveOpen}
            onOpenChange={onArchiveOpenChange}
            placement="top-center"
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <h1 className="text-lg font-semibold text-danger-500">
                                Are you sure you want to dispose?
                            </h1>
                            <ModalBody className="">
                                <Textarea
                                    isRequired
                                    label="Reason for disposal"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                                <Select
                                    isRequired
                                    variant="faded"
                                    label="Select Status"
                                    value={statusToArchive}
                                    onChange={(e) =>
                                        setStatusToArchive(e.target.value)
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
                                <Textarea
                                    variant="faded"
                                    isRequired
                                    label="Asset Condition"
                                    value={condition}
                                    onChange={(e) =>
                                        setCondition(e.target.value)
                                    }
                                />
                            </ModalBody>
                        </ModalHeader>
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
                                    handleArchiveAssets(
                                        selectedAsset.asset_details.map(
                                            (detail) => detail.ASSETNO
                                        )
                                    );
                                    onClose();
                                }}
                                isDisabled={!reason || !condition}
                                isLoading={archiveLoading}
                            >
                                {archiveLoading ? "Disposing..." : "Dispose"}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
