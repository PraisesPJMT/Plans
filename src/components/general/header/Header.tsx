import { useEffect, useState } from "react";
import { SiGoogletasks } from "react-icons/si";

import styles from "./Header.module.css";

const Header = () => {
  const THEMES = {
    DARK: "dark",
    LIGHT: "light",
    AUTO: "auto",
  };

  const [theme, setTheme] = useState(document.body?.dataset?.theme || "dark");

  useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <SiGoogletasks />
        Plans
      </div>

      <div>
        <button
          type="button"
          onClick={() => {
            if (theme === THEMES.DARK) {
              setTheme(THEMES.LIGHT);
            } else {
              setTheme(THEMES.DARK);
            }
          }}
        >
          {theme === "dark" ? "☀️ Light Mode" : "🌑 Dark Mode"}
        </button>
      </div>
    </header>
  );
};

export default Header;
