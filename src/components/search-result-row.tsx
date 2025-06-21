import { useEffect, useState } from "react";
import * as styles from "../css/search-result-row.module.css";
import { useKeyPress } from "../hooks/useKeyPress";

import defaultFavicon from "../../icons/q-mark.svg";

type ResultType = "tab" | "bookmark" | "search";

type Props = {
  favIconUrl?: string;
  title: string;
  url: string;
  tabindex: number;
  onChange: () => Promise<void>;
  isSelected: boolean;
  resultType: ResultType;
};

export const SearchResultRow = ({
  favIconUrl,
  title,
  url,
  tabindex,
  onChange,
  isSelected,
  resultType = "tab",
}: Props) => {
  const isEnterPressed = useKeyPress("Enter");
  const [favIconImageError, setFavIconImageError] = useState(false);

  useEffect(() => {
    if (isEnterPressed && isSelected) {
      onChange();
    }
  }, [isEnterPressed]);

  useEffect(() => {
    setFavIconImageError(false);
  }, [favIconUrl]);

  const getIcon = () => {
    if (favIconUrl && !favIconImageError) {
      return (
        <img
          src={favIconUrl}
          width={20}
          height={20}
          alt=""
          onError={() => setFavIconImageError(true)} // best way to check if a iconUrl is valid by loading an <img /> with it and checking if it fails
        />
      );
    }

    return <div className={styles.bookmarkIcon}>📄</div>;
  };

  const getActionText = () => {
    switch (resultType) {
      case "tab":
        return "Switch to tab";
      case "bookmark":
        return "Open bookmark";
      case "search":
        return "Search web";
      default:
        return "Open";
    }
  };

  return (
    <div
      className={`result-item ${styles.resultItem} ${
        isSelected ? `${styles.selected} is-selected` : ""
      }`}
      onClick={() => onChange()}
      tabindex={tabindex}
    >
      <div className={styles.favicon}>
        <div className={styles.faviconWrapper}>{getIcon()}</div>
      </div>
      <div className={styles.title}>
        <div className={styles.titleAndUrl}>
          <h4 className={styles.title_header}>
            {resultType === "search" ? "Search for " + title : title}
          </h4>
          <p className={styles.title_description}>{url}</p>
        </div>

        {isSelected && <p className={styles.switchTab}>{getActionText()}</p>}
      </div>
    </div>
  );
};
