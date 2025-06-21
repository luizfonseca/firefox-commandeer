import { useEffect, useState } from "react";
import * as searchResults from "../css/search-results.module.css";
import { SearchResultRow } from "./search-result-row";

type SearchResult = {
  type: "tab" | "bookmark";
  favIconUrl?: string;
  title: string;
  url: string;
  tabId?: number; // Only for actual tabs
  originalData?: browser.bookmarks.BookmarkTreeNode; // Only for bookmarks
};

export default function SearchResultsList({
  tabs,
  onChange,
  activeTabIndex,
  searchTerm,
  resultsRef,
}: {
  tabs: SearchResult[];
  onChange: (result: SearchResult) => Promise<void>;
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
      {tabs.map((result, index) => {
        return (
          <SearchResultRow
            favIconUrl={result.favIconUrl}
            title={result.title}
            url={result.url}
            isSelected={index === activeTabIndex}
            tabindex={index + 1}
            key={`${result.type}-${index}`}
            onChange={async () => await onChange(result)}
            resultType={result.type}
          />
        );
      })}

      {searchTerm !== "" && (
        <div className={searchResults.noResults}>
          <SearchResultRow
            title={"Search for " + searchTerm}
            url={`${currentSearchEngine}: "${searchTerm}"`}
            isSelected={tabs.length === activeTabIndex}
            tabindex={tabs.length + 1}
            resultType="search"
            onChange={() => triggerSearch(searchTerm)}
          />
        </div>
      )}
    </div>
  );
}
