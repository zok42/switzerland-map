# 🇨🇭 Schweiz Landkarte Quiz (Switzerland Map Quiz)

Eine interaktive Node.js-Webanwendung, die als spielerisches Geografie-Quiz für die Schweiz dient. Spieler müssen Kantone, Bezirke, Städte, Seen, Flüsse und Bundesräte auf einer stummen Schweizer Karte (ohne Namen) finden. Die Anwendung läuft vollständig lokal und startet sofort ohne vorherige Anmeldung oder Bestenliste.

## 🌟 Features

- **Stumme Google-Maps-Karte:** Die Anwendung nutzt einen hochauflösenden Google-Maps-Hintergrund, bei dem alle integrierten Ortsnamen, Beschriftungen und Texte serverseitig ausgeblendet wurden. Dies stellt sicher, dass das Quiz stumm bleibt und eine echte geografische Herausforderung darstellt!
- **Vier abwechslungsreiche Spielmodi:**
  - **Schweiz-Modus:** Finde alle 26 Kantone, die wichtigsten Schweizer Seen und Flüsse sowie Großstädte und Kantonshauptstädte auf der gesamten Karte.
  - **Kanton-Modus:** Wähle einen spezifischen Kanton aus. Die Karte zoomt weich auf die Grenzen. Finde die dortigen regionalen Städte, Flüsse, Seen oder die jeweiligen **Nachbarkantone** und **Bezirke (Bezirksgrenzen)**.
  - **Wappen-Modus (Wappen-Quiz):** Erkenne Kantone anhand ihrer hochauflösenden offiziellen Wappen (SVG von Wikimedia Commons) in der Sidebar und klicke auf das richtige Gebiet auf der Karte!
  - **Politik-Modus (Bundesrat-Quiz):** Lerne die **7 Bundesratsmitglieder (Stand 2026)** kennen! Dir wird ein Porträtfoto zusammen mit Partei, Departement und Amtsantrittsjahr gezeigt. Finde den jeweiligen Herkunftskanton des gezeigten Bundesrats auf der Karte! Das System nutzt ein kartenbasiertes "Deck", welches garantiert, dass alle 7 Mitglieder genau einmal pro Durchgang ohne vorzeitige Wiederholungen abgefragt werden.
- **Spielerische Effekte:** Interaktive Hover-Highlights, Fehleranzeigen (rotes Aufblinken) und Erfolgsfeiern mit Konfetti-Effekten bei richtigen Antworten.
- **Ebenen-Filter:** Blende Kantone, Bezirke, Städte, Seen oder Flüsse nach Belieben auf der Karte ein und aus.

## 🛠️ Technologien

- **Backend:** Node.js, Express (Statische Dateien)
- **Frontend:** HTML5, CSS3, JavaScript (Single-Page-Application)
- **Karten-Rendering:** Leaflet.js mit Google Maps Kacheln (No-Labels API-Stil)
- **Styling:** Tailwind CSS & FontAwesome (Icons)
- **Geodaten:** swisstopo-Vektordaten (Kantone, Seen, Bezirke) via `swiss-maps` TopoJSON
- **Effekte:** Canvas Confetti

## 📂 Projektstruktur

```text
switzerland-map/
├── public/                 # Statische Frontend-Dateien
│   ├── app.js              # Leaflet-Initialisierung, Daten-Modelle, Bundesräte und Spiel-Logik
│   ├── index.html          # HTML5 Dashboard-Layout (2x2 Modus-Auswahl)
│   └── style.css           # Benutzerdefinierte CSS-Übergänge und Scrollbars
├── server.js               # Express-Webserver
├── package.json            # Projekt-Metadaten und Node-Abhängigkeiten
└── .npmrc                  # npm-Konfiguration (deaktiviert Funding-Meldungen)
```

## 🚀 Installation & Start

### Voraussetzungen

Stelle sicher, dass du [Node.js](https://nodejs.org/) (Version 18 oder neuer) installiert hast.

### Schritte

1. **Abhängigkeiten installieren:**
   ```bash
   npm install
   ```

2. **Webserver starten:**
   ```bash
   npm start
   ```

3. **Im Browser öffnen:**
   Navigiere zu [http://localhost:3000](http://localhost:3000)

## 🎮 Spielanleitung

1. Wähle im oberen Bereich der linken Sidebar einen der **vier Spielmodi** (*Schweiz*, *Kanton*, *Wappen* oder *Politik*) aus.
2. Schaue auf die **aktuelle Aufgabe** im linken Seitenbereich (z. B. *"Finde den Kanton von: Beat Jans"* im Politik-Modus oder *"Finde diesen Kanton!"* mit Wappenbild im Wappen-Modus).
3. Klicke auf das entsprechende Gebiet, den Bezirk, den Fluss oder den Stadtpunkt auf der Karte.
4. Bei einer **richtigen Antwort** erhältst du Punkte, deine Serie (Streak) steigt und ein feierlicher Konfetti-Effekt erscheint. Im Politik-Modus wird zudem der Herkunftskanton für 2.5 Sekunden im Steckbrief grün eingeblendet, damit du ihn dir merken kannst.
5. Bei einer **falschen Antwort** blinkt das geklickte Element rot auf und du kannst es erneut versuchen oder die Frage überspringen.

## 📄 Lizenz & Quellen

- **Geodaten-Quelle:** Die administrativen Grenzen (Kantone & Bezirke) und Seen stammen aus dem Bundesamt für Statistik (BFS), GEOSTAT / swisstopo.
- **Wappen & Porträts:** Bundesratsporträts und Kantonswappen stammen von Wikimedia Commons / Schweizer Bundeskanzlei.
- **Code-Lizenz:** ISC-Lizenz. Freie Nutzung für Bildungs- und private Zwecke.
