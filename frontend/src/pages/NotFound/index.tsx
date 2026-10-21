import { useNavigate } from "react-router-dom";

import styles from "./NotFound.module.scss";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <h1>404</h1>

        <h2>Page not found</h2>

        <p>The page you are looking for does not exist.</p>

        <button type="button" onClick={() => navigate("/")}>
          Go to home
        </button>
      </div>
    </main>
  );
};

export default NotFound;
