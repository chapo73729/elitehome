# ARDMUPRO — Kit visuel Instagram

Un système visuel « Niveau Juste » pour @ardmupro : charbon chaud, ivoire,
**un seul rouge**, serif élégante (Gloock) pour les énoncés, mono discrète
pour les annotations, et un motif signature — le **niveau à bulle** — sur
chaque visuel. Objectif : que la grille entière se lise comme une seule
marque, précise et haut de gamme, à l'image du travail.

## Ce qui change par rapport à la grille actuelle

- **Un seul rouge** (`#c22333`) partout, en petite dose — fini les fonds
  rouges saturés qui varient d'un post à l'autre.
- **Deux polices, pas plus** : Gloock (énoncés) + DM Mono (étiquettes),
  logo en Instrument Sans. Fini le mélange serif/sans/effets.
- **Un squelette commun** : cadre filaire, tirets d'angle rouges, en-tête
  ARDMUPRO, numéro de planche, pied de page ARDMUPRO.CH.
- **Des figures dessinées** (niveau, fil à plomb, coupes, calepinage) au
  lieu de photos génériques — personne d'autre ne peut poster ça.

## Contenu (`assets/`)

| Fichier | Format | Usage |
|---|---|---|
| `avatar.png` | 1000×1000 | Photo de profil (recadrage rond safe) |
| `post-01.png` → `post-09.png` | 1080×1350 (4:5) | Grille de relance, 9 planches |
| `story-01-avant-apres.png` | 1080×1920 | Template Avant/Après (insérer 2 photos dans les zones) |
| `story-02-conseil.png` | 1080×1920 | Template « Conseil du lundi » (changer la citation) |
| `highlight-*.png` (×5) | 1080×1080 | Couvertures : SERVICES · PROJETS · AVANT/APRÈS · CONSEILS · CONTACT |
| `grid-preview.png` | — | Aperçu du profil (ne pas publier) |

Les 9 planches : 01 identité · 02 engagement · 03 gypserie · 04 peinture ·
05 isolation · 06 façades · 07 revêtements · 08 conseil (rénover avant de
vendre) · 09 devis gratuit.

## Ordre de publication

Instagram affiche du plus récent au plus ancien : **publier PL.09 en
premier, finir par PL.01** pour que le profil se lise dans l'ordre.
Un post par jour, ou tout d'un coup pour une relance propre.

## Bio suggérée

> **ARDMUPRO Sàrl**
> Rénovation & second œuvre — Suisse
> Gypserie · Peinture · Isolation · Façades · Revêtements
> Devis gratuit ↓
> www.ardmupro.ch

## Légendes prêtes à l'emploi

- **PL.01** — « Rénover, au niveau juste. Gypserie, peinture, isolation,
  façades, revêtements — partout en Suisse. Devis gratuit, lien en bio. »
- **PL.02** — « Solidité, précision, tranquillité d'esprit : ce que nous
  devons à chaque client, quelles que soient les contraintes. »
- **PL.03–07** — décrire le service en 2 phrases + « Devis gratuit — lien
  en bio ». Terminer par la question : « Un mur, un sol, une façade à
  refaire ? Écrivez-nous. »
- **PL.08** — « Rénover intelligemment avant de vendre peut augmenter la
  valeur de votre bien. Nous analysons votre appartement et ciblons les
  travaux les plus rentables. »
- **PL.09** — « Visite, métré, prix ferme : le devis est gratuit et sans
  engagement. → www.ardmupro.ch »

Hashtags (≤ 8, mixer selon le post) : `#renovation #suisse #gypserie
#peinture #isolation #facades #secondoeuvre #immobiliersuisse`
(+ ville selon le chantier : `#geneve #lausanne #valais…`)

## La vraie force : vos chantiers

Ce kit donne l'ossature — mais ce qui convertit, ce sont **les photos
réelles de chantiers** :

1. **Avant/Après** avec le template ST.01 : même cadrage, même lumière,
   photo droite (le niveau !). C'est le contenu n°1 du secteur.
2. **Reels courts** (10–20 s) : passes de taloche, coupe de parquet,
   bâchage propre — plans stables, sans musique criarde.
3. **1 conseil par semaine** avec ST.02 : vous devenez « l'artisan qui
   explique », pas « l'entreprise qui vend ».
4. Photos d'équipe : sobres, sur fond de chantier propre, jamais générées
   par IA — la confiance se joue là.

Rythme cible : 2 posts + 3 stories par semaine, réponses aux DM < 24 h.

## Regénérer / décliner

```bash
npm i playwright-core
node marketing/instagram-ardmupro/generate.mjs
```

Chaque visuel est un template HTML dans `generate.mjs` — dupliquer une
entrée de `PLATES` pour créer une nouvelle planche (nouveau service,
annonce, promo) : le squelette, les couleurs et les polices sont partagés.
`PHILOSOPHY.md` décrit la direction artistique.
