import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Image,
} from "@heroui/react";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export const AssetDetails = ({
    isOpen,
    selectedAsset,
    onOpenChange,
    onComponentModalOpen,
}) => {
    return (
        <Modal
            isOpen={isOpen}
            size="xl"
            placement="top-center"
            onOpenChange={onOpenChange}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Assets Details
                        </ModalHeader>
                        <ModalBody>
                            {selectedAsset && (
                                <div className="flex flex-wrap gap-6">
                                    <Swiper
                                        spaceBetween={10}
                                        slidesPerView={1}
                                        className="w-full sm:w-1/2 lg:w-1/3"
                                    >
                                        {selectedAsset?.asset_details[0]
                                            ?.IMAGEPATH &&
                                            JSON.parse(
                                                selectedAsset.asset_details[0]
                                                    .IMAGEPATH
                                            ).map((path, index) => (
                                                <SwiperSlide key={index}>
                                                    <Image
                                                        src={`/storage/${path}`}
                                                        alt={`Asset Image ${
                                                            index + 1
                                                        }`}
                                                        className="object-cover"
                                                        width={400}
                                                        height={200}
                                                        onError={(e) =>
                                                            (e.target.src =
                                                                "/assets/placeholder.jpg")
                                                        }
                                                    />
                                                </SwiperSlide>
                                            ))}
                                    </Swiper>

                                    <div className="flex-1 space-y-4 text-sm text-gray-700">
                                        <p>
                                            <span className="font-semibold">
                                                Description:
                                            </span>{" "}
                                            {
                                                selectedAsset.asset_details[0]
                                                    ?.DESCRIPTION
                                            }
                                        </p>
                                        <p>
                                            <span className="font-semibold">
                                                Serial Number:
                                            </span>{" "}
                                            {
                                                selectedAsset.asset_details[0]
                                                    ?.SERIALNO
                                            }
                                        </p>
                                        <p>
                                            <span className="font-semibold">
                                                Date Issued:
                                            </span>{" "}
                                            {selectedAsset.asset_details[0]?.DATEISSUUED?.trim()}
                                        </p>
                                        <p>
                                            <span className="font-semibold">
                                                Condition:
                                            </span>{" "}
                                            {
                                                selectedAsset.asset_details[0]
                                                    ?.CONDITIONS
                                            }
                                        </p>
                                        <Button
                                            color="primary"
                                            variant="light"
                                            onPress={onComponentModalOpen}
                                        >
                                            View components
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="flat"
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
