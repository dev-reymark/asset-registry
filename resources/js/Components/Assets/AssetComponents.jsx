import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/react";
import React from "react";

export const AssetComponents = ({
    onComponentModalOpenChange,
    isComponentModalOpen,
    selectedAsset,
}) => {
    const componentDetails =
        selectedAsset?.asset_details?.[0]?.component_details || [];

    return (
        <Modal
            size="3xl"
            isOpen={isComponentModalOpen}
            onOpenChange={onComponentModalOpenChange}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Components
                        </ModalHeader>
                        <ModalBody>
                            <Table aria-label="Components Table">
                                <TableHeader>
                                    <TableColumn>COMPONENTNUMBER</TableColumn>
                                    {/* <TableColumn>ASSETCOMPNETID</TableColumn> */}
                                    <TableColumn>COMPONENTNAME</TableColumn>
                                    <TableColumn>DESCRIPTION</TableColumn>
                                    <TableColumn>SYSTEMCOMPONENTID</TableColumn>
                                </TableHeader>
                                <TableBody emptyContent="No rows to display.">
                                    {componentDetails.map((comp) => (
                                        <TableRow key={comp.ASSETCOMPNETID}>
                                            <TableCell>
                                                {comp.COMPONENTNUMBER}
                                            </TableCell>
                                            {/* <TableCell>
                                                {comp.ASSETCOMPNETID}
                                            </TableCell> */}
                                            <TableCell>
                                                {comp.asset_component
                                                    ?.ASSETCOMPONENTNAME || "—"}
                                            </TableCell>
                                            <TableCell>
                                                {comp.COMPONENTDESCRIPTION}
                                            </TableCell>
                                            <TableCell>
                                                {comp.SYSTEMCOMPONENTID}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={onClose}
                            >
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
