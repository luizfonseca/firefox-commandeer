import { useCallback, useEffect, useRef, useState } from "react";
import SearchResultsList from "./components/search-results-list";
import * as footer from "./css/footer.module.css";
import * as searchInput from "./css/search-input.module.css";
import "./global.css";
import { useDebounce } from "./hooks/useDebounce";
import { useKeyPress } from "./hooks/useKeyPress";

type SearchResult = {
  type: "tab" | "bookmark";
  favIconUrl?: string;
  title: string;
  url: string;
  tabId?: number; // Only for actual tabs
  originalData?: browser.bookmarks.BookmarkTreeNode; // Only for bookmarks
};

export function App() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [platform, setPlatform] = useState<browser.runtime.PlatformOs>("mac");
  const [search, setSearch] = useState<string>("");
  const [tabs, setTabs] = useState<SearchResult[]>([]);

  const resultsListref = useRef<HTMLDivElement>(null);

  const debouncedTerm = useDebounce(search, 150);
  const arrowDownPressed = useKeyPress("ArrowDown");
  const arrowUpPressed = useKeyPress("ArrowUp");

  const getAllBookmarks = async (): Promise<
    browser.bookmarks.BookmarkTreeNode[]
  > => {
    const bookmarkTree = await browser.bookmarks.getTree();
    const bookmarks: browser.bookmarks.BookmarkTreeNode[] = [];

    const traverse = (nodes: browser.bookmarks.BookmarkTreeNode[]) => {
      for (const node of nodes) {
        if (node.url) {
          // Only include actual bookmarks (not folders)
          bookmarks.push(node);
        }
        if (node.children) {
          traverse(node.children);
        }
      }
    };

    traverse(bookmarkTree);
    return bookmarks;
  };

  const getFaviconUrl = (url: string): string | undefined => {
    if (!url) return undefined;

    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`;
    } catch {
      return undefined;
    }
  };

  const getInitialTabs = async () => {
    const [browserTabs, bookmarks] = await Promise.all([
      browser.tabs.query({}),
      getAllBookmarks(),
    ]);

    // Convert tabs to SearchResult format
    const tabResults: SearchResult[] = browserTabs.map((tab) => ({
      type: "tab",
      favIconUrl: tab.favIconUrl,
      title: tab.title || "Untitled",
      url: tab.url || "",
      tabId: tab.id,
    }));

    const bookmarkResults: SearchResult[] = bookmarks.map((bookmark) => ({
      type: "bookmark",
      favIconUrl: getFaviconUrl(bookmark.url || ""),
      title: bookmark.title || "Untitled",
      url: bookmark.url || "",
      originalData: bookmark,
    }));

    setTabs([...tabResults, ...bookmarkResults]);
  };

  const activateTab = async (result: SearchResult) => {
    if (result.type === "tab" && result.tabId) {
      await browser.tabs.update(result.tabId, { active: true });
    } else if (result.type === "bookmark") {
      await browser.tabs.create({ url: result.url });
    }

    if (window) {
      window.close();
    }
  };

  const searchTabs = async (term: string) => {
    const [allTabs, allBookmarks] = await Promise.all([
      browser.tabs.query({}),
      getAllBookmarks(),
    ]);

    const lowerTerm = term.toLowerCase();

    const filteredTabs = allTabs.filter(
      (tab) =>
        tab?.title?.toLowerCase().includes(lowerTerm) ||
        tab?.url?.toLowerCase().includes(lowerTerm)
    );

    const filteredBookmarks = allBookmarks.filter(
      (bookmark) =>
        bookmark?.title?.toLowerCase().includes(lowerTerm) ||
        bookmark?.url?.toLowerCase().includes(lowerTerm)
    );

    // Convert to SearchResult format
    const tabResults: SearchResult[] = filteredTabs.map((tab) => ({
      type: "tab",
      favIconUrl: tab.favIconUrl,
      title: tab.title || "Untitled",
      url: tab.url || "",
      tabId: tab.id,
    }));

    const bookmarkResults: SearchResult[] = filteredBookmarks.map(
      (bookmark) => ({
        type: "bookmark",
        favIconUrl: getFaviconUrl(bookmark.url || ""),
        title: bookmark.title || "Untitled",
        url: bookmark.url || "",
        originalData: bookmark,
      })
    );

    setTabs([...tabResults, ...bookmarkResults]);
  };

  const scrollItemIntoView = () => {
    if (resultsListref.current) {
      const selectedTab = resultsListref.current.querySelector(
        ".result-item.is-selected"
      );
      selectedTab?.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }
  };

  const setCurrentPlatform = useCallback(async () => {
    const platform = await browser.runtime.getPlatformInfo();

    setPlatform(platform.os);
  }, []);

  useEffect(() => {
    getInitialTabs();
    setCurrentPlatform();
  }, []);

  useEffect(() => {
    if (debouncedTerm.length > 0) {
      searchTabs(debouncedTerm);
    } else {
      getInitialTabs();
    }
  }, [debouncedTerm]);

  useEffect(() => {
    if (arrowDownPressed) {
      setActiveTabIndex((activeTabIndex + 1) % tabs.length);
      scrollItemIntoView();
    }
  }, [arrowDownPressed]);

  useEffect(() => {
    if (arrowUpPressed) {
      setActiveTabIndex((activeTabIndex - 1 + tabs.length) % tabs.length);
      scrollItemIntoView();
    }
  }, [arrowUpPressed]);

  useEffect(() => {
    if (tabs.length > 0) {
      setActiveTabIndex(0);
    }
  }, [tabs]);

  return (
    <div className="main-container">
      <div className="group-input">
        <input
          className={searchInput}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          autofocus
          type="text"
          placeholder="Search tabs, bookmarks, history, downloads and more..."
        />

        <hr />
      </div>

      <div className="group-search">
        <SearchResultsList
          tabs={tabs}
          activeTabIndex={activeTabIndex}
          onChange={activateTab}
          searchTerm={search}
          resultsRef={resultsListref}
        />
      </div>

      <div className={`group-footer ${footer.footer}`}>
        <div className={footer.command}>
          <span className={footer.shortcutDescription}>navigate</span>
          <span className={footer.shortcut}>&uarr;</span>
          <span className={footer.shortcut}>&darr;</span>
        </div>

        <div className={footer.command}>
          <span className={footer.shortcutDescription}>select item</span>
          <span className={footer.shortcut}>enter</span>
        </div>
        <div className={footer.command}>
          <span className={footer.shortcutDescription}>open extension</span>
          <span className={footer.shortcut}>
            {platform === "mac" ? "CMD" : "CTRL"}
          </span>
          <span className={footer.shortcut}>Shift</span>
          <span className={footer.shortcut}>0</span>
        </div>
      </div>
    </div>
  );
}
