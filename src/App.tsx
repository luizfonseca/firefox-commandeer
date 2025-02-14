import { useEffect, useState } from "react";
import SearchResults from "./components/search-results";
import * as searchInput from "./css/search-input.module.css";
import "./global.css";
import { useKeyPress } from "./hooks/useKeyPress";

export function App() {
  const [search, setSearch] = useState("");
  const [tabs, setTabs] = useState<browser.tabs.Tab[]>([]);

  const arrowDownPressed = useKeyPress("ArrowDown");
  const arrowUpPressed = useKeyPress("ArrowUp");

  const [activeTabIndex, setActiveTabIndex] = useState(0);

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

  useEffect(() => {
    getInitialTabs();
  }, []);

  useEffect(() => {
    if (search.length > 0) {
      searchTabs(search);
    } else {
      getInitialTabs();
    }
  }, [search]);

  useEffect(() => {
    if (arrowDownPressed) {
      setActiveTabIndex((activeTabIndex + 1) % tabs.length);
    }
  }, [arrowDownPressed]);

  useEffect(() => {
    if (arrowUpPressed) {
      setActiveTabIndex((activeTabIndex - 1 + tabs.length) % tabs.length);
    }
  }, [arrowUpPressed]);

  useEffect(() => {
    if (tabs.length > 0) {
      setActiveTabIndex(0);
    }
  }, [tabs]);

  return (
    <div className="main-container">
      <input
        className={searchInput}
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        autofocus
        type="text"
        placeholder="Search tabs, bookmarks, history, downloads and more..."
      />

      <hr />

      <SearchResults
        tabs={tabs}
        activeTabIndex={activeTabIndex}
        onChange={activateTab}
        searchTerm={search}
      />
    </div>
  );
}
