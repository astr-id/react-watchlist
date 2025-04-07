import React, { useState, useEffect } from "react";
import styles from "../styles/Home.module.scss";
import Header from "../components/Header";
import WatchlistSection from "../components/WatchlistSection";

function Index() {
  const LOCAL_STORAGE_KEY = "watchlist";
  const [watchItems, setWatchItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const storedItems = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (storedItems) {
      try {
        const parsedItems = JSON.parse(storedItems);
        if (Array.isArray(parsedItems)) {
          setWatchItems(parsedItems);
        } else {
          setWatchItems([]);
        }
      } catch (error) {
        setWatchItems([]);
      }
    }
  }, []);

  useEffect(() => {
    if (watchItems.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(watchItems));
    }
  }, [watchItems]);

  const handleAddItem = (newItem) => {
    setWatchItems((prev) => [...prev, newItem]);
  };

  const handleUpdateItem = (updatedItem) => {
    setWatchItems((prevList) =>
      prevList.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  return (
    <div className={styles.homeContainer}>
      <div className={styles.homeContent}>
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <main className={styles.mainContent}>
          <WatchlistSection
            items={watchItems}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            searchQuery={searchQuery}
          />
        </main>
      </div>
    </div>
  );
}

export default Index;
