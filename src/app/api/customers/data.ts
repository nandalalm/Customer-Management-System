import { Customer, CustomerStatus } from "@/types";

const customerStore = new Map<string, Customer>();

interface SeedEntry {
  name: string;
  email: string;
  phone: string;
  company: string;
  status: CustomerStatus;
  notes: string;
  lastContactDate: string;
  createdAt: string;
}

const seedData: SeedEntry[] = [
  { name: "Alice Johnson", email: "alice.johnson@techvault.com", phone: "2125551001", company: "TechVault", status: "active", notes: "Key decision-maker for enterprise plan", lastContactDate: "2026-07-28", createdAt: "2025-03-10" },
  { name: "Bob Martinez", email: "bob.martinez@novaedge.io", phone: "3105551002", company: "NovaEdge", status: "active", notes: "Interested in annual billing", lastContactDate: "2026-07-30", createdAt: "2025-04-15" },
  { name: "Catherine Lee", email: "catherine.lee@brightwavetech.com", phone: "4155551003", company: "BrightWave Tech", status: "inactive", notes: "Contract ended Q1 2026", lastContactDate: "2026-03-12", createdAt: "2024-11-20" },
  { name: "Daniel Kim", email: "daniel.kim@stratosphereinc.com", phone: "7185551004", company: "Stratosphere Inc", status: "active", notes: "Expanding to 50 seats next quarter", lastContactDate: "2026-08-01", createdAt: "2025-06-01" },
  { name: "Emily Chen", email: "emily.chen@cloudpinnacle.com", phone: "6505551005", company: "CloudPinnacle", status: "active", notes: "", lastContactDate: "2026-07-25", createdAt: "2025-01-18" },
  { name: "Frank Rivera", email: "frank.rivera@axiomdata.co", phone: "8185551006", company: "Axiom Data", status: "inactive", notes: "Moved to competitor platform", lastContactDate: "2026-02-14", createdAt: "2024-09-05" },
  { name: "Grace Patel", email: "grace.patel@lunarlogic.com", phone: "2135551007", company: "Lunar Logic", status: "active", notes: "Referred by Daniel Kim", lastContactDate: "2026-07-22", createdAt: "2025-07-10" },
  { name: "Henry Nguyen", email: "henry.nguyen@apexsystems.net", phone: "9175551008", company: "Apex Systems", status: "active", notes: "Needs SSO integration", lastContactDate: "2026-08-02", createdAt: "2025-02-28" },
  { name: "Isabella Scott", email: "isabella.scott@vortexlabs.io", phone: "5105551009", company: "Vortex Labs", status: "inactive", notes: "Budget cut — revisit in Q4", lastContactDate: "2026-04-10", createdAt: "2025-05-12" },
  { name: "James Wright", email: "james.wright@crestlinegroup.com", phone: "6465551010", company: "Crestline Group", status: "active", notes: "Signed 2-year contract", lastContactDate: "2026-07-18", createdAt: "2024-12-01" },
  { name: "Karen Zhao", email: "karen.zhao@pulseanalytics.com", phone: "4085551011", company: "Pulse Analytics", status: "active", notes: "Trialing premium tier", lastContactDate: "2026-08-03", createdAt: "2025-08-01" },
  { name: "Liam Brooks", email: "liam.brooks@horizonai.dev", phone: "3235551012", company: "Horizon AI", status: "active", notes: "", lastContactDate: "2026-07-20", createdAt: "2025-03-22" },
  { name: "Mia Torres", email: "mia.torres@emberforge.co", phone: "7025551013", company: "EmberForge", status: "inactive", notes: "No response to last 3 follow-ups", lastContactDate: "2026-01-08", createdAt: "2024-10-15" },
  { name: "Nathan Hall", email: "nathan.hall@swiftcurrent.io", phone: "8585551014", company: "SwiftCurrent", status: "active", notes: "Interested in API access", lastContactDate: "2026-07-29", createdAt: "2025-04-05" },
  { name: "Olivia Adams", email: "olivia.adams@quantumreach.com", phone: "9255551015", company: "QuantumReach", status: "active", notes: "Needs onboarding call scheduled", lastContactDate: "2026-08-04", createdAt: "2025-07-28" },
  { name: "Peter Yang", email: "peter.yang@ironcladsec.com", phone: "2065551016", company: "Ironclad Security", status: "active", notes: "Security audit in progress", lastContactDate: "2026-07-15", createdAt: "2025-01-09" },
  { name: "Quinn Murphy", email: "quinn.murphy@silverlinesaas.com", phone: "3035551017", company: "Silverline SaaS", status: "inactive", notes: "Downgraded to free plan", lastContactDate: "2026-05-20", createdAt: "2024-08-14" },
  { name: "Rachel Green", email: "rachel.green@novaedge.io", phone: "4695551018", company: "NovaEdge", status: "active", notes: "Second contact at NovaEdge", lastContactDate: "2026-07-31", createdAt: "2025-06-18" },
  { name: "Samuel Clark", email: "samuel.clark@zenithcloud.net", phone: "6175551019", company: "Zenith Cloud", status: "active", notes: "Migration from AWS scheduled", lastContactDate: "2026-07-27", createdAt: "2025-02-10" },
  { name: "Tina Hernandez", email: "tina.hernandez@brightscale.co", phone: "5035551020", company: "BrightScale", status: "active", notes: "", lastContactDate: "2026-08-01", createdAt: "2025-05-30" },
  { name: "Umar Farooq", email: "umar.farooq@peakflowtech.com", phone: "7135551021", company: "PeakFlow Tech", status: "inactive", notes: "Company acquired — new POC unknown", lastContactDate: "2026-03-05", createdAt: "2024-11-01" },
  { name: "Victoria Lane", email: "victoria.lane@crestlinegroup.com", phone: "2025551022", company: "Crestline Group", status: "active", notes: "Handles billing for James Wright's team", lastContactDate: "2026-07-26", createdAt: "2025-01-25" },
  { name: "William Foster", email: "william.foster@arclight.dev", phone: "4155551023", company: "Arclight Dev", status: "active", notes: "Wants custom dashboard widgets", lastContactDate: "2026-07-19", createdAt: "2025-04-20" },
  { name: "Xena Rossi", email: "xena.rossi@tidalsoftware.com", phone: "6025551024", company: "Tidal Software", status: "inactive", notes: "On hold — internal restructuring", lastContactDate: "2026-04-22", createdAt: "2024-12-18" },
  { name: "Yusuf Ali", email: "yusuf.ali@cloudpinnacle.com", phone: "8015551025", company: "CloudPinnacle", status: "active", notes: "Technical lead — prefers email contact", lastContactDate: "2026-07-24", createdAt: "2025-03-15" },
  { name: "Zara Mitchell", email: "zara.mitchell@emberforge.co", phone: "9165551026", company: "EmberForge", status: "active", notes: "Re-engaged after 6-month gap", lastContactDate: "2026-08-02", createdAt: "2025-07-05" },
  { name: "Aaron Phillips", email: "aaron.phillips@stratosphereinc.com", phone: "3125551027", company: "Stratosphere Inc", status: "active", notes: "Training session booked for Aug 15", lastContactDate: "2026-08-03", createdAt: "2025-06-12" },
  { name: "Bella Simmons", email: "bella.simmons@lunarlogic.com", phone: "7325551028", company: "Lunar Logic", status: "inactive", notes: "Preferred competitor pricing", lastContactDate: "2026-02-28", createdAt: "2024-10-30" },
  { name: "Carlos Mendez", email: "carlos.mendez@apexsystems.net", phone: "5165551029", company: "Apex Systems", status: "active", notes: "Handles LATAM accounts", lastContactDate: "2026-07-21", createdAt: "2025-05-08" },
  { name: "Diana Okafor", email: "diana.okafor@vortexlabs.io", phone: "2145551030", company: "Vortex Labs", status: "active", notes: "Re-evaluating for Q3 budget", lastContactDate: "2026-07-30", createdAt: "2025-07-20" },
  { name: "Ethan Blake", email: "ethan.blake@horizonai.dev", phone: "4435551031", company: "Horizon AI", status: "active", notes: "Wants ML model integration", lastContactDate: "2026-08-01", createdAt: "2025-02-17" },
  { name: "Fiona Duarte", email: "fiona.duarte@swiftcurrent.io", phone: "6195551032", company: "SwiftCurrent", status: "inactive", notes: "Left the company", lastContactDate: "2026-01-15", createdAt: "2024-09-22" },
  { name: "George Tan", email: "george.tan@quantumreach.com", phone: "7575551033", company: "QuantumReach", status: "active", notes: "", lastContactDate: "2026-07-28", createdAt: "2025-04-02" },
  { name: "Hannah Price", email: "hannah.price@ironcladsec.com", phone: "3035551034", company: "Ironclad Security", status: "active", notes: "Compliance review contact", lastContactDate: "2026-07-17", createdAt: "2025-01-30" },
  { name: "Isaac Reed", email: "isaac.reed@silverlinesaas.com", phone: "4805551035", company: "Silverline SaaS", status: "active", notes: "Upgraded to pro plan in July", lastContactDate: "2026-07-23", createdAt: "2025-06-25" },
  { name: "Julia Novak", email: "julia.novak@zenithcloud.net", phone: "5615551036", company: "Zenith Cloud", status: "inactive", notes: "Invoice dispute — escalated to finance", lastContactDate: "2026-05-10", createdAt: "2024-11-15" },
  { name: "Kevin Shaw", email: "kevin.shaw@brightscale.co", phone: "8165551037", company: "BrightScale", status: "active", notes: "Referred two new accounts", lastContactDate: "2026-08-04", createdAt: "2025-03-08" },
  { name: "Lena Kowalski", email: "lena.kowalski@peakflowtech.com", phone: "2675551038", company: "PeakFlow Tech", status: "active", notes: "New POC after acquisition", lastContactDate: "2026-07-29", createdAt: "2025-07-15" },
  { name: "Marcus Webb", email: "marcus.webb@arclight.dev", phone: "4155551039", company: "Arclight Dev", status: "inactive", notes: "Project paused indefinitely", lastContactDate: "2026-03-20", createdAt: "2025-01-05" },
  { name: "Nina Johansson", email: "nina.johansson@tidalsoftware.com", phone: "9715551040", company: "Tidal Software", status: "active", notes: "Expanding to European offices", lastContactDate: "2026-08-02", createdAt: "2025-05-18" },
  { name: "Oscar Gutierrez", email: "oscar.gutierrez@techvault.com", phone: "6025551041", company: "TechVault", status: "active", notes: "Second contact at TechVault", lastContactDate: "2026-07-26", createdAt: "2025-04-28" },
  { name: "Priya Sharma", email: "priya.sharma@axiomdata.co", phone: "5105551042", company: "Axiom Data", status: "active", notes: "Wants data export feature", lastContactDate: "2026-08-03", createdAt: "2025-06-30" },
  { name: "Randall Cooper", email: "randall.cooper@crestlinegroup.com", phone: "3305551043", company: "Crestline Group", status: "inactive", notes: "Role changed — no longer relevant", lastContactDate: "2026-04-05", createdAt: "2024-12-10" },
  { name: "Sofia Reyes", email: "sofia.reyes@pulseanalytics.com", phone: "8505551044", company: "Pulse Analytics", status: "active", notes: "", lastContactDate: "2026-07-31", createdAt: "2025-02-22" },
  { name: "Thomas Engel", email: "thomas.engel@horizonai.dev", phone: "2035551045", company: "Horizon AI", status: "active", notes: "CTO — executive sponsor", lastContactDate: "2026-08-01", createdAt: "2025-03-30" },
  { name: "Uma Krishnan", email: "uma.krishnan@cloudpinnacle.com", phone: "4085551046", company: "CloudPinnacle", status: "inactive", notes: "Switched to in-house solution", lastContactDate: "2026-02-08", createdAt: "2024-10-05" },
  { name: "Victor Sato", email: "victor.sato@novaedge.io", phone: "7145551047", company: "NovaEdge", status: "active", notes: "Handles DevOps tooling procurement", lastContactDate: "2026-07-27", createdAt: "2025-05-14" },
  { name: "Wendy Liu", email: "wendy.liu@emberforge.co", phone: "3475551048", company: "EmberForge", status: "active", notes: "Negotiating multi-year deal", lastContactDate: "2026-08-04", createdAt: "2025-07-22" },
  { name: "Xavier Dunn", email: "xavier.dunn@apexsystems.net", phone: "9495551049", company: "Apex Systems", status: "inactive", notes: "Unresponsive since January", lastContactDate: "2026-01-20", createdAt: "2024-08-28" },
  { name: "Yasmin Cole", email: "yasmin.cole@brightscale.co", phone: "6155551050", company: "BrightScale", status: "active", notes: "Onboarding in progress", lastContactDate: "2026-08-05", createdAt: "2025-08-01" },
];

function seedStore(): void {
  seedData.forEach((entry) => {
    const id = crypto.randomUUID();
    customerStore.set(id, {
      ...entry,
      id,
      lastContactDate: new Date(entry.lastContactDate).toISOString(),
      createdAt: new Date(entry.createdAt).toISOString(),
    });
  });
}

seedStore();

export function getStore(): Map<string, Customer> {
  return customerStore;
}
