import React from 'react';
import './Form.css'; 

const Form = ({ id, type = 'text', value, onChange, placeholder, className }) => {
  return (
    <div className={`input-group ${className}`}>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-input"
      />
    </div>
  );
};

export default Form;
