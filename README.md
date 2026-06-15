# FWPF Page Revamp

Ein interaktiver Frontend-Prototyp für eine neu gestaltete FWPF-Wahlseite im Modul **GUIIV**.  
Die Anwendung übersetzt die bisher eher tabellarische FWPF-Einschreibung in eine klarere, visuellere Wahl-Erfahrung: Studierende legen ihren Wahlrahmen fest, priorisieren Module auf einem digitalen Stimmzettel und geben diesen symbolisch in einer Wahlurne ab.

Live-Demo: https://fwpf-page-revamp.vercel.app

## Konzept

Das Projekt versteht die FWPF-Wahl als digitalen Wahlprozess:

1. Regelwerk verstehen
2. gewünschten SWS- und Modulumfang festlegen
3. Module auswählen und priorisieren
4. Stimmzettel prüfen
5. Stimmzettel abgeben

Zusätzlich gibt es einen optionalen **Immersive Mode**, der den Prozess als kleine Pixel-Art-Wahllokal-Szene darstellt. Die einzelnen Stationen im Raum öffnen die jeweiligen Bereiche der normalen Seite als Papier-Overlay.

## Features

- statischer Next.js-Prototyp ohne Backend, Datenbank oder Authentifizierung
- interaktive Modulpriorisierung per Drag-and-Drop
- dynamische Mindestanzahl an Prioritäten abhängig vom gewählten Wahlrahmen
- Modul-Infofenster mit Dummy-Inhalten
- Regelwerk im Wahlzettel-Stil
- Stundenplan-Popup mit anklickbaren Modul-Abkürzungen
- Zusammenfassung mit Status- und Chancenanzeige
- animierte Stimmzettel-Abgabe
- optionaler PixiJS-basierter Immersive Mode mit Pixel-Art-Wahllokal
- responsive Grundstruktur mit Fokus auf Desktop

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- App Router
- PixiJS für den Immersive Mode
- dnd-kit für Drag-and-Drop

## Projektstruktur

Die eigentliche Next.js-App liegt im Unterordner:

```txt
main_project/
```

Wichtige Bereiche:

```txt
main_project/
├── app/                         # Next.js App Router
├── components/
│   ├── ballot/                  # Stimmzettel, Wahlurne, Zusammenfassung
│   ├── immersive/               # Immersive Mode und PixiJS-Szene
│   │   └── scene/               # Kamera, Sprites, Stationen, Rendering
│   ├── layout/                  # Header und Prozessnavigation
│   ├── modules/                 # Modulkarten, Drag-and-Drop, Modulmodal
│   ├── rulebook/                # Regelwerk und Stundenplan-Popup
│   ├── sws/                     # Wahlrahmen / SWS-Auswahl
│   ├── ui/                      # kleine wiederverwendbare UI-Bausteine
│   └── workflow/                # Seitenzustand und Prozesslogik
├── data/                        # Modul- und Demodaten
└── public/assets/               # Pixel-Art-Assets und Sprites
```

## Lokal starten

Voraussetzung: Node.js und npm.

```bash
cd main_project
npm install
npm run dev
```

Die lokale Entwicklungsseite läuft danach standardmäßig unter:

```txt
http://localhost:3000
```

## Build prüfen

```bash
cd main_project
npm run build
```

## Deployment

Das Projekt ist aktuell über Vercel deployed:

```txt
https://fwpf-page-revamp.vercel.app
```

Für ein erneutes Deployment über Vercel:

- GitHub-Repository importieren
- als Root Directory `main_project` auswählen
- Build Command: `npm run build`
- Output wird automatisch von Next.js/Vercel erkannt

## Status

Das Projekt ist ein Frontend-Prototyp. Es gibt bewusst keine echte Speicherung, keine Benutzerverwaltung und keine Backend-Anbindung. Interaktionen dienen dazu, den Ablauf, die visuelle Struktur und das Bedienkonzept der überarbeiteten FWPF-Wahlseite erlebbar zu machen.
