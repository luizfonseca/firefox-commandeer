import { useCallback, useEffect, useRef, useState } from "react";
import SearchResults from "./components/search-results";
import * as footer from "./css/footer.module.css";
import * as searchInput from "./css/search-input.module.css";
import "./global.css";
import { useDebounce } from "./hooks/useDebounce";
import { useKeyPress } from "./hooks/useKeyPress";

export function App() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [platform, setPlatform] = useState<browser.runtime.PlatformOs>("mac");
  const [search, setSearch] = useState<string>("");
  const [tabs, setTabs] = useState<browser.tabs.Tab[]>([]);

  const resultsListref = useRef<HTMLDivElement>(null);

  const debouncedTerm = useDebounce(search, 150);
  const arrowDownPressed = useKeyPress("ArrowDown");
  const arrowUpPressed = useKeyPress("ArrowUp");

  const getInitialTabs = async () => {
    const tabs = await browser.tabs.query({});
    setTabs(tabs);
  };

  const activateTab = async (tab: browser.tabs.Tab) => {
    if (!tab.id) {
      return;
    }

    await browser.tabs.update(tab.id, { active: true });

    if (window) {
      window.close();
    }
  };

  const searchTabs = async (term: string) => {
    const allTabs = await browser.tabs.query({});

    // Normalize input to prevent uppercase/lowercase differences
    // filter tabs that match the input and/or url
    const filteredTabs = allTabs.filter(
      (tab) =>
        tab?.title?.toLowerCase().includes(term.toLowerCase()) ||
        tab?.url?.toLowerCase().includes(term.toLowerCase()),
    );

    setTabs(filteredTabs);
  };

  const scrollItemIntoView = () => {
    if (resultsListref.current) {
      const selectedTab = resultsListref.current.querySelector(
        ".result-item.is-selected",
      );
      selectedTab.scrollIntoView({
        block: "start",
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
        <SearchResults
          tabs={tabs}
          activeTabIndex={activeTabIndex}
          onChange={activateTab}
          searchTerm={search}
          resultsRef={resultsListref}
        />
      </div>

      <div className={`group-footer ${footer.footer}`}>
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
