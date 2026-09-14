# Wahl der Qual

Welcher Film heute? Statische Web-App zum gemeinsamen Filmauswählen – ohne Backend, nur im Browser.

## Live

**https://maesspeed.github.io/Cinex/**

Öffentlich über GitHub Pages (Zweig `main`, Ordner `/`). Zuerst iPhone 8, danach Desktop.

## Testen

Seed-Login: **Test** / **1234**

Danach **Wer schaut**: Tester, User No 1, Bot - Apptesti. Neue Profile: nur Name + Avatar. Löschen nur nach Passwort des Logins.

## Katalog

Suche und „Filme vorschlagen“ nutzen die öffentliche TMDB-API v3 (`language=de-DE`, `region=DE`, `include_adult=false`). Poster bleiben TMDB-Bild-URLs.

Optionaler Schlüssel in `config.js` als `window.TMDB_KEY` (siehe `config.example.js`). Ist der Schlüssel leer, versucht die App die Anfrage trotzdem. Schlägt TMDB fehl: Suche zeigt **Katalog nicht erreichbar**, leere Treffer **Kein Treffer**. `films.json` ist nur der schnelle Offline-Fallback für Vorschläge.

## Ablauf

1. Anmelden oder registrieren (localStorage)
2. Wer schaut
3. Hauptmenü: Filme vorschlagen, Filter, Meine Filmlisten, Tags verwalten
4. Vorschläge mit Postern, Noten-Icons und Watchlist
5. Filmlisten: Watchlist, Bewertete, Tags, Angesehen
6. Footer (genau 3): **Vorschlagen** | **Listen** | **Verwalten**. Desktop immer sichtbar. Handy: sichtbar, wenn die Seite nicht scrollt (z. B. Hauptmenü); sonst ausblenden beim Runterscrollen, einblenden beim Hochscrollen. Toast sitzt über dem Footer. Account/Logout bleiben im Header.

Jeder Profilstand (Listen, Historie, Bewertungen, eigene Tags) liegt getrennt in `localStorage`.
