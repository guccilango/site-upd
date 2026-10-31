// UPD Records API Client + Deterministic Seed State (works connected to FastAPI or standalone on GitHub Pages)

const INITIAL_RANKS = [
  { id: 1, name: "Cadet", level: 1, discord_role_id: "120001000000000001" },
  { id: 2, name: "Officer I", level: 2, discord_role_id: "120001000000000002" },
  { id: 3, name: "Officer II", level: 3, discord_role_id: "120001000000000003" },
  { id: 4, name: "Officer III", level: 4, discord_role_id: "120001000000000004" },
  { id: 5, name: "Corporal", level: 5, discord_role_id: "120001000000000005" },
  { id: 6, name: "Sergeant I", level: 6, discord_role_id: "120001000000000006" },
  { id: 7, name: "Sergeant II", level: 7, discord_role_id: "120001000000000007" },
  { id: 8, name: "Lieutenant I", level: 8, discord_role_id: "120001000000000008" },
  { id: 9, name: "Lieutenant II", level: 9, discord_role_id: "120001000000000009" },
  { id: 10, name: "Captain", level: 10, discord_role_id: "120001000000000010" },
  { id: 11, name: "Commander", level: 11, discord_role_id: "120001000000000011" },
  { id: 12, name: "Deputy Chief", level: 12, discord_role_id: "120001000000000012" },
  { id: 13, name: "Assistant Chief", level: 13, discord_role_id: "120001000000000013" },
  { id: 14, name: "Chief of Police", level: 14, discord_role_id: "120001000000000014" }
];

const INITIAL_OFFICERS = [
  { id: 1, discord_id: "381920194810294001", rp_name: "Alexander Hawthorne", badge: "102", division: "Command Staff", status: "active", rank_id: 11, rank_name: "Commander", rank_level: 11, is_admin: 1 },
  { id: 2, discord_id: "381920194810294002", rp_name: "Jonathan Vance", badge: "4109", division: "Robbery-Homicide Division", status: "active", rank_id: 4, rank_name: "Officer III", rank_level: 4, is_admin: 0 },
  { id: 3, discord_id: "381920194810294003", rp_name: "Elena Rostova", badge: "2084", division: "Firearms Training Unit", status: "active", rank_id: 6, rank_name: "Sergeant I", rank_level: 6, is_admin: 0 },
  { id: 4, discord_id: "381920194810294004", rp_name: "Marcus Holloway", badge: "3115", division: "Metropolitan SWAT", status: "active", rank_id: 8, rank_name: "Lieutenant I", rank_level: 8, is_admin: 0 },
  { id: 5, discord_id: "381920194810294005", rp_name: "Caleb Mercer", badge: "5219", division: "Patrol Division", status: "pending", rank_id: 2, rank_name: "Officer I", rank_level: 2, is_admin: 0 }
];

