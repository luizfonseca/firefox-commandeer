import { useEffect, useState } from "react";
import * as searchResults from "../css/search-results.module.css";
import { Tab } from "./tab";

export default function SearchResults({
  tabs,
  onChange,
  activeTabIndex,
  searchTerm,
  resultsRef,
}: {
  tabs: browser.tabs.Tab[];
  onChange: (tab: browser.tabs.Tab) => Promise<void>;
  activeTabIndex: number;
  searchTerm: string;
  resultsRef: React.RefObject<HTMLDivElement>;
}) {
  const [currentSearchEngine, setCurrentSearchEngine] = useState("Google");

  const triggerSearch = async (term: string) => {
    await browser.search.query({ text: term, disposition: "NEW_TAB" });
    window.close();
  };

  const findDefaultEngine = async () => {
    const engines = await browser.search.get();
    const defaultEngine = engines.find((e) => e.isDefault);
    if (defaultEngine) {
      setCurrentSearchEngine(defaultEngine.name);
    }
  };

  useEffect(() => {
    findDefaultEngine();
  }, []);

  return (
    <div
      id="search-results"
      className={searchResults.searchResults}
      ref={resultsRef}
    >
      {tabs.map((tab, index) => {
        return (
          <Tab
            tab={tab}
            isSelected={index === activeTabIndex}
            tabindex={index + 1}
            key={index}
            onChange={onChange}
            resultType="tab"
          />
        );
      })}

      {searchTerm !== "" && (
        <div className={searchResults.noResults}>
          <Tab
            // @ts-ignore -- expected to mismatch
            tab={{
              title: "Search for " + searchTerm,
              url: `${currentSearchEngine}: "${searchTerm}"`,
            }}
            isSelected={tabs.length + 1 === activeTabIndex}
            tabindex={tabs.length + 1}
            resultType="search"
            onChange={() => triggerSearch(searchTerm)}
          />
        </div>
      )}
    </div>
  );
}
