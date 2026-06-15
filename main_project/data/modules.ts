export type ModuleCategory = "sonstige" | "schwerpunkt" | "ausserhalb";

export type ModuleStatus = "normal" | "wahlfach" | "alreadyTaken" | "never";

export type ModuleLanguage = "de" | "en" | "de-en";

export type FwpfModule = {
  id: string;
  title: string;
  category: ModuleCategory;
  sws: number;
  tags: string[];
  status?: ModuleStatus;
  priority?: number;
  favorite?: boolean;
  language?: ModuleLanguage;
};

export type ModuleDetails = {
  language: string;
  prerequisites: string;
  courseType: string;
  semester: string;
  workload: string[];
  studyGoalContribution: string;
  learningGoals: string;
  keyQualifications: string;
  contents: string[];
  literature: string[];
  assessment: string;
  aids: string;
  responsible: string;
};

export const categoryLabels: Record<ModuleCategory, string> = {
  sonstige: "Sonstige Modulgruppen",
  schwerpunkt: "Schwerpunkt Wirtschaftsinformatik",
  ausserhalb: "Außerhalb Schwerpunkt",
};

export const statusLabels: Record<Exclude<ModuleStatus, "normal">, string> = {
  wahlfach: "Wahlmodul",
  alreadyTaken: "hatte Sie schon",
  never: "auf keinen Fall",
};

export const languageLabels: Record<ModuleLanguage, string> = {
  de: "DE",
  en: "EN",
  "de-en": "DE/EN",
};

export function getModuleDetails(module: FwpfModule): ModuleDetails {
  const isBlock = module.tags.includes("Block");

  return {
    language:
      module.language === "en"
        ? "Englisch"
        : module.language === "de-en"
          ? "Deutsch oder Englisch"
          : "Deutsch",
    prerequisites: "Dummy-Text: Voraussetzungen und empfohlene Vorkenntnisse werden hier später aus dem Modulhandbuch übernommen.",
    courseType: `${module.sws} SWS ${isBlock ? "Blockveranstaltung" : "seminaristischer Unterricht"} mit Dummy-Beschreibung`,
    semester: "Dummy-Semesterturnus",
    workload: [
      "Dummy-Text: Gesamtaufwand wird noch ergänzt.",
      "Dummy-Text: Kontaktzeit wird noch ergänzt.",
      "Dummy-Text: Vor- und Nachbereitung wird noch ergänzt.",
    ],
    studyGoalContribution:
      "Dummy-Text: An dieser Stelle steht später, welchen Beitrag das Modul zu den Zielen des Studiengangs leistet. Der Text beschreibt knapp den modulbezogenen Kontext und den Nutzen für Studierende.",
    learningGoals:
      "Dummy-Text: Hier werden später die konkreten Lernziele des Moduls aufgeführt. Der Abschnitt erklärt, welche Kompetenzen Studierende nach erfolgreichem Abschluss erworben haben sollen.",
    keyQualifications:
      "Dummy-Text: Hier stehen später Schlüsselqualifikationen wie Analysefähigkeit, Teamarbeit, Präsentation oder eigenständige Problemlösung.",
    contents: [
      "Dummy-Inhaltspunkt 1: Einführung und thematische Einordnung",
      "Dummy-Inhaltspunkt 2: Grundlagen, Begriffe und typische Fragestellungen",
      "Dummy-Inhaltspunkt 3: Methoden, Werkzeuge oder Vorgehensweisen",
      "Dummy-Inhaltspunkt 4: Übungs- oder Praxisbeispiele",
      "Dummy-Inhaltspunkt 5: Zusammenfassung und Ausblick",
    ],
    literature: [
      "Dummy-Literatur: Quelle wird später ergänzt.",
      "Dummy-Literatur: Weitere Materialien werden später ergänzt.",
    ],
    assessment: "Dummy-Text: Leistungsnachweis wird später ergänzt.",
    aids: "Dummy-Text: Zugelassene Hilfsmittel werden später ergänzt.",
    responsible: "Dummy-Name der/des Modulverantwortlichen",
  };
}

