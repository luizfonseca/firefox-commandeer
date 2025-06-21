import * as searchResults from "../css/search-results.module.css";
import { SearchResultRow } from "./search-result-row";

export type SearchResult = {
  type: "tab" | "bookmark" | "search";
  favIconUrl: string | undefined;
  title: string;
  url: string;
  tabId?: number; // Only for actual tabs
  originalData?: browser.bookmarks.BookmarkTreeNode; // Only for bookmarks
};

export default function SearchResultsList({
  tabs,
  onChange,
  activeTabIndex,
  resultsRef,
}: {
  tabs: SearchResult[];
  onChange: (result: SearchResult) => Promise<void>;
  activeTabIndex: number;
  resultsRef: React.RefObject<HTMLDivElement>;
}) {
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
    </div>
  );
}
