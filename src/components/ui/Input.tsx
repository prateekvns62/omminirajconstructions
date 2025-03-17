import React from 'react';

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return <input {...props} className="border p-2 rounded-md w-full" />;
};

export default Input;
