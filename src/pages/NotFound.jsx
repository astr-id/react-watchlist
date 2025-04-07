import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "../styles/NotFound.module.scss";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error", location.pathname);
  }, [location.pathname]);

  return (
    <div className={styles.errorPage}>
      <div className={styles.errorContent}>
        <h1 className={styles.errorCode}>404</h1>
        <p className={styles.errorMessage}>Oops! Page not found</p>
        <a href="/" className={styles.errorLink}>
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
