import React from "react";
import { Heart, Play, Clock, CheckCircle, Star } from "lucide-react";
import styles from "../styles/WatchCard.module.scss";
import AddModal from "./AddModal";
import { toCamelCase } from "../utils/toCamelCase";

const WatchCard = ({ item, onUpdateItem }) => {
  const getStatusIcon = (status) => {
    const iconClass = styles.icon;

    switch (status) {
      case "want-to-watch":
        return <Heart className={`${iconClass} ${styles.pink}`} />;
      case "currently-watching":
        return <Play className={`${iconClass} ${styles.blue}`} />;
      case "waiting-for":
        return <Clock className={`${iconClass} ${styles.orange}`} />;
      case "completed":
        return <CheckCircle className={`${iconClass} ${styles.green}`} />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "want-to-watch":
        return "Want to Watch";
      case "currently-watching":
        return "Currently Watching";
      case "waiting-for":
        return "Waiting For";
      case "completed":
        return "Completed";
      default:
        return "";
    }
  };

  return (
    <div className={styles.watchCard}>
      <div className={styles.imageWrapper}>
        <img src={item.image} alt={item.title} />
        <div
          className={`${styles.statusBadge} ${
            styles[toCamelCase(item.status)]
          }`}
        >
          {getStatusIcon(item.status)}
          <span>{getStatusLabel(item.status)}</span>
        </div>
      </div>

      <div className={styles.watchCardHeader}>
        <div className={styles.topRow}>
          <h3 title={item.title}>{item.title}</h3>
          {item.rating && (
            <div className={styles.rating}>
              <Star className={styles.starIcon} />
              <span>{item.rating}</span>
            </div>
          )}
        </div>
        <div className={styles.meta}>
          <span className={styles.tag}>{item.type}</span>
          {item.year && <span className={styles.tag}>{item.year}</span>}
        </div>
      </div>
      <div className={styles.watchCardBody}>
        <div className={styles.episodes}>
          {item.currentEpisode && item.season ? (
            <>
              <span>Episodes {item.currentEpisode || 0} </span>
              <span>Season {item.season || 0}</span>
            </>
          ) : null}
        </div>
      </div>

      <div className={styles.watchCardFooter}>
        <AddModal itemToEdit={item} onUpdateItem={onUpdateItem} />
      </div>
    </div>
  );
};

export default WatchCard;
