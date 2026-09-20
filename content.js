(() => {
  "use strict";

  const DEFAULTS = {
    enabled: true,
    blur: 8,
    revealOnHover: true,
    blurText: true,
    blurImages: true,
    blurVideos: true,
    blurAvatars: true,
    blurNames: true
  };

  let settings = { ...DEFAULTS };

  function updateClassesAndVars() {
    const root = document.documentElement;

    // Set nilai CSS variable blur
    root.style.setProperty("--wa-privacy-blur", `${settings.blur}px`);

    // Toggle class di tag <html> sesuai settings
    const toggleClass = (className, condition) => {
      if (settings.enabled && condition) {
        root.classList.add(className);
      } else {
        root.classList.remove(className);
      }
    };

    toggleClass("wa-privacy-blurText", settings.blurText);
    toggleClass("wa-privacy-blurImages", settings.blurImages);
    toggleClass("wa-privacy-blurVideos", settings.blurVideos);
    toggleClass("wa-privacy-blurAvatars", settings.blurAvatars);
    toggleClass("wa-privacy-blurNames", settings.blurNames);
    toggleClass("wa-privacy-revealOnHover", settings.revealOnHover);
  }

  async function loadSettings() {
    const stored = await chrome.storage.local.get(DEFAULTS);
    settings = { ...DEFAULTS, ...stored };
    updateClassesAndVars();
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;

    for (const [key, change] of Object.entries(changes)) {
      settings[key] = change.newValue;
    }

    updateClassesAndVars();
  });

  // Shortcut Alt + Shift + B
  document.addEventListener("keydown", async (event) => {
    if (event.altKey && event.shiftKey && event.code === "KeyB") {
      settings.enabled = !settings.enabled;

      await chrome.storage.local.set({
        enabled: settings.enabled
      });

      updateClassesAndVars();
    }
  });

  loadSettings();
})();