const INITIAL_TEMPLATES = [
  {
    code: "SW",
    name: "Affidavit and Application for Search Warrant",
    category: "doj",
    min_issue_level: 2,
    min_approve_level: 11,
    channel: "web",
    active: 1,
    version: 1,
    title: "AFFIDAVIT AND APPLICATION FOR A SEARCH WARRANT",
    court_header: "IN THE SUPERIOR COURT OF THE STATE OF SAN ANDREAS\nIN AND FOR THE COUNTY OF LOS SANTOS",
    fields: [
      { key: "case_no", label: "Case / Docket No.", type: "text", required: true, max_length: 60, placeholder: "26-CR-00418" },
      { key: "target_subject", label: "Target Subject / Occupant(s)", type: "text", required: true, max_length: 200, placeholder: "Marcus Vance, DOB 04/12/1994, and unknown associates" },
      { key: "target_premises", label: "Premises to be Searched (Full Address & Description)", type: "textarea", required: true, max_length: 800, placeholder: "1428 Forum Drive, Apt. 3B, Strawberry, Los Santos — a two-story stucco residential structure with a white metal security door bearing numerals '3B'." },
      { key: "statutes_violated", label: "Offense(s) / Penal Code Sections", type: "text", required: true, max_length: 300, placeholder: "San Andreas Penal Code §§ 187(a) (Murder), 29800(a)(1) (Felon in Possession of Firearm)" },
      { key: "items_to_seize", label: "Property & Evidence to be Seized (Schedule A)", type: "textarea", required: true, max_length: 1500, placeholder: "1. Any and all 9mm Luger firearms, magazines, ammunition, and spent casings;\n2. Cellular telephones, SIM cards, and digital storage media;\n3. Indicia of occupancy and dominion over the premises." },
      { key: "probable_cause", label: "Statement of Probable Cause (Facts & Investigation)", type: "textarea", required: true, max_length: 3500, placeholder: "On October 28, 2026, at approximately 2215 hours, Unified Police Department patrol units responded to a shots-fired call at Forum Drive..." },
      { key: "night_service", label: "Night Service & Knock-Notice Request", type: "text", required: true, max_length: 200, placeholder: "Standard Daytime Service (0700-2200 hrs)" }
    ],
    body: "<b>CASE DOCKET NO.:</b> {case_no}\n<b>TARGET SUBJECT(S):</b> {target_subject}\n<b>STATUTORY VIOLATIONS:</b> {statutes_violated}\n<b>EXECUTION PARAMETERS:</b> {night_service}\n\n<b>I. SWORN DECLARATION OF AFFIANT</b>\nI, <b>{issuer_name}</b>, Badge No. <b>#{issuer_badge}</b>, holding the rank of <b>{issuer_rank}</b> with the Unified Police Department (UPD), being first duly sworn, hereby depose and state under penalty of perjury under the laws of the State of San Andreas that I have probable cause to believe, and do believe, that evidence of a felony crime is presently concealed at the premises described below.\n\n<b>II. PARTICULAR DESCRIPTION OF PREMISES TO BE SEARCHED</b>\n{target_premises}\n\n<b>III. PARTICULAR DESCRIPTION OF PROPERTY & EVIDENCE TO BE SEIZED (SCHEDULE A)</b>\n{items_to_seize}\n\n<b>IV. STATEMENT OF PROBABLE CAUSE</b>\n{probable_cause}\n\n<b>V. PRAYER FOR ORDER</b>\nWHEREFORE, Affiant prays that a Search Warrant be issued by the Superior Court commanding any Peace Officer of the Unified Police Department to search the above-described premises and seize the enumerated property for disposition in accordance with law."
  },
  {
    code: "AW",
    name: "Affidavit and Application for Arrest Warrant",
    category: "doj",
    min_issue_level: 2,
    min_approve_level: 11,
    channel: "web",
    active: 1,
    version: 1,
    title: "AFFIDAVIT OF PROBABLE CAUSE FOR ARREST WARRANT",
    court_header: "IN THE SUPERIOR COURT OF THE STATE OF SAN ANDREAS\nIN AND FOR THE COUNTY OF LOS SANTOS",
    fields: [
      { key: "case_no", label: "Case / Docket No.", type: "text", required: true, max_length: 60, placeholder: "26-CR-00419" },
      { key: "defendant_name", label: "Defendant Full Name & Identifiers", type: "text", required: true, max_length: 250, placeholder: "Dante Moretti · State ID #88219 · DOB 11/03/1991" },
      { key: "last_known_address", label: "Last Known Residence / Location", type: "text", required: true, max_length: 250, placeholder: "742 Mirror Park Blvd., Los Santos, SA" },
      { key: "charges", label: "Criminal Charges (Penal Code Sections & Counts)", type: "textarea", required: true, max_length: 800, placeholder: "Count 1: Penal Code § 211 — Armed Robbery (Felony)\nCount 2: Penal Code § 245(a)(2) — Assault with a Deadly Weapon (Felony)" },
      { key: "probable_cause", label: "Statement of Probable Cause", type: "textarea", required: true, max_length: 3500, placeholder: "Surveillance footage and positive ballistic comparison establish that Defendant discharged a 9mm handgun during the robbery..." },
      { key: "bail_request", label: "Recommended Bail / Remand Status", type: "text", required: true, max_length: 150, placeholder: "No Bail — Flight & Public Safety Risk" }
    ],
    body: "<b>CASE DOCKET NO.:</b> {case_no}\n<b>DEFENDANT:</b> {defendant_name}\n<b>LAST KNOWN ADDRESS:</b> {last_known_address}\n<b>RECOMMENDED BAIL STATUS:</b> {bail_request}\n\n<b>I. SWORN COMPLAINT & AFFIDAVIT</b>\nBefore the Superior Court of the State of San Andreas personally appeared <b>{issuer_name}</b> ({issuer_rank}, Badge #{issuer_badge}), of the Unified Police Department, who, being first duly sworn, deposes and says that within the County of Los Santos the above-named Defendant committed the offenses set forth herein.\n\n<b>II. ENUMERATED CRIMINAL CHARGES</b>\n{charges}\n\n<b>III. STATEMENT OF PROBABLE CAUSE</b>\n{probable_cause}\n\n<b>IV. REQUEST FOR ISSUANCE OF WARRANT</b>\nWHEREFORE, Affiant requests that a Warrant of Arrest be issued authorizing any Peace Officer of the State of San Andreas to apprehend and bring the above-named Defendant before a Magistrate of the Superior Court."
  },
  {
    code: "CO",
    name: "Application for Court Order — Disclosure of Records (18 U.S.C. § 2703(d))",
    category: "doj",
    min_issue_level: 4,
    min_approve_level: 11,
    channel: "web",
    active: 1,
    version: 1,
    title: "APPLICATION FOR COURT ORDER FOR DISCLOSURE OF RECORDS\nPURSUANT TO 18 U.S.C. § 2703(d) & S.A. FINANCIAL PRIVACY ACT",
    court_header: "IN THE SUPERIOR COURT OF THE STATE OF SAN ANDREAS\nIN AND FOR THE COUNTY OF LOS SANTOS",
    fields: [
      { key: "case_no", label: "Case / Investigation No.", type: "text", required: true, max_length: 60, placeholder: "26-INV-00109" },
      { key: "target_account", label: "Target Subject & Account / Phone / Identifier", type: "text", required: true, max_length: 250, placeholder: "Account #4401-9982 (Maze Bank) / Tel. (555) 019-4821 — Subscribed to Viktor Kovalenko" },
      { key: "custodian_entity", label: "Service Provider / Financial Institution", type: "text", required: true, max_length: 200, placeholder: "Maze Bank of Los Santos & Whiz Wireless Telecommunications" },
      { key: "records_scope", label: "Scope of Records & Date Range Requested", type: "textarea", required: true, max_length: 1200, placeholder: "All call detail records (CDRs), cell-site location information (CSLI), and wire transfer logs from 09/01/2026 through present." },
      { key: "articulable_facts", label: "Specific and Articulable Facts (Statutory Relevance)", type: "textarea", required: true, max_length: 3500, placeholder: "Subpoenaed toll records demonstrate structured wire transfers immediately preceding narcotics deliveries..." },
      { key: "nondisclosure_period", label: "Non-Disclosure & Sealing Order Request", type: "text", required: true, max_length: 150, placeholder: "90-Day Non-Disclosure Order (18 U.S.C. § 2705(b))" }
    ],
    body: "<b>INVESTIGATION NO.:</b> {case_no}\n<b>TARGET IDENTIFIER / SUBSCRIBER:</b> {target_account}\n<b>CUSTODIAN OF RECORDS:</b> {custodian_entity}\n<b>SEALING & NON-DISCLOSURE:</b> {nondisclosure_period}\n\n<b>I. STATUTORY APPLICATION</b>\n<b>{issuer_name}</b> ({issuer_rank}, Badge #{issuer_badge}), a sworn investigator of the Unified Police Department, hereby applies to the Superior Court for an Order pursuant to 18 U.S.C. § 2703(d) compelling <b>{custodian_entity}</b> to disclose the records specified below.\n\n<b>II. RECORDS & DATA TO BE PRODUCED</b>\n{records_scope}\n\n<b>III. SPECIFIC AND ARTICULABLE FACTS</b>\n{articulable_facts}"
  },
  {
    code: "SO",
    name: "Request for Authorization — Community Stabilization Operation (SMEAC)",
    category: "doj",
    min_issue_level: 8,
    min_approve_level: 11,
    channel: "web",
    active: 1,
    version: 1,
    title: "REQUEST FOR JUDICIAL & EXECUTIVE AUTHORIZATION\nSPECIAL TACTICAL & COMMUNITY STABILIZATION OPERATION (SMEAC)",
    court_header: "BEFORE THE DEPARTMENT OF JUSTICE & SUPERIOR COURT\nSTATE OF SAN ANDREAS · COUNTY OF LOS SANTOS",
    fields: [
      { key: "operation_name", label: "Operation Codename & Designated Zone", type: "text", required: true, max_length: 200, placeholder: "OPERATION IRON SHIELD — Davis / Grove Street Cul-de-Sac Sector" },
      { key: "operational_window", label: "Operational Window (Start & End Date/Time)", type: "text", required: true, max_length: 150, placeholder: "November 2, 2026 (0600 hrs) through November 5, 2026 (2200 hrs)" },
      { key: "situation", label: "1. SITUATION (Threat Intelligence & Armed Group Activity)", type: "textarea", required: true, max_length: 1500, placeholder: "Over the preceding 14 days, the designated sector has experienced 11 confirmed Class-3 automatic weapons discharges..." },
      { key: "mission", label: "2. MISSION STATEMENT", type: "textarea", required: true, max_length: 800, placeholder: "Establish continuous law enforcement presence, execute high-risk felony warrants, and restore civil order." },
      { key: "execution", label: "3. EXECUTION & TACTICAL PHASES (Units, Perimeter & Checkpoints)", type: "textarea", required: true, max_length: 1500, placeholder: "Phase I: Perimeter containment by UPD Patrol & Air Support. Phase II: Tactical entry by SWAT. Phase III: Stabilization patrols." },
      { key: "roe_safeguards", label: "4. RULES OF ENGAGEMENT & CONSTITUTIONAL SAFEGUARDS", type: "textarea", required: true, max_length: 1000, placeholder: "Strict adherence to UPD Use-of-Force Policy (Graham v. Connor). Body-worn cameras mandatory on all personnel." }
    ],
    body: "<b>OPERATION DESIGNATION:</b> {operation_name}\n<b>OPERATIONAL WINDOW:</b> {operational_window}\n<b>FILING COMMAND OFFICER:</b> {issuer_name} ({issuer_rank}, Badge #{issuer_badge})\n\n<b>I. SITUATION & INTELLIGENCE ASSESSMENT</b>\n{situation}\n\n<b>II. MISSION</b>\n{mission}\n\n<b>III. EXECUTION PLAN (PHASES & DEPLOYED UNITS)</b>\n{execution}\n\n<b>IV. RULES OF ENGAGEMENT & SAFEGUARDS</b>\n{roe_safeguards}"
  },
  {
    code: "FQ",
    name: "Certificate of Firearms Qualification & UPD Weapon Authorization",
    category: "internal",
    min_issue_level: 5,
    min_approve_level: 5,
    channel: "web",
    active: 1,
    version: 1,
    title: "CERTIFICATE OF FIREARMS QUALIFICATION\n& DEPARTMENTAL WEAPON CUSTODY AUTHORIZATION",
    court_header: "UNIFIED POLICE DEPARTMENT · FIREARMS TRAINING & RANGE DIVISION\nSTATE OF SAN ANDREAS POST CERTIFICATION",
    fields: [
      { key: "holder_name", label: "Authorized Individual Full Name", type: "text", required: true, max_length: 150, placeholder: "Lucas Sterling" },
      { key: "holder_id", label: "State ID / Citizen Identification No.", type: "text", required: true, max_length: 60, placeholder: "SA-ID #30491" },
      { key: "doj_permit_ref", label: "DOJ Firearms Permit / Referral Docket No.", type: "text", required: true, max_length: 100, placeholder: "DOJ-CCW-2026-0812" },
      { key: "course_score", label: "Qualification Course & Range Score", type: "text", required: true, max_length: 150, placeholder: "POST Combat & Legal Deadly Force Qualification — Score: 96/100 (QUALIFIED)" },
      { key: "weapon_details", label: "Assigned UPD Weapon (Make, Model, Caliber & Serial No.)", type: "text", required: true, max_length: 250, placeholder: "Glock 17 Gen 5 · 9x19mm Parabellum · Serial No. UPD-ARM-88412" },
      { key: "conditions", label: "Custody Terms & Operational Restrictions", type: "textarea", required: true, max_length: 800, placeholder: "Weapon remains the exclusive property of the Unified Police Department. Holder is certified in safe handling, retention, and statutory use-of-force limitations." }
    ],
    body: "<b>CERTIFIED INDIVIDUAL:</b> {holder_name} (State ID: {holder_id})\n<b>DOJ PERMIT / REFERRAL NO.:</b> {doj_permit_ref}\n<b>ISSUING INSTRUCTOR:</b> {issuer_name} ({issuer_rank}, Badge #{issuer_badge})\n\n<b>I. ATTESTATION OF FIREARMS QUALIFICATION</b>\nPursuant to the referral of the Department of Justice (<b>{doj_permit_ref}</b>), the Unified Police Department Firearms Training Division hereby certifies that <b>{holder_name}</b> has satisfactorily completed mandatory instruction and live-fire proficiency:\n\n<b>Qualification Result:</b> {course_score}\n\n<b>II. DECLARATION OF UPD WEAPON OWNERSHIP & AUTHORIZATION TO HANDLE</b>\nThe firearm identified below is, and at all times remains, the official property of the <b>Unified Police Department (UPD)</b>:\n\n<b>Assigned Firearm:</b> {weapon_details}\n\n<b>Conditions of Custody:</b>\n{conditions}"
  },
  {
    code: "CM",
    name: "Official Departmental Commendation",
    category: "internal",
    min_issue_level: 5,
    min_approve_level: 5,
    channel: "modal",
    active: 1,
    version: 1,
    title: "OFFICIAL DEPARTMENTAL COMMENDATION\nOFFICE OF THE CHIEF OF POLICE",
    court_header: "UNIFIED POLICE DEPARTMENT · HONORS & AWARDS BOARD\nCOUNTY OF LOS SANTOS, STATE OF SAN ANDREAS",
    fields: [
      { key: "recipient_name", label: "Recipient Officer Name & Badge", type: "text", required: true, max_length: 150, placeholder: "Officer III Jonathan Vance · Badge #4109" },
      { key: "award_class", label: "Decoration / Commendation Class", type: "text", required: true, max_length: 120, placeholder: "Medal of Valor" },
      { key: "incident_date", label: "Date & Location of Meritorious Act", type: "text", required: true, max_length: 150, placeholder: "October 29, 2026 — Pacific Standard Bank, Vinewood Blvd." },
      { key: "citation_narrative", label: "Citation Narrative", type: "textarea", required: true, max_length: 2500, placeholder: "For conspicuous gallantry and devotion to duty during an armed hostage barricade..." }
    ],
    body: "<b>TO:</b> {recipient_name}\n<b>DECORATION CONFERRED:</b> {award_class}\n<b>DATE & LOCATION OF ACTION:</b> {incident_date}\n<b>NOMINATING SUPERVISOR:</b> {issuer_name} ({issuer_rank}, Badge #{issuer_badge})\n\n<b>CITATION FOR MERITORIOUS SERVICE</b>\nThe Command Staff of the Unified Police Department presents this Official Commendation to <b>{recipient_name}</b> in recognition of exceptional professionalism and courage:\n\n{citation_narrative}"
  }
];

