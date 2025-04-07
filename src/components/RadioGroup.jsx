import React from "react";
import styles from "../styles/RadioGroup.module.scss";

const RadioGroup = ({ options, selectedValue, onChange }) => {
  return (
    <div className={styles.radioGroup}>
      {options.map((option) => (
        <label key={option} className={styles.radioLabel}>
          <input
            type="radio"
            value={option}
            checked={selectedValue === option}
            onChange={() => onChange(option)}
          />
          <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
        </label>
      ))}
    </div>
  );
};

export default RadioGroup;