export const modules: FwpfModule[] = [
  {
    id: "unternehmensgruendung",
    title: "Unternehmensgründung",
    category: "sonstige",
    sws: 2,
    tags: ["Sonstige"],
  },
  {
    id: "projektmanagement-trends",
    title: "Aktuelle Trends im Einsatz von Projektmanagement-Methoden",
    category: "schwerpunkt",
    sws: 4,
    tags: ["Block", "Schwerpunkt"],
    priority: 1,
    favorite: true,
  },
  {
    id: "operations-research",
    title: "Einführung in Operations-Research",
    category: "schwerpunkt",
    sws: 2,
    tags: ["Block", "Schwerpunkt"],
    priority: 5,
  },
  {
    id: "softwaretest",
    title: "Grundlagen des Softwaretests",
    category: "schwerpunkt",
    sws: 4,
    tags: ["Block", "Schwerpunkt"],
    priority: 2,
  },
  {
    id: "sap-hana",
    title: "In-Memory Computing am Beispiel von SAP HANA",
    category: "schwerpunkt",
    sws: 2,
    tags: ["Schwerpunkt"],
    priority: 3,
  },
  {
    id: "electronic-commerce",
    title: "Electronic Commerce",
    category: "schwerpunkt",
    sws: 4,
    tags: ["Schwerpunkt"],
    priority: 6,
  },
  {
    id: "sql-nosql",
    title: "Anwendungsentwicklung mit SQL- und NoSQL-Datenbanken",
    category: "schwerpunkt",
    sws: 4,
    tags: ["Schwerpunkt"],
    priority: 4,
  },
  {
    id: "crm",
    title: "Customer Relationship Management",
    category: "schwerpunkt",
    sws: 4,
    tags: ["Schwerpunkt"],
    priority: 8,
  },
  {
    id: "simulation",
    title: "Einsatz von Simulations-Software",
    category: "schwerpunkt",
    sws: 4,
    tags: ["Schwerpunkt"],
    priority: 7,
  },
  {
    id: "location-based",
    title: "Ortsbezogene Anwendungen und Dienste",
    category: "schwerpunkt",
    sws: 4,
    tags: ["Schwerpunkt"],
    priority: 12,
  },
  {
    id: "technisches-marketing",
    title: "Technisches Marketing",
    category: "schwerpunkt",
    sws: 4,
    tags: ["Schwerpunkt"],
    status: "alreadyTaken",
  },
  {
    id: "e-commerce-recht",
    title: "E-Commerce-Recht",
    category: "schwerpunkt",
    sws: 2,
    tags: ["Block", "Schwerpunkt"],
    priority: 9,
  },
  {
    id: "guiiv",
    title: "Graphical User Interface Design and Information Visualization",
    category: "schwerpunkt",
    sws: 4,
    tags: ["Schwerpunkt"],
    priority: 10,
    language: "en",
  },
  {
    id: "technical-computing",
    title: "Technical Computing",
    category: "ausserhalb",
    sws: 4,
    tags: ["Außerhalb"],
    priority: 13,
    language: "en",
  },
  {
    id: "visualisierung",
    title: "Visualisierung",
    category: "ausserhalb",
    sws: 4,
    tags: ["Außerhalb"],
    priority: 11,
  },
  {
    id: "mikrocontroller",
    title: "Betriebssysteme für einfache Mikrocontroller",
    category: "ausserhalb",
    sws: 2,
    tags: ["Block", "Außerhalb"],
    status: "never",
  },
  {
    id: "embedded-systems",
    title: "Embedded Systems",
    category: "ausserhalb",
    sws: 4,
    tags: ["Außerhalb"],
    status: "wahlfach",
    language: "en",
  },
  {
    id: "web-security",
    title: "Web Application Security",
    category: "ausserhalb",
    sws: 4,
    tags: ["Block", "Außerhalb"],
    priority: 14,
    language: "de-en",
  },
  {
    id: "cms",
    title: "Grundlagen Content-Management-Systeme",
    category: "ausserhalb",
    sws: 4,
    tags: ["Außerhalb"],
    status: "never",
  },
];

export const prioritizedModules = [...modules]
  .filter((module) => module.priority)
  .sort((a, b) => Number(a.priority) - Number(b.priority));

export const neverModules = modules.filter((module) => module.status === "never");

export const electiveModules = modules.filter((module) => module.status === "wahlfach");
