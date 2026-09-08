# 🇨🇭 Schweiz Landkarte Quiz (Switzerland Map Quiz)

Eine interaktive Node.js-Webanwendung, die als spielerisches Geografie-Quiz für die Schweiz dient. Spieler müssen Kantone, Städte, Seen und Flüsse auf einer stummen Schweizer Karte (ohne Namen) finden. Zudem bietet die App eine detaillierte Kantonsicht mit denselben Herausforderungen für spezifische Regionen und deren Nachbarkantone.

## 🌟 Features

- **Stumme Karte:** Die Anwendung nutzt die offiziellen swisstopo-Vektorgrenzen sowie einen kartenbeschriftungsfreien Hintergrund (CartoDB No Labels), damit das Quiz eine echte Herausforderung darstellt.
- **Zwei Spielmodi:**
  - **Schweiz-Modus:** Finde alle 26 Kantone, die wichtigsten Schweizer Seen und Flüsse sowie Großstädte und Kantonshauptstädte auf der gesamten Schweizer Karte.
  - **Kanton-Modus:** Wähle einen spezifischen Kanton aus. Die Karte zoomt weich auf die Grenzen dieses Kantons. Finde die dortigen Städte, Flüsse, Seen oder die jeweiligen **Nachbarkantone**.
- **Spielerprofil & Bestenliste (Highscore):** Trage zu Beginn deinen Namen ein. Deine Ergebnisse werden live an das Node.js-Backend gesendet und persistent in einer Bestenliste gespeichert.
- **Spielerische Effekte:** Interaktive Hover-Highlights, Fehleranzeigen (rotes Aufblinken) und Erfolgsfeiern mit Konfetti-Effekten bei richtigen Antworten.
- **Ebenen-Filter:** Blende Kantone, Städte, Seen oder Flüsse nach Belieben auf der Karte ein und aus.

## 🛠️ Technologien

- **Backend:** Node.js, Express (Statische Dateien & REST-API für Highscores)
- **Frontend:** HTML5, CSS3, JavaScript (Single-Page-Application)
- **Karten-Rendering:** Leaflet.js
- **Styling:** Tailwind CSS & FontAwesome (Icons)
- **Geodaten:** swisstopo-Vektordaten via `swiss-maps` TopoJSON
- **Effekte:** Canvas Confetti

## 📂 Projektstruktur

```text
switzerland-map/
├── public/                 # Statische Frontend-Dateien
│   ├── app.js              # Leaflet-Initialisierung, Daten-Modelle und Spiel-Logik
│   ├── index.html          # HTML5 Dashboard-Layout
│   └── style.css           # Benutzerdefinierte CSS-Übergänge und Scrollbars
├── server.js               # Express-Webserver und API-Schnittstellen
├── package.json            # Projekt-Metadaten und Node-Abhängigkeiten
└── scores.json             # Persistente Speicherung der Highscore-Daten (wird automatisch generiert)
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
   *Alternativ für Entwickler:*
   ```bash
   node server.js
   ```

3. **Im Browser öffnen:**
   Navigiere zu [http://localhost:3000](http://localhost:3000)

## 🎮 Spielanleitung

1. Trage nach dem Laden der Seite deinen **Spielernamen** ein und klicke auf "Spiel Starten".
2. Schaue auf die **aktuelle Aufgabe** im linken Seitenbereich (z. B. "den Kanton: Graubünden" oder "den See: Genfersee").
3. Klicke auf die entsprechende Form oder den Punkt auf der Karte.
4. Bei einer **richtigen Antwort** erhältst du Punkte, deine Serie (Streak) steigt und ein Konfetti-Effekt erscheint. Nach einer kurzen Verzögerung wird die nächste Frage generiert.
5. Bei einer **falschen Antwort** blinkt das geklickte Element rot auf und du kannst es erneut versuchen. Du kannst die Frage auch jederzeit überspringen.
6. Wechsle im Menü auf **"Kanton"**, um eine Region auszuwählen und das Quiz im Detailmodus des jeweiligen Kantons zu spielen.

## 📄 Lizenz & Quellen

- **Geodaten-Quelle:** Die administrativen Grenzen und Seen stammen aus dem Bundesamt für Statistik (BFS), GEOSTAT / swisstopo.
- **Code-Lizenz:** ISC-Lizenz. Freie Nutzung für Bildungs- und private Zwecke.
