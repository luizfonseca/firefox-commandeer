import { useEffect } from "react";
import * as tabItem from "../css/tab-item.module.css";
import { useKeyPress } from "../hooks/useKeyPress";

import defaultFavicon from "../../icons/q-mark.svg";

type ResultType = "tab" | "search";

type Props = {
  tab: browser.tabs.Tab;
  tabindex: number;
  onChange: (tab: browser.tabs.Tab) => Promise<void>;
  isSelected: boolean;
  resultType: ResultType;
};

export const Tab = ({
  tab,
  tabindex,
  onChange,
  isSelected,
  resultType = "tab",
}: Props) => {
  const isEnterPressed = useKeyPress("Enter");

  useEffect(() => {
    if (isEnterPressed && isSelected) {
      onChange(tab);
    }
  }, [isEnterPressed]);

  return (
    <div
      className={`${tabItem.tabItem} ${isSelected ? tabItem.selected : ""}`}
      onClick={() => onChange(tab)}
      tabindex={tabindex}
    >
      <div className={tabItem.favicon}>
        <div className={tabItem.faviconWrapper}>
          {tab.favIconUrl ? (
            <img src={tab.favIconUrl} width={20} height={20} alt="favicon" />
          ) : (
            <img src={defaultFavicon} width={20} height={20} alt="ico" />
          )}
        </div>
      </div>
      <div className={tabItem.title}>
        <h4 className={tabItem.title_header}>{tab.title}</h4>
        <p className={tabItem.title_description}>{tab.url}</p>

        {isSelected && resultType === "tab" && (
          <p className={tabItem.switchTab}>Switch to tab </p>
        )}
      </div>
    </div>
  );
};
