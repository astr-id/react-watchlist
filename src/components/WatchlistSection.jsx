import React, { useState } from "react";
import styles from "../styles/WatchlistSection.module.scss";
import WatchCard from "./WatchCard";
import AddModal from "./AddModal";
import { Heart, Play, Clock, CheckCircle } from "lucide-react";
import { toCamelCase } from "../utils/toCamelCase";

const WatchlistSection = ({ items, onAddItem, onUpdateItem, searchQuery }) => {
  const [activeTab, setActiveTab] = useState("want-to-watch");

  const filteredItems = searchQuery
    ? items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  const filterByStatus = (status) => {
    return filteredItems.filter((item) => item.status === status);
  };

  const getTabClass = (tabName) => {
    return `${styles.tabBtn} ${
      activeTab === tabName ? styles[toCamelCase(tabName)] : ""
    }`;
  };

  return (
    <div className={styles.watchlistSection}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>Your Watchlist</h2>
        <AddModal onAddItem={onAddItem} />
      </div>
      <div>
        <p className={styles.descriptionText}>
          Welcome to your watchlist! Here, you can manage the movies and shows
          you're currently watching, plan to watch, or have already completed.
          <br />
          <br />
          Please note: Your watchlist is stored locally in your browser.
          Clearing your browser data will result in the loss of your watchlist.
          Make sure to back it up if needed!
        </p>
      </div>
      {searchQuery ? (
        <div className={styles.searchResults}>
          <h3>Search Results: {filteredItems.length} items found</h3>
          {filteredItems.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No items match your search. Try refining your query!</p>
            </div>
          ) : (
            <div className={styles.cardGrid}>
              {filteredItems.map((item) => (
                <WatchCard
                  key={item.id}
                  item={item}
                  onUpdateItem={onUpdateItem}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className={styles.tabs}>
          <div className={styles.tabsNav}>
            <button
              className={getTabClass("want-to-watch")}
              onClick={() => setActiveTab("want-to-watch")}
            >
              <Heart size={16} />
              Want to Watch
            </button>
            <button
              className={getTabClass("currently-watching")}
              onClick={() => setActiveTab("currently-watching")}
            >
              <Play size={16} />
              Watching
            </button>
            <button
              className={getTabClass("waiting-for")}
              onClick={() => setActiveTab("waiting-for")}
            >
              <Clock size={16} />
              Waiting For
            </button>
            <button
              className={getTabClass("completed")}
              onClick={() => setActiveTab("completed")}
            >
              <CheckCircle size={16} />
              Completed
            </button>
          </div>

          <div className={styles.tabContent}>
            <div className={styles.cardGrid}>
              {filterByStatus(activeTab).map((item) => (
                <WatchCard
                  key={item.id}
                  item={item}
                  onUpdateItem={onUpdateItem}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchlistSection;
