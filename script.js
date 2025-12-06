// Map notes to audio files (make sure these names match your sounds folder)
const soundMap = {
  do: new Audio("sounds/do.mp3"),
  re: new Audio("sounds/re.mp3"),
  mi: new Audio("sounds/mi.mp3"),
  fa: new Audio("sounds/fa.mp3"),
  so: new Audio("sounds/so.mp3"),
  la: new Audio("sounds/la.mp3"),
  ti: new Audio("sounds/ti.mp3"),
  "do-high": new Audio("sounds/do-high.mp3"),
};

const buttons = document.querySelectorAll(".sound-btn");
const volumeSlider = document.getElementById("volumeSlider");
const muteBtn = document.getElementById("muteBtn");

let isMuted = false;
let lastVolume = volumeSlider.value;

// set volume for all notes
function setAllVolumes(volume) {
  Object.values(soundMap).forEach((audio) => {
    audio.volume = volume;
  });
}

setAllVolumes(parseFloat(volumeSlider.value));

// helper: play by key (used for buttons, and easy to reuse if you add keyboard later)
function playNote(key, buttonEl) {
  const audio = soundMap[key];
  if (!audio) return;

  audio.currentTime = 0;

  if (!isMuted) {
    audio.volume = parseFloat(volumeSlider.value);
  } else {
    audio.volume = 0;
  }

  // visual flash on button
  if (buttonEl) {
    buttonEl.classList.add("playing");
    setTimeout(() => buttonEl.classList.remove("playing"), 120);
  }

  audio.play().catch((err) => {
    console.error("Audio play blocked or failed:", err);
  });
}

// click listeners
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const soundKey = btn.getAttribute("data-sound");
    playNote(soundKey, btn);
  });
});

// volume control
volumeSlider.addEventListener("input", () => {
  const volume = parseFloat(volumeSlider.value);
  if (!isMuted) {
    setAllVolumes(volume);
  }
  lastVolume = volume;
});

// mute toggle
muteBtn.addEventListener("click", () => {
  isMuted = !isMuted;

  if (isMuted) {
    setAllVolumes(0);
    muteBtn.classList.add("muted");
    muteBtn.querySelector(".mute-icon").textContent = "🔇";
    muteBtn.querySelector(".mute-text").textContent = "Muted";
  } else {
    setAllVolumes(parseFloat(lastVolume || 0.8));
    muteBtn.classList.remove("muted");
    muteBtn.querySelector(".mute-icon").textContent = "🔊";
    muteBtn.querySelector(".mute-text").textContent = "On";
  }
});

// --- Keyboard support: number keys 1–8 play notes ---

document.addEventListener("keydown", (e) => {
  const key = e.key;

  const keyboardMap = {
    "1": "do",
    "2": "re",
    "3": "mi",
    "4": "fa",
    "5": "so",
    "6": "la",
    "7": "ti",
    "8": "do-high",
  };

  const soundKey = keyboardMap[key];
  if (!soundKey) return;

  // find the button for animation
  const btn = document.querySelector(`[data-sound="${soundKey}"]`);

  playNote(soundKey, btn);
});

