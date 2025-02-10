const InputField = ({ id, label, type = 'text', className = '', value, onChange, error = false, ...props }) => {
    return (
        <div className="">
            <div className="relative">
                <input id={id} {...props} type={type} value={value} onChange={onChange} placeholder={'\u00A0'}
                    className={`mt-2 ${className} peer block w-full px-3 py-2 rounded-md transition-all border ${error ? 'border-red-500' : 'border-gray-300'} 
                        focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'}`} />
                {label && (
                    <label htmlFor={id}
                        className={`absolute left-3 top-2 text-gray-500 transition-all bg-white px-1 peer-placeholder-shown:top-2 peer-placeholder-shown:text-base 
                            peer-focus:top-[-10px] peer-focus:text-xs ${error ? 'peer-focus:text-red-500' : 'peer-focus:text-blue-500'} `}>
                        {label}
                    </label>
                )}
            </div>
            {error && (<p className="mt-1 text-sm text-red-500">{error}</p>)}
            <style jsx>{`
                input:not(:placeholder-shown) + label { top: -10px; font-size: 0.75rem; color: ${error ? '#ef4444' : '#3b82f6'}; }
            `}</style>
        </div>
    );
};

export default InputField;