const INITIAL_DOCUMENTS = [
  {
    id: 101,
    control_no: "UPD-SW-2026-0001",
    template_code: "SW",
    template_name: "Affidavit and Application for Search Warrant",
    category: "doj",
    min_approve_level: 11,
    status: "APPROVED",
    issuer_id: 2,
    issuer_name: "Jonathan Vance",
    issuer_badge: "4109",
    issuer_rank: "Officer III",
    approver_id: 1,
    approver_name: "Alexander Hawthorne",
    approver_badge: "102",
    approver_rank: "Commander",
    created_at: "2026-10-29T18:10:00Z",
    approved_at: "2026-10-29T19:05:00Z",
    png_url: "https://api.fivemanage.com/images/upd-sw-2026-0001.png",
    data_json: {
      case_no: "26-CR-00418",
      target_subject: "Marcus Vance, DOB 04/12/1994",
      target_premises: "1428 Forum Drive, Apt. 3B, Strawberry, Los Santos",
      statutes_violated: "Penal Code §§ 187(a), 29800(a)(1)",
      items_to_seize: "9mm Luger firearms, spent casings, cellular devices, and indicia of occupancy.",
      probable_cause: "Ballistic casing match to NIBIN record #26-8841 and eyewitness identification placing subject entering Apt. 3B immediately after the shooting.",
      night_service: "Standard Daytime Service (0700-2200 hrs)"
    }
  },
  {
    id: 102,
    control_no: "UPD-FQ-2026-0001",
    template_code: "FQ",
    template_name: "Certificate of Firearms Qualification & UPD Weapon Authorization",
    category: "internal",
    min_approve_level: 5,
    status: "APPROVED",
    issuer_id: 3,
    issuer_name: "Elena Rostova",
    issuer_badge: "2084",
    issuer_rank: "Sergeant I",
    approver_id: 4,
    approver_name: "Marcus Holloway",
    approver_badge: "3115",
    approver_rank: "Lieutenant I",
    created_at: "2026-10-30T14:20:00Z",
    approved_at: "2026-10-30T15:00:00Z",
    png_url: "https://api.fivemanage.com/images/upd-fq-2026-0001.png",
    data_json: {
      holder_name: "Lucas Sterling",
      holder_id: "SA-ID #30491",
      doj_permit_ref: "DOJ-CCW-2026-0812",
      course_score: "POST Combat & Legal Deadly Force Qualification — Score: 96/100 (QUALIFIED)",
      weapon_details: "Glock 17 Gen 5 · 9x19mm Parabellum · Serial No. UPD-ARM-88412",
      conditions: "Weapon remains the exclusive property of the Unified Police Department. Holder is certified in safe handling, retention, and statutory use-of-force limitations."
    }
  },
  {
    id: 103,
    control_no: null,
    template_code: "CO",
    template_name: "Application for Court Order — Disclosure of Records (18 U.S.C. § 2703(d))",
    category: "doj",
    min_approve_level: 11,
    status: "PENDING",
    issuer_id: 2,
    issuer_name: "Jonathan Vance",
    issuer_badge: "4109",
    issuer_rank: "Officer III",
    approver_id: null,
    approver_name: null,
    approver_badge: null,
    approver_rank: "",
    created_at: "2026-10-31T01:15:00Z",
    approved_at: null,
    png_url: null,
    data_json: {
      case_no: "26-INV-00109",
      target_account: "Account #4401-9982 (Maze Bank) / Tel. (555) 019-4821 — Viktor Kovalenko",
      custodian_entity: "Maze Bank of Los Santos & Whiz Wireless",
      records_scope: "Call detail records (CDRs), cell-site location information (CSLI), and wire logs from 09/01/2026 to present.",
      articulable_facts: "Financial intelligence indicates three structured wire transfers totaling $145,000 immediately preceding seized narcotics shipments at the Port of Los Santos.",
      nondisclosure_period: "90-Day Non-Disclosure Order (18 U.S.C. § 2705(b))"
    }
  },
  {
    id: 104,
    control_no: null,
    template_code: "SO",
    template_name: "Request for Authorization — Community Stabilization Operation (SMEAC)",
    category: "doj",
    min_approve_level: 11,
    status: "PENDING",
    issuer_id: 4,
    issuer_name: "Marcus Holloway",
    issuer_badge: "3115",
    issuer_rank: "Lieutenant I",
    approver_id: null,
    approver_name: null,
    approver_badge: null,
    approver_rank: "",
    created_at: "2026-10-31T02:05:00Z",
    approved_at: null,
    png_url: null,
    data_json: {
      operation_name: "OPERATION IRON SHIELD — Davis / Grove Street Sector",
      operational_window: "November 2, 2026 (0600 hrs) through November 5, 2026 (2200 hrs)",
      situation: "11 confirmed Class-3 automatic weapons discharges and armed barricades recorded in the last 14 days.",
      mission: "Execute 6 high-risk felony arrest warrants, interdict illegal firearms, and restore civil order.",
      execution: "Phase I: Perimeter containment. Phase II: SWAT warrant service. Phase III: High-visibility foot patrols.",
      roe_safeguards: "Graham v. Connor compliance; mandatory body-worn cameras; EMS staged at Carson Ave."
    }
  }
];

