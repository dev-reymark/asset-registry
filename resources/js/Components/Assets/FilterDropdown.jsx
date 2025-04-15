import { Button } from "@heroui/react";
import { useState } from "react";
import { CiCirclePlus, CiFilter } from "react-icons/ci";

const FilterDropdown = ({
    statuses,
    status,
    setStatus,
    descriptions,
    description,
    setDescription,
    issuedTos,
    issuedTo,
    applyFilters,
    setIssuedTo,
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false); // Toggle for Status filter
    const [descriptionOpen, setDescriptionOpen] = useState(false); // Toggle for Description filter
    const [issuedToOpen, setIssuedToOpen] = useState(false); // Toggle for Issued To filter

    const handleDropdownToggle = () => {
        setDropdownOpen(!dropdownOpen);
    };

    return (
        <div className="relative">
            {/* Button to trigger dropdown */}
            <Button
                color="primary"
                isIconOnly
                variant="flat"
                onPress={handleDropdownToggle}
            >
                <CiFilter className="size-5" />
            </Button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
                <div className="absolute top-12 bg-white border p-4 w-60 shadow-lg z-50">
                    <form>
                        {/* Status Filter */}
                        <fieldset>
                            <div className="flex justify-between">
                                <legend>Status</legend>
                                <Button
                                    variant="light"
                                    onPress={() => setStatusOpen(!statusOpen)} // Toggle Status filter visibility
                                    isIconOnly
                                >
                                    <CiCirclePlus className="size-5" />
                                </Button>
                            </div>
                            {statusOpen && // Show/Hide Status filter options
                                (statuses || []).map((item) => (
                                    <div key={item}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={status === item}
                                                onChange={() => {
                                                    setStatus(item);
                                                    applyFilters({
                                                        status: item,
                                                    });
                                                }}
                                            />
                                            {item}
                                        </label>
                                    </div>
                                ))}
                        </fieldset>

                        {/* Description Filter */}
                        <fieldset className="mt-4">
                            <div className="flex justify-between">
                                <legend>Description</legend>
                                <Button
                                    variant="light"
                                    onPress={() =>
                                        setDescriptionOpen(!descriptionOpen)
                                    } // Toggle Description filter visibility
                                    isIconOnly
                                >
                                    <CiCirclePlus className="size-5" />
                                </Button>
                            </div>
                            {descriptionOpen && // Show/Hide Description filter options
                                (descriptions || []).map((item) => (
                                    <div key={item}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={description === item}
                                                onChange={() => {
                                                    setDescription(item);
                                                    applyFilters({
                                                        description: item,
                                                    });
                                                }}
                                            />
                                            {item}
                                        </label>
                                    </div>
                                ))}
                        </fieldset>

                        {/* Issued To Filter */}
                        <fieldset className="mt-4">
                            <div className="flex justify-between">
                                <legend>Issued To</legend>
                                <Button
                                    variant="light"
                                    onPress={() =>
                                        setIssuedToOpen(!issuedToOpen)
                                    } // Toggle Issued To filter visibility
                                    isIconOnly
                                >
                                    <CiCirclePlus className="size-5" />
                                </Button>
                            </div>
                            {issuedToOpen && // Show/Hide Issued To filter options
                                (issuedTos || []).map((item) => (
                                    <div key={item}>
                                        <label>
                                            <input
                                                type="checkbox"
                                                checked={issuedTo === item}
                                                onChange={() => {
                                                    setIssuedTo(item);
                                                    applyFilters({
                                                        issued_to: item,
                                                    });
                                                }}
                                            />
                                            {item}
                                        </label>
                                    </div>
                                ))}
                        </fieldset>

                        {/* Clear Filters Button */}
                        <div className="mt-4 text-center">
                            <button
                                type="button"
                                className="text-red-500"
                                onClick={() => {
                                    setIssuedTo("");
                                    setDescription("");
                                    setStatus("");
                                    applyFilters({
                                        issued_to: "",
                                        description: "",
                                        status: "",
                                    });
                                }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;
