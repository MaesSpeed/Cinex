# Wahl der Qual

Welcher Film heute? Statische Web-App zum gemeinsamen Filmauswählen. Katalog, Watchlist, Zufall und Entdecken laufen im Browser. Die Live-Suche ist optional und geht über einen Cloudflare-Worker, der den TMDB-Schlüssel serverseitig hält.

## Live

**https://maesspeed.github.io/Cinex/**

Öffentlich über GitHub Pages (Zweig `main`, Ordner `/`). Zuerst iPhone 8, danach Desktop.

## Testen

Seed-Login: **Test** / **1234**

Danach **Wer schaut**: Tester, User No 1, Bot - Apptesti. Neue Profile: nur Name + Avatar. Löschen nur nach Passwort des Logins.

## Katalog

Suche (Watchlist **Film suchen** und Schauspieler-Filter auf Entdecken) läuft immer zuerst lokal: In-Memory-Katalog plus `films.json` (Präfix/Teilstring, auch deutsche Titel und Franchise-Aliase wie Bond/007). Treffer werden nach Relevanz sortiert (exakter Titel, Titelpräfix, Wortgrenzen, danach Aliase) und innerhalb der Stufe nach Bekanntheit (`popularity`/`vote_count` falls vorhanden, sonst Bewertung und Jahr). Sehr kurze Clips unter 40 Minuten erscheinen in der Titelsuche nur bei exaktem Titeltreffer. Die Ergebnisliste zeigt zunächst 20 Filme; **Weitere anzeigen** oder Scrollen nahe am Listenende lädt die nächsten 20, ohne den restlichen Katalog neu zu zeichnen.

Ist die lokale Liste leer oder dünn (kein exakter Titel, zu wenige starke Treffer), fragt die App den Such-Proxy. Der Proxy spricht mit TMDB (`language=de-DE`, `region=DE`, `include_adult=false`). Die App mappt die Treffer ins bestehende Filmformat (Titel, Originaltitel, Poster, Bewertung). Lokale und Live-Treffer werden zusammengeführt, nach derselben Relevanz sortiert und paginiert; bei Dubletten bleibt die lokale Fassung (Laufzeit, Aliase). Ein hinzugefügter Live-Treffer landet im Profil (`localStorage`) und im Sitzungs-Katalog, damit Cover, Watchlist und Demnächst auch ohne weiteren Proxy-Aufruf funktionieren. Fehlende Laufzeit und Besetzung lädt die App beim Hinzufügen einmal nach. Poster bleiben TMDB-Bild-URLs.

Ist `window.SEARCH_PROXY` leer oder der Proxy nicht erreichbar, bleibt die lokale Suche nutzbar. Treffer wie Inception oder Interstellar kommen aus dem Katalog. Schlägt nur die Online-Suche fehl und es gibt keine lokalen Treffer, erscheint ein dezenter Hinweis statt einer harten Fehlermeldung.

**Wichtig:** Die öffentliche GitHub-Pages-Seite darf **keinen** TMDB-Schlüssel in `config.js` haben (`window.TMDB_KEY` bleibt leer). Die Suche hängt den Schlüssel nicht an. Franchise-Suchen wie „Bond“ funktionieren offline, sobald die Titel in `films.json` stehen (ggf. mit `aliases`).

### Live-Suche einrichten (Cloudflare, kostenlos)

Der Worker liegt in `worker/`. GitHub Pages liefert weiterhin nur die statische Seite. Der Schlüssel ist dasselbe Geheimnis wie beim Katalog-Build (`TMDB_API_KEY`): kurzer v3-`api_key` oder langer v4-Read-Token (JWT, beginnt mit `eyJ`).

1. Kostenlosen Cloudflare-Account anlegen und die Wrangler-CLI einmal anmelden: `npx wrangler login`
2. Im Ordner `worker/`: `npx wrangler secret put TMDB_API_KEY` und den Schlüssel einfügen (nicht committen).
3. `npx wrangler deploy` — die Ausgabe nennt die öffentliche URL, z. B. `https://cinex-search.<account>.workers.dev`
4. Diese URL ohne Schrägstrich am Ende in `config.js` als `window.SEARCH_PROXY` eintragen und mit der Seite deployen. Die URL ist öffentlich, der Schlüssel nicht.
5. Pages-Deploy bleibt wie bisher (Zweig `main`, Ordner `/`). `films.json` ändert sich durch die Live-Suche nicht.

Lokal derselbe Worker, Schlüssel nur in `worker/.dev.vars` (Vorlage: `worker/.dev.vars.example`, Datei ist gitignored):

```bash
cd worker
cp .dev.vars.example .dev.vars
npx wrangler dev
```

In der lokalen `config.js` dann `window.SEARCH_PROXY = "http://127.0.0.1:8787";` setzen. Diese Zeile nicht mit echtem Schlüssel committen. Ohne Proxy-URL sucht die App nur im lokalen Katalog.

Prüfen: `curl https://<worker>/search/movie?query=Gladiator` liefert JSON ohne `api_key`. Im Browser-Netzwerk der Seite darf der TMDB-Schlüssel nie auftauchen.

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
2. Wer schaut. Ein einzelnes Profil, oder die Auswahl auf „Wer schaut?“, landet auf **Listen → Watchlist** — nicht auf Entdecken.
3. Entdecken: Karte **Filme vorschlagen** mit Lava-Rand, Interstellar-Lupe, gewählten Filter-Chips (blau mit Lava-Rand) und dauerhaftem Glanz von links nach rechts. Filter stehen senkrecht und aufgeklappt: Dauer, Genre, Tags, Stream, Typ, Schauspieler. Eine Kategorie mit Auswahl bekommt einen Lava-Rand. Typ klappt bei Überlauf mit „mehr“ auf. Schauspieler-Suche bleibt in der Handybreite, Treffer direkt unter dem Feld.
4. Drei hohe Vorschlagskarten. Neben dem Cover: Titel, Schauspieler, **Anschauen**. ‹ Filter und Refresh bleiben. Wischen nach rechts legt den Film in Demnächst und Watchlist, nach links wischt ihn aus der Runde. Aufklappen: Lava-Rand pulsiert leicht. Inhalt: Zuletzt gesehen, Anschauen, Taggen | Watchlist, passende Richtung, Enthalten in / Tags / Bewertung.
5. Filmlisten: Watchlist, Demnächst, Bewertete, Tags, Angesehen. Watchlist: Chip **+ Hinzufügen** öffnet ein hohes Bottom-Sheet (**Zu Watchlist hinzufügen**) mit Kategorie-Chips (einzeln wählbar), Katalogvorschlägen und Live-Suche (**Film suchen**). Plus/Haken schaltet die Watchlist; schließen nur per Wischen nach unten. Tags verwalten sitzt im Tab Tags.
6. Footer (genau 3): **Zufall** | **Listen** | **Entdecken**. Desktop immer sichtbar. Handy: sichtbar, wenn die Seite nicht scrollt; sonst ausblenden beim Runterscrollen, einblenden beim Hochscrollen. Toast sitzt über dem Footer. Account/Logout sitzen im Header auf Listen und Entdecken. Das Entdecken-Icon im Footer bleibt an seiner Stelle.

Jeder Profilstand (Listen, Historie, Bewertungen, eigene Tags) liegt getrennt in `localStorage`.
