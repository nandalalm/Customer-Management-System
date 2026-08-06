import { Customer, CustomerStatus } from "@/types";

const globalForCustomers = globalThis as unknown as {
  __customerStore?: Map<string, Customer>;
};

const customerStore: Map<string, Customer> =
  globalForCustomers.__customerStore ?? new Map<string, Customer>();

if (!globalForCustomers.__customerStore) {
  globalForCustomers.__customerStore = customerStore;
}

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

// 150 Seeded Indian Customers.
// Phone numbers are in Indian format (+91 XXXXXXXXXX).
// lastContactDate is strictly <= 2026-08-05 so any newly added customer (created today: 2026-08-06)
// will immediately sort to the very top when ordered by recent contact descending.
const seedData: SeedEntry[] = [
  { name: "Aarav Sharma", email: "aarav.sharma@techvault.com", phone: "+91 9876543201", company: "TechVault", status: "active", notes: "Key decision-maker for enterprise plan", lastContactDate: "2026-08-05", createdAt: "2025-03-10" },
  { name: "Aditi Patel", email: "aditi.patel@novaedge.io", phone: "+91 9876543202", company: "NovaEdge", status: "active", notes: "Interested in annual billing", lastContactDate: "2026-08-04", createdAt: "2025-04-15" },
  { name: "Ananya Iyer", email: "ananya.iyer@brightwavetech.com", phone: "+91 9876543203", company: "BrightWave Tech", status: "inactive", notes: "Contract ended Q1 2026", lastContactDate: "2026-03-12", createdAt: "2024-11-20" },
  { name: "Arjun Verma", email: "arjun.verma@stratosphereinc.com", phone: "+91 9876543204", company: "Stratosphere Inc", status: "active", notes: "Expanding to 50 seats next quarter", lastContactDate: "2026-08-03", createdAt: "2025-06-01" },
  { name: "Bhavya Gupta", email: "bhavya.gupta@cloudpinnacle.com", phone: "+91 9876543205", company: "CloudPinnacle", status: "active", notes: "", lastContactDate: "2026-07-25", createdAt: "2025-01-18" },
  { name: "Chetan Reddy", email: "chetan.reddy@axiomdata.co", phone: "+91 9876543206", company: "Axiom Data", status: "inactive", notes: "Moved to competitor platform", lastContactDate: "2026-02-14", createdAt: "2024-09-05" },
  { name: "Deepika Mehta", email: "deepika.mehta@lunarlogic.com", phone: "+91 9876543207", company: "Lunar Logic", status: "active", notes: "Referred by Arjun Verma", lastContactDate: "2026-07-22", createdAt: "2025-07-10" },
  { name: "Devansh Nair", email: "devansh.nair@apexsystems.net", phone: "+91 9876543208", company: "Apex Systems", status: "active", notes: "Needs SSO integration", lastContactDate: "2026-08-02", createdAt: "2025-02-28" },
  { name: "Divya Joshi", email: "divya.joshi@vortexlabs.io", phone: "+91 9876543209", company: "Vortex Labs", status: "inactive", notes: "Budget cut — revisit in Q4", lastContactDate: "2026-04-10", createdAt: "2025-05-12" },
  { name: "Gaurav Malhotra", email: "gaurav.malhotra@crestlinegroup.com", phone: "+91 9876543210", company: "Crestline Group", status: "active", notes: "Signed 2-year contract", lastContactDate: "2026-07-18", createdAt: "2024-12-01" },
  { name: "Ishaan Rao", email: "ishaan.rao@pulseanalytics.com", phone: "+91 9876543211", company: "Pulse Analytics", status: "active", notes: "Trialing premium tier", lastContactDate: "2026-08-03", createdAt: "2025-08-01" },
  { name: "Kavya Singh", email: "kavya.singh@horizonai.dev", phone: "+91 9876543212", company: "Horizon AI", status: "active", notes: "", lastContactDate: "2026-07-20", createdAt: "2025-03-22" },
  { name: "Kiran Deshmukh", email: "kiran.deshmukh@emberforge.co", phone: "+91 9876543213", company: "EmberForge", status: "inactive", notes: "No response to last 3 follow-ups", lastContactDate: "2026-01-08", createdAt: "2024-10-15" },
  { name: "Manish Agarwal", email: "manish.agarwal@swiftcurrent.io", phone: "+91 9876543214", company: "SwiftCurrent", status: "active", notes: "Interested in API access", lastContactDate: "2026-07-29", createdAt: "2025-04-05" },
  { name: "Meera Sen", email: "meera.sen@quantumreach.com", phone: "+91 9876543215", company: "QuantumReach", status: "active", notes: "Needs onboarding call scheduled", lastContactDate: "2026-08-04", createdAt: "2025-07-28" },
  { name: "Nikhil Pillai", email: "nikhil.pillai@ironcladsec.com", phone: "+91 9876543216", company: "Ironclad Security", status: "active", notes: "Security audit in progress", lastContactDate: "2026-07-15", createdAt: "2025-01-09" },
  { name: "Pooja Banerjee", email: "pooja.banerjee@silverlinesaas.com", phone: "+91 9876543217", company: "Silverline SaaS", status: "inactive", notes: "Downgraded to free plan", lastContactDate: "2026-05-20", createdAt: "2024-08-14" },
  { name: "Pranav Roy", email: "pranav.roy@novaedge.io", phone: "+91 9876543218", company: "NovaEdge", status: "active", notes: "Second contact at NovaEdge", lastContactDate: "2026-07-31", createdAt: "2025-06-18" },
  { name: "Rahul Kapoor", email: "rahul.kapoor@zenithcloud.net", phone: "+91 9876543219", company: "Zenith Cloud", status: "active", notes: "Migration from AWS scheduled", lastContactDate: "2026-07-27", createdAt: "2025-02-10" },
  { name: "Riya Sundaram", email: "riya.sundaram@brightscale.co", phone: "+91 9876543220", company: "BrightScale", status: "active", notes: "", lastContactDate: "2026-08-01", createdAt: "2025-05-30" },
  { name: "Rohan Kulkarni", email: "rohan.kulkarni@peakflowtech.com", phone: "+91 9876543221", company: "PeakFlow Tech", status: "inactive", notes: "Company acquired — new POC unknown", lastContactDate: "2026-03-05", createdAt: "2024-11-01" },
  { name: "Sai Nambiar", email: "sai.nambiar@crestlinegroup.com", phone: "+91 9876543222", company: "Crestline Group", status: "active", notes: "Handles billing for team", lastContactDate: "2026-07-26", createdAt: "2025-01-25" },
  { name: "Sakshi Saxena", email: "sakshi.saxena@arclight.dev", phone: "+91 9876543223", company: "Arclight Dev", status: "active", notes: "Wants custom dashboard widgets", lastContactDate: "2026-07-19", createdAt: "2025-04-20" },
  { name: "Sameer Nanda", email: "sameer.nanda@tidalsoftware.com", phone: "+91 9876543224", company: "Tidal Software", status: "inactive", notes: "On hold — internal restructuring", lastContactDate: "2026-04-22", createdAt: "2024-12-18" },
  { name: "Siddharth Bhat", email: "siddharth.bhat@cloudpinnacle.com", phone: "+91 9876543225", company: "CloudPinnacle", status: "active", notes: "Technical lead — prefers email contact", lastContactDate: "2026-07-24", createdAt: "2025-03-15" },
  { name: "Sneha Menon", email: "sneha.menon@emberforge.co", phone: "+91 9876543226", company: "EmberForge", status: "active", notes: "Re-engaged after 6-month gap", lastContactDate: "2026-08-02", createdAt: "2025-07-05" },
  { name: "Tanvi Choudhury", email: "tanvi.choudhury@stratosphereinc.com", phone: "+91 9876543227", company: "Stratosphere Inc", status: "active", notes: "Training session booked", lastContactDate: "2026-08-03", createdAt: "2025-06-12" },
  { name: "Utkarsh Pandey", email: "utkarsh.pandey@lunarlogic.com", phone: "+91 9876543228", company: "Lunar Logic", status: "inactive", notes: "Preferred competitor pricing", lastContactDate: "2026-02-28", createdAt: "2024-10-30" },
  { name: "Varun Hegde", email: "varun.hegde@apexsystems.net", phone: "+91 9876543229", company: "Apex Systems", status: "active", notes: "Handles India accounts", lastContactDate: "2026-07-21", createdAt: "2025-05-08" },
  { name: "Vidya Swaminathan", email: "vidya.swaminathan@vortexlabs.io", phone: "+91 9876543230", company: "Vortex Labs", status: "active", notes: "Re-evaluating for Q3 budget", lastContactDate: "2026-07-30", createdAt: "2025-07-20" },
  { name: "Vikram Sethi", email: "vikram.sethi@horizonai.dev", phone: "+91 9876543231", company: "Horizon AI", status: "active", notes: "Wants ML model integration", lastContactDate: "2026-08-01", createdAt: "2025-02-17" },
  { name: "Yash Trivedi", email: "yash.trivedi@swiftcurrent.io", phone: "+91 9876543232", company: "SwiftCurrent", status: "inactive", notes: "Left the company", lastContactDate: "2026-01-15", createdAt: "2024-09-22" },
  { name: "Abhinav Prasad", email: "abhinav.prasad@quantumreach.com", phone: "+91 9876543233", company: "QuantumReach", status: "active", notes: "", lastContactDate: "2026-07-28", createdAt: "2025-04-02" },
  { name: "Akansha Dutt", email: "akansha.dutt@ironcladsec.com", phone: "+91 9876543234", company: "Ironclad Security", status: "active", notes: "Compliance review contact", lastContactDate: "2026-07-17", createdAt: "2025-01-30" },
  { name: "Alok Srivastava", email: "alok.srivastava@silverlinesaas.com", phone: "+91 9876543235", company: "Silverline SaaS", status: "active", notes: "Upgraded to pro plan", lastContactDate: "2026-07-23", createdAt: "2025-06-25" },
  { name: "Anand Rangan", email: "anand.rangan@zenithcloud.net", phone: "+91 9876543236", company: "Zenith Cloud", status: "inactive", notes: "Invoice dispute", lastContactDate: "2026-05-10", createdAt: "2024-11-15" },
  { name: "Ankita Bhalla", email: "ankita.bhalla@brightscale.co", phone: "+91 9876543237", company: "BrightScale", status: "active", notes: "Referred two new accounts", lastContactDate: "2026-08-04", createdAt: "2025-03-08" },
  { name: "Anshul Jain", email: "anshul.jain@peakflowtech.com", phone: "+91 9876543238", company: "PeakFlow Tech", status: "active", notes: "New POC after acquisition", lastContactDate: "2026-07-29", createdAt: "2025-07-15" },
  { name: "Anusha Shetty", email: "anusha.shetty@arclight.dev", phone: "+91 9876543239", company: "Arclight Dev", status: "inactive", notes: "Project paused indefinitely", lastContactDate: "2026-03-20", createdAt: "2025-01-05" },
  { name: "Archana Kaushik", email: "archana.kaushik@tidalsoftware.com", phone: "+91 9876543240", company: "Tidal Software", status: "active", notes: "Expanding to European offices", lastContactDate: "2026-08-02", createdAt: "2025-05-18" },
  { name: "Ashok Mahajan", email: "ashok.mahajan@techvault.com", phone: "+91 9876543241", company: "TechVault", status: "active", notes: "Second contact at TechVault", lastContactDate: "2026-07-26", createdAt: "2025-04-28" },
  { name: "Avani Bajaj", email: "avani.bajaj@axiomdata.co", phone: "+91 9876543242", company: "Axiom Data", status: "active", notes: "Wants data export feature", lastContactDate: "2026-08-03", createdAt: "2025-06-30" },
  { name: "Ayush Saxena", email: "ayush.saxena@crestlinegroup.com", phone: "+91 9876543243", company: "Crestline Group", status: "inactive", notes: "Role changed", lastContactDate: "2026-04-05", createdAt: "2024-12-10" },
  { name: "Bindu Sridhar", email: "bindu.sridhar@pulseanalytics.com", phone: "+91 9876543244", company: "Pulse Analytics", status: "active", notes: "", lastContactDate: "2026-07-31", createdAt: "2025-02-22" },
  { name: "Chirag Thakkar", email: "chirag.thakkar@horizonai.dev", phone: "+91 9876543245", company: "Horizon AI", status: "active", notes: "CTO — executive sponsor", lastContactDate: "2026-08-01", createdAt: "2025-03-30" },
  { name: "Deepa Narang", email: "deepa.narang@cloudpinnacle.com", phone: "+91 9876543246", company: "CloudPinnacle", status: "inactive", notes: "Switched to in-house solution", lastContactDate: "2026-02-08", createdAt: "2024-10-05" },
  { name: "Dinesh Kulkarni", email: "dinesh.kulkarni@novaedge.io", phone: "+91 9876543247", company: "NovaEdge", status: "active", notes: "DevOps lead", lastContactDate: "2026-07-27", createdAt: "2025-05-14" },
  { name: "Divtej Singh", email: "divtej.singh@emberforge.co", phone: "+91 9876543248", company: "EmberForge", status: "active", notes: "Negotiating deal", lastContactDate: "2026-08-04", createdAt: "2025-07-22" },
  { name: "Ekta Merchant", email: "ekta.merchant@apexsystems.net", phone: "+91 9876543249", company: "Apex Systems", status: "inactive", notes: "Unresponsive since January", lastContactDate: "2026-01-20", createdAt: "2024-08-28" },
  { name: "Farhan Qureshi", email: "farhan.qureshi@brightscale.co", phone: "+91 9876543250", company: "BrightScale", status: "active", notes: "Onboarding in progress", lastContactDate: "2026-08-05", createdAt: "2025-08-01" },
  { name: "Geetika Chawla", email: "geetika.chawla@techvault.com", phone: "+91 9876543251", company: "TechVault", status: "active", notes: "Enterprise architect", lastContactDate: "2026-07-29", createdAt: "2025-03-12" },
  { name: "Girish Gowda", email: "girish.gowda@novaedge.io", phone: "+91 9876543252", company: "NovaEdge", status: "active", notes: "VP of Product", lastContactDate: "2026-08-01", createdAt: "2025-04-18" },
  { name: "Harish Varma", email: "harish.varma@brightwavetech.com", phone: "+91 9876543253", company: "BrightWave Tech", status: "inactive", notes: "Switched plan", lastContactDate: "2026-03-15", createdAt: "2024-11-22" },
  { name: "Hemant Bisht", email: "hemant.bisht@stratosphereinc.com", phone: "+91 9876543254", company: "Stratosphere Inc", status: "active", notes: "Renewing contract", lastContactDate: "2026-08-02", createdAt: "2025-06-05" },
  { name: "Indira Reddy", email: "indira.reddy@cloudpinnacle.com", phone: "+91 9876543255", company: "CloudPinnacle", status: "active", notes: "", lastContactDate: "2026-07-28", createdAt: "2025-01-20" },
  { name: "Jagdish Prasad", email: "jagdish.prasad@axiomdata.co", phone: "+91 9876543256", company: "Axiom Data", status: "inactive", notes: "Inactive account", lastContactDate: "2026-02-18", createdAt: "2024-09-10" },
  { name: "Jahnvi Rastogi", email: "jahnvi.rastogi@lunarlogic.com", phone: "+91 9876543257", company: "Lunar Logic", status: "active", notes: "Expanding tier", lastContactDate: "2026-07-25", createdAt: "2025-07-12" },
  { name: "Jayant Solanki", email: "jayant.solanki@apexsystems.net", phone: "+91 9876543258", company: "Apex Systems", status: "active", notes: "API user", lastContactDate: "2026-08-03", createdAt: "2025-03-01" },
  { name: "Jyoti Somani", email: "jyoti.somani@vortexlabs.io", phone: "+91 9876543259", company: "Vortex Labs", status: "inactive", notes: "Reviewing budget", lastContactDate: "2026-04-12", createdAt: "2025-05-15" },
  { name: "Kabir Wadhwa", email: "kabir.wadhwa@crestlinegroup.com", phone: "+91 9876543260", company: "Crestline Group", status: "active", notes: "Multi-year client", lastContactDate: "2026-07-20", createdAt: "2024-12-05" },
  { name: "Kamal Kishor", email: "kamal.kishor@pulseanalytics.com", phone: "+91 9876543261", company: "Pulse Analytics", status: "active", notes: "Premium user", lastContactDate: "2026-08-04", createdAt: "2025-08-02" },
  { name: "Karthik Subramanian", email: "karthik.subramanian@horizonai.dev", phone: "+91 9876543262", company: "Horizon AI", status: "active", notes: "", lastContactDate: "2026-07-22", createdAt: "2025-03-25" },
  { name: "Kritika Saini", email: "kritika.saini@emberforge.co", phone: "+91 9876543263", company: "EmberForge", status: "inactive", notes: "Pending follow up", lastContactDate: "2026-01-10", createdAt: "2024-10-18" },
  { name: "Lokesh Yadav", email: "lokesh.yadav@swiftcurrent.io", phone: "+91 9876543264", company: "SwiftCurrent", status: "active", notes: "New integration", lastContactDate: "2026-07-30", createdAt: "2025-04-08" },
  { name: "Madhuri Dixit", email: "madhuri.dixit@quantumreach.com", phone: "+91 9876543265", company: "QuantumReach", status: "active", notes: "Onboarding scheduled", lastContactDate: "2026-08-05", createdAt: "2025-07-30" },
  { name: "Mallika Roy", email: "mallika.roy@ironcladsec.com", phone: "+91 9876543266", company: "Ironclad Security", status: "active", notes: "Security audit", lastContactDate: "2026-07-18", createdAt: "2025-01-12" },
  { name: "Manoj Ahuja", email: "manoj.ahuja@silverlinesaas.com", phone: "+91 9876543267", company: "Silverline SaaS", status: "inactive", notes: "Free plan", lastContactDate: "2026-05-22", createdAt: "2024-08-16" },
  { name: "Mayank Khatri", email: "mayank.khatri@zenithcloud.net", phone: "+91 9876543268", company: "Zenith Cloud", status: "active", notes: "Cloud migration", lastContactDate: "2026-07-28", createdAt: "2025-02-12" },
  { name: "Mihir Bansal", email: "mihir.bansal@brightscale.co", phone: "+91 9876543269", company: "BrightScale", status: "active", notes: "", lastContactDate: "2026-08-02", createdAt: "2025-06-01" },
  { name: "Mohit Som", email: "mohit.som@peakflowtech.com", phone: "+91 9876543270", company: "PeakFlow Tech", status: "inactive", notes: "Acquired", lastContactDate: "2026-03-08", createdAt: "2024-11-05" },
  { name: "Monica Geller", email: "monica.geller@arclight.dev", phone: "+91 9876543271", company: "Arclight Dev", status: "active", notes: "Dashboard widgets", lastContactDate: "2026-07-21", createdAt: "2025-04-22" },
  { name: "Nalini Murthy", email: "nalini.murthy@tidalsoftware.com", phone: "+91 9876543272", company: "Tidal Software", status: "inactive", notes: "Restructuring", lastContactDate: "2026-04-25", createdAt: "2024-12-20" },
  { name: "Namrata Kulkarni", email: "namrata.kulkarni@techvault.com", phone: "+91 9876543273", company: "TechVault", status: "active", notes: "Lead dev", lastContactDate: "2026-07-25", createdAt: "2025-03-18" },
  { name: "Naveen Saxena", email: "naveen.saxena@novaedge.io", phone: "+91 9876543274", company: "NovaEdge", status: "active", notes: "Re-engaged", lastContactDate: "2026-08-03", createdAt: "2025-07-08" },
  { name: "Neelam Upadhyay", email: "neelam.upadhyay@brightwavetech.com", phone: "+91 9876543275", company: "BrightWave Tech", status: "active", notes: "Training session", lastContactDate: "2026-08-04", createdAt: "2025-06-15" },
  { name: "Nidhi Tripathi", email: "nidhi.tripathi@stratosphereinc.com", phone: "+91 9876543276", company: "Stratosphere Inc", status: "inactive", notes: "Pricing review", lastContactDate: "2026-03-01", createdAt: "2024-11-02" },
  { name: "Nitin Mittal", email: "nitin.mittal@cloudpinnacle.com", phone: "+91 9876543277", company: "CloudPinnacle", status: "active", notes: "LATAM account", lastContactDate: "2026-07-23", createdAt: "2025-05-10" },
  { name: "Omkar Nadkarni", email: "omkar.nadkarni@axiomdata.co", phone: "+91 9876543278", company: "Axiom Data", status: "active", notes: "Q3 Budget", lastContactDate: "2026-08-01", createdAt: "2025-07-22" },
  { name: "Pallavi Bhasin", email: "pallavi.bhasin@lunarlogic.com", phone: "+91 9876543279", company: "Lunar Logic", status: "active", notes: "ML integration", lastContactDate: "2026-08-02", createdAt: "2025-02-20" },
  { name: "Pankaj Sharma", email: "pankaj.sharma@apexsystems.net", phone: "+91 9876543280", company: "Apex Systems", status: "inactive", notes: "Left team", lastContactDate: "2026-01-18", createdAt: "2024-09-25" },
  { name: "Parul Tandon", email: "parul.tandon@vortexlabs.io", phone: "+91 9876543281", company: "Vortex Labs", status: "active", notes: "", lastContactDate: "2026-07-29", createdAt: "2025-04-05" },
  { name: "Pradeep Tyagi", email: "pradeep.tyagi@crestlinegroup.com", phone: "+91 9876543282", company: "Crestline Group", status: "active", notes: "Compliance review", lastContactDate: "2026-07-19", createdAt: "2025-02-02" },
  { name: "Prakriti Jain", email: "prakriti.jain@pulseanalytics.com", phone: "+91 9876543283", company: "Pulse Analytics", status: "active", notes: "Upgraded pro plan", lastContactDate: "2026-07-25", createdAt: "2025-06-28" },
  { name: "Prashant Bhatt", email: "prashant.bhatt@horizonai.dev", phone: "+91 9876543284", company: "Horizon AI", status: "inactive", notes: "Invoice dispute", lastContactDate: "2026-05-12", createdAt: "2024-11-18" },
  { name: "Preeti Sahay", email: "preeti.sahay@emberforge.co", phone: "+91 9876543285", company: "EmberForge", status: "active", notes: "New referrals", lastContactDate: "2026-08-05", createdAt: "2025-03-10" },
  { name: "Radhika Merchant", email: "radhika.merchant@swiftcurrent.io", phone: "+91 9876543286", company: "SwiftCurrent", status: "active", notes: "New POC", lastContactDate: "2026-07-30", createdAt: "2025-07-18" },
  { name: "Rajesh Nambiar", email: "rajesh.nambiar@quantumreach.com", phone: "+91 9876543287", company: "QuantumReach", status: "inactive", notes: "Project paused", lastContactDate: "2026-03-22", createdAt: "2025-01-08" },
  { name: "Rajnish Kumar", email: "rajnish.kumar@ironcladsec.com", phone: "+91 9876543288", company: "Ironclad Security", status: "active", notes: "EU expansion", lastContactDate: "2026-08-03", createdAt: "2025-05-20" },
  { name: "Rakesh Verma", email: "rakesh.verma@silverlinesaas.com", phone: "+91 9876543289", company: "Silverline SaaS", status: "active", notes: "Tech Vault contact", lastContactDate: "2026-07-28", createdAt: "2025-04-30" },
  { name: "Ramanathan Iyer", email: "ramanathan.iyer@zenithcloud.net", phone: "+91 9876543290", company: "Zenith Cloud", status: "active", notes: "Data export request", lastContactDate: "2026-08-04", createdAt: "2025-07-02" },
  { name: "Rashmi Shukla", email: "rashmi.shukla@brightscale.co", phone: "+91 9876543291", company: "BrightScale", status: "inactive", notes: "Role changed", lastContactDate: "2026-04-08", createdAt: "2024-12-12" },
  { name: "Rattan Tata", email: "rattan.tata@peakflowtech.com", phone: "+91 9876543292", company: "PeakFlow Tech", status: "active", notes: "", lastContactDate: "2026-08-01", createdAt: "2025-02-25" },
  { name: "Reena Joseph", email: "reena.joseph@arclight.dev", phone: "+91 9876543293", company: "Arclight Dev", status: "active", notes: "Executive sponsor", lastContactDate: "2026-08-02", createdAt: "2025-04-02" },
  { name: "Richa Chadha", email: "richa.chadha@tidalsoftware.com", phone: "+91 9876543294", company: "Tidal Software", status: "inactive", notes: "In-house solution", lastContactDate: "2026-02-10", createdAt: "2024-10-08" },
  { name: "Rishi Kapoor", email: "rishi.kapoor@techvault.com", phone: "+91 9876543295", company: "TechVault", status: "active", notes: "DevOps lead", lastContactDate: "2026-07-28", createdAt: "2025-05-16" },
  { name: "Ritu Periwal", email: "ritu.periwal@novaedge.io", phone: "+91 9876543296", company: "NovaEdge", status: "active", notes: "Multi-year agreement", lastContactDate: "2026-08-05", createdAt: "2025-07-25" },
  { name: "Rohit Sharma", email: "rohit.sharma@brightwavetech.com", phone: "+91 9876543297", company: "BrightWave Tech", status: "inactive", notes: "Unresponsive", lastContactDate: "2026-01-22", createdAt: "2024-08-30" },
  { name: "Roshni Nadar", email: "roshni.nadar@stratosphereinc.com", phone: "+91 9876543298", company: "Stratosphere Inc", status: "active", notes: "Onboarding completed", lastContactDate: "2026-08-05", createdAt: "2025-08-02" },
  { name: "Ruchi Parikh", email: "ruchi.parikh@cloudpinnacle.com", phone: "+91 9876543299", company: "CloudPinnacle", status: "active", notes: "Primary technical contact", lastContactDate: "2026-07-31", createdAt: "2025-03-14" },
  { name: "Sachin Tendulkar", email: "sachin.tendulkar@axiomdata.co", phone: "+91 9876543300", company: "Axiom Data", status: "active", notes: "Requested security docs", lastContactDate: "2026-08-02", createdAt: "2025-06-20" },
  { name: "Sandeep Maheshwari", email: "sandeep.maheshwari@lunarlogic.com", phone: "+91 9876543301", company: "Lunar Logic", status: "active", notes: "Adding 10 user licenses", lastContactDate: "2026-08-04", createdAt: "2025-07-11" },
  { name: "Sangeeta Bijlani", email: "sangeeta.bijlani@apexsystems.net", phone: "+91 9876543302", company: "Apex Systems", status: "inactive", notes: "Project completed Q2", lastContactDate: "2026-05-15", createdAt: "2024-11-28" },
  { name: "Sanjay Dutt", email: "sanjay.dutt@vortexlabs.io", phone: "+91 9876543303", company: "Vortex Labs", status: "active", notes: "Exploring enterprise API", lastContactDate: "2026-07-27", createdAt: "2025-02-14" },
  { name: "Sanjeev Kapoor", email: "sanjeev.kapoor@crestlinegroup.com", phone: "+91 9876543304", company: "Crestline Group", status: "active", notes: "Annual renewal discussion", lastContactDate: "2026-08-01", createdAt: "2025-04-10" },
  { name: "Shalini Sundar", email: "shalini.sundar@pulseanalytics.com", phone: "+91 9876543305", company: "Pulse Analytics", status: "active", notes: "Integration completed", lastContactDate: "2026-07-29", createdAt: "2025-05-03" },
  { name: "Shashi Tharoor", email: "shashi.tharoor@horizonai.dev", phone: "+91 9876543306", company: "Horizon AI", status: "inactive", notes: "Switched account manager", lastContactDate: "2026-03-10", createdAt: "2024-10-12" },
  { name: "Shikhar Dhawan", email: "shikhar.dhawan@emberforge.co", phone: "+91 9876543307", company: "EmberForge", status: "active", notes: "SaaS platform lead", lastContactDate: "2026-08-03", createdAt: "2025-06-28" },
  { name: "Shilpa Shetty", email: "shilpa.shetty@swiftcurrent.io", phone: "+91 9876543308", company: "SwiftCurrent", status: "active", notes: "Custom reporting requested", lastContactDate: "2026-07-26", createdAt: "2025-01-22" },
  { name: "Shivam Dube", email: "shivam.dube@quantumreach.com", phone: "+91 9876543309", company: "QuantumReach", status: "active", notes: "Review meeting scheduled", lastContactDate: "2026-08-02", createdAt: "2025-03-19" },
  { name: "Shruti Haasan", email: "shruti.haasan@ironcladsec.com", phone: "+91 9876543310", company: "Ironclad Security", status: "inactive", notes: "Contract expired", lastContactDate: "2026-04-18", createdAt: "2024-12-04" },
  { name: "Shubman Gill", email: "shubman.gill@silverlinesaas.com", phone: "+91 9876543311", company: "Silverline SaaS", status: "active", notes: "Key stakeholder", lastContactDate: "2026-07-31", createdAt: "2025-05-24" },
  { name: "Sonal Chauhan", email: "sonal.chauhan@zenithcloud.net", phone: "+91 9876543312", company: "Zenith Cloud", status: "active", notes: "Upsell opportunity", lastContactDate: "2026-08-04", createdAt: "2025-07-08" },
  { name: "Sonam Kapoor", email: "sonam.kapoor@brightscale.co", phone: "+91 9876543313", company: "BrightScale", status: "active", notes: "Quarterly review done", lastContactDate: "2026-07-28", createdAt: "2025-02-11" },
  { name: "Sourav Ganguly", email: "sourav.ganguly@peakflowtech.com", phone: "+91 9876543314", company: "PeakFlow Tech", status: "inactive", notes: "Budget frozen", lastContactDate: "2026-02-24", createdAt: "2024-09-18" },
  { name: "Sriya Reddy", email: "sriya.reddy@arclight.dev", phone: "+91 9876543315", company: "Arclight Dev", status: "active", notes: "Adding new team members", lastContactDate: "2026-08-01", createdAt: "2025-04-15" },
  { name: "Subhash Chandra", email: "subhash.chandra@tidalsoftware.com", phone: "+91 9876543316", company: "Tidal Software", status: "active", notes: "Feature feedback provided", lastContactDate: "2026-07-25", createdAt: "2025-06-02" },
  { name: "Sudha Murty", email: "sudha.murty@techvault.com", phone: "+91 9876543317", company: "TechVault", status: "active", notes: "Billing admin", lastContactDate: "2026-08-03", createdAt: "2025-07-19" },
  { name: "Sumanth Kumar", email: "sumanth.kumar@novaedge.io", phone: "+91 9876543318", company: "NovaEdge", status: "inactive", notes: "Account dormant", lastContactDate: "2026-03-30", createdAt: "2024-10-25" },
  { name: "Sunil Chhetri", email: "sunil.chhetri@brightwavetech.com", phone: "+91 9876543319", company: "BrightWave Tech", status: "active", notes: "Requested onboarding guide", lastContactDate: "2026-07-30", createdAt: "2025-03-05" },
  { name: "Sunita Williams", email: "sunita.williams@stratosphereinc.com", phone: "+91 9876543320", company: "Stratosphere Inc", status: "active", notes: "High usage client", lastContactDate: "2026-08-04", createdAt: "2025-05-29" },
  { name: "Suresh Raina", email: "suresh.raina@cloudpinnacle.com", phone: "+91 9876543321", company: "CloudPinnacle", status: "active", notes: "Contract signed", lastContactDate: "2026-07-27", createdAt: "2025-01-15" },
  { name: "Suryakumar Yadav", email: "suryakumar.yadav@axiomdata.co", phone: "+91 9876543322", company: "Axiom Data", status: "inactive", notes: "Referred to partner", lastContactDate: "2026-01-29", createdAt: "2024-08-11" },
  { name: "Swati Maliwal", email: "swati.maliwal@lunarlogic.com", phone: "+91 9876543323", company: "Lunar Logic", status: "active", notes: "New contract lead", lastContactDate: "2026-08-02", createdAt: "2025-06-14" },
  { name: "Taapsee Pannu", email: "taapsee.pannu@apexsystems.net", phone: "+91 9876543324", company: "Apex Systems", status: "active", notes: "SSO rollout ready", lastContactDate: "2026-08-05", createdAt: "2025-07-27" },
  { name: "Tanishq Mukherjee", email: "tanishq.mukherjee@vortexlabs.io", phone: "+91 9876543325", company: "Vortex Labs", status: "active", notes: "Product trial active", lastContactDate: "2026-07-29", createdAt: "2025-04-19" },
  { name: "Tarun Gogoi", email: "tarun.gogoi@crestlinegroup.com", phone: "+91 9876543326", company: "Crestline Group", status: "inactive", notes: "Left organization", lastContactDate: "2026-04-02", createdAt: "2024-11-08" },
  { name: "Tejaswini Sawant", email: "tejaswini.sawant@pulseanalytics.com", phone: "+91 9876543327", company: "Pulse Analytics", status: "active", notes: "Requested roadmap details", lastContactDate: "2026-08-01", createdAt: "2025-03-28" },
  { name: "Trisha Krishnan", email: "trisha.krishnan@horizonai.dev", phone: "+91 9876543328", company: "Horizon AI", status: "active", notes: "API integration live", lastContactDate: "2026-07-24", createdAt: "2025-05-12" },
  { name: "Tusshar Kapoor", email: "tusshar.kapoor@emberforge.co", phone: "+91 9876543329", company: "EmberForge", status: "active", notes: "Engineering manager", lastContactDate: "2026-08-03", createdAt: "2025-06-08" },
  { name: "Uday Kotak", email: "uday.kotak@swiftcurrent.io", phone: "+91 9876543330", company: "SwiftCurrent", status: "inactive", notes: "Account closed", lastContactDate: "2026-02-12", createdAt: "2024-10-01" },
  { name: "Udit Narayan", email: "udit.narayan@quantumreach.com", phone: "+91 9876543331", company: "QuantumReach", status: "active", notes: "Pilot program participant", lastContactDate: "2026-07-31", createdAt: "2025-02-19" },
  { name: "Upendra Rao", email: "upendra.rao@ironcladsec.com", phone: "+91 9876543332", company: "Ironclad Security", status: "active", notes: "Compliance officer", lastContactDate: "2026-08-04", createdAt: "2025-07-04" },
  { name: "Urvashi Rautela", email: "urvashi.rautela@silverlinesaas.com", phone: "+91 9876543333", company: "Silverline SaaS", status: "active", notes: "Expanding seat count", lastContactDate: "2026-07-28", createdAt: "2025-04-25" },
  { name: "Uttam Kumar", email: "uttam.kumar@zenithcloud.net", phone: "+91 9876543334", company: "Zenith Cloud", status: "inactive", notes: "Evaluating alternatives", lastContactDate: "2026-05-01", createdAt: "2024-12-15" },
  { name: "Vaibhav Gehlot", email: "vaibhav.gehlot@brightscale.co", phone: "+91 9876543335", company: "BrightScale", status: "active", notes: "New account manager assigned", lastContactDate: "2026-08-02", createdAt: "2025-06-22" },
  { name: "Vaani Kapoor", email: "vaani.kapoor@peakflowtech.com", phone: "+91 9876543336", company: "PeakFlow Tech", status: "active", notes: "Needs custom export", lastContactDate: "2026-07-26", createdAt: "2025-01-30" },
  { name: "Venkatesh Prasad", email: "venkatesh.prasad@arclight.dev", phone: "+91 9876543337", company: "Arclight Dev", status: "active", notes: "Developer tier subscriber", lastContactDate: "2026-08-05", createdAt: "2025-07-14" },
  { name: "Vidyut Jammwal", email: "vidyut.jammwal@tidalsoftware.com", phone: "+91 9876543338", company: "Tidal Software", status: "inactive", notes: "Contract under review", lastContactDate: "2026-03-18", createdAt: "2024-11-25" },
  { name: "Vijay Sethupathi", email: "vijay.sethupathi@techvault.com", phone: "+91 9876543339", company: "TechVault", status: "active", notes: "Technical advisor", lastContactDate: "2026-07-30", createdAt: "2025-05-05" },
  { name: "Vikrant Massey", email: "vikrant.massey@novaedge.io", phone: "+91 9876543340", company: "NovaEdge", status: "active", notes: "Renewal confirmed", lastContactDate: "2026-08-03", createdAt: "2025-06-17" },
  { name: "Vinay Pathak", email: "vinay.pathak@brightwavetech.com", phone: "+91 9876543341", company: "BrightWave Tech", status: "active", notes: "Quarterly review complete", lastContactDate: "2026-07-27", createdAt: "2025-02-08" },
  { name: "Vineet Singh", email: "vineet.singh@stratosphereinc.com", phone: "+91 9876543342", company: "Stratosphere Inc", status: "inactive", notes: "No recent activity", lastContactDate: "2026-01-31", createdAt: "2024-09-08" },
  { name: "Vinoo Mankad", email: "vinoo.mankad@cloudpinnacle.com", phone: "+91 9876543343", company: "CloudPinnacle", status: "active", notes: "System admin POC", lastContactDate: "2026-08-01", createdAt: "2025-03-31" },
  { name: "Vipin Sharma", email: "vipin.sharma@axiomdata.co", phone: "+91 9876543344", company: "Axiom Data", status: "active", notes: "Wants automated reports", lastContactDate: "2026-07-29", createdAt: "2025-05-18" },
  { name: "Virender Sehwag", email: "virender.sehwag@lunarlogic.com", phone: "+91 9876543345", company: "Lunar Logic", status: "active", notes: "Key executive", lastContactDate: "2026-08-04", createdAt: "2025-07-21" },
  { name: "Vishal Dadlani", email: "vishal.dadlani@apexsystems.net", phone: "+91 9876543346", company: "Apex Systems", status: "inactive", notes: "Paused subscription", lastContactDate: "2026-04-14", createdAt: "2024-12-28" },
  { name: "Yuvraj Singh", email: "yuvraj.singh@vortexlabs.io", phone: "+91 9876543347", company: "Vortex Labs", status: "active", notes: "Upgraded plan", lastContactDate: "2026-08-02", createdAt: "2025-06-11" },
  { name: "Yuzvendra Chahal", email: "yuzvendra.chahal@crestlinegroup.com", phone: "+91 9876543348", company: "Crestline Group", status: "active", notes: "Finance contact", lastContactDate: "2026-07-28", createdAt: "2025-02-15" },
  { name: "Zakir Hussain", email: "zakir.hussain@pulseanalytics.com", phone: "+91 9876543349", company: "Pulse Analytics", status: "active", notes: "Data scientist lead", lastContactDate: "2026-08-05", createdAt: "2025-07-31" },
  { name: "Zoya Akhtar", email: "zoya.akhtar@horizonai.dev", phone: "+91 9876543350", company: "Horizon AI", status: "inactive", notes: "Account under review", lastContactDate: "2026-03-25", createdAt: "2024-11-12" },
];

function seedStore(): void {
  if (customerStore.size > 0) return;

  // Use a fixed base date (2026-08-05) so dates are deterministic across serverless instances
  const baseTime = new Date("2026-08-05T12:00:00.000Z").getTime();

  seedData.forEach((entry, index) => {
    // Generate deterministic valid UUIDs so all Vercel serverless function instances
    // share the exact same IDs for all 150 seed customers.
    const hexIndex = String(index + 1).padStart(12, "0");
    const id = `00000000-0000-4000-8000-${hexIndex}`;

    const daysAgo = index + 1;
    const contactDate = new Date(baseTime - daysAgo * 24 * 60 * 60 * 1000);
    const createdDate = new Date(baseTime - (daysAgo + 30) * 24 * 60 * 60 * 1000);

    customerStore.set(id, {
      ...entry,
      id,
      lastContactDate: contactDate.toISOString(),
      createdAt: createdDate.toISOString(),
    });
  });
}

seedStore();

export function getStore(): Map<string, Customer> {
  return customerStore;
}