function loadLocalStore() {
  const raw = localStorage.getItem("upd_portal_store_v1");
  if (raw) {
    try { return JSON.parse(raw); } catch (_) {}
  }
  const initial = {
    ranks: INITIAL_RANKS,
    officers: INITIAL_OFFICERS,
    templates: INITIAL_TEMPLATES,
    documents: INITIAL_DOCUMENTS,
    activeOfficerId: 1
  };
  localStorage.setItem("upd_portal_store_v1", JSON.stringify(initial));
  return initial;
}

function saveLocalStore(store) {
  localStorage.setItem("upd_portal_store_v1", JSON.stringify(store));
}

export const store = loadLocalStore();

export function getToken() {
  if (window.location.hash.startsWith("#token=")) {
    const t = window.location.hash.slice("#token=".length);
    sessionStorage.setItem("upd_jwt", t);
    window.location.hash = "#/";
  }
  return sessionStorage.getItem("upd_jwt");
}

export async function apiRequest(path, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${window.UPD_CONFIG.API_URL}${path}`, {
    ...options,
    headers
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const err = await res.json();
      msg = err.detail || msg;
    } catch (_) {}
    throw new Error(msg);
  }
  return res.json();
}

export function getCurrentOfficer() {
  return store.officers.find(o => o.id === store.activeOfficerId) || store.officers[0];
}

export function setActiveDemoOfficer(officerId) {
  store.activeOfficerId = Number(officerId);
  saveLocalStore(store);
}

export function canIssueTemplate(officer, template) {
  if (!officer || officer.status !== "active" || !template.active) return false;
  if (officer.is_admin) return true;
  return (officer.rank_level || 0) >= template.min_issue_level;
}

export function canApproveDocument(officer, doc) {
  if (!officer || officer.status !== "active") return false;
  if (Number(officer.id) === Number(doc.issuer_id)) return false; // Self-approval strictly forbidden
  if (officer.is_admin) return true;
  return (officer.rank_level || 0) >= (doc.min_approve_level || 5);
}

export function createDraftLocal(templateCode, fieldValues) {
  const officer = getCurrentOfficer();
  const tpl = store.templates.find(t => t.code === templateCode);
  if (!tpl) throw new Error("Template not found");
  if (!canIssueTemplate(officer, tpl)) throw new Error("Insufficient rank or inactive officer status");

  for (const f of tpl.fields) {
    const val = (fieldValues[f.key] || "").trim();
    if (f.required && !val) throw new Error(`Missing required field: ${f.label}`);
  }

  const nextId = store.documents.reduce((m, d) => Math.max(m, d.id), 100) + 1;
  const doc = {
    id: nextId,
    control_no: null,
    template_code: tpl.code,
    template_name: tpl.name,
    category: tpl.category,
    min_approve_level: tpl.min_approve_level,
    status: "PENDING",
    issuer_id: officer.id,
    issuer_name: officer.rp_name,
    issuer_badge: officer.badge,
    issuer_rank: officer.rank_name,
    approver_id: null,
    approver_name: null,
    approver_badge: null,
    approver_rank: "",
    created_at: new Date().toISOString(),
    approved_at: null,
    png_url: null,
    data_json: { ...fieldValues }
  };
  store.documents.unshift(doc);
  saveLocalStore(store);
  return doc;
}

export function approveDocumentLocal(docId) {
  const officer = getCurrentOfficer();
  const doc = store.documents.find(d => d.id === Number(docId));
  if (!doc) throw new Error("Document not found");
  if (!canApproveDocument(officer, doc)) {
    throw new Error("Self-approval is prohibited or rank is below required threshold.");
  }
  const year = new Date().getFullYear();
  const sameCode = store.documents.filter(d => d.template_code === doc.template_code && d.control_no);
  const seq = String(sameCode.length + 1).padStart(4, "0");
  doc.control_no = `UPD-${doc.template_code}-${year}-${seq}`;
  doc.status = "APPROVED";
  doc.approver_id = officer.id;
  doc.approver_name = officer.rp_name;
  doc.approver_badge = officer.badge;
  doc.approver_rank = officer.rank_name;
  doc.approved_at = new Date().toISOString();
  doc.png_url = `https://api.fivemanage.com/images/${doc.control_no.toLowerCase()}.png`;
  saveLocalStore(store);
  return doc;
}

