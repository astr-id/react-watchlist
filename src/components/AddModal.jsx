import React, { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import styles from "../styles/AddModal.module.scss";

const DEFAULT_IMAGES =
  "https://cdn.pixabay.com/photo/2017/11/10/04/47/image-2935360_1280.png";

const AddModal = ({ onAddItem, itemToEdit, onUpdateItem }) => {
  const OMDB_API_KEY = import.meta.env.VITE_OMDB_KEY;

  const [open, setOpen] = useState(false);
  const [type, setType] = useState(itemToEdit?.type || "anime");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(itemToEdit || null);
  const [status, setStatus] = useState(itemToEdit?.status || "want-to-watch");
  const [episodesCurrent, setEpisodesCurrent] = useState(
    itemToEdit?.episodes?.current || ""
  );
  const [season, setSeason] = useState(itemToEdit?.season || ""); // Add season state
  const disabled = !selected && !itemToEdit && !query;

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(() => {
      if (type === "anime") {
        fetch(`https://api.jikan.moe/v4/anime?q=${query}`)
          .then((res) => res.json())
          .then((data) => setResults(data.data || []))
          .catch((error) => {
            console.error("Error fetching anime:", error);
            toast.error("Failed to fetch anime results.");
          });
      } else {
        fetch(
          `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${query}&type=${
            type === "movie" ? "movie" : "series"
          }`
        )
          .then((res) => res.json())
          .then((data) => setResults(data.Search || []))
          .catch((error) => {
            console.error("Error fetching movie/series:", error);
            toast.error("Failed to fetch movie/series results.");
          });
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [query, type]);

  const handleSelect = async (item) => {
    if (type === "anime") {
      const res = await fetch(`https://api.jikan.moe/v4/anime/${item.mal_id}`);
      const data = await res.json();
      const anime = data.data;

      setSelected({
        title: anime.title,
        image: anime.images?.jpg?.image_url || DEFAULT_IMAGES,
        year: anime.year,
        rating: anime.score,
      });
    } else {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${item.imdbID}`
      );
      const movie = await res.json();

      setSelected({
        title: movie.Title,
        image: movie.Poster !== "N/A" ? movie.Poster : DEFAULT_IMAGES,
        year: movie.Year,
        rating: parseFloat(movie.imdbRating) || null,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selected) {
      toast.error("Please select a title from search.");
      return;
    }

    const newItem = {
      ...selected,
      type,
      status,
      currentEpisode: episodesCurrent || "0",
      season: season || "", // Ensure the season is included
    };

    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

    if (!itemToEdit) {
      newItem.id = watchlist.length
        ? watchlist[watchlist.length - 1].id + 1
        : 1;
      watchlist.push(newItem);
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
      onAddItem(newItem);
      toast.success("Added to your watchlist!");
    } else {
      newItem.id = itemToEdit.id;
      const updatedList = watchlist.map((item) =>
        item.id === itemToEdit.id ? newItem : item
      );
      localStorage.setItem("watchlist", JSON.stringify(updatedList));
      onUpdateItem(newItem);
      toast.success("Item updated!");
    }

    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setQuery("");
    setSelected(null);
    setStatus("want-to-watch");
    setEpisodesCurrent("");
    setSeason(""); // Reset season as well
    setType("anime");
    setResults([]);
  };

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className={itemToEdit ? styles.updateBtn : styles.addBtn}
      >
        {itemToEdit ? (
          "Edit"
        ) : (
          <>
            <PlusCircle className={styles.addNewIcon} />
            Add New
          </>
        )}
      </button>

      {open && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>
              {itemToEdit ? `Edit ${itemToEdit.title}` : "Add to Watchlist"}
            </h2>
            <p className={styles.modalDescription}>
              {itemToEdit
                ? `Update ${itemToEdit.title}'s status.`
                : "Add a new anime, series or movie to your watchlist."}
            </p>

            <form>
              {!itemToEdit && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Select Type</label>
                    <div className={styles.radioGroup}>
                      {["anime", "series", "movie"].map((item) => (
                        <label key={item} className={styles.radioLabel}>
                          <input
                            type="radio"
                            value={item}
                            checked={type === item}
                            onChange={() => {
                              setType(item);
                              setSelected(null);
                              setQuery("");
                              setResults([]);
                            }}
                          />
                          <span>
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Search Title</label>
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className={styles.input}
                      placeholder="Start typing..."
                    />
                    {results.length > 0 && (
                      <ul className={styles.searchSuggestions}>
                        {results.map((item) => (
                          <li
                            key={item.mal_id || item.imdbID}
                            onClick={() => handleSelect(item)}
                          >
                            {item.title || item.Title}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </>
              )}

              {selected && (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className={styles.select}
                    >
                      <option value="want-to-watch">Want to Watch</option>
                      <option value="currently-watching">
                        Currently Watching
                      </option>
                      <option value="waiting-for">Waiting For</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  {(type === "anime" || type === "series") && (
                    <>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Current Episode</label>
                        <input
                          type="number"
                          value={episodesCurrent}
                          onChange={(e) => setEpisodesCurrent(e.target.value)}
                          className={styles.input}
                          placeholder="Enter current episode"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.label}>Current Season</label>
                        <input
                          type="number"
                          value={season}
                          onChange={(e) => setSeason(e.target.value)}
                          className={styles.input}
                          placeholder="Enter current season"
                        />
                      </div>
                    </>
                  )}
                </>
              )}

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={disabled}
                  onClick={handleSubmit}
                >
                  {itemToEdit ? "Update Item" : "Add to Watchlist"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddModal;
