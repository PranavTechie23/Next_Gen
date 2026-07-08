/** TPO dashboard tab IDs — synced to URL via ?tab= */
export const TPO_TABS = [
  "overview",
  "drives",
  "analytics",
  "placements",
  "students",
  "reports",
] as const;

export type TPOTab = (typeof TPO_TABS)[number];

export const TPO_TAB_ITEMS: { id: TPOTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "drives", label: "Drives" },
  { id: "analytics", label: "Analytics" },
  { id: "placements", label: "Offers & Pipeline" },
  { id: "students", label: "Student Registry" },
  { id: "reports", label: "Reports" },
];

export const TPO_TAB_HEADINGS: Record<TPOTab, { title: string; subtitle: string }> = {
  overview: { title: "Overview", subtitle: "Complete insights across all placement operations" },
  drives: { title: "Placement Drives", subtitle: "Manage drives and shortlist students via JD" },
  analytics: { title: "Analytics & Insights", subtitle: "Detailed analytics and performance trends" },
  placements: { title: "Offers & Pipeline", subtitle: "Track applications, interview stages, and offer outcomes" },
  students: { title: "Student Registry", subtitle: "Maintain roster, readiness scores, and student profiles" },
  reports: { title: "Reports & Exports", subtitle: "Generate and export comprehensive reports" },
};

export function initialTPOTabFromUrl(): TPOTab {
  const raw = new URLSearchParams(window.location.search).get("tab");
  if (raw && (TPO_TABS as readonly string[]).includes(raw)) {
    return raw as TPOTab;
  }
  return "overview";
}
