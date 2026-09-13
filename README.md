# Wahl der Qual

Welcher Film heute? Statische Web-App zum gemeinsamen Filmauswählen – ohne Backend, nur im Browser.

## Live

**https://maesspeed.github.io/Cinex/**

Öffentlich über GitHub Pages (Zweig `main`, Ordner `/`). Funktioniert auf iPhone Safari und am PC.

## Poster

Karten zeigen echte Filmplakate aus `films.json` (TMDB-Bild-URLs, ohne API-Schlüssel). Die Datei liegt im Repo-Root und wird von GitHub Pages ausgeliefert.

## TMDB-Schlüssel (optional, für Anbieter)

Ohne Schlüssel laufen Vorschläge mit dem Katalog aus `films.json` (Fallback: eingebauter `FILMS`-Katalog).

Mit Schlüssel kommen die deutschen Watch-Anbieter (Stream / Leihen / Kaufen) von [TMDB](https://www.themoviedb.org):

1. Account auf [themoviedb.org](https://www.themoviedb.org) anlegen.
2. Unter Einstellungen → API einen **API-Key (v3 auth)** erzeugen.
3. Auf der Live-Seite entweder das Feld **TMDB-Schlüssel** nutzen oder in der Browserkonsole:

```js
localStorage.setItem("wdq.tmdbKey", "DEIN_KEY");
location.reload();
```

`window.TMDB_KEY` bleibt im Quellcode leer, damit ein Schlüssel ohne Neu-Build gesetzt werden kann.

Es werden keine Preise erfunden. Fehlt der Schlüssel, sagt die App das ausdrücklich statt Netflix & Co. zu raten.

## Daten

Bewertungen (**Deine Note**) und die Gesehen-Historie bleiben lokal im Browser, getrennt pro Konto:

- Konto 1: `wdq.a1.ratings`, `wdq.a1.history`
- Konto 2: `wdq.a2.ratings`, `wdq.a2.history`

Kein Passwort, kein Server.
