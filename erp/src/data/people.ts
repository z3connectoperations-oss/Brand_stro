import type { Employee, Product, TeamId } from "@/lib/types";

export const employees: Employee[] = [
  { id: "E01", name: "Zameel", initials: "ZA", role: "founder", title: "Founder & CEO", team: "leadership", baseSalary: 0, targetEarning: 0, color: "bg-slate-900" },
  { id: "E02", name: "Vikram S.", initials: "VS", role: "creative-head", title: "Creative Team Head", team: "leadership", reportsTo: "E01", baseSalary: 0, targetEarning: 0, color: "bg-indigo-700" },
  { id: "E03", name: "Arun K.", initials: "AK", role: "crm", title: "Client Relationship Manager", team: "crm", reportsTo: "E01", baseSalary: 10000, targetEarning: 20000, color: "bg-sky-600" },
  { id: "E04", name: "Meera N.", initials: "MN", role: "hr", title: "HR / Admin", team: "hr", reportsTo: "E01", baseSalary: 10000, targetEarning: 15000, color: "bg-rose-600" },
  { id: "E05", name: "Fathima R.", initials: "FR", role: "rnd", title: "R&D — Research & Direction", team: "rnd", reportsTo: "E02", baseSalary: 10000, targetEarning: 12000, color: "bg-teal-600" },
  { id: "E06", name: "Gautam V.", initials: "GV", role: "sketch", title: "Sketch Artist", team: "sketch", reportsTo: "E02", baseSalary: 10000, targetEarning: 15000, color: "bg-amber-600" },
  { id: "E07", name: "Akhil P.", initials: "AP", role: "team-leader", title: "Logo Team Leader", team: "logo", reportsTo: "E02", baseSalary: 12000, targetEarning: 17000, color: "bg-violet-600" },
  { id: "E08", name: "Shihaf K.", initials: "SK", role: "designer", title: "Logo Designer", team: "logo", reportsTo: "E07", baseSalary: 10000, targetEarning: 15000, color: "bg-indigo-500" },
  { id: "E09", name: "Prabha D.", initials: "PD", role: "designer", title: "Logo Designer", team: "logo", reportsTo: "E07", baseSalary: 10000, targetEarning: 15000, color: "bg-fuchsia-600" },
  { id: "E10", name: "Naveen T.", initials: "NT", role: "designer", title: "Logo Designer", team: "logo", reportsTo: "E07", baseSalary: 10000, targetEarning: 15000, color: "bg-blue-600" },
  { id: "E11", name: "Shalin M.", initials: "SM", role: "team-leader", title: "Packaging Team Leader", team: "packaging", reportsTo: "E02", baseSalary: 12000, targetEarning: 17000, color: "bg-emerald-700" },
  { id: "E12", name: "Rasith M.", initials: "RM", role: "designer", title: "Sr. Packaging Designer", team: "packaging", reportsTo: "E11", baseSalary: 12000, targetEarning: 17000, color: "bg-orange-600" },
  { id: "E13", name: "Ayesha B.", initials: "AB", role: "designer", title: "Packaging Designer", team: "packaging", reportsTo: "E11", baseSalary: 10000, targetEarning: 15000, color: "bg-lime-700" },
  { id: "E14", name: "Karthik R.", initials: "KR", role: "designer", title: "Packaging Designer", team: "packaging", reportsTo: "E11", baseSalary: 10000, targetEarning: 15000, color: "bg-cyan-700" },
];

export const byId = (id?: string) => employees.find((e) => e.id === id);

export const teamNames: Record<TeamId, string> = {
  logo: "Logo Team",
  packaging: "Packaging Team",
  rnd: "R&D",
  sketch: "Sketch",
  crm: "CRM",
  hr: "HR / Admin",
  leadership: "Leadership",
};

export const products: Product[] = [
  { id: "logo", name: "Logo Design Only", price: 6000, monthlyTarget: 8, includedRevisions: 3, deliverables: ["Logo"], usesSketch: true },
  {
    id: "branding",
    name: "Branding + Logo Package",
    price: 15000,
    monthlyTarget: 16,
    includedRevisions: 3,
    deliverables: ["Logo", "Brand Guidelines", "Visiting Card", "Letterhead", "T-Shirt", "Custom Packaging"],
    usesSketch: true,
  },
  { id: "label", name: "Standalone Label Design", price: 2500, monthlyTarget: 15, includedRevisions: 2, deliverables: ["Label"], usesSketch: false },
  { id: "packaging", name: "Standalone Packaging Design", price: 3500, monthlyTarget: 8, includedRevisions: 2, deliverables: ["Packaging"], usesSketch: false },
];

export const productById = (id: string) => products.find((p) => p.id === id)!;
