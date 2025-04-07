import React from "react";
import AsyncSelect from "react-select/async";
import styles from "../styles/AsyncSearch.module.scss";

const AsyncSearch = ({
  loadOptions,
  onSelect,
  placeholder = "Start typing...",
}) => {
  return (
    <div className={styles.asyncSearch}>
      <AsyncSelect
        cacheOptions
        loadOptions={loadOptions}
        defaultOptions={false}
        onChange={(selectedOption) => onSelect(selectedOption.raw)}
        placeholder={placeholder}
        className={styles.inputSelect}
      />
    </div>
  );
};

export default AsyncSearch;
