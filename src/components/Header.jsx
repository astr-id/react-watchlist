import React from "react";
import styles from "../styles/Header.module.scss";
import { Search, Heart } from "lucide-react";

const Header = ({ searchQuery, setSearchQuery }) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.headerBrand}>
          <Heart className={styles.headerIcon} />
          <h1 className={styles.headerTitle}>Astr-id</h1>
        </div>

        <div className={styles.headerSearch}>
          <div className={styles.searchInputWrapper}>
            <Search className={styles.searchIcon} />
            <input
              type="search"
              placeholder="Search your watchlist..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
