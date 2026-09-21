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

Optionaler Schlüssel in `config.js` als `window.TMDB_KEY` (siehe `config.example.js`). Die Suche läuft immer zuerst lokal: In-Memory-Katalog plus `films.json` (Präfix/Teilstring, auch deutsche Titel und Franchise-Aliase wie Bond/007). Treffer werden nach Relevanz sortiert (exakter Titel, Titelpräfix, Wortgrenzen, danach Aliase) und innerhalb der Stufe nach Bekanntheit (`popularity`/`vote_count` falls vorhanden, sonst Bewertung und Jahr). Sehr kurze Clips unter 40 Minuten erscheinen in der Titelsuche nur bei exaktem Titeltreffer. Die Ergebnisliste zeigt zunächst 20 Filme; **Weitere anzeigen** oder Scrollen nahe am Listenende lädt die nächsten 20, ohne den restlichen Katalog neu zu zeichnen. Ist der Schlüssel leer, bleibt die lokale Suche vollständig nutzbar – Treffer wie Inception oder Interstellar kommen aus dem Katalog. TMDB reichert nur an, wenn ein Schlüssel gesetzt ist. Schlägt die Online-Suche fehl und es gibt keine lokalen Treffer, erscheint ein dezenter Hinweis statt einer harten Fehlermeldung.

**Wichtig:** Die öffentliche GitHub-Pages-Seite darf **keinen** TMDB-Schlüssel in `config.js` haben (`window.TMDB_KEY` bleibt leer). Sonst wäre der Key im Browser sichtbar. Franchise-Suchen wie „Bond“ funktionieren offline, sobald die Titel in `films.json` stehen (ggf. mit `aliases`).

### Katalog aktualisieren (GitHub Actions)

`films.json` wird serverseitig gebaut. Der TMDB-Schlüssel liegt nur als Repository-Secret, nie im Code.

1. Im GitHub-Repo: **Settings → Secrets and variables → Actions**
2. Secret **`TMDB_API_KEY`** anlegen — entweder der klassische kurze TMDB-v3-`api_key` **oder** ein langer v4 Read Access Token (JWT, beginnt mit `eyJ` / länger als 64 Zeichen). Das Build-Skript erkennt die Form selbst: Bearer-Token gehen als `Authorization: Bearer …` ohne Query-Parameter, der v3-Key als `api_key`.
3. **Actions → „Refresh films catalog“ → Run workflow**

Der Workflow läuft zusätzlich wöchentlich und committet `films.json` auf den Default-Zweig (`main`), wenn sich der Katalog geändert hat.

Lokal denselben Lauf (Schlüssel nur in der Shell, nicht in `config.js`):

```bash
TMDB_API_KEY=… node scripts/build-films-catalog.mjs
```

## Ablauf

1. Anmelden oder registrieren (localStorage)
2. Wer schaut
3. Entdecken (Titel **Vorschläge**): Karte **Filme vorschlagen**, Filter (Dauer, Genre, Tags, Stream, Typ, Schauspieler)
4. Drei hohe Vorschlagskarten. Wischen nach rechts legt den Film in Demnächst und Watchlist, nach links wischt ihn aus der Runde. Aufklappen: Zuletzt gesehen, Anschauen, Taggen | Watchlist, passende Richtung, Enthalten in / Tags / Bewertung
5. Filmlisten: Watchlist, Demnächst, Bewertete, Tags, Angesehen. Watchlist: Chip **+ Hinzufügen** öffnet ein hohes Bottom-Sheet (**Zu Watchlist hinzufügen**) mit Kategorie-Chips (einzeln wählbar), Katalogvorschlägen und Live-Suche (**Film suchen**). Plus/Haken schaltet die Watchlist; schließen nur per Wischen nach unten. Tags verwalten sitzt im Tab Tags.
6. Footer (genau 3): **Zufall** | **Listen** | **Entdecken**. Desktop immer sichtbar. Handy: sichtbar, wenn die Seite nicht scrollt; sonst ausblenden beim Runterscrollen, einblenden beim Hochscrollen. Toast sitzt über dem Footer. Account/Logout bleiben im Header auf Entdecken.

Jeder Profilstand (Listen, Historie, Bewertungen, eigene Tags) liegt getrennt in `localStorage`.
