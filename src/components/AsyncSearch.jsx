import React from "react";
import AsyncSelect from "react-select/async";
import styles from "../styles/AsyncSearch.module.scss";

const AsyncSearch = ({
  loadOptions,
  onSelect,
  placeholder = "Start typing...",
}) => {
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    fontSize: "0.95rem",
    border: `1px solid ${state.isFocused ? "#FF69B4" : "#ccc"}`,
    borderRadius: "1rem",
    transition: "border-color 0.3s, box-shadow 0.3s",
    boxShadow: state.isFocused
      ? "0 0 4px rgba(255, 105, 180, 0.5)"
      : "none",
    "&:hover": {
      borderColor: "#FF69B4",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "var(--text-color)",
    fontSize: "0.95rem",
    fontStyle: "italic",
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 999,
    borderRadius: "1rem",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#fff",
    transition: "box-shadow 0.3s ease-in-out",
  }),
  option: (provided, state) => ({
    ...provided,
    fontSize: "0.95rem",
    color: "var(--text-color)",
    padding: "8px 12px",
    borderRadius: "0.5rem",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "var(--text-color)",
    fontSize: "0.95rem",
  }),
};

  return (
    <div className={styles.asyncSearch}>
      <AsyncSelect
        cacheOptions
        loadOptions={loadOptions}
        defaultOptions={false}
        onChange={(selectedOption) => onSelect(selectedOption.raw)}
        placeholder={placeholder}
        className={styles.inputSelect} 
        styles={customStyles}
      />
    </div>
  );
};

export default AsyncSearch;
