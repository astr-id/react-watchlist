import React from "react";
import styles from "../styles/InputField.module.scss";

const InputField = ({ label, type, value, onChange, placeholder, options }) => {
  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>{label}</label>
      {type === "select" ? (
        <select
          value={value}
          onChange={onChange}
          className={styles.select}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          className={styles.input}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default InputField;
