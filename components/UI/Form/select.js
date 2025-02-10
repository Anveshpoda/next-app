const SelectField = ({
    id,
    label,
    value,
    onChange,
    className = '',
    error = false,
    children,
    ...props
}) => {
    // Determine if a value is selected. Adjust this logic if your default value is not ""
    const shouldFloat = value !== '';

    return (
        <div className={`${className}`}>
            <div className="relative">
                <select
                    id={id}
                    value={value}
                    onChange={onChange}
                    {...props}
                    className={`mt-2 block appearance-none w-full px-3 py-2 rounded-md transition-all
                        border ${error ? 'border-red-500' : 'border-gray-300'}
                        focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'}
                        bg-white`}
                >
                    {children}
                </select>
                {label && (
                    <label htmlFor={id}
                        className={`absolute left-3 transition-all bg-white px-1 pointer-events-none
                        ${shouldFloat
                                ? `top-[-10px] text-xs ${error ? 'text-red-500' : 'text-blue-500'}`
                                : 'top-2 text-base text-gray-500'
                            }`}
                    >
                        {label}
                    </label>
                )}
                {/* Optional: Custom arrow icon */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" clipRule="evenodd"
                            d="M10 3a1 1 0 01.832.445l5 7a1 1 0 01-.832 1.555H5a1 1 0 01-.832-1.555l5-7A1 1 0 0110 3zm0 11a1 1 0 00.832-.445l5-7a1 1 0 10-1.664-1.11L10 11.89 5.832 5.445a1 1 0 10-1.664 1.11l5 7A1 1 0 0010 14z"
                        />
                    </svg>
                </div>
            </div>
            {error && error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};

export default SelectField;
