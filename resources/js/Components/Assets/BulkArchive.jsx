// not used

import React from "react";

export const BulkArchive = ({}) => {
    const {
        isOpen: isBulkArchiveOpen,
        onOpen: openBulkArchiveModal,
        onOpenChange: onBulkArchiveOpenChange,
    } = useDisclosure();

    const [bulkReason, setBulkReason] = useState("");
    const [bulkCondition, setBulkCondition] = useState("");
    const [bulkStatus, setBulkStatus] = useState("");
    const [bulkLoading, setBulkLoading] = useState(false);

    const handleBulkArchiveAssets = (assetNos) => {
        const assetNosAsIntegers = assetNos.map(Number);
        setBulkLoading(true);

        router.post(
            route("assetsextended.bulkArchive"),
            {
                asset_nos: assetNosAsIntegers,
                archival_reason: bulkReason,
                status: bulkStatus,
                conditions: bulkCondition,
            },
            {
                preserveState: true,
                replace: true,
                onSuccess: () => {
                    setSelectedKeys(new Set());
                    setBulkReason("");
                    setBulkStatus("");
                    setBulkCondition("");
                    toast.success("Assets archived successfully.");
                },
                onError: (errors) => {
                    console.error("Bulk archive failed:", errors);
                    toast.error("Failed to archive assets.");
                },
                onFinish: () => {
                    setBulkLoading(false);
                },
            }
        );
    };
    return (
        <Modal
            isOpen={isBulkArchiveOpen}
            onOpenChange={onBulkArchiveOpenChange}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Bulk Archive Selected Assets
                        </ModalHeader>
                        <ModalBody>
                            <Textarea
                                isRequired
                                label="Reason"
                                value={bulkReason}
                                onChange={(e) => setBulkReason(e.target.value)}
                            />
                            <Select
                                label="Status"
                                value={bulkStatus}
                                onChange={(e) => setBulkStatus(e.target.value)}
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
                                isRequired
                                label="Condition"
                                value={bulkCondition}
                                onChange={(e) =>
                                    setBulkCondition(e.target.value)
                                }
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button
                                color="danger"
                                onPress={() => {
                                    handleBulkArchiveAssets(
                                        Array.from(selectedKeys)
                                    );
                                    onClose();
                                }}
                                isDisabled={
                                    !bulkReason || !bulkStatus || !bulkCondition
                                }
                                isLoading={bulkLoading}
                            >
                                {bulkLoading
                                    ? "Disposing..."
                                    : "Confirm Dispose"}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
