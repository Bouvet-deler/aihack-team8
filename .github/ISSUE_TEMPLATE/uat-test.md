---
name: "🧪 Manuell UAT-test"
about: "Stikkprøvebasert akseptansetest av Stavanger Mobilitet"
title: "UAT: Manuell akseptansetest [DATO]"
labels: "testing, uat"
---

## Testmiljø

| Felt | Verdi |
|------|-------|
| **Tester** | |
| **Dato** | |
| **Nettleser (desktop)** | |
| **Enhet (mobil)** | |
| **URL** | |
| **Git commit/versjon** | |

---

## 1. Oppstart og lasting

- [ ] Appen laster med en loading-spinner og teksten "Laster data…"
- [ ] Parkering- og sykkeldata vises etter lasting
- [ ] "Sist oppdatert"-tidspunkt vises under kontrollene
- [ ] Ingen feil eller konsoll-feil ved oppstart

> **Notat:**
>

---

## 2. Kart – grunnleggende visning

- [ ] Kartet er sentrert på Stavanger (ca. 58.97°N, 5.73°E)
- [ ] OpenStreetMap-fliser laster korrekt uten manglende tiles
- [ ] Parkeringsmarkører (sirkler) vises med antall ledige plasser
- [ ] Sykkelmarkører (firkanter med avrundede hjørner) vises med sykkelikon og antall
- [ ] Zoom inn/ut fungerer med scroll og knapper
- [ ] Panorering (dra) fungerer

> **Notat:**
>

---

## 3. Markør-farger og størrelser

