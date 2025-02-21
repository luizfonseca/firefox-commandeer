import { createRoot } from "preact/compat/client";
import { App } from "./App";

const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const html = document.getElementsByTagName("html")[0];
html.classList.add(isDark ? "dark" : "light");

const container = document.getElementById("app");

const root = createRoot(container);
root.render(<App />);
