import React, { useState, useEffect, useRef } from 'react';

const ServicesDropdown = () => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Toggle the dropdown on button click
    const toggleDropdown = () => {
        setOpen((prev) => !prev);
    };

    // Optional: Close the dropdown if a click occurs outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle click on individual service actions
    const handleAction = (action) => {
        console.log(`Action clicked: ${action}`);
        // Insert your action handling logic here.
        // Optionally, you can close the dropdown after an action by calling: setOpen(false);
    };

    return (
        // Fixed position at the top right of the page
        <div className="top-4 right-4 z-50 pr-5" ref={dropdownRef}>
            <div className="relative inline-block">
                {/* Button to toggle the dropdown */}
                <button
                    onClick={toggleDropdown}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md focus:outline-none"
                >
                    Services
                </button>
                {/* Dropdown menu (displayed below the button) */}
                {open && (
                    <ul className="absolute right-0 mt-2 bg-white shadow-lg rounded-md py-2 w-48">
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleAction('CheckApi')}
                        >
                            CheckApi
                        </li>
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleAction('Update Credentials')}
                        >
                            Update Credentials
                        </li>
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ServicesDropdown;
