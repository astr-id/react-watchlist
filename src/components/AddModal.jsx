import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import styles from "../styles/AddModal.module.scss";
import InputField from "./InputField";
import RadioGroup from "./RadioGroup";
import AsyncSearch from "./AsyncSearch";

const DEFAULT_IMAGES =
  "https://cdn.pixabay.com/photo/2017/11/10/04/47/image-2935360_1280.png";

const AddModal = ({ onAddItem, itemToEdit, onUpdateItem }) => {
  const OMDB_API_KEY = import.meta.env.VITE_OMDB_KEY;

  const [open, setOpen] = useState(false);
  const [type, setType] = useState(itemToEdit?.type || "anime");
  const [selected, setSelected] = useState(itemToEdit || null);
  const [status, setStatus] = useState(itemToEdit?.status || "want-to-watch");
  const [episodesCurrent, setEpisodesCurrent] = useState(
    itemToEdit?.episodes?.current || ""
  );
  const [season, setSeason] = useState(itemToEdit?.season || "");
  const disabled = !selected && !itemToEdit;

  const loadOptions = async (inputValue) => {
    if (inputValue.length < 3) return [];

    try {
      if (type === "anime") {
        const res = await fetch(
          `https://api.jikan.moe/v4/anime?q=${inputValue}`
        );
        const data = await res.json();
        return data.data.map((item) => ({
          value: item.mal_id,
          label: item.title,
          raw: item,
        }));
      } else {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${inputValue}&type=${
            type === "movie" ? "movie" : "series"
          }`
        );
        const data = await res.json();
        if (!data.Search) return [];
        return data.Search.map((item) => ({
          value: item.imdbID,
          label: item.Title,
          raw: item,
        }));
      }
    } catch (error) {
      console.error("Error loading options:", error);
      toast.error("Failed to fetch search results.");
      return [];
    }
  };

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
      season: season || "",
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
    setSelected(null);
    setStatus("want-to-watch");
    setEpisodesCurrent("");
    setSeason("");
    setType("anime");
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
                    <RadioGroup
                      options={["anime", "series", "movie"]}
                      selectedValue={type}
                      onChange={(value) => {
                        setType(value);
                        setSelected(null);
                      }}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Search Title</label>
                    <AsyncSearch
                      loadOptions={loadOptions}
                      onSelect={handleSelect}
                      placeholder="Start typing..."
                    />
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
                      <InputField
                        label="Current Episode"
                        type="number"
                        value={episodesCurrent}
                        onChange={(e) => setEpisodesCurrent(e.target.value)}
                        placeholder="Enter current episode"
                      />
                      <InputField
                        label="Current Season"
                        type="number"
                        value={season}
                        onChange={(e) => setSeason(e.target.value)}
                        placeholder="Enter current season"
                      />
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
