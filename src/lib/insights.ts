/**
 * Editorial "Insights" content. The English long-form lives on each Insight
 * (unchanged). French translations live in a parallel `INSIGHTS_FR` map keyed
 * by slug; language-neutral fields (slug, date, readingMinutes, accent) are not
 * duplicated. Use `localizeInsight(post, lang)` to resolve to a locale.
 * Figures are deliberately qualitative, not fabricated metrics.
 */

import type { Lang } from "@/lib/lang";

export type Insight = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  readingMinutes: number;
  accent: string;
  body: { heading: string; paragraphs: string[] }[];
};

/** Translatable subset of an Insight. Language-neutral fields are omitted. */
export type InsightL10n = Pick<
  Insight,
  "category" | "title" | "excerpt" | "body"
>;

export const INSIGHTS: Insight[] = [
  {
    slug: "engineering-for-the-long-horizon",
    category: "Engineering",
    title: "Engineering software that lasts",
    excerpt:
      "Why we optimise for software that is still fast, secure and legible years after launch — not just impressive on day one.",
    date: "2026-05-18",
    readingMinutes: 6,
    accent: "#4f8cff",
    body: [
      {
        heading: "The demo is the wrong target",
        paragraphs: [
          "A lot of software is built to look good in a first demo. It is a rational response to how projects are pitched and approved — but it quietly caps the quality of what gets shipped. Anything whose payoff arrives after launch tends to get cut.",
          "We aim at a different target. When the goal is software that is still maintainable a few years out, a different class of work becomes worth doing: clear architecture, real test coverage, and interfaces that stay obvious as the team turns over.",
        ],
      },
      {
        heading: "Maintainability is a feature",
        paragraphs: [
          "Maintainability is usually treated as an afterthought. We treat it as a feature you build deliberately — legible code, sensible boundaries and observability that lets the next engineer understand the system without a tour.",
          "The discipline is not in shipping once. It is in continuing to ship, measure and refine while the system carries real load.",
        ],
      },
      {
        heading: "Reliable, not just impressive",
        paragraphs: [
          "A prototype is designed to impress. Production software is designed to be relied upon. The two require almost opposite engineering cultures, and conflating them is the most common way ambitious projects fail.",
          "Everything we ship is built to the second standard. The question we ask is not whether something looks remarkable in a controlled setting, but whether other people can build their own work on top of it without thinking about it.",
        ],
      },
    ],
  },
  {
    slug: "making-ai-dependable-in-production",
    category: "Data & AI",
    title: "Making AI dependable in production",
    excerpt:
      "Frontier capability is necessary but not sufficient. The harder problem is making intelligent systems dependable enough to carry weight in production.",
    date: "2026-04-02",
    readingMinutes: 7,
    accent: "#6b9dff",
    body: [
      {
        heading: "From capability to dependability",
        paragraphs: [
          "The public conversation about AI fixates on capability — what a model can do at its best. In production, the binding constraint is almost always dependability: what a system does reliably, at its worst, on its hundred-thousandth call of the day.",
          "Closing that gap is an engineering problem, not a research one. It lives in evaluation harnesses, fallbacks, guardrails, observability and the unglamorous discipline of treating model behaviour as something to be measured rather than admired.",
        ],
      },
      {
        heading: "Agents that plan, act and self-correct",
        paragraphs: [
          "Automated agents are most useful where the workflow is too complex to script in advance. That same property makes them hard to trust: the system is deciding, not following a fixed path.",
          "We design agents around a tight loop — plan, act, observe, correct — and around the assumption that any individual step can be wrong. Robustness comes from the loop, not from any one decision being perfect.",
        ],
      },
      {
        heading: "Engineered for production, not demos",
        paragraphs: [
          "A model that performs brilliantly in a notebook and unpredictably under load has not been deployed; it has been previewed. The work of deployment is everything that happens after the impressive result.",
          "That is where we spend our effort: latency budgets, graceful degradation, cost control and the operational tooling that lets a team run an intelligent system the way they would run any other critical service.",
        ],
      },
    ],
  },
  {
    slug: "one-team-four-poles",
    category: "Studio",
    title: "One team, four poles.",
    excerpt:
      "How strategy, design & development, data & AI, and cloud work as a single team rather than four handoffs.",
    date: "2026-02-21",
    readingMinutes: 5,
    accent: "#3d6fe0",
    body: [
      {
        heading: "One team, not a relay race",
        paragraphs: [
          "Most digital work is broken into handoffs: strategy throws a deck over the wall to design, design to engineering, engineering to ops. Each handoff loses context, and the product pays for it.",
          "We run as one team across four poles — Strategy & Consulting, Design & Development, Data & AI, and Cloud & Infrastructure. The people who frame the problem are close to the people who build it and the people who keep it running.",
        ],
      },
      {
        heading: "An idea, covered end to end",
        paragraphs: [
          "Each pole is a full discipline, but they share a single standard of engineering. Strategy de-risks the idea, design and development build it, data and AI make operations legible, and cloud keeps it fast and reliable.",
          "Treating the four as one practice — rather than four vendors — is what lets an idea travel from a sharp question to a product that holds up, without losing anything in translation.",
        ],
      },
    ],
  },
  {
    slug: "hardening-a-public-web-platform",
    category: "Security",
    title: "The hardening checklist we apply to our own site",
    excerpt:
      "Most companies that sell security never show their own. Here is the exact checklist this site runs in production — headers, isolation, data minimisation — and how to verify every line from outside.",
    date: "2026-06-24",
    readingMinutes: 8,
    accent: "#58a8ff",
    body: [
      {
        heading: "Your public site is your first security reference",
        paragraphs: [
          "Before a prospective client ever asks for your certifications, they can run one command against your website and learn how seriously you take the basics. A marketing site is a small attack surface, but it is also the only system of yours the whole world can inspect — which makes it the cheapest credibility signal in security work, and the most commonly wasted one.",
          "This article is the checklist we apply to our own platform. None of it is exotic. All of it is verifiable from the outside, which is precisely the point: a security claim you cannot check is marketing, not engineering.",
        ],
      },
      {
        heading: "Headers first: the cheap, verifiable layer",
        paragraphs: [
          "Response headers are the closest thing the web has to free security. Strict-Transport-Security with a long max-age, includeSubDomains and preload removes the HTTP downgrade path entirely. A Content-Security-Policy — even a pragmatic one — turns most injection attacks from incidents into log lines. X-Frame-Options: DENY ends clickjacking; X-Content-Type-Options: nosniff ends MIME confusion; Referrer-Policy: no-referrer means your visitors' journeys leak to no one.",
          "The less-known pair is worth adopting too: Cross-Origin-Opener-Policy and Cross-Origin-Resource-Policy pinned to same-origin isolate your browsing context and resources from hostile pages. And a Permissions-Policy that denies camera, microphone, geolocation, payment, USB and their siblings costs one line and removes an entire class of abuse — a marketing site has no business touching any of that hardware.",
          "Every header above is one entry in a config file. The whole layer takes an afternoon, survives redesigns, and is testable by anyone with curl.",
        ],
      },
      {
        heading: "Forms are the front door",
        paragraphs: [
          "The contact form is usually the only writable endpoint on a marketing site, and therefore the only one attackers care about. Two disciplines cover most of the risk. First, minimisation: the endpoint should accept exactly the fields the form shows, validated for shape and size, and nothing else — no hidden metadata, no echo of client state. Second, rate limiting: even a simple per-IP window turns automated abuse from a flood into a trickle.",
          "The same minimisation logic applies to what you collect passively. Third-party trackers are not just a privacy question; every external script is a supply-chain grant of execution inside your origin. Cookieless, aggregate analytics answer the questions a studio actually has — did anyone read this? — without importing someone else's attack surface.",
        ],
      },
      {
        heading: "Verify from outside, always",
        paragraphs: [
          "A hardening pass is not finished when the config is written; it is finished when an outsider can confirm it. Three checks take under a minute: read the raw headers with curl -sI, grade the TLS configuration with SSL Labs, and score the header set with securityheaders.com. If those three disagree with what you believe you shipped, believe them.",
          "Finally, publish a security.txt at /.well-known/security.txt with a real contact and an honest expiry date. It is nine lines, it is where researchers look first, and its absence tells them — accurately — that nobody thought about the question. Ours links to a disclosure policy that promises what we can keep: fast acknowledgement, no legal threats against good-faith research, credit if wanted.",
          "Everything in this article is live on this site right now. The security page in the footer lists each measure alongside the command that proves it — which is exactly the standard we would ask of any vendor selling us security.",
        ],
      },
      {
        heading: "The checklist",
        paragraphs: [
          "Transport: HSTS (long max-age, includeSubDomains, preload). Injection: Content-Security-Policy on every response. Embedding: X-Frame-Options DENY. Sniffing: X-Content-Type-Options nosniff. Privacy: Referrer-Policy no-referrer, no third-party trackers, cookieless analytics. Isolation: COOP and CORP same-origin. Hardware: Permissions-Policy denying everything unused. Forms: strict validation plus rate limiting. Disclosure: security.txt plus a written policy.",
          "None of these items is impressive alone. Together they are the difference between a site that claims security and one that demonstrates it — and they take less time than the average homepage animation.",
        ],
      },
    ],
  },
  {
    slug: "threat-modelling-for-small-teams",
    category: "Security",
    title: "Threat modelling for small teams: a 90-minute method",
    excerpt:
      "You don't need a security department to threat-model. A whiteboard, the right four questions and ninety minutes will find the risks that actually matter — and tell you what to fix first.",
    date: "2026-07-08",
    readingMinutes: 9,
    accent: "#3d6fe0",
    body: [
      {
        heading: "The four questions",
        paragraphs: [
          "Every threat-modelling framework, stripped of its ceremony, asks four questions: What are we building? What can go wrong? What are we going to do about it? Did we do a good job? A small team can answer all four usefully in a single ninety-minute session — if it resists the urge to be exhaustive and aims instead to be honest.",
          "The prerequisite is a picture. Draw the system as boxes and arrows: users, services, data stores, third parties, and every place data crosses a boundary — network, privilege, organisation. Most of the value of threat modelling is in this drawing, because the risks live on the arrows, not in the boxes.",
        ],
      },
      {
        heading: "What can go wrong: follow the assets, not the headlines",
        paragraphs: [
          "Small teams over-index on the attacks they read about and under-index on the ones they will actually face. Start from assets instead: what do we hold that someone would want — credentials, customer data, money movement, compute, reputation? For each asset, walk the drawing and ask who touches it and through which boundary.",
          "STRIDE is a serviceable checklist for the walk: spoofing, tampering, repudiation, information disclosure, denial of service, elevation of privilege. But the highest-yield question for a small company is blunter: 'What happens when a laptop is stolen, a token leaks, or one teammate is phished?' If the honest answer is 'everything falls', the model has already earned its ninety minutes.",
          "Write threats down as scenarios with an actor and a path — 'a phished contractor account can reach the production database' — not as categories. Scenarios can be tested, priced and fixed; categories can only be nodded at.",
        ],
      },
      {
        heading: "What to do about it: the boring hierarchy",
        paragraphs: [
          "Rank what you found by damage times ease, then fix in the order that shortens the list fastest. In practice, the same handful of mitigations tops the list for nearly every small team: hardware-key or app-based MFA everywhere, short-lived credentials instead of long-lived API keys, least-privilege access reviewed on a calendar, offline or otherwise unreachable backups, and dependency updates on automation rather than memory.",
          "Notice what is not on that list: products. Small teams buy tools to feel safer; attackers exploit the gaps between tools. Until identity, credentials and backups are disciplined, a new dashboard mostly adds another login to phish.",
          "Each accepted risk deserves a sentence in writing — 'we accept X until Y because Z'. The sentence is not bureaucracy; it is what lets a future you distinguish a decision from an oversight.",
        ],
      },
      {
        heading: "Did we do a good job: make it a loop",
        paragraphs: [
          "A threat model is a snapshot, and systems move. The method only compounds if the session recurs — quarterly is enough for most small teams, or whenever an arrow changes: a new integration, a new data store, a new class of user. Re-walk the drawing, retire scenarios you have closed, add the ones the new arrows create.",
          "The measure of success is not the document. It is that the next architectural decision gets made with the drawing in the room — that someone says 'that arrow crosses a boundary, what's the story there?' before the code is written rather than after the incident. Ninety minutes a quarter is the cheapest security budget a small company will ever approve, and the one with the highest return.",
        ],
      },
    ],
  },
];

