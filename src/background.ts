// Manifest commands
const BROWSER_COMMANDS = {
  TOGGLE_SEARCH_BAR: "_toggle-command-bar",
};

/** Listener for registered manifest commands */
browser.commands.onCommand.addListener(async (command) => {
  if (command === BROWSER_COMMANDS.TOGGLE_SEARCH_BAR) {
    browser.action.openPopup();
  }
});
