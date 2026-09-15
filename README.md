# Wahl der Qual

Welcher Film heute? Statische Web-App zum gemeinsamen Filmauswählen – ohne Backend, nur im Browser.

## Live

**https://maesspeed.github.io/Cinex/**

Öffentlich über GitHub Pages (Zweig `main`, Ordner `/`). Zuerst iPhone 8, danach Desktop.

## Testen

Seed-Login: **Test** / **1234**

Danach **Wer schaut**: Tester, User No 1, Bot - Apptesti. Neue Profile: nur Name + Avatar. Löschen nur nach Passwort des Logins.

## Katalog

Suche und „Filme vorschlagen“ können die öffentliche TMDB-API v3 nutzen (`language=de-DE`, `region=DE`, `include_adult=false`). Poster bleiben TMDB-Bild-URLs.

Optionaler Schlüssel in `config.js` als `window.TMDB_KEY` (siehe `config.example.js`). Die Suche läuft immer zuerst lokal: In-Memory-Katalog plus `films.json` (Präfix/Teilstring, auch deutsche Titel). Ist der Schlüssel leer, bleibt die lokale Suche vollständig nutzbar – Treffer wie Inception oder Interstellar kommen aus dem Katalog. TMDB reichert nur an, wenn ein Schlüssel gesetzt ist. Schlägt die Online-Suche fehl und es gibt keine lokalen Treffer, erscheint ein dezenter Hinweis statt einer harten Fehlermeldung.

## Ablauf

1. Anmelden oder registrieren (localStorage)
2. Wer schaut
3. Hauptmenü: Filme vorschlagen, Filter, Meine Filmlisten, Tags verwalten
4. Vorschläge mit Postern, Noten-Icons und Watchlist
5. Filmlisten: Watchlist, Bewertete, Tags, Angesehen. Watchlist: Chip **+ Hinzufügen** öffnet ein hohes Bottom-Sheet (**Zu Watchlist hinzufügen**) mit Kategorie-Chips (einzeln wählbar), Katalogvorschlägen und Live-Suche (**Film suchen**). Plus/Haken schaltet die Watchlist; schließen nur per Wischen nach unten.
6. Footer (genau 3): **Vorschlagen** | **Listen** | **Verwalten**. Desktop immer sichtbar. Handy: sichtbar, wenn die Seite nicht scrollt (z. B. Hauptmenü); sonst ausblenden beim Runterscrollen, einblenden beim Hochscrollen. Toast sitzt über dem Footer. Account/Logout bleiben im Header.

Jeder Profilstand (Listen, Historie, Bewertungen, eigene Tags) liegt getrennt in `localStorage`.
