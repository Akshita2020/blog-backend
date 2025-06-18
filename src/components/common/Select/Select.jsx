import React from 'react';

const Select = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  error,
  className = '',
  ...props
}) => {
  const baseClasses =
    'block w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none transition-colors';
  const errorClasses = error ? 'border-red-500' : 'border-gray-300';

  const classes = `${baseClasses} ${errorClasses} ${className}`;

  return (
    <select value={value} onChange={onChange} className={classes} {...props}>
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
