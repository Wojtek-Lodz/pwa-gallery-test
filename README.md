# PWA Galeria Testowa

Jednostronicowa aplikacja PWA (Progressive Web App) do testów: wyświetla galerię
generowanych lokalnie grafik (SVG), działa offline po zainstalowaniu i jest gotowa
do wdrożenia z GitHub na hosting Hostinger.

## Zawartość

- `index.html` — jedyna strona aplikacji (galeria + podgląd grafiki)
- `app.js` — logika UI, status online/offline, rejestracja Service Workera, instalacja PWA
- `images.js` — dane galerii (grafiki SVG generowane w locie, bez zewnętrznych zależności)
- `manifest.webmanifest` — manifest PWA (nazwa, ikony, tryb standalone)
- `service-worker.js` — cache-first, umożliwia pracę offline
- `icons/` — ikony aplikacji (PNG 192/512, wersja maskable)
- `.github/workflows/deploy.yml` — automatyczne wdrożenie na Hostinger przez FTP po pushu do `main`

## Test lokalny

Aplikacja nie wymaga budowania — to czysty HTML/CSS/JS. Uruchom dowolny lokalny
serwer statyczny w katalogu projektu, np.:

```bash
npx serve .
# lub
python -m http.server 8080
```

Otwórz `http://localhost:8080` (lub port podany przez serwer). Service Worker
i instalacja PWA wymagają serwowania przez HTTP(S) — nie zadziałają z pliku
otwartego bezpośrednio (`file://`).

## Wdrożenie na Hostinger

### Opcja A — automatycznie przez GitHub Actions (FTP)

1. W panelu Hostinger (hPanel) → **Pliki → Konta FTP** znajdź/utwórz dane dostępowe
   (host, login, hasło) oraz katalog docelowy (zwykle `/public_html/`).
2. W repozytorium GitHub: **Settings → Secrets and variables → Actions → New repository secret**
   i dodaj:
   - `FTP_SERVER`
   - `FTP_USERNAME`
   - `FTP_PASSWORD`
   - `FTP_TARGET_DIR` (np. `/public_html/`)
3. Każdy push do gałęzi `main` automatycznie wgra pliki na Hostinger
   (workflow: `.github/workflows/deploy.yml`).

### Opcja B — ręcznie

1. Pobierz repozytorium (`git clone ...`) lub ZIP z GitHub.
2. W hPanel → **Pliki → Menedżer plików** (lub przez FTP) wgraj zawartość
   katalogu do `public_html/` (lub podkatalogu, np. `public_html/galeria/`).
3. Upewnij się, że serwer obsługuje HTTPS (Hostinger włącza darmowe SSL) —
   Service Worker działa tylko na `https://` lub `localhost`.

## Uwagi dot. PWA

- Manifest wskazuje `start_url: "./index.html"` i `scope: "./"` — jeśli wdrażasz
  aplikację w podkatalogu (np. `/galeria/`), ścieżki względne zadziałają bez zmian.
- Po zmianie plików aplikacji zwiększ numer `CACHE_NAME` w `service-worker.js`,
  aby wymusić odświeżenie pamięci podręcznej u użytkowników.