export function rejectDocumentLocal(docId, reason) {
  const officer = getCurrentOfficer();
  const doc = store.documents.find(d => d.id === Number(docId));
  if (!doc) throw new Error("Document not found");
  if (!canApproveDocument(officer, doc)) {
    throw new Error("Self-rejection is prohibited or insufficient rank.");
  }
  doc.status = "REJECTED";
  doc.approver_id = officer.id;
  doc.approver_name = officer.rp_name;
  doc.approver_badge = officer.badge;
  doc.approver_rank = officer.rank_name;
  doc.reject_reason = reason;
  saveLocalStore(store);
  return doc;
}

export function revokeDocumentLocal(docId, reason) {
  const officer = getCurrentOfficer();
  if (!officer.is_admin) throw new Error("Only Command Administrators can revoke documents");
  const doc = store.documents.find(d => d.id === Number(docId));
  if (!doc) throw new Error("Document not found");
  doc.status = "REVOKED";
  doc.revoked_at = new Date().toISOString();
  doc.reject_reason = reason || "Revoked by Command Staff";
  saveLocalStore(store);
  return doc;
}

export function saveOfficerLocal(payload) {
  const rank = store.ranks.find(r => r.id === Number(payload.rank_id)) || store.ranks[0];
  const existing = store.officers.find(o => o.discord_id === payload.discord_id);
  if (existing) {
    Object.assign(existing, {
      rp_name: payload.rp_name,
      badge: payload.badge,
      division: payload.division,
      status: payload.status,
      rank_id: rank.id,
      rank_name: rank.name,
      rank_level: rank.level,
      is_admin: payload.is_admin ? 1 : 0
    });
  } else {
    const nextId = store.officers.reduce((m, o) => Math.max(m, o.id), 0) + 1;
    store.officers.push({
      id: nextId,
      discord_id: payload.discord_id,
      rp_name: payload.rp_name,
      badge: payload.badge,
      division: payload.division,
      status: payload.status,
      rank_id: rank.id,
      rank_name: rank.name,
      rank_level: rank.level,
      is_admin: payload.is_admin ? 1 : 0
    });
  }
  saveLocalStore(store);
}

