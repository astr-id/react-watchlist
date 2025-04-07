import React from "react";
import styles from "../styles/InputField.module.scss";

const InputField = ({ label, type = "text", value, onChange, placeholder }) => {
  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={styles.input}
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputField;
