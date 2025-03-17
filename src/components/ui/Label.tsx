import React from 'react';

const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, ...props }) => {
  return (
    <label {...props} className="text-sm font-medium text-gray-700">
      {children}
    </label>
  );
};

export default Label;