export function saveRankLocal(rankId, name, level, discordRoleId) {
  const rk = store.ranks.find(r => r.id === Number(rankId));
  if (rk) {
    rk.name = name;
    rk.level = Number(level);
    rk.discord_role_id = discordRoleId;
  } else {
    const nextId = store.ranks.reduce((m, r) => Math.max(m, r.id), 0) + 1;
    store.ranks.push({ id: nextId, name, level: Number(level), discord_role_id: discordRoleId });
    store.ranks.sort((a, b) => a.level - b.level);
  }
  saveLocalStore(store);
}

export function saveTemplateLocal(updatedTpl) {
  const idx = store.templates.findIndex(t => t.code === updatedTpl.code);
  if (idx >= 0) {
    store.templates[idx] = { ...store.templates[idx], ...updatedTpl, version: (store.templates[idx].version || 1) + 1 };
  } else {
    store.templates.push({ ...updatedTpl, version: 1, active: 1 });
  }
  saveLocalStore(store);
}

export function verifyControlNoLocal(controlNo) {
  const norm = (controlNo || "").trim().toUpperCase();
  const doc = store.documents.find(d => (d.control_no || "").toUpperCase() === norm);
  if (!doc) return null;
  return {
    control_no: doc.control_no,
    template_code: doc.template_code,
    document_title: doc.template_name,
    category: doc.category,
    status: doc.status,
    issued_by: `${doc.issuer_rank} ${doc.issuer_name} (Badge #${doc.issuer_badge})`,
    approved_by: `${doc.approver_rank} ${doc.approver_name} (Badge #${doc.approver_badge})`,
    approved_at: doc.approved_at,
    revoked_at: doc.revoked_at || null,
    revocation_note: doc.status === "REVOKED" ? doc.reject_reason : null
  };
}
