import type { Client, Lead } from "@/lib/types";

const fullOnboarding = (done: number) =>
  [
    "Review Sales handover notes",
    "Add client to Client Database",
    "Send welcome message (package, price, next step)",
    "Schedule client meeting (Client Meetings group)",
    "Run structured discovery call",
    "Collect materials into Drive project folder",
    "Hand Project Brief to R&D with priority",
  ].map((step, i) => ({ step, done: i < done }));

export const clients: Client[] = [
  { id: "C01", code: "CL-1024", name: "ABC Foods Pvt Ltd", industry: "FMCG & Nutrition", contact: "Arun Kumar", phone: "+91 98765 43210", email: "hello@abcfoods.example", since: "2026-09-12", tier: "Important", onboarding: fullOnboarding(7) },
  { id: "C02", code: "CL-1021", name: "KPN Restaurant Group", industry: "Hospitality", contact: "Fathima Ali", phone: "+91 98400 11223", email: "ops@kpn.example", since: "2026-08-30", tier: "Standard", onboarding: fullOnboarding(7) },
  { id: "C03", code: "CL-1018", name: "Iyengar Bakery", industry: "Bakery Chain", contact: "Sanjay Raj", phone: "+91 94444 55667", email: "sanjay@iyengar.example", since: "2026-08-22", tier: "Standard", onboarding: fullOnboarding(7) },
  { id: "C04", code: "CL-1030", name: "Mahalaxmi Builders", industry: "Real Estate", contact: "Dr. S. K. Gupta", phone: "+91 90000 22334", email: "skg@mahalaxmi.example", since: "2026-09-15", tier: "Important", onboarding: fullOnboarding(5) },
  { id: "C05", code: "CL-1028", name: "Orange Surgicals", industry: "Medical Supplies", contact: "Naveen Thomas", phone: "+91 97900 88990", email: "naveen@orange.example", since: "2026-09-08", tier: "Standard", onboarding: fullOnboarding(7) },
  { id: "C06", code: "CL-1033", name: "Fresh Basket Organics", industry: "Organic Retail", contact: "Priya Menon", phone: "+91 98847 12121", email: "priya@freshbasket.example", since: "2026-09-18", tier: "Standard", onboarding: fullOnboarding(3) },
  { id: "C07", code: "CL-1031", name: "Deccan Roasters", industry: "Coffee", contact: "Vikram Rao", phone: "+91 99001 45678", email: "vikram@deccan.example", since: "2026-09-16", tier: "Standard", onboarding: fullOnboarding(7) },
  { id: "C08", code: "CL-1012", name: "Chaivanth", industry: "Tea Brand", contact: "Lakshmi P.", phone: "+91 98000 34567", email: "hi@chaivanth.example", since: "2026-08-10", tier: "Standard", onboarding: fullOnboarding(7) },
  { id: "C09", code: "CL-1009", name: "Filters & Flavours", industry: "Beverages", contact: "Rahul S.", phone: "+91 96000 77889", email: "rahul@fnf.example", since: "2026-08-05", tier: "Standard", onboarding: fullOnboarding(7) },
  { id: "C10", code: "CL-1035", name: "Good Flour Co.", industry: "Food Products", contact: "Anita J.", phone: "+91 95555 66778", email: "anita@goodflour.example", since: "2026-09-20", tier: "Standard", onboarding: fullOnboarding(2) },
];

export const clientById = (id: string) => clients.find((c) => c.id === id)!;

export const leads: Lead[] = [
  { id: "L01", business: "Novatech Systems", contact: "Ravi Shankar", interest: "branding", source: "Instagram", status: "Proposal", estValue: 15000, nextAction: "Call on package scope", nextActionDate: "2026-09-21", lastContact: "2026-09-19", ownerId: "E01" },
  { id: "L02", business: "Windavan Sweets", contact: "Meena K.", interest: "packaging", source: "WhatsApp", status: "Negotiation", estValue: 3500, nextAction: "Follow up on quotation", nextActionDate: "2026-09-18", lastContact: "2026-09-15", ownerId: "E01" },
  { id: "L03", business: "Zenith Organics", contact: "Suresh B.", interest: "label", source: "Referral", status: "Requirement", estValue: 5000, nextAction: "Send label size checklist", nextActionDate: "2026-09-22", lastContact: "2026-09-20", ownerId: "E01" },
  { id: "L04", business: "Blue Lotus Spa", contact: "Divya R.", interest: "logo", source: "Facebook", status: "Contacted", estValue: 6000, nextAction: "Share portfolio", nextActionDate: "2026-09-21", lastContact: "2026-09-19", ownerId: "E01" },
  { id: "L05", business: "Sri Murugan Stores", contact: "Murugan", interest: "logo", source: "Walk-in", status: "New", estValue: 6000, nextAction: "First qualification call", nextActionDate: "2026-09-22", lastContact: "2026-09-21", ownerId: "E01" },
  { id: "L06", business: "Cafe Amaravati", contact: "Harini", interest: "branding", source: "Instagram", status: "Requirement", estValue: 15000, nextAction: "Collect brand story", nextActionDate: "2026-09-17", lastContact: "2026-09-14", ownerId: "E01" },
  { id: "L07", business: "Pearl Dental", contact: "Dr. Nisha", interest: "logo", source: "Referral", status: "Won", estValue: 6000, nextAction: "Handover to CRM", nextActionDate: "2026-09-21", lastContact: "2026-09-20", ownerId: "E01" },
  { id: "L08", business: "Kovai Millets", contact: "Selvam", interest: "packaging", source: "WhatsApp", status: "Lost", estValue: 3500, nextAction: "—", nextActionDate: "2026-09-10", lastContact: "2026-09-10", ownerId: "E01" },
  { id: "L09", business: "Aura Candles", contact: "Rekha", interest: "label", source: "Instagram", status: "New", estValue: 2500, nextAction: "First qualification call", nextActionDate: "2026-09-21", lastContact: "2026-09-21", ownerId: "E01" },
];
