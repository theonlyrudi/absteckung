# S900+ Absteckung

Kleine Web-App (PWA) für Android/Chrome: Stonex S900+ per Bluetooth (Web Serial, NMEA) verbinden,
Punkte aus KML abstecken (Pfeil-/Zielscheiben-Führung) und aktuelle Positionen aufnehmen (Export KML/CSV).

App: https://theonlyrudi.github.io/absteckung/

Voraussetzungen: Chrome ≥ 137 auf Android, S900+ in Android gekoppelt, NMEA-Ausgabe (GGA, RMC, GST) über Bluetooth aktiv.
Optionale Hintergrundkarte (basemap.de, Luftbild, OSM) mit Leaflet 1.9.4 (lokal eingebunden); angesehene Kacheln werden offline gespeichert.
Bei Änderungen an der App in `sw.js` die `VERSION` hochzählen.
