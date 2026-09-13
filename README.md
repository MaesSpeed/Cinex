# Wahl der Qual

Welcher Film heute? Statische Web-App zum gemeinsamen Filmauswählen – ohne Backend, nur im Browser.

## Live

**https://maesspeed.github.io/Cinex/**

Öffentlich über GitHub Pages (Zweig `main`, Ordner `/`). Zuerst iPhone 8, danach Desktop.

## Testen

Seed-Login: **Test** / **1234**

Danach **Wer schaut**: Tester, User No 1, Bot - Apptesti. Neue Profile: nur Name + Avatar. Löschen nur nach Passwort des Logins.

## Poster

Karten zeigen echte Filmplakate aus `films.json` (TMDB-Bild-URLs, **ohne API-Schlüssel**). `loadCatalog` lädt `./films.json` und ersetzt den eingebauten `FILMS`-Fallback, wenn mehr als 20 Titel da sind.

## Ablauf

1. Anmelden oder registrieren (localStorage)
2. Wer schaut
3. Hauptmenü: Filme vorschlagen, Filter, Meine Filmlisten, Tags verwalten
4. Vorschläge mit Postern, Noten-Icons und Vorgemerkt
5. Filmlisten: Vorgemerkt, Bewertete, Tags, Angesehen
6. Footer (genau 3): **Vorschlagen** | **Listen** | **Verwalten**. Am Desktop immer sichtbar. Am Handy zuerst zugeklappt, erscheint beim Hochscrollen, verschwindet beim Runterscrollen. Account/Logout bleiben im Header.

Jeder Profilstand (Listen, Historie, Bewertungen, eigene Tags) liegt getrennt in `localStorage`.
