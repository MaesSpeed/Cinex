# cinex-sync

Cloudflare Worker für den Cloud-Sync von Wahl der Qual (Name + Passwort, ein versioniertes JSON-Blob pro Konto). Die KV-Bindung ist dieselbe wie beim bereits laufenden Worker `cinex-sync`. Ein Deploy überschreibt den Worker, eine Datenmigration ist nicht nötig.

## Schlüssel

| Schlüssel | Inhalt |
|---|---|
| `user:<name>` | PBKDF2-Hash |
| `tok:<token>` | `{name, createdAt, expiresAt}`, TTL standardmäßig 30 Tage, wird bei Benutzung verlängert sobald weniger als die Hälfte übrig ist |
| `data:<name>` | `{version, updatedAt, data}` |
| `hist:<name>:<YYYY-MM-DD>` | höchstens ein Stand pro UTC-Tag, Ablauf nach 30 Tagen |
| `hist:<name>:undo` | Stand direkt vor der letzten Wiederherstellung, falls der Tagesslot schon belegt war |

Bestehende Tokens ohne `expiresAt` bleiben gültig und werden beim nächsten Aufruf einmal verlängert.

## Endpunkte

| Methode | Pfad | Auth | Hinweis |
|---|---|---|---|
| GET | `/health` | — | Liveness |
| POST | `/register` | — | `{name, password}` → Token |
| POST | `/login` | — | `{name, password}` → Token |
| POST | `/verify` | Bearer | `{name, password}` prüft das Passwort, legt kein neues Token an |
| POST | `/logout` | Bearer | löscht das Token |
| GET | `/data` | Bearer | `{version, updatedAt, data}` |
| PUT | `/data` | Bearer | `{baseVersion, data, confirmShrink?}` |
| GET | `/data/history` | Bearer | Liste der Stände, ohne die Blobs |
| POST | `/data/restore` | Bearer | `{id}` schreibt den Stand als neue Version |

PUT antwortet mit `422` und `error: "shrink_rejected"`, wenn `data` null ist oder gegenüber dem aktuellen Stand mehr als 10 Einträge oder mehr als 10 % bei Watchlist, Angesehen, Bewertungen oder Profilen verloren gehen. `confirmShrink: true` speichert trotzdem. `409` bleibt der Versionskonflikt.

Vor dem Überschreiben wird der bisherige Stand höchstens einmal pro Tag gesichert. Wiederherstellen legt selbst eine neue Version an. War heute schon ein Stand gesichert und er ist nicht der aktuelle, landet der aktuelle zusätzlich unter `hist:<name>:undo`.

Gelöschte Profile (`profileTombstones` im Blob) schreibt der Worker auch dann nicht zurück, wenn ein älterer Client sie ohne Grabstein wieder mitschickt.

## Deploy

Im Ordner `worker-sync/`, mit dem Cloudflare-Konto, dem der bestehende Worker gehört:

```bash
npm install
npm test
npx wrangler deploy
```

`wrangler.toml` nicht umbiegen: Name `cinex-sync`, Binding `CINEX_SYNC`, Namespace-Id `5b9f11f5cad54b9a89883f66b83cb9dc`. Kein Secret, kein neues Namespace, kein Löschen von Schlüsseln.

Reihenfolge: diesen Worker deployen, danach (oder direkt darauf) die Seite aus `main` über GitHub Pages. Beides verträgt sich auch andersherum; der Worker zuerst ist ruhiger, weil Profil-Löschen `/verify` braucht und die Einstellungen `/data/history` lesen. Alte Clients und alte Tokens funktionieren weiter. Ein normaler Sync schreibt weiter `{baseVersion, data}`.
