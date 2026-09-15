// Logika interfejsu: filtrowanie galerii, podgląd w dialogu,
// status sieci, rejestracja Service Workera i obsługa instalacji PWA.

const grid = document.getElementById("grid");
const filtersEl = document.getElementById("filters");
const viewer = document.getElementById("viewer");
const viewerImg = document.getElementById("viewerImg");
const viewerTitle = document.getElementById("viewerTitle");
const viewerDesc = document.getElementById("viewerDesc");
const toast = document.getElementById("toast");

let activeCategory = "Wszystkie";

function showToast(msg, ms = 2200) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), ms);
}

function categories() {
  return ["Wszystkie", ...new Set(GALLERY.map((g) => g.category))];
}

function renderFilters() {
  filtersEl.innerHTML = "";
  categories().forEach((cat) => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    if (cat === activeCategory) btn.classList.add("active");
    btn.addEventListener("click", () => {
      activeCategory = cat;
      renderFilters();
      renderGrid();
    });
    filtersEl.appendChild(btn);
  });
}

function renderGrid() {
  const items =
    activeCategory === "Wszystkie"
      ? GALLERY
      : GALLERY.filter((g) => g.category === activeCategory);

  grid.innerHTML = "";
  if (!items.length) {
    grid.innerHTML = `<p class="empty">Brak grafik w tej kategorii.</p>`;
    return;
  }
  items.forEach((item) => {
    const fig = document.createElement("figure");
    fig.innerHTML = `
      <img src="${item.src}" alt="${item.title}" loading="lazy">
      <figcaption><b>${item.title}</b><span>${item.category}</span></figcaption>
    `;
    fig.addEventListener("click", () => openViewer(item));
    grid.appendChild(fig);
  });
}

function openViewer(item) {
  viewerImg.src = item.src;
  viewerImg.alt = item.title;
  viewerTitle.textContent = item.title;
  viewerDesc.textContent = item.desc;
  viewer.showModal();
}

document.getElementById("closeDlg").addEventListener("click", () => viewer.close());
viewer.addEventListener("click", (e) => {
  const r = viewer.getBoundingClientRect();
  const inside =
    e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
  if (!inside) viewer.close();
});

renderFilters();
renderGrid();

// --- Status sieci ---
const netDot = document.getElementById("netDot");
const netText = document.getElementById("netText");
function updateNetStatus() {
  const online = navigator.onLine;
  netDot.classList.toggle("online", online);
  netDot.classList.toggle("offline", !online);
  netText.textContent = online ? "Online" : "Offline (tryb PWA z pamięci podręcznej)";
}
window.addEventListener("online", updateNetStatus);
window.addEventListener("offline", updateNetStatus);
updateNetStatus();

// --- Service Worker ---
const swDot = document.getElementById("swDot");
const swText = document.getElementById("swText");
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then(() => {
      swDot.classList.add("online");
      swText.textContent = "Service Worker: aktywny";
    })
    .catch((err) => {
      swDot.classList.add("offline");
      swText.textContent = "Service Worker: błąd";
      console.error(err);
    });
} else {
  swText.textContent = "Service Worker: niewspierany";
}

// --- Instalacja PWA ---
let deferredPrompt = null;
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = "inline-block";
});

installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  showToast(outcome === "accepted" ? "Aplikacja zainstalowana ✅" : "Instalacja anulowana");
  deferredPrompt = null;
  installBtn.style.display = "none";
});

window.addEventListener("appinstalled", () => {
  showToast("Aplikacja zainstalowana ✅");
  installBtn.style.display = "none";
});
