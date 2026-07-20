# ARDLABS® — Kit visuel Instagram

Un système visuel complet pour le profil Instagram, dérivé de la signature
« Compile » du site (fond nuit `#050505`, azur unique `#4f8cff`, Geist /
Geist Mono, cadres blueprint, annotations `// compile: … ok`). Chaque visuel
est une « planche » (PL.01 → PL.09) d'un même document technique : le profil
entier se lit comme un seul objet dessiné.

## Contenu (`assets/`)

| Fichier | Format | Usage |
|---|---|---|
| `avatar.png` | 1000×1000 | Photo de profil (pensée pour le recadrage rond) |
| `post-01.png` → `post-09.png` | 1080×1350 (4:5) | Grille de lancement, 9 planches |
| `story-01-shipped.png` | 1080×1920 | Story « projet livré » (teaser case study) |
| `story-02-insight.png` | 1080×1920 | Story « field note » (citation / insight) |
| `highlight-*.png` (×5) | 1080×1080 | Couvertures de highlights : WORK · STUDIO · AI · PROCESS · CONTACT |
| `grid-preview.png` | — | Aperçu du rendu de la grille sur le profil (ne pas publier) |

## Ordre de publication

Instagram affiche la grille du plus récent au plus ancien : **publier PL.09
en premier et finir par PL.01**, pour que le profil se lise PL.01 → PL.09.
Espacer d'un jour (ou publier les 9 d'un coup pour un relaunch).

Les 9 planches : 01 identité · 02 manifeste · 03–06 les quatre pôles
(Strategy, Design & Dev, Data & AI, Cloud) · 07 réseau mondial ·
08 sécurité · 09 contact.

## Bio suggérée

> **ARDLABS®**
> Digital Engineering Studio — Prague
> Software, platforms & AI, engineered to the detail.
> ↓ Compile your brief
> ardlabs.eu/contact

## Légendes prêtes à l'emploi (FR / EN)

- **PL.01** — FR : « Des idées complexes, des produits précis. Studio
  d'ingénierie digitale, Prague. » / EN : “Complex ideas, engineered into
  precise products. Digital engineering studio, Prague.”
- **PL.02** — FR : « La plupart des studios livrent des features. Nous
  concevons des produits. » / EN : “Most studios ship features. We engineer
  products.”
- **PL.03–06** — reprendre la tagline du pôle (« Clarity before code », etc.)
  et 2–3 capabilities en liste.
- **PL.07** — FR : « Basés à Prague, opérationnels partout. Async par défaut,
  précis à la livraison. »
- **PL.08** — FR : « La défense n'est pas une option ; elle est conçue dès le
  premier commit. »
- **PL.09** — FR : « Une idée qui mérite d'exister ? Compilez votre brief →
  ardlabs.eu/contact » (mettre le lien en bio).

Hashtags (garder ≤ 8, mixer) : `#digitalengineering #softwarestudio
#productdesign #buildinpublic #ai #saas #praguetech #designsystem`

## Règles du système (pour les futurs visuels)

1. **Un seul azur** (`#4f8cff`), jamais plus de ~10 % de la surface.
2. Toujours le squelette : cadre pointillé + 4 équerres + annotation
   `// compile: {sujet} … ok` + numéro de planche + `ARDLABS.EU`.
3. Deux voix typographiques seulement : Geist Light très grand (l'énoncé),
   Geist Mono très petit (les métadonnées). Pas de tailles intermédiaires.
4. Une figure centrale « dessinée » (traits fins, cotes, croix de repérage),
   jamais de photo brute sans traitement ni d'aplats décoratifs.
5. Photos d'équipe / studio : passer en noir & blanc, poser le même cadre
   blueprint par-dessus.

## Regénérer / décliner

```bash
npm i playwright-core           # une fois
node marketing/instagram/generate.mjs
```

Chromium est résolu via `PLAYWRIGHT_BROWSERS_PATH` ou `CHROMIUM_PATH`.
Chaque visuel est un template HTML dans `generate.mjs` : dupliquer une entrée
de `PLATES` (ou un template de story) pour produire une nouvelle planche —
le squelette et les polices sont partagés. `PHILOSOPHY.md` décrit la
direction artistique complète.