### Parkering – fargekoding
- [ ] Grønn (#22c55e) vises for > 100 ledige plasser
- [ ] Gul (#eab308) vises for 51–100 ledige plasser
- [ ] Oransje (#f97316) vises for 21–50 ledige plasser
- [ ] Rød (#ef4444) vises for ≤ 20 ledige plasser

### Bysykkel – fargekoding
- [ ] Grønn (#22c55e) vises for > 5 tilgjengelige sykler
- [ ] Gul (#eab308) vises for 3–5 tilgjengelige sykler
- [ ] Oransje (#f97316) vises for 1–2 tilgjengelige sykler
- [ ] Rød (#ef4444) vises for 0 tilgjengelige sykler
- [ ] Grå (#9ca3af) vises for inaktive stasjoner (is_renting=false)

### Størrelser
- [ ] Valgt markør er større enn uvalgte (48px parkering / 52px sykkel)
- [ ] Dimmet markør er mindre (32px parkering / 34px sykkel)

> **Notat:**
>

---

## 4. Markør-interaksjon og popup

### Parkering-popup
- [ ] Klikk på parkeringsmarkør åpner popup
- [ ] Popup viser: stedsnavn, fargeindikator, antall ledige plasser
- [ ] Popup viser dato og klokkeslett
- [ ] Kartet flyr til markøren med animasjon (~0.8s)

### Sykkel-popup
- [ ] Klikk på sykkelmarkør åpner popup
- [ ] Popup viser: stasjonsnavn, tilgjengelige sykler, ledige låser, kapasitet
- [ ] Inaktiv stasjon viser "Stasjonen er ikke aktiv" (eller oversatt melding)
- [ ] Popup viser "Sist rapportert"-tidspunkt

### Kryss-interaksjon
- [ ] Klikk på markør markerer tilhørende element i sidepanelet
- [ ] Klikk på element i sidepanelet flyr kartet til riktig markør
- [ ] Markøren får blå ramme (#007079) når valgt

> **Notat:**
>

---

## 5. Sidepanel – faner og liste

- [ ] "Parkering"-fane viser antall parkeringsplasser i badge
- [ ] "Bysykkel"-fane viser antall stasjoner i badge
- [ ] Bytte fane bytter innholdet i listen
- [ ] Bytte fane tømmer søkefeltet
- [ ] Listen er sortert etter tilgjengelighet (høyest først)
- [ ] Klikk på listeelement markerer det (blå venstre-kant + bakgrunn)
- [ ] Inaktive sykkelstasjoner vises med 50% gjennomsiktighet i listen

> **Notat:**
>

---

## 6. Lag-veksling (layer toggles)

- [ ] Klikk "P"-knappen skjuler/viser alle parkeringsmarkører på kartet
- [ ] Klikk sykkel-knappen skjuler/viser alle sykkelmarkører på kartet
- [ ] Aktiv toggle har turkis bakgrunn + hvit tekst
- [ ] Inaktiv toggle har grå bakgrunn
- [ ] Begge lag kan være av samtidig (tomt kart)
- [ ] Begge lag kan være på samtidig (alle markører vises)

> **Notat:**
>

---

## 7. Søk og filtrering

- [ ] Skriv i søkefeltet – listen filtreres i sanntid
- [ ] Søk er case-insensitivt (f.eks. "SENTRUM" = "sentrum")
- [ ] Norske tegn fungerer (ø, æ, å)
- [ ] Markører som ikke matcher dimmes til 25% opacity på kartet
- [ ] Tøm-knappen (×) vises når søkefeltet har tekst
- [ ] Klikk × tømmer søket og viser alle resultater
- [ ] Placeholder endres basert på fane ("Søk parkering…" / "Søk bysykkelstasjon…")

### Tomme resultater
- [ ] Søk etter noe som ikke finnes → "Ingen resultater for «[søkeord]»"
- [ ] Slett søketekst → alle elementer vises igjen

> **Notat:**
>

---

## 8. Oppdatering og auto-refresh

### Manuell oppdatering
- [ ] Klikk oppdater-knappen → ikonet spinner
- [ ] Knappen er deaktivert (grå) under lasting
- [ ] "Sist oppdatert"-tid oppdateres etter vellykket refresh

### Auto-oppdatering
- [ ] Standard intervall er 1 min (verifiser i dropdown)
- [ ] Bytt til 30 sek → data oppdateres automatisk innen 30 sek
- [ ] "Sist oppdatert"-tidspunktet endres etter hvert intervall
- [ ] Bytt til 5 min → verifiser at det tar lengre tid mellom oppdateringer

> **Notat:**
>

---

## 9. Språkbytte (i18n)

### Norsk (NO) – standard
- [ ] NO-knapp er aktiv ved oppstart (turkis bakgrunn)
- [ ] All tekst er på norsk

### Engelsk (EN)
- [ ] Klikk EN → all tekst bytter til engelsk umiddelbart
- [ ] Faner: "Parking" / "City Bike"
- [ ] Søke-placeholder: "Search parking…" / "Search bike station…"
- [ ] Feilmelding (hvis synlig): "Could not load data. Please try again later."
- [ ] Popup-tekst: "free spots", "Available bikes", "Available docks", "Capacity"

### Spansk (ES)
- [ ] Klikk ES → all tekst bytter til spansk umiddelbart

### Persistens
- [ ] Bytt til EN, last siden på nytt → EN er fortsatt valgt
- [ ] Språkvalg lagres i localStorage

> **Notat:**
>

---

## 10. Responsivt design

### Desktop (≥ 768px)
- [ ] Sidepanel vises til venstre (300px bredde)
- [ ] Kartet fyller resten av skjermen
- [ ] "Oppdater"-label vises ved dropdown

### Mobil (< 768px)
- [ ] Kartet vises øverst (~55% høyde)
- [ ] Sidepanelet vises nederst (~45% høyde)
- [ ] Sidepanelet er scrollbart
- [ ] Touch-vennlige knapper (min 44px)
- [ ] Oppdater-knappen er større (44x44px)
- [ ] "Oppdater"-label er skjult

### Overgang
- [ ] Endre vindusbredde over/under 768px → layout bytter uten feil

> **Notat:**
>

---

## 11. Feilhåndtering

- [ ] Slå av nettverk (DevTools → Offline) → feilbanner vises øverst
- [ ] Feilbanner viser rød bakgrunn med feilikon og melding
- [ ] Feilbanner har `role="alert"` (sjekk i DevTools)
- [ ] Slå på nettverk igjen → neste oppdatering fjerner feilbanneret
- [ ] Appen krasjer ikke ved API-feil – UI forblir interaktivt

> **Notat:**
>

---

## 12. PWA og offline

### Installasjon
- [ ] Nettleseren tilbyr "Installer" / "Legg til på hjemskjerm"
- [ ] Installert app åpnes i standalone-modus (ingen adressefelt)
- [ ] App-ikon vises korrekt (192px og 512px)

### Offline-modus
- [ ] Besøk appen med nettverk → data caches
- [ ] Slå av nettverk → last siden på nytt
- [ ] Cachet UI og data vises (inntil 5 min gammelt)
- [ ] Feilbanner vises for nye data-forespørsler som feiler

> **Notat:**
>

---

## 13. Tilgjengelighet (stikkprøve)

- [ ] Tab-navigasjon fungerer gjennom alle interaktive elementer
- [ ] Søkefelt har `aria-label="Search"` (eller oversatt)
- [ ] Tøm-knapp har `aria-label="Clear search"` (eller oversatt)
- [ ] Feilbanner har `role="alert"`
- [ ] Skjermleser annonserer feilmeldinger
- [ ] Kontrast mellom tekst og bakgrunn er tilstrekkelig lesbar

> **Notat:**
>

---

## 14. Ytelse (stikkprøve)

- [ ] Første lasting < 3 sekunder (normal nettverkshastighet)
- [ ] Søkefiltrering skjer uten merkbar forsinkelse
- [ ] Kart-panorering og zoom er jevnt (ingen hakking)
- [ ] Bytte faner skjer umiddelbart
- [ ] Ingen minnelekkasjer ved gjentatte oppdateringer (sjekk DevTools → Memory)

> **Notat:**
>

---

## Oppsummering

| Kategori | Bestått | Feil | Ikke testet |
|----------|---------|------|-------------|
| Oppstart og lasting | | | |
| Kart – visning | | | |
| Markør-farger | | | |
| Markør-interaksjon | | | |
| Sidepanel – faner | | | |
| Lag-veksling | | | |
| Søk og filtrering | | | |
| Oppdatering | | | |
| Språkbytte | | | |
| Responsivt design | | | |
| Feilhåndtering | | | |
| PWA og offline | | | |
| Tilgjengelighet | | | |
| Ytelse | | | |

### Totalvurdering

- [ ] ✅ **Bestått** – Klar for produksjon
- [ ] ⚠️ **Betinget bestått** – Mindre feil funnet, ikke blokkerende
- [ ] ❌ **Ikke bestått** – Kritiske feil funnet

### Funn og kommentarer

>

