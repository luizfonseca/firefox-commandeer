import { useEffect } from "react";
import * as tabItem from "../css/tab-item.module.css";
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

  useEffect(() => {
    if (isEnterPressed && isSelected) {
      onChange();
    }
  }, [isEnterPressed]);

  const getIcon = () => {
    if (favIconUrl) {
      return <img src={favIconUrl} width={20} height={20} alt="favicon" />;
    }

    if (resultType === "bookmark") {
      return <div className={tabItem.bookmarkIcon}>📄</div>;
    }

    return <img src={defaultFavicon} width={20} height={20} alt="ico" />;
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
      className={`result-item ${tabItem.tabItem} ${
        isSelected ? `${tabItem.selected} is-selected` : ""
      }`}
      onClick={() => onChange()}
      tabindex={tabindex}
    >
      <div className={tabItem.favicon}>
        <div className={tabItem.faviconWrapper}>{getIcon()}</div>
      </div>
      <div className={tabItem.title}>
        <h4 className={tabItem.title_header}>
          {resultType === "bookmark" && (
            <span className={tabItem.resultTypeIndicator}>📄 </span>
          )}
          {title}
        </h4>
        <p className={tabItem.title_description}>{url}</p>

        {isSelected && <p className={tabItem.switchTab}>{getActionText()}</p>}
      </div>
    </div>
  );
};
