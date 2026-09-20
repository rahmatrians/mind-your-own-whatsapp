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

const ids = [
  "enabled",
  "blur",
  "revealOnHover",
  "blurText",
  "blurImages",
  "blurVideos",
  "blurAvatars",
  "blurNames"
];

const elements = {};

ids.forEach((id) => {
  elements[id] = document.getElementById(id);
});

async function load() {
  const settings = await chrome.storage.local.get(DEFAULTS);

  for (const id of ids) {
    if (elements[id].type === "checkbox") {
      elements[id].checked = settings[id];
    } else {
      elements[id].value = settings[id];
    }
  }

  updateUI(settings);
}

async function save() {
  const settings = {
    enabled: elements.enabled.checked,

    blur: Number(elements.blur.value),

    revealOnHover: elements.revealOnHover.checked,

    blurText: elements.blurText.checked,
    blurImages: elements.blurImages.checked,
    blurVideos: elements.blurVideos.checked,
    blurAvatars: elements.blurAvatars.checked,
    blurNames: elements.blurNames.checked
  };

  await chrome.storage.local.set(settings);

  updateUI(settings);
}

function updateUI(settings) {
  document.getElementById("blurValue").textContent =
    `${settings.blur}px`;

  const status = document.getElementById("status");

  if (settings.enabled) {
    status.textContent = "Protection enabled";
    status.classList.remove("disabled");
  } else {
    status.textContent = "Protection disabled";
    status.classList.add("disabled");
  }
}

ids.forEach((id) => {
  elements[id].addEventListener("change", save);
  elements[id].addEventListener("input", save);
});


const manifestData = chrome.runtime.getManifest();
const versionElement = document.querySelector(".version");
if (versionElement) {
  versionElement.textContent = `v${manifestData.version}`;
}

load();
