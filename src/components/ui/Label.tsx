import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const Label: React.FC<LabelProps> = ({ children, ...props }) => {
  return (
    <label {...props} className="text-sm font-medium text-gray-700">
      {children}
    </label>
  );
};

export default Label;