import React from "react";

type InputProps = {
  type: string;
  placeholder: string;
};

const Input: React.FC<InputProps> = ({ type, placeholder }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  );
};

export default Input;