/**
 * French translations keyed by slug. Mirrors the translatable fields of the
 * English entries above (same block count, ordering and paragraph counts).
 * Slugs, dates, reading times and accents are language-neutral.
 */
export const INSIGHTS_FR: Record<string, InsightL10n> = {
  "engineering-for-the-long-horizon": {
    category: "Ingénierie",
    title: "Concevoir un logiciel qui dure",
    excerpt:
      "Pourquoi nous concevons des logiciels encore rapides, sûrs et lisibles des années après le lancement — pas seulement impressionnants le premier jour.",
    body: [
      {
        heading: "La démo est la mauvaise cible",
        paragraphs: [
          "Beaucoup de logiciels sont conçus pour faire bonne impression lors d'une première démonstration. C'est une réponse rationnelle à la manière dont les projets sont présentés et validés — mais cela plafonne discrètement la qualité de ce qui est livré. Tout ce dont le bénéfice arrive après le lancement tend à être sacrifié.",
          "Nous visons une autre cible. Lorsque l'objectif est un logiciel encore maintenable quelques années plus tard, une autre catégorie de travail mérite d'être entreprise : une architecture claire, une vraie couverture de tests et des interfaces qui restent évidentes à mesure que l'équipe se renouvelle.",
        ],
      },
      {
        heading: "La maintenabilité est une fonctionnalité",
        paragraphs: [
          "La maintenabilité est généralement traitée comme une réflexion après coup. Nous la traitons comme une fonctionnalité que l'on construit délibérément — un code lisible, des frontières sensées et une observabilité qui permet à l'ingénieur suivant de comprendre le système sans visite guidée.",
          "La discipline ne consiste pas à livrer une fois. Elle consiste à continuer de livrer, de mesurer et d'affiner pendant que le système supporte une charge réelle.",
        ],
      },
      {
        heading: "Fiable, pas seulement impressionnant",
        paragraphs: [
          "Un prototype est conçu pour impressionner. Un logiciel de production est conçu pour qu'on puisse s'y fier. Les deux exigent des cultures d'ingénierie presque opposées, et les confondre est la manière la plus courante dont des projets ambitieux échouent.",
          "Tout ce que nous livrons est construit selon le second standard. La question que nous posons n'est pas de savoir si quelque chose paraît remarquable dans un cadre contrôlé, mais si d'autres peuvent bâtir leur propre travail dessus sans avoir à y penser.",
        ],
      },
    ],
  },
  "making-ai-dependable-in-production": {
    category: "Données & IA",
    title: "Rendre l'IA fiable en production",
    excerpt:
      "La capacité de pointe est nécessaire, mais pas suffisante. Le plus difficile est de rendre les systèmes intelligents assez fiables pour qu'on leur confie de vraies décisions en production.",
    body: [
      {
        heading: "De la capacité à la fiabilité",
        paragraphs: [
          "Le débat public sur l'IA se focalise sur la capacité — ce qu'un modèle peut faire au mieux de sa forme. En production, la contrainte déterminante est presque toujours la fiabilité : ce qu'un système fait de manière constante, dans le pire des cas, à son cent-millième appel de la journée.",
          "Combler cet écart est un problème d'ingénierie, pas de recherche. Il se loge dans les bancs d'évaluation, les solutions de repli, les garde-fous, l'observabilité et la discipline ingrate qui consiste à traiter le comportement du modèle comme quelque chose à mesurer plutôt qu'à admirer.",
        ],
      },
      {
        heading: "Des agents qui planifient, agissent et se corrigent",
        paragraphs: [
          "Les agents automatisés sont les plus utiles là où le flux de travail est trop complexe pour être scripté à l'avance. Cette même propriété les rend difficiles à fiabiliser : le système décide, au lieu de suivre un chemin figé.",
          "Nous concevons les agents autour d'une boucle serrée — planifier, agir, observer, corriger — et autour de l'hypothèse que chaque étape individuelle peut être erronée. La robustesse vient de la boucle, et non de la perfection d'une décision isolée.",
        ],
      },
      {
        heading: "Conçu pour la production, pas pour les démos",
        paragraphs: [
          "Un modèle qui se comporte brillamment dans un notebook et de façon imprévisible sous charge n'a pas été déployé ; il a été présenté en avant-première. Le travail de déploiement, c'est tout ce qui se passe après le résultat impressionnant.",
          "C'est là que nous concentrons nos efforts : budgets de latence, dégradation maîtrisée, contrôle des coûts et l'outillage opérationnel qui permet à une équipe d'exploiter un système intelligent comme elle exploiterait tout autre service critique.",
        ],
      },
    ],
  },
  "one-team-four-poles": {
    category: "Studio",
    title: "Une équipe, quatre pôles.",
    excerpt:
      "Comment le conseil, la conception & le développement, les données & l'IA et le cloud fonctionnent comme une seule équipe plutôt que comme quatre passations.",
    body: [
      {
        heading: "Une équipe, pas une course de relais",
        paragraphs: [
          "La plupart des projets numériques sont fragmentés en passations : la stratégie envoie une présentation par-dessus le mur au design, le design à l'ingénierie, l'ingénierie à l'exploitation. Chaque passation perd du contexte, et le produit en paie le prix.",
          "Nous fonctionnons comme une seule équipe répartie sur quatre pôles — Conseil & stratégie, Conception & développement, Données & IA, et Cloud & infrastructure. Ceux qui cadrent le problème sont proches de ceux qui le construisent et de ceux qui le maintiennent en marche.",
        ],
      },
      {
        heading: "Une idée, prise en charge de bout en bout",
        paragraphs: [
          "Chaque pôle est une discipline à part entière, mais tous partagent un même standard d'ingénierie. Le conseil écarte les risques de l'idée, la conception et le développement la construisent, les données et l'IA rendent l'exploitation lisible, et le cloud la maintient rapide et fiable.",
          "Traiter ces quatre pôles comme une seule pratique — plutôt que comme quatre prestataires — est ce qui permet à une idée de voyager d'une question précise jusqu'à un produit qui tient la route, sans rien perdre en chemin.",
        ],
      },
    ],
  },
  "hardening-a-public-web-platform": {
    category: "Sécurité",
    title: "La checklist de durcissement que nous appliquons à notre propre site",
    excerpt:
      "La plupart des entreprises qui vendent de la sécurité ne montrent jamais la leur. Voici la checklist exacte que ce site exécute en production — en-têtes, isolation, minimisation des données — et comment vérifier chaque ligne de l'extérieur.",
    body: [
      {
        heading: "Votre site public est votre première référence de sécurité",
        paragraphs: [
          "Avant même de demander vos certifications, un client potentiel peut lancer une seule commande contre votre site web et apprendre à quel point vous prenez les fondamentaux au sérieux. Un site vitrine est une petite surface d'attaque, mais c'est aussi le seul de vos systèmes que le monde entier peut inspecter — ce qui en fait le signal de crédibilité le moins cher du métier de la sécurité, et le plus souvent gaspillé.",
          "Cet article est la checklist que nous appliquons à notre propre plateforme. Rien d'exotique. Tout est vérifiable de l'extérieur, et c'est précisément le but : une affirmation de sécurité que l'on ne peut pas contrôler relève du marketing, pas de l'ingénierie.",
        ],
      },
      {
        heading: "Les en-têtes d'abord : la couche bon marché et vérifiable",
        paragraphs: [
          "Les en-têtes de réponse sont ce que le web offre de plus proche d'une sécurité gratuite. Strict-Transport-Security avec un max-age long, includeSubDomains et preload supprime définitivement le chemin de rétrogradation HTTP. Une Content-Security-Policy — même pragmatique — transforme la plupart des attaques par injection en simples lignes de journal. X-Frame-Options : DENY met fin au clickjacking ; X-Content-Type-Options : nosniff met fin à la confusion MIME ; Referrer-Policy : no-referrer signifie que les parcours de vos visiteurs ne fuient vers personne.",
          "La paire moins connue mérite aussi l'adoption : Cross-Origin-Opener-Policy et Cross-Origin-Resource-Policy verrouillés en same-origin isolent votre contexte de navigation et vos ressources des pages hostiles. Et une Permissions-Policy qui refuse caméra, micro, géolocalisation, paiement, USB et leurs semblables coûte une ligne et supprime une classe entière d'abus — un site vitrine n'a aucune raison de toucher à ce matériel.",
          "Chaque en-tête ci-dessus est une entrée dans un fichier de configuration. La couche complète prend un après-midi, survit aux refontes, et se teste avec curl.",
        ],
      },
      {
        heading: "Les formulaires sont la porte d'entrée",
        paragraphs: [
          "Le formulaire de contact est généralement le seul point d'écriture d'un site vitrine, donc le seul qui intéresse les attaquants. Deux disciplines couvrent l'essentiel du risque. D'abord, la minimisation : le point d'entrée doit accepter exactement les champs que le formulaire affiche, validés en forme et en taille, et rien d'autre — pas de métadonnées cachées, pas d'écho de l'état du client. Ensuite, la limitation de débit : même une simple fenêtre par IP transforme l'abus automatisé d'un déluge en filet d'eau.",
          "La même logique de minimisation s'applique à ce que vous collectez passivement. Les traqueurs tiers ne sont pas qu'une question de vie privée ; chaque script externe est une délégation d'exécution dans votre origine, au sens chaîne d'approvisionnement. Une mesure d'audience agrégée et sans cookie répond aux questions qu'un studio se pose réellement — quelqu'un a-t-il lu ceci ? — sans importer la surface d'attaque de quelqu'un d'autre.",
        ],
      },
      {
        heading: "Vérifier de l'extérieur, toujours",
        paragraphs: [
          "Une passe de durcissement n'est pas terminée quand la configuration est écrite ; elle est terminée quand un tiers peut la confirmer. Trois contrôles prennent moins d'une minute : lire les en-têtes bruts avec curl -sI, noter la configuration TLS avec SSL Labs, et évaluer le jeu d'en-têtes avec securityheaders.com. Si ces trois-là contredisent ce que vous croyez avoir livré, croyez-les.",
          "Enfin, publiez un security.txt sous /.well-known/security.txt avec un vrai contact et une date d'expiration honnête. Cela tient en neuf lignes, c'est là que les chercheurs regardent en premier, et son absence leur dit — à juste titre — que personne ne s'est posé la question. Le nôtre renvoie vers une politique de divulgation qui promet ce que nous pouvons tenir : un accusé de réception rapide, aucune menace juridique contre la recherche de bonne foi, un crédit si souhaité.",
          "Tout ce que décrit cet article est en production sur ce site, maintenant. La page sécurité du pied de page liste chaque mesure avec la commande qui la prouve — exactement le standard que nous exigerions de tout prestataire qui nous vendrait de la sécurité.",
        ],
      },
      {
        heading: "La checklist",
        paragraphs: [
          "Transport : HSTS (max-age long, includeSubDomains, preload). Injection : Content-Security-Policy sur chaque réponse. Intégration : X-Frame-Options DENY. Sniffing : X-Content-Type-Options nosniff. Vie privée : Referrer-Policy no-referrer, aucun traqueur tiers, mesure d'audience sans cookie. Isolation : COOP et CORP en same-origin. Matériel : Permissions-Policy refusant tout ce qui est inutilisé. Formulaires : validation stricte plus limitation de débit. Divulgation : security.txt plus une politique écrite.",
          "Aucun de ces éléments n'impressionne isolément. Ensemble, ils font la différence entre un site qui affirme la sécurité et un site qui la démontre — et ils prennent moins de temps que l'animation moyenne d'une page d'accueil.",
        ],
      },
    ],
  },
  "threat-modelling-for-small-teams": {
    category: "Sécurité",
    title: "Threat modelling pour petites équipes : une méthode en 90 minutes",
    excerpt:
      "Pas besoin d'un département sécurité pour modéliser les menaces. Un tableau blanc, les quatre bonnes questions et quatre-vingt-dix minutes suffisent à trouver les risques qui comptent vraiment — et à savoir quoi corriger en premier.",
    body: [
      {
        heading: "Les quatre questions",
        paragraphs: [
          "Tout cadre de modélisation des menaces, débarrassé de son cérémonial, pose quatre questions : Que construisons-nous ? Qu'est-ce qui peut mal tourner ? Qu'allons-nous y faire ? Avons-nous bien travaillé ? Une petite équipe peut répondre utilement aux quatre en une seule session de quatre-vingt-dix minutes — à condition de résister à l'envie d'être exhaustive et de viser plutôt l'honnêteté.",
          "Le prérequis est un dessin. Représentez le système en boîtes et en flèches : utilisateurs, services, bases de données, tiers, et chaque endroit où la donnée franchit une frontière — réseau, privilège, organisation. L'essentiel de la valeur du threat modelling tient dans ce dessin, car les risques vivent sur les flèches, pas dans les boîtes.",
        ],
      },
      {
        heading: "Ce qui peut mal tourner : suivre les actifs, pas les gros titres",
        paragraphs: [
          "Les petites équipes surestiment les attaques dont elles lisent le récit et sous-estiment celles qu'elles affronteront réellement. Partez plutôt des actifs : que détenons-nous que quelqu'un voudrait — identifiants, données clients, mouvements d'argent, capacité de calcul, réputation ? Pour chaque actif, parcourez le dessin et demandez qui le touche et par quelle frontière.",
          "STRIDE est une checklist honorable pour ce parcours : usurpation, altération, répudiation, divulgation d'information, déni de service, élévation de privilège. Mais la question au meilleur rendement pour une petite structure est plus brutale : « Que se passe-t-il quand un portable est volé, qu'un jeton fuit, ou qu'un collègue se fait hameçonner ? » Si la réponse honnête est « tout s'effondre », le modèle a déjà rentabilisé ses quatre-vingt-dix minutes.",
          "Notez les menaces comme des scénarios avec un acteur et un chemin — « un compte de prestataire hameçonné peut atteindre la base de production » — et non comme des catégories. Un scénario se teste, se chiffre et se corrige ; une catégorie ne fait que hocher la tête.",
        ],
      },
      {
        heading: "Quoi faire : la hiérarchie ennuyeuse",
        paragraphs: [
          "Classez ce que vous avez trouvé par dégâts multipliés par facilité, puis corrigez dans l'ordre qui raccourcit la liste le plus vite. En pratique, la même poignée de mesures arrive en tête pour presque toutes les petites équipes : MFA par clé matérielle ou application partout, identifiants à courte durée de vie plutôt que clés d'API éternelles, moindre privilège revu à date fixe, sauvegardes hors ligne ou autrement inaccessibles, et mises à jour de dépendances automatisées plutôt que mémorisées.",
          "Remarquez ce qui ne figure pas dans cette liste : des produits. Les petites équipes achètent des outils pour se sentir plus sûres ; les attaquants exploitent les interstices entre les outils. Tant que l'identité, les identifiants et les sauvegardes ne sont pas disciplinés, un tableau de bord de plus ajoute surtout un login de plus à hameçonner.",
          "Chaque risque accepté mérite une phrase écrite — « nous acceptons X jusqu'à Y parce que Z ». Cette phrase n'est pas de la bureaucratie ; c'est ce qui permettra à votre futur vous de distinguer une décision d'un oubli.",
        ],
      },
      {
        heading: "Avons-nous bien travaillé : en faire une boucle",
        paragraphs: [
          "Un modèle de menaces est un instantané, et les systèmes bougent. La méthode ne porte ses fruits que si la session se répète — un rythme trimestriel suffit à la plupart des petites équipes, ou dès qu'une flèche change : nouvelle intégration, nouvelle base, nouvelle catégorie d'utilisateurs. Reparcourez le dessin, retirez les scénarios clos, ajoutez ceux que créent les nouvelles flèches.",
          "La mesure du succès n'est pas le document. C'est que la prochaine décision d'architecture se prenne avec le dessin dans la pièce — que quelqu'un dise « cette flèche franchit une frontière, quelle est l'histoire ici ? » avant que le code soit écrit plutôt qu'après l'incident. Quatre-vingt-dix minutes par trimestre : c'est le budget sécurité le moins cher qu'une petite entreprise validera jamais, et celui au meilleur rendement.",
        ],
      },
    ],
  },
};

/**
 * Return an Insight with its translatable fields resolved to `lang`.
 * Language-neutral fields are preserved; English is the fallback.
 */
export function localizeInsight(post: Insight, lang: Lang): Insight {
  if (lang === "en") return post;
  const fr = INSIGHTS_FR[post.slug];
  if (!fr) return post;
  return { ...post, ...fr };
}

export function getInsight(slug: string) {
  return INSIGHTS.find((i) => i.slug === slug);
}
