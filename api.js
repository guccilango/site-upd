// UPD Records API Client — Real-Time Shared Cloud Registry + Discord Channel Dispatch + OAuth2
import { DOC_I18N, resolveTemplateForLang } from "./i18n.js?v=6";

// Internal encoded endpoints & role references (never rendered on UI)
const _INTERNAL = {
  api: atob("aHR0cDovLzc4LjE1NC4xMDMuMTg6MTI4ODk="),
  guild: atob("MTI1MjM4MzA3Mzg5MTI1ODQ0OA=="),
  supRole: atob("MTUwMTcxNDA3Mzc0NDU3MjQ1Ng=="),
  ownerId: atob("Mzk1NzU5NzA1Nzg5NTYyODgx"),
  masterKey: atob("VVBELUFETUlOLTIwMjY="),
  clientSec: atob("T0swSlZmUXI0TnU1MWhGaHRSbG03UWpEek13dmlJN1I="),
  docsWh: atob("aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvdjEwL3dlYmhvb2tzLzE1NjYwMTExMDE1ODg2Mjc0ODYvQkJPa2hSWlAya0dWRmJUUGdkeGlYZUtiNmE2MHBFNDdMOVBOT2x4Y25MdEpheUlQM0ZCd1B3NU1WZHVMQ2NsOTJkdWg="),
  syncWh: atob("aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvdjEwL3dlYmhvb2tzLzE1NjYwMTEyNDk2MjI1MjM5NjQvR2x6Tk5ac2dRSjF6Z2FRYTd6ZkFscVZPQnp5VnlOTDZnb21SVGk4Uks1TUs5NXFhQ2V4YmFuQnZwUG9OU0hBRHctRUs="),
  syncMid: atob("MTU2NjAxMjMxMjUzNDUxNTc4Mw=="),
  fmKey: atob("SkpFdVp3SlF3cFVqYW9oZDU4MFJUVU1lRm1oTzNzY2s=")
};

const STORE_STORAGE_KEY = "upd_portal_store_v4";
let _activeSyncMid = localStorage.getItem("upd_sync_mid") || _INTERNAL.syncMid;
let _isPushing = false;
let _pushPending = false;
let _initialSyncDone = false;

const _bc = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("upd_realtime_sync") : null;

const INITIAL_RANKS = [
  { id: 1, name: "Cadet", level: 1, discord_role_id: "" },
  { id: 2, name: "Officer I", level: 2, discord_role_id: "" },
  { id: 3, name: "Officer II", level: 3, discord_role_id: "" },
  { id: 4, name: "Officer III", level: 4, discord_role_id: "" },
  { id: 5, name: "Corporal", level: 5, discord_role_id: "" },
  { id: 6, name: "Sergeant I", level: 6, discord_role_id: "" },
  { id: 7, name: "Sergeant II", level: 7, discord_role_id: "" },
  { id: 8, name: "Lieutenant I", level: 8, discord_role_id: "" },
  { id: 9, name: "Lieutenant II", level: 9, discord_role_id: "" },
  { id: 10, name: "Captain", level: 10, discord_role_id: "" },
  { id: 11, name: "Commander", level: 11, discord_role_id: _INTERNAL.supRole },
  { id: 12, name: "Deputy Chief", level: 12, discord_role_id: "" },
  { id: 13, name: "Assistant Chief", level: 13, discord_role_id: "" },
  { id: 14, name: "Chief of Police", level: 14, discord_role_id: "" }
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
      { key: "target_subject", label: "Target Subject / Occupant(s)", type: "text", required: true, max_length: 200, placeholder: "Full name, DOB, and known associates" },
      { key: "target_premises", label: "Premises to be Searched (Full Address & Description)", type: "textarea", required: true, max_length: 800, placeholder: "Full street address and physical description of premises to be searched..." },
      { key: "statutes_violated", label: "Offense(s) / Penal Code Sections", type: "text", required: true, max_length: 300, placeholder: "San Andreas Penal Code sections" },
      { key: "items_to_seize", label: "Property & Evidence to be Seized (Schedule A)", type: "textarea", required: true, max_length: 1500, placeholder: "1. Firearms, magazines, ammunition, and spent casings;\n2. Cellular telephones and digital storage media;\n3. Indicia of occupancy." },
      { key: "probable_cause", label: "Statement of Probable Cause (Facts & Investigation)", type: "textarea", required: true, max_length: 3500, placeholder: "Detailed narrative of investigation and probable cause facts..." },
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
      { key: "defendant_name", label: "Defendant Full Name & Identifiers", type: "text", required: true, max_length: 250, placeholder: "Full Name · State ID · DOB" },
      { key: "last_known_address", label: "Last Known Residence / Location", type: "text", required: true, max_length: 250, placeholder: "Last known address in Los Santos, SA" },
      { key: "charges", label: "Criminal Charges (Penal Code Sections & Counts)", type: "textarea", required: true, max_length: 800, placeholder: "Count 1: Penal Code section and offense title" },
      { key: "probable_cause", label: "Statement of Probable Cause", type: "textarea", required: true, max_length: 3500, placeholder: "Facts establishing that the offense was committed and that the Defendant committed it..." },
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
      { key: "target_account", label: "Target Subject & Account / Phone / Identifier", type: "text", required: true, max_length: 250, placeholder: "Account number / Phone number and subscriber name" },
      { key: "custodian_entity", label: "Service Provider / Financial Institution", type: "text", required: true, max_length: 200, placeholder: "Financial institution or telecommunications provider" },
      { key: "records_scope", label: "Scope of Records & Date Range Requested", type: "textarea", required: true, max_length: 1200, placeholder: "Call detail records (CDRs), cell-site location information (CSLI), wire transfer logs, and date range..." },
      { key: "articulable_facts", label: "Specific and Articulable Facts (Statutory Relevance)", type: "textarea", required: true, max_length: 3500, placeholder: "Specific and articulable facts showing reasonable grounds that records are relevant and material to an ongoing felony investigation..." },
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
      { key: "operation_name", label: "Operation Codename & Designated Zone", type: "text", required: true, max_length: 200, placeholder: "Operation codename and geographic sector" },
      { key: "operational_window", label: "Operational Window (Start & End Date/Time)", type: "text", required: true, max_length: 150, placeholder: "Start and end date/time" },
      { key: "situation", label: "1. SITUATION (Threat Intelligence & Armed Group Activity)", type: "textarea", required: true, max_length: 1500, placeholder: "Threat intelligence and recent violent felony activity in the sector..." },
      { key: "mission", label: "2. MISSION STATEMENT", type: "textarea", required: true, max_length: 800, placeholder: "Tactical and stabilization objectives..." },
      { key: "execution", label: "3. EXECUTION & TACTICAL PHASES (Units, Perimeter & Checkpoints)", type: "textarea", required: true, max_length: 1500, placeholder: "Phases of operation and deployed units..." },
      { key: "roe_safeguards", label: "4. RULES OF ENGAGEMENT & CONSTITUTIONAL SAFEGUARDS", type: "textarea", required: true, max_length: 1000, placeholder: "Use-of-force policy compliance, body-worn cameras, and medical staging..." }
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
      { key: "holder_name", label: "Authorized Individual Full Name", type: "text", required: true, max_length: 150, placeholder: "Full Name" },
      { key: "holder_id", label: "State ID / Citizen Identification No.", type: "text", required: true, max_length: 60, placeholder: "SA-ID #00000" },
      { key: "doj_permit_ref", label: "DOJ Firearms Permit / Referral Docket No.", type: "text", required: true, max_length: 100, placeholder: "DOJ-CCW-2026-0001" },
      { key: "course_score", label: "Qualification Course & Range Score", type: "text", required: true, max_length: 150, placeholder: "POST Combat & Legal Deadly Force Qualification — Score: 96/100 (QUALIFIED)" },
      { key: "weapon_details", label: "Assigned UPD Weapon (Make, Model, Caliber & Serial No.)", type: "text", required: true, max_length: 250, placeholder: "Glock 17 Gen 5 · 9x19mm Parabellum · Serial No. UPD-ARM-0001" },
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
      { key: "recipient_name", label: "Recipient Officer Name & Badge", type: "text", required: true, max_length: 150, placeholder: "Officer Name & Badge #" },
      { key: "award_class", label: "Decoration / Commendation Class", type: "text", required: true, max_length: 120, placeholder: "Medal of Valor / Meritorious Service Citation" },
      { key: "incident_date", label: "Date & Location of Meritorious Act", type: "text", required: true, max_length: 150, placeholder: "Date and location" },
      { key: "citation_narrative", label: "Citation Narrative", type: "textarea", required: true, max_length: 2500, placeholder: "Detailed narrative of meritorious service..." }
    ],
    body: "<b>TO:</b> {recipient_name}\n<b>DECORATION CONFERRED:</b> {award_class}\n<b>DATE & LOCATION OF ACTION:</b> {incident_date}\n<b>NOMINATING SUPERVISOR:</b> {issuer_name} ({issuer_rank}, Badge #{issuer_badge})\n\n<b>CITATION FOR MERITORIOUS SERVICE</b>\nThe Command Staff of the Unified Police Department presents this Official Commendation to <b>{recipient_name}</b> in recognition of exceptional professionalism and courage:\n\n{citation_narrative}"
  }
];

function cloneDeep(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function loadLocalStore() {
  const raw = localStorage.getItem(STORE_STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.ranks) && Array.isArray(parsed.officers)) {
        return parsed;
      }
    } catch (_) {}
  }
  const initial = {
    rev: 0,
    ranks: cloneDeep(INITIAL_RANKS),
    officers: [
      {
        id: 1,
        discord_id: _INTERNAL.ownerId,
        rp_name: "Gucci Lango",
        badge: "101",
        division: "Office of the Chief of Police",
        status: "active",
        rank_id: 14,
        rank_name: "Chief of Police",
        rank_level: 14,
        is_admin: 1,
        _updated_at: 1
      }
    ],
    templates: cloneDeep(INITIAL_TEMPLATES),
    documents: [],
    chunk_ids: []
  };
  localStorage.setItem(STORE_STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

export const store = loadLocalStore();

// ─── Real-Time Shared Cloud Sync Engine ───────────────────────────────────────

function statusPriority(status) {
  const s = String(status || "PENDING").toUpperCase();
  if (s === "REVOKED") return 4;
  if (s === "APPROVED") return 3;
  if (s === "REJECTED") return 2;
  return 1;
}

function mergeRemoteIntoStore(remote) {
  if (!remote || typeof remote !== "object") return false;

  // 1. Ranks
  const rankMap = new Map(INITIAL_RANKS.map(r => [Number(r.id), cloneDeep(r)]));
  for (const r of store.ranks || []) {
    rankMap.set(Number(r.id), { ...rankMap.get(Number(r.id)), ...r });
  }
  for (const r of remote.customRanks || remote.ranks || []) {
    const id = Number(r.id);
    const cur = rankMap.get(id);
    if (!cur || (Number(r._updated_at) || 0) >= (Number(cur._updated_at) || 0)) {
      rankMap.set(id, { ...cur, ...r });
    }
  }
  store.ranks = Array.from(rankMap.values()).sort((a, b) => a.level - b.level);

  // 2. Officers
  const offMap = new Map();
  for (const o of store.officers || []) {
    offMap.set(String(o.discord_id), { ...o });
  }
  for (const o of remote.officers || []) {
    const key = String(o.discord_id);
    const cur = offMap.get(key);
    if (!cur || (Number(o._updated_at) || 0) >= (Number(cur._updated_at) || 0)) {
      offMap.set(key, { ...cur, ...o });
    }
  }
  store.officers = Array.from(offMap.values()).sort((a, b) => (b.rank_level || 0) - (a.rank_level || 0));

  // 3. Templates
  const tplMap = new Map(INITIAL_TEMPLATES.map(t => [t.code, cloneDeep(t)]));
  for (const t of store.templates || []) {
    if ((t.version || 1) > 1 || !tplMap.has(t.code)) {
      tplMap.set(t.code, { ...tplMap.get(t.code), ...t });
    }
  }
  for (const t of remote.customTemplates || []) {
    const cur = tplMap.get(t.code);
    if (!cur || (Number(t.version) || 1) >= (Number(cur.version) || 1)) {
      tplMap.set(t.code, { ...cur, ...t });
    }
  }
  store.templates = Array.from(tplMap.values());

  // 4. Documents
  const docMap = new Map();
  for (const d of store.documents || []) {
    docMap.set(Number(d.id), { ...d });
  }
  for (const d of remote.documents || []) {
    const id = Number(d.id);
    const cur = docMap.get(id);
    if (!cur) {
      docMap.set(id, { ...d });
    } else {
      const remPrio = statusPriority(d.status);
      const curPrio = statusPriority(cur.status);
      const remTime = Number(d._updated_at) || 0;
      const curTime = Number(cur._updated_at) || 0;
      if (remPrio > curPrio || (remPrio === curPrio && remTime >= curTime)) {
        docMap.set(id, {
          ...cur,
          ...d,
          png_url: d.png_url || cur.png_url || null,
          discord_posted: Boolean(cur.discord_posted || d.discord_posted)
        });
      } else if (!cur.png_url && d.png_url) {
        cur.png_url = d.png_url;
      }
    }
  }
  store.documents = Array.from(docMap.values()).sort((a, b) => Number(b.id) - Number(a.id));

  if (Array.isArray(remote.chunk_ids)) {
    store.chunk_ids = remote.chunk_ids;
  }
  store.rev = Math.max(Number(store.rev) || 0, Number(remote.rev) || 1);
  return true;
}

async function resolveWebhookMid() {
  try {
    const r = await fetch(`${_INTERNAL.syncWh}?_t=${Date.now()}`, { cache: "no-store" });
    if (r.ok) {
      const hook = await r.json();
      if (hook.name && hook.name.startsWith("UPD-Sync:")) {
        const mid = hook.name.split(":")[1]?.trim();
        if (mid && /^\d+$/.test(mid)) {
          _activeSyncMid = mid;
          localStorage.setItem("upd_sync_mid", mid);
          return mid;
        }
      }
    }
  } catch (_) {}
  return _activeSyncMid;
}

export async function pullSharedStore(force = false) {
  if (_isPushing && !force) return false;
  try {
    let res = await fetch(`${_INTERNAL.syncWh}/messages/${_activeSyncMid}?_t=${Date.now()}`, {
      cache: "no-store"
    });
    if (res.status === 404) {
      const resolved = await resolveWebhookMid();
      if (resolved !== _activeSyncMid) {
        res = await fetch(`${_INTERNAL.syncWh}/messages/${_activeSyncMid}?_t=${Date.now()}`, {
          cache: "no-store"
        });
      }
    }
    if (!res.ok) return false;

    const msg = await res.json();
    const header = String(msg.content || "");
    const parts = header.split("|");
    const remoteRev = Number(parts[1]) || 0;
    const chunkIds = (parts[2] || "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    if (!force && _initialSyncDone && remoteRev > 0 && remoteRev === Number(store.rev)) {
      return false;
    }

    let rawJson = (msg.embeds || []).map(e => e.description || "").join("");
    for (const cid of chunkIds) {
      const cRes = await fetch(`${_INTERNAL.syncWh}/messages/${cid}?_t=${Date.now()}`, {
        cache: "no-store"
      });
      if (cRes.ok) {
        const cMsg = await cRes.json();
        rawJson += (cMsg.embeds || []).map(e => e.description || "").join("");
      }
    }

    if (!rawJson) return false;
    const remoteData = JSON.parse(rawJson);
    const prevSnapshot = JSON.stringify({
      o: store.officers.length,
      r: store.ranks.length,
      d: store.documents.map(x => `${x.id}:${x.status}:${x.control_no || ""}:${x.png_url || ""}`).join(",")
    });

    mergeRemoteIntoStore(remoteData);
    _initialSyncDone = true;
    localStorage.setItem(STORE_STORAGE_KEY, JSON.stringify(store));

    const nextSnapshot = JSON.stringify({
      o: store.officers.length,
      r: store.ranks.length,
      d: store.documents.map(x => `${x.id}:${x.status}:${x.control_no || ""}:${x.png_url || ""}`).join(",")
    });

    if (force || prevSnapshot !== nextSnapshot) {
      window.dispatchEvent(new CustomEvent("upd:store-updated", { detail: { rev: store.rev, source: "cloud" } }));
    }
    return true;
  } catch (_) {
    return false;
  }
}

function splitString(str, size) {
  const out = [];
  for (let i = 0; i < str.length; i += size) {
    out.push(str.slice(i, i + size));
  }
  return out.length ? out : ["{}"];
}

async function pushSharedStore() {
  if (_isPushing) {
    _pushPending = true;
    return;
  }
  _isPushing = true;
  try {
    // Pull & merge latest remote state before writing so concurrent users never overwrite each other
    await pullSharedStore(true);

    const customRanks = store.ranks.filter(r => {
      const base = INITIAL_RANKS.find(ir => ir.id === r.id);
      return !base || base.name !== r.name || base.level !== r.level || base.discord_role_id !== r.discord_role_id;
    });
    const customTemplates = store.templates.filter(
      t => (t.version || 1) > 1 || !INITIAL_TEMPLATES.some(it => it.code === t.code)
    );

    const cloudObj = {
      rev: store.rev,
      officers: store.officers,
      customRanks,
      customTemplates,
      documents: store.documents,
      chunk_ids: store.chunk_ids || []
    };

    const serialized = JSON.stringify(cloudObj);
    // Each message holds up to 5,200 chars across 2 embeds (2,600 chars each, well below Discord's 6,000 limit)
    const pages = splitString(serialized, 5200);
    const overflowPages = pages.slice(1);
    const activeChunkIds = [];

    for (let i = 0; i < overflowPages.length; i++) {
      const pageStr = overflowPages[i];
      const subChunks = splitString(pageStr, 2600);
      const embeds = subChunks.map((sc, idx) => ({
        title: idx === 0 ? `UPD_STATE_OVERFLOW_${i + 1}` : undefined,
        description: sc,
        color: 1121848
      }));
      const existingCid = (store.chunk_ids || [])[i];
      let savedCid = null;
      if (existingCid) {
        const pRes = await fetch(`${_INTERNAL.syncWh}/messages/${existingCid}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: `UPD_OVERFLOW_${i + 1}|${store.rev}`, embeds })
        });
        if (pRes.ok) savedCid = existingCid;
      }
      if (!savedCid) {
        const cRes = await fetch(`${_INTERNAL.syncWh}?wait=true`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: `UPD_OVERFLOW_${i + 1}|${store.rev}`, embeds })
        });
        if (cRes.ok) {
          const cMsg = await cRes.json();
          savedCid = cMsg.id;
        }
      }
      if (savedCid) activeChunkIds.push(savedCid);
    }

    store.chunk_ids = activeChunkIds;
    const rootSubChunks = splitString(pages[0], 2600);
    const rootEmbeds = rootSubChunks.map((sc, idx) => ({
      title: idx === 0 ? "UPD_CLOUD_STATE" : undefined,
      description: sc,
      color: 1121848
    }));
    const rootPayload = {
      content: `UPD_REALTIME_SYNC_V1|${store.rev}|${activeChunkIds.join(",")}`,
      embeds: rootEmbeds
    };

    let rootRes = await fetch(`${_INTERNAL.syncWh}/messages/${_activeSyncMid}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rootPayload)
    });

    if (rootRes.status === 404) {
      const createRes = await fetch(`${_INTERNAL.syncWh}?wait=true`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rootPayload)
      });
      if (createRes.ok) {
        const created = await createRes.json();
        _activeSyncMid = created.id;
        localStorage.setItem("upd_sync_mid", _activeSyncMid);
        fetch(_INTERNAL.syncWh, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: `UPD-Sync:${_activeSyncMid}` })
        }).catch(() => {});
      }
    }
  } catch (_) {
  } finally {
    _isPushing = false;
    if (_pushPending) {
      _pushPending = false;
      pushSharedStore();
    }
  }
}

export function saveLocalStore(st) {
  st.rev = Date.now();
  localStorage.setItem(STORE_STORAGE_KEY, JSON.stringify(st));
  if (_bc) {
    try {
      _bc.postMessage({ type: "store-updated", rev: st.rev });
    } catch (_) {}
  }
  window.dispatchEvent(new CustomEvent("upd:store-updated", { detail: { rev: st.rev, source: "local" } }));
  pushSharedStore();
}

// Start real-time sync loop across tabs and across all connected users
if (typeof window !== "undefined") {
  if (_bc) {
    _bc.onmessage = () => {
      const raw = localStorage.getItem(STORE_STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          mergeRemoteIntoStore(parsed);
          window.dispatchEvent(new CustomEvent("upd:store-updated", { detail: { rev: store.rev, source: "tab" } }));
        } catch (_) {}
      }
    };
  }
  pullSharedStore(true);
  setInterval(() => {
    if (document.visibilityState !== "hidden") {
      pullSharedStore(false);
    }
  }, 3000);
  window.addEventListener("focus", () => pullSharedStore(false));
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") pullSharedStore(false);
  });
}

// ─── Official US-Letter Document Canvas Renderer & Discord Channel Dispatch ──

function loadImage(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function wrapCanvasParagraphs(ctx, text, maxWidth) {
  const lines = [];
  const rawLines = String(text || "").split("\n");
  for (const raw of rawLines) {
    if (!raw.trim()) {
      lines.push({ text: "", bold: false });
      continue;
    }
    const isBoldHeader = /^<b>.*<\/b>$/i.test(raw.trim()) || /^[I|V|X]+\.\s+[A-ZÀ-Ú\s&]+$/.test(raw.trim());
    const cleanLine = raw.replace(/<\/?b>/gi, "");
    const words = cleanLine.split(/\s+/);
    let current = "";
    for (const w of words) {
      const test = current ? `${current} ${w}` : w;
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push({ text: current, bold: isBoldHeader });
        current = w;
      } else {
        current = test;
      }
    }
    if (current) {
      lines.push({ text: current, bold: isBoldHeader });
    }
  }
  return lines;
}

export async function renderDocumentSheetCanvas(doc) {
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch (_) {}
  }

  const canvas = document.createElement("canvas");
  canvas.width = 1240;
  canvas.height = 1605;
  const ctx = canvas.getContext("2d");

  const docLang = doc.lang || doc.data_json?._lang || "pt";
  const chrome = DOC_I18N[docLang] || DOC_I18N.pt;
  const rawTpl = store.templates.find(t => t.code === doc.template_code) || store.templates[0];
  const resolvedTpl = resolveTemplateForLang(rawTpl, docLang);
  const status = (doc.status || "PENDING").toUpperCase();

  // Paper background & faithful US-Letter double border (matches .us-letter-sheet)
  ctx.fillStyle = "#fcfbf7";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#111e38";
  ctx.lineWidth = 3;
  ctx.strokeRect(24, 24, canvas.width - 48, canvas.height - 48);
  ctx.strokeStyle = "#8c6d1f";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(32, 32, canvas.width - 64, canvas.height - 64);

  const [crestImg, sealImg] = await Promise.all([
    loadImage("./assets/opacidade2.png"),
    loadImage("./assets/selo.png")
  ]);

  // Watermark
  if (crestImg) {
    ctx.save();
    ctx.globalAlpha = 0.075;
    ctx.drawImage(crestImg, (canvas.width - 480) / 2, (canvas.height - 480) / 2, 480, 480);
    ctx.restore();
  }

  // Diagonal Draft Stamp when not APPROVED
  if (status !== "APPROVED") {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height * 0.46);
    ctx.rotate((-32 * Math.PI) / 180);
    ctx.font = "700 46px 'Public Sans', Arial, sans-serif";
    ctx.fillStyle = "rgba(158, 27, 27, 0.13)";
    ctx.textAlign = "center";
    ctx.fillText(status === "PENDING" ? chrome.stampDraft : status, 0, 0);
    ctx.restore();
  }

  // Masthead Crest & Department Header
  const padX = 68;
  if (crestImg) {
    ctx.drawImage(crestImg, padX, 62, 72, 72);
  }
  ctx.textAlign = "left";
  ctx.fillStyle = "#111e38";
  ctx.font = "700 22px 'Public Sans', Arial, sans-serif";
  ctx.fillText(chrome.deptTitle, padX + 88, 86);
  ctx.fillStyle = "#8c6d1f";
  ctx.font = "700 15px 'Public Sans', Arial, sans-serif";
  ctx.fillText(chrome.deptSub, padX + 88, 108);
  ctx.fillStyle = "#525866";
  ctx.font = "400 16px 'Newsreader', Georgia, serif";
  ctx.fillText(chrome.deptJuris, padX + 88, 129);

  // Right Masthead Metadata
  const ctrl = doc.control_no || `DRAFT-${doc.id || "PREVIEW"}`;
  const dateStr = (doc.approved_at || doc.created_at || new Date().toISOString()).slice(0, 10);
  const seriesStr = resolvedTpl.category === "doj" ? chrome.seriesDoj : chrome.seriesInternal;
  const statusStr = status === "APPROVED" ? (docLang === "pt" ? "APROVADO" : "APPROVED") : status;

  const drawMetaRow = (label, val, yPos) => {
    ctx.textAlign = "right";
    ctx.font = "700 15px 'Public Sans', Arial, sans-serif";
    ctx.fillStyle = "#111e38";
    ctx.fillText(val, canvas.width - padX, yPos);
    const valW = ctx.measureText(val).width;
    ctx.font = "400 15px 'Public Sans', Arial, sans-serif";
    ctx.fillStyle = "#525866";
    ctx.fillText(`${label} `, canvas.width - padX - valW, yPos);
  };
  drawMetaRow(chrome.ctrlNoLabel, ctrl, 76);
  drawMetaRow(chrome.dateLabel, dateStr, 96);
  drawMetaRow(chrome.seriesLabel, seriesStr, 116);
  drawMetaRow(chrome.statusLabel, statusStr, 136);
  ctx.textAlign = "left";

  // Navy & Gold Rules below Masthead
  ctx.fillStyle = "#111e38";
  ctx.fillRect(padX, 152, canvas.width - padX * 2, 3);
  ctx.fillStyle = "#8c6d1f";
  ctx.fillRect(padX, 159, canvas.width - padX * 2, 1.5);

  // Caption Box (matches .sheet-caption-box)
  const courtLines = String(resolvedTpl.court_header || "UNIFIED POLICE DEPARTMENT").split("\n");
  const titleLines = String(resolvedTpl.title || resolvedTpl.name).split("\n");
  const capTop = 174;
  const courtH = courtLines.length * 22 + 12;
  const titleH = titleLines.length * 24 + 14;
  const capH = courtH + titleH;

  ctx.fillStyle = "#f3f0e6";
  ctx.fillRect(padX, capTop, canvas.width - padX * 2, capH);
  ctx.strokeStyle = "#111e38";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(padX, capTop, canvas.width - padX * 2, capH);

  ctx.textAlign = "center";
  ctx.fillStyle = "#111e38";
  ctx.font = "700 16.5px 'Newsreader', Georgia, serif";
  courtLines.forEach((cl, idx) => {
    ctx.fillText(cl, canvas.width / 2, capTop + 24 + idx * 22);
  });

  // Divider inside Caption Box
  ctx.strokeStyle = "#d5d8e0";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padX + 16, capTop + courtH);
  ctx.lineTo(canvas.width - padX - 16, capTop + courtH);
  ctx.stroke();

  ctx.fillStyle = "#111e38";
  ctx.font = "700 19px 'Public Sans', Arial, sans-serif";
  titleLines.forEach((tl, idx) => {
    ctx.fillText(tl, canvas.width / 2, capTop + courtH + 24 + idx * 24);
  });
  ctx.textAlign = "left";

  // Body Text (matches .sheet-body-text in Newsreader serif)
  const vars = {
    ...(doc.data_json || {}),
    issuer_name: doc.issuer_name,
    issuer_badge: doc.issuer_badge,
    issuer_rank: doc.issuer_rank,
    issuer_division: docLang === "pt" ? "Divisão de Patrulha" : "Command Division"
  };
  const filledBody = String(resolvedTpl.body || "").replace(/\{([a-zA-Z0-9_]+)\}/g, (_, k) => {
    const val = vars[k];
    return val !== undefined && val !== "" ? String(val) : `[${k}]`;
  });

  ctx.font = "400 18px 'Newsreader', Georgia, serif";
  const wrapped = wrapCanvasParagraphs(ctx, filledBody, canvas.width - padX * 2 - 8);
  let y = capTop + capH + 30;
  const maxBodyY = 1280;
  for (const ln of wrapped) {
    if (y > maxBodyY) break;
    if (!ln.text) {
      y += 14;
      continue;
    }
    ctx.font = ln.bold ? "700 18px 'Newsreader', Georgia, serif" : "400 18px 'Newsreader', Georgia, serif";
    ctx.fillStyle = "#141619";
    ctx.fillText(ln.text, padX, y);
    y += 25;
  }

  // Signature & Seal Card Box (matches .sheet-sig-box)
  const sigTop = 1310;
  const sigH = 185;
  const sigW = canvas.width - padX * 2;
  ctx.fillStyle = "#faf8f1";
  ctx.fillRect(padX, sigTop, sigW, sigH);
  ctx.strokeStyle = "#cfd5df";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(padX, sigTop, sigW, sigH);

  const colW = (sigW - 180) / 2;
  const leftCenterX = padX + colW / 2;
  const rightCenterX = canvas.width - padX - colW / 2;

  // Left Column: Issuing Officer
  ctx.textAlign = "center";
  ctx.fillStyle = "#525866";
  ctx.font = "700 13.5px 'Public Sans', Arial, sans-serif";
  ctx.fillText(chrome.sigIssuerRole, leftCenterX, sigTop + 30);

  ctx.fillStyle = "#0e2954";
  ctx.font = "400 40px 'Mrs Saint Delafield', cursive";
  ctx.fillText(doc.issuer_name || "Officer", leftCenterX, sigTop + 82);

  ctx.fillStyle = "#111e38";
  ctx.fillRect(leftCenterX - colW * 0.42, sigTop + 96, colW * 0.84, 1.5);

  ctx.fillStyle = "#111e38";
  ctx.font = "700 15px 'Public Sans', Arial, sans-serif";
  ctx.fillText(String(doc.issuer_name || "").toUpperCase(), leftCenterX, sigTop + 118);

  ctx.fillStyle = "#141619";
  ctx.font = "400 15px 'Newsreader', Georgia, serif";
  ctx.fillText(`${doc.issuer_rank || "Officer"} · Badge #${doc.issuer_badge || "101"}`, leftCenterX, sigTop + 140);
  ctx.fillText("Unified Police Department", leftCenterX, sigTop + 162);

  // Center Column: Official Seal
  if (sealImg) {
    ctx.drawImage(sealImg, (canvas.width - 112) / 2, sigTop + 22, 112, 112);
  }
  ctx.fillStyle = "#8c6d1f";
  ctx.font = "700 12px 'Public Sans', Arial, sans-serif";
  ctx.fillText(chrome.sealText, canvas.width / 2, sigTop + 158);

  // Right Column: Approving Officer
  ctx.fillStyle = "#525866";
  ctx.font = "700 13.5px 'Public Sans', Arial, sans-serif";
  ctx.fillText(chrome.sigApproverRole, rightCenterX, sigTop + 30);

  if (status === "APPROVED" && doc.approver_name) {
    ctx.fillStyle = "#0e2954";
    ctx.font = "400 40px 'Mrs Saint Delafield', cursive";
    ctx.fillText(doc.approver_name, rightCenterX, sigTop + 82);

    ctx.fillStyle = "#111e38";
    ctx.fillRect(rightCenterX - colW * 0.42, sigTop + 96, colW * 0.84, 1.5);

    ctx.fillStyle = "#111e38";
    ctx.font = "700 15px 'Public Sans', Arial, sans-serif";
    ctx.fillText(String(doc.approver_name).toUpperCase(), rightCenterX, sigTop + 118);

    ctx.fillStyle = "#141619";
    ctx.font = "400 15px 'Newsreader', Georgia, serif";
    ctx.fillText(`${doc.approver_rank || ""} · Badge #${doc.approver_badge || ""}`, rightCenterX, sigTop + 140);
    ctx.fillText(chrome.sigCountersigned.replace("{date}", dateStr), rightCenterX, sigTop + 162);
  } else {
    ctx.fillStyle = "#9e1b1b";
    ctx.font = "700 14px 'Public Sans', Arial, sans-serif";
    ctx.fillText(chrome.sigAwaiting, rightCenterX, sigTop + 76);

    ctx.fillStyle = "#111e38";
    ctx.fillRect(rightCenterX - colW * 0.42, sigTop + 96, colW * 0.84, 1.5);

    const reqRankLabel = resolvedTpl.category === "doj" ? chrome.sigReqCommander : chrome.sigReqCorporal;
    ctx.fillStyle = "#111e38";
    ctx.font = "700 15px 'Public Sans', Arial, sans-serif";
    ctx.fillText(reqRankLabel, rightCenterX, sigTop + 118);

    ctx.fillStyle = "#141619";
    ctx.font = "400 15px 'Newsreader', Georgia, serif";
    ctx.fillText("Unified Police Department", rightCenterX, sigTop + 140);
  }

  // Bottom Verification Bar (matches .sheet-footer-bar)
  const footY = 1515;
  ctx.fillStyle = "#111e38";
  ctx.fillRect(padX, footY, canvas.width - padX * 2, 1.5);

  const cfgUrl = window.UPD_CONFIG?.SITE_URL;
  let siteBase = "";
  if (cfgUrl && typeof cfgUrl === "string" && cfgUrl.trim()) {
    siteBase = cfgUrl.trim().replace(/\/+$/, "");
  } else if (typeof window !== "undefined" && window.location?.origin && window.location.origin !== "null") {
    const p = (window.location.pathname || "").replace(/\/[^/]*$/, "");
    siteBase = `${window.location.origin}${p}`.replace(/\/+$/, "");
  } else {
    siteBase = "https://guccilango.github.io/site-upd";
  }
  const verifyFullUrl = `${siteBase}/verify.html?n=${encodeURIComponent(ctrl)}`;
  const verifyLabel = isPt ? "VERIFICAR NO REGISTRO:" : "VERIFY REGISTRY:";

  ctx.textAlign = "left";
  ctx.fillStyle = "#525866";
  ctx.font = "400 13px 'Public Sans', Arial, sans-serif";
  ctx.fillText(`${verifyLabel} ${verifyFullUrl}`, padX, footY + 24);

  ctx.textAlign = "right";
  ctx.fillText(chrome.footerSensitive, canvas.width - padX, footY + 24);
  ctx.textAlign = "left";

  return canvas;
}

export async function renderDocumentSheetPngBlob(doc) {
  const canvas = await renderDocumentSheetCanvas(doc);
  return new Promise(resolve => canvas.toBlob(blob => resolve(blob), "image/png", 0.95));
}

function canvasToPdfBlob(canvas) {
  const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.95);
  const base64 = jpegDataUrl.split(",")[1];
  const raw = atob(base64);
  const imgBytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    imgBytes[i] = raw.charCodeAt(i);
  }

  const pageW = 612;
  const pageH = 792;
  const imgW = canvas.width;
  const imgH = canvas.height;
  const contentStream = `q\n${pageW} 0 0 ${pageH} 0 0 cm\n/Im0 Do\nQ\n`;

  const enc = new TextEncoder();
  const chunks = [];
  const offsets = [0];
  let byteLen = 0;

  const pushStr = s => {
    const b = enc.encode(s);
    chunks.push(b);
    byteLen += b.length;
  };
  const pushBytes = b => {
    chunks.push(b);
    byteLen += b.length;
  };
  const startObj = id => {
    offsets[id] = byteLen;
    pushStr(`${id} 0 obj\n`);
  };
  const endObj = () => pushStr("endobj\n");

  pushStr("%PDF-1.4\n%\xFF\xFF\xFF\xFF\n");

  startObj(1);
  pushStr("<< /Type /Catalog /Pages 2 0 R >>\n");
  endObj();

  startObj(2);
  pushStr("<< /Type /Pages /Kids [3 0 R] /Count 1 >>\n");
  endObj();

  startObj(3);
  pushStr(
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\n`
  );
  endObj();

  startObj(4);
  pushStr(
    `<< /Type /XObject /Subtype /Image /Width ${imgW} /Height ${imgH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgBytes.length} >>\nstream\n`
  );
  pushBytes(imgBytes);
  pushStr("\nendstream\n");
  endObj();

  startObj(5);
  pushStr(`<< /Length ${contentStream.length} >>\nstream\n${contentStream}endstream\n`);
  endObj();

  const xrefOffset = byteLen;
  pushStr("xref\n0 6\n0000000000 65535 f \n");
  for (let i = 1; i <= 5; i++) {
    pushStr(`${String(offsets[i]).padStart(10, "0")} 00000 n \n`);
  }
  pushStr(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`);

  return new Blob(chunks, { type: "application/pdf" });
}

export async function downloadDocumentPdf(doc) {
  const canvas = await renderDocumentSheetCanvas(doc);
  const pdfBlob = canvasToPdfBlob(canvas);
  const ctrl = doc.control_no || `DRAFT-${doc.id || "PREVIEW"}`;
  const url = URL.createObjectURL(pdfBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${ctrl}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// Uploads the finalized sheet to Fivemanage and returns its public CDN URL (or null on failure).
export async function uploadToFivemanage(blob, filename) {
  if (!blob) return null;
  try {
    const fd = new FormData();
    fd.append("file", blob, filename);
    fd.append("filename", filename);
    const res = await fetch("https://api.fivemanage.com/api/v3/file", {
      method: "POST",
      headers: { Authorization: _INTERNAL.fmKey },
      body: fd
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const payload = await res.json();
    return payload.data?.url || payload.url || null;
  } catch (err) {
    console.error("Fivemanage upload failed:", err);
    return null;
  }
}

const _inflightFmUploads = new Map();

export async function ensureDocumentFivemanageUrl(docOrId) {
  const doc =
    typeof docOrId === "object" && docOrId
      ? docOrId
      : store.documents.find(d => Number(d.id) === Number(docOrId));
  if (!doc) return null;
  if (doc.png_url && String(doc.png_url).includes("fivemanage.com")) {
    return doc.png_url;
  }
  if (_inflightFmUploads.has(doc.id)) {
    return _inflightFmUploads.get(doc.id);
  }
  const promise = (async () => {
    try {
      const ctrl = doc.control_no || `UPD-${doc.template_code}-${doc.id}`;
      const pngBlob = await renderDocumentSheetPngBlob(doc);
      const fmUrl = await uploadToFivemanage(pngBlob, `${ctrl}.png`);
      if (fmUrl) {
        doc.png_url = fmUrl;
        doc._updated_at = Date.now();
        saveLocalStore(store);
        window.dispatchEvent(
          new CustomEvent("upd:store-updated", { detail: { rev: store.rev, source: "async-upload" } })
        );
        return fmUrl;
      }
    } catch (_) {
    } finally {
      _inflightFmUploads.delete(doc.id);
    }
    return doc.png_url || null;
  })();
  _inflightFmUploads.set(doc.id, promise);
  return promise;
}

export async function postApprovedDocumentToDiscord(doc) {
  if (!doc || doc.status !== "APPROVED") return null;
  const docLang = doc.lang || doc.data_json?._lang || "pt";
  const isPt = docLang === "pt";
  const rawTpl = store.templates.find(t => t.code === doc.template_code) || {
    code: doc.template_code,
    name: doc.template_name,
    category: doc.category
  };
  const resolvedTpl = resolveTemplateForLang(rawTpl, docLang);
  const ctrl = doc.control_no || `UPD-${doc.template_code}-${doc.id}`;
  const siteBase = (window.UPD_CONFIG?.SITE_URL || "https://guccilango.github.io/site-upd").replace(/\/+$/, "");
  const verifyUrl = `${siteBase}/verify.html?n=${encodeURIComponent(ctrl)}`;

  try {
    const pngBlob = await renderDocumentSheetPngBlob(doc);
    const filename = `${ctrl}.png`;
    const fmUrl = await uploadToFivemanage(pngBlob, filename);
    if (fmUrl) {
      doc.png_url = fmUrl;
      doc._updated_at = Date.now();
      saveLocalStore(store);
      window.dispatchEvent(
        new CustomEvent("upd:store-updated", { detail: { rev: store.rev, source: "async-upload" } })
      );
    }

    const fields = [
      {
        name: isPt ? "Nº de Controle Oficial" : "Official Control No.",
        value: `\`${ctrl}\``,
        inline: true
      },
      {
        name: isPt ? "Classificação" : "Classification",
        value:
          doc.category === "doj"
            ? isPt
              ? "Processo Judicial DOJ"
              : "DOJ Judicial Filing"
            : isPt
              ? "Certificação Interna UPD"
              : "Internal UPD Record",
        inline: true
      },
      {
        name: isPt ? "Idioma" : "Language",
        value: isPt ? "🇧🇷 Português" : "🇺🇸 English",
        inline: true
      },
      {
        name: isPt ? "Oficial Requerente / Emissor" : "Submitting / Issuing Officer",
        value: `${doc.issuer_rank} **${doc.issuer_name}** (Badge #${doc.issuer_badge})`,
        inline: true
      },
      {
        name: isPt ? "Contra-Assinado Por (Comando)" : "Counter-Signed By (Command)",
        value: `${doc.approver_rank} **${doc.approver_name}** (Badge #${doc.approver_badge})`,
        inline: true
      },
      {
        name: isPt ? "Autenticidade Pública" : "Public Verification",
        value: isPt
          ? `[Verificar Registro Oficial](${verifyUrl})`
          : `[Verify Official Record](${verifyUrl})`,
        inline: true
      }
    ];

    if (fmUrl) {
      fields.push({
        name: isPt ? "Link da Imagem (Fivemanage)" : "Image Link (Fivemanage)",
        value: `\`${fmUrl}\`\n[${isPt ? "Abrir Imagem no Fivemanage" : "Open Image on Fivemanage"}](${fmUrl})`,
        inline: false
      });
    }

    const embed = {
      title: `${ctrl} - [${doc.template_code}] ${resolvedTpl.name || doc.template_name}`,
      url: verifyUrl,
      color: 0x145a32,
      description: isPt
        ? `Documento oficial emitido e registrado no **Portal de Documentos da Unified Police Department**.`
        : `Official record issued and registered in the **Unified Police Department Records Portal**.`,
      fields,
      image: { url: fmUrl || `attachment://${filename}` },
      footer: {
        text: "Unified Police Department · Records Bureau"
      },
      timestamp: doc.approved_at || new Date().toISOString()
    };

    const formData = new FormData();
    formData.append(
      "payload_json",
      JSON.stringify({
        username: "Unified Police Department - Official Records",
        embeds: [embed]
      })
    );
    if (pngBlob && !fmUrl) {
      formData.append("files[0]", pngBlob, filename);
    }

    const res = await fetch(`${_INTERNAL.docsWh}?wait=true`, {
      method: "POST",
      body: formData
    });
    if (res.ok) {
      const msg = await res.json();
      doc.discord_posted = true;
      doc.discord_msg_id = msg.id;
      const imgUrl = fmUrl || msg.embeds?.[0]?.image?.url || msg.attachments?.[0]?.url;
      if (imgUrl) {
        doc.png_url = imgUrl;
      }
      doc._updated_at = Date.now();
      saveLocalStore(store);
      window.dispatchEvent(
        new CustomEvent("upd:store-updated", { detail: { rev: store.rev, source: "async-upload" } })
      );
      return msg;
    }
  } catch (err) {
    console.error("Failed to dispatch document to Discord channel:", err);
  }
  return null;
}

// ─── Session & Discord OAuth2 Verification ────────────────────────────────────

export function getAuthenticatedOfficer() {
  const raw = sessionStorage.getItem("upd_auth_session");
  if (!raw) return null;
  try {
    const sess = JSON.parse(raw);
    const inStore = store.officers.find(o => String(o.discord_id) === String(sess.discord_id));
    const officer = inStore || sess;
    officer.status = "active";
    if (String(officer.discord_id) === String(_INTERNAL.ownerId) || sess.is_admin || officer.is_admin) {
      officer.is_admin = 1;
      if ((Number(officer.rank_level) || 0) < 11) {
        officer.rank_id = 11;
        officer.rank_name = officer.rank_name || "Commander";
        officer.rank_level = 11;
      }
    }
    return officer;
  } catch (_) {
    return null;
  }
}

export function getCurrentOfficer() {
  return getAuthenticatedOfficer();
}

export function logoutOfficer() {
  sessionStorage.removeItem("upd_auth_session");
  sessionStorage.removeItem("upd_jwt");
  window.location.hash = "#/";
}

export function loginOwnerDirect(discordId, accessKey, rpName, badge) {
  const cleanId = String(discordId || "").trim();
  const cleanKey = String(accessKey || "").trim();

  const existing = store.officers.find(o => String(o.discord_id) === cleanId);
  const isOwner = cleanId === _INTERNAL.ownerId;

  if (!isOwner && (!existing || existing.status !== "active" || existing.rank_level < 5)) {
    throw new Error("Acesso negado: credencial não autorizada para o Portal de Supervisão.");
  }
  if (
    cleanKey !== _INTERNAL.masterKey &&
    cleanKey !== `UPD-${_INTERNAL.supRole}` &&
    cleanKey !== _INTERNAL.supRole
  ) {
    throw new Error("Chave de supervisão inválida.");
  }

  let officer = existing;
  if (!officer && isOwner) {
    officer = {
      id: 1,
      discord_id: _INTERNAL.ownerId,
      rp_name: (rpName || "Gucci Lango").trim(),
      badge: (badge || "101").trim(),
      division: "Office of the Chief of Police",
      status: "active",
      rank_id: 14,
      rank_name: "Chief of Police",
      rank_level: 14,
      is_admin: 1,
      _updated_at: Date.now()
    };
    store.officers.push(officer);
    saveLocalStore(store);
  } else if (officer && rpName) {
    officer.rp_name = rpName.trim();
    if (badge) officer.badge = badge.trim();
    officer._updated_at = Date.now();
    saveLocalStore(store);
  }

  sessionStorage.setItem("upd_auth_session", JSON.stringify(officer));
  return officer;
}

export function getCanonicalRedirectUri() {
  const cfg = window.UPD_CONFIG;
  if (window.location.hostname.endsWith("github.io")) {
    return `${cfg.SITE_URL.replace(/\/+$/, "")}/`;
  }
  const basePath = window.location.pathname.replace(/\/index\.html$/, "");
  return `${window.location.origin}${basePath.endsWith("/") ? basePath : `${basePath}/`}`;
}

export function getDiscordOAuthUrl() {
  const cfg = window.UPD_CONFIG;
  const redirectUri = getCanonicalRedirectUri();
  const params = new URLSearchParams({
    client_id: cfg.DISCORD_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "token",
    scope: "identify guilds.members.read"
  });
  return `https://discord.com/oauth2/authorize?${params.toString()}`;
}

export async function handleDiscordOAuthCallbackIfPresent() {
  const hash = window.location.hash || "";
  const search = window.location.search || "";
  const fragmentParams = new URLSearchParams(hash.replace(/^#\/?/, ""));
  const queryParams = new URLSearchParams(search);

  const oauthError = fragmentParams.get("error") || queryParams.get("error");
  if (oauthError) {
    window.history.replaceState(null, "", window.location.pathname);
    throw new Error("Autenticação no Discord cancelada ou não autorizada.");
  }

  let accessToken = fragmentParams.get("access_token");
  const code = queryParams.get("code");

  if (!accessToken && code) {
    window.history.replaceState(null, "", window.location.pathname);
    const body = new URLSearchParams({
      client_id: window.UPD_CONFIG.DISCORD_CLIENT_ID,
      client_secret: _INTERNAL.clientSec,
      grant_type: "authorization_code",
      code,
      redirect_uri: getCanonicalRedirectUri()
    });
    const tokRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body
    });
    if (!tokRes.ok) {
      throw new Error("Não foi possível concluir a troca de token OAuth2 com o Discord.");
    }
    const tokJson = await tokRes.json();
    accessToken = tokJson.access_token;
  }

  if (!accessToken) return null;

  window.history.replaceState(null, "", window.location.pathname);
  await pullSharedStore(true);

  const userRes = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!userRes.ok) {
    throw new Error("Não foi possível validar sua conta no Discord.");
  }
  const user = await userRes.json();
  const discordId = String(user.id);
  const displayName = user.global_name || user.username || "Officer";

  let memberRoles = [];
  let nick = displayName;
  try {
    const memRes = await fetch(`https://discord.com/api/users/@me/guilds/${_INTERNAL.guild}/member`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (memRes.ok) {
      const mem = await memRes.json();
      memberRoles = Array.isArray(mem.roles) ? mem.roles.map(String) : [];
      if (mem.nick) nick = mem.nick;
    }
  } catch (_) {}

  const isOwner = discordId === String(_INTERNAL.ownerId);
  const hasSupervisorRole = memberRoles.includes(String(_INTERNAL.supRole));
  const existing = store.officers.find(o => String(o.discord_id) === discordId);

  const mappedRanks = [...store.ranks]
    .filter(r => r.discord_role_id && memberRoles.includes(String(r.discord_role_id)))
    .sort((a, b) => b.level - a.level);

  if (!isOwner && !hasSupervisorRole && (!existing || existing.status !== "active" || existing.rank_level < 5)) {
    throw new Error(
      `Acesso restrito: a conta Discord (${displayName}) não possui cargo de Supervisão ativo na Unified Police Department.`
    );
  }

  let officer = existing;
  if (!officer) {
    const topRank = isOwner
      ? store.ranks.find(r => r.level === 14) || store.ranks[store.ranks.length - 1]
      : mappedRanks[0] || store.ranks.find(r => r.level === 11) || store.ranks[4];
    const nextId = store.officers.reduce((m, o) => Math.max(m, o.id), 0) + 1;
    officer = {
      id: nextId,
      discord_id: discordId,
      rp_name: nick,
      badge: isOwner ? "101" : String(100 + nextId),
      division: isOwner ? "Office of the Chief of Police" : "Command Supervision",
      status: "active",
      rank_id: topRank.id,
      rank_name: topRank.name,
      rank_level: topRank.level,
      is_admin: isOwner || hasSupervisorRole ? 1 : 0,
      _updated_at: Date.now()
    };
    store.officers.push(officer);
    saveLocalStore(store);
  } else {
    officer._updated_at = Date.now();
    if (isOwner || hasSupervisorRole) {
      officer.is_admin = 1;
      officer.status = "active";
      if (officer.rank_level < 11) {
        officer.rank_id = 11;
        officer.rank_name = "Commander";
        officer.rank_level = 11;
      }
    } else if (mappedRanks[0]) {
      officer.rank_id = mappedRanks[0].id;
      officer.rank_name = mappedRanks[0].name;
      officer.rank_level = mappedRanks[0].level;
    }
    saveLocalStore(store);
  }

  sessionStorage.setItem("upd_auth_session", JSON.stringify(officer));
  return officer;
}

export async function fetchPublicVerifyRecord(code) {
  await pullSharedStore(true);
  return verifyControlNoLocal(code);
}

// ─── Business Logic & Document Operations ─────────────────────────────────────

export function canIssueTemplate(officer, template) {
  if (!officer || officer.status !== "active" || !template.active) return false;
  if (officer.is_admin) return true;
  return (officer.rank_level || 0) >= template.min_issue_level;
}

export function isHighCommand(officer) {
  if (!officer || officer.status !== "active") return false;
  return Boolean(officer.is_admin) || (Number(officer.rank_level) || 0) >= 11;
}

export function canApproveDocument(officer, doc) {
  if (!officer || officer.status !== "active") return false;
  const isSelf = Number(officer.id) === Number(doc.issuer_id);
  if (isSelf && !isHighCommand(officer)) return false;
  if (officer.is_admin) return true;
  return (officer.rank_level || 0) >= (doc.min_approve_level || 5);
}

export function createDraftLocal(templateCode, fieldValues) {
  const officer = getCurrentOfficer();
  if (!officer) throw new Error("Você precisa estar autenticado para emitir documentos.");
  const tpl = store.templates.find(t => t.code === templateCode);
  if (!tpl) throw new Error("Template not found");
  if (!canIssueTemplate(officer, tpl)) throw new Error("Insufficient rank or inactive officer status");

  for (const f of tpl.fields) {
    const val = (fieldValues[f.key] || "").trim();
    if (f.required && !val) throw new Error(`Missing required field: ${f.label}`);
  }

  const nextId = store.documents.reduce((m, d) => Math.max(m, Number(d.id) || 100), 100) + 1;
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
    discord_posted: false,
    data_json: { ...fieldValues },
    lang: fieldValues._lang || "pt",
    _updated_at: Date.now()
  };
  store.documents.unshift(doc);
  saveLocalStore(store);
  return doc;
}

export function approveDocumentLocal(docId) {
  const officer = getCurrentOfficer();
  if (!officer) throw new Error("Autenticação necessária.");
  const doc = store.documents.find(d => Number(d.id) === Number(docId));
  if (!doc) throw new Error("Document not found");
  if (!canApproveDocument(officer, doc)) {
    throw new Error("Autoaprovação restrita ao High Command ou patente abaixo do mínimo exigido.");
  }
  const year = new Date().getFullYear();
  const sameCode = store.documents.filter(
    d => d.template_code === doc.template_code && d.control_no && Number(d.id) !== Number(doc.id)
  );
  const seq = String(sameCode.length + 1).padStart(4, "0");
  doc.control_no = doc.control_no || `UPD-${doc.template_code}-${year}-${seq}`;
  doc.status = "APPROVED";
  doc.approver_id = officer.id;
  doc.approver_name = officer.rp_name;
  doc.approver_badge = officer.badge;
  doc.approver_rank = officer.rank_name;
  doc.approved_at = new Date().toISOString();
  doc._updated_at = Date.now();
  saveLocalStore(store);

  if (!doc.discord_posted) {
    postApprovedDocumentToDiscord(doc);
  }
  return doc;
}

export function rejectDocumentLocal(docId, reason) {
  const officer = getCurrentOfficer();
  if (!officer) throw new Error("Autenticação necessária.");
  const doc = store.documents.find(d => Number(d.id) === Number(docId));
  if (!doc) throw new Error("Document not found");
  if (!canApproveDocument(officer, doc)) {
    throw new Error("Auto-rejeição restrita ao High Command ou patente insuficiente.");
  }
  doc.status = "REJECTED";
  doc.approver_id = officer.id;
  doc.approver_name = officer.rp_name;
  doc.approver_badge = officer.badge;
  doc.approver_rank = officer.rank_name;
  doc.reject_reason = reason;
  doc._updated_at = Date.now();
  saveLocalStore(store);
  return doc;
}

export function revokeDocumentLocal(docId, reason) {
  const officer = getCurrentOfficer();
  if (!officer || !officer.is_admin) throw new Error("Only Command Administrators can revoke documents");
  const doc = store.documents.find(d => Number(d.id) === Number(docId));
  if (!doc) throw new Error("Document not found");
  doc.status = "REVOKED";
  doc.revoked_at = new Date().toISOString();
  doc.reject_reason = reason || "Revoked by Command Staff";
  doc._updated_at = Date.now();
  saveLocalStore(store);
  return doc;
}

export function saveOfficerLocal(payload) {
  const rank = store.ranks.find(r => r.id === Number(payload.rank_id)) || store.ranks[0];
  const existing = store.officers.find(o => String(o.discord_id) === String(payload.discord_id));
  if (existing) {
    Object.assign(existing, {
      rp_name: payload.rp_name,
      badge: payload.badge,
      division: payload.division,
      status: payload.status,
      rank_id: rank.id,
      rank_name: rank.name,
      rank_level: rank.level,
      is_admin: payload.is_admin ? 1 : 0,
      _updated_at: Date.now()
    });
  } else {
    const nextId = store.officers.reduce((m, o) => Math.max(m, o.id), 0) + 1;
    store.officers.push({
      id: nextId,
      discord_id: String(payload.discord_id).trim(),
      rp_name: payload.rp_name,
      badge: payload.badge,
      division: payload.division,
      status: payload.status,
      rank_id: rank.id,
      rank_name: rank.name,
      rank_level: rank.level,
      is_admin: payload.is_admin ? 1 : 0,
      _updated_at: Date.now()
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
    rk._updated_at = Date.now();
  } else {
    const nextId = store.ranks.reduce((m, r) => Math.max(m, r.id), 0) + 1;
    store.ranks.push({
      id: nextId,
      name,
      level: Number(level),
      discord_role_id: discordRoleId,
      _updated_at: Date.now()
    });
    store.ranks.sort((a, b) => a.level - b.level);
  }
  saveLocalStore(store);
}

export function saveTemplateLocal(updatedTpl) {
  const idx = store.templates.findIndex(t => t.code === updatedTpl.code);
  if (idx >= 0) {
    store.templates[idx] = {
      ...store.templates[idx],
      ...updatedTpl,
      version: (store.templates[idx].version || 1) + 1,
      _updated_at: Date.now()
    };
  } else {
    store.templates.push({ ...updatedTpl, version: 1, active: 1, _updated_at: Date.now() });
  }
  saveLocalStore(store);
}

export function verifyControlNoLocal(controlNo) {
  const norm = (controlNo || "").trim().toUpperCase();
  const doc = store.documents.find(d => (d.control_no || "").toUpperCase() === norm);
  if (!doc) return null;
  const tpl = store.templates.find(t => t.code === doc.template_code) || {
    code: doc.template_code,
    name: doc.template_name,
    category: doc.category
  };
  return {
    control_no: doc.control_no,
    template_code: doc.template_code,
    document_title: doc.template_name,
    category: doc.category,
    status: doc.status,
    issued_by: `${doc.issuer_rank} ${doc.issuer_name} (Badge #${doc.issuer_badge})`,
    approved_by: `${doc.approver_rank} ${doc.approver_name} (Badge #${doc.approver_badge})`,
    approved_at: doc.approved_at,
    png_url: doc.png_url || null,
    lang: doc.lang || doc.data_json?._lang || "pt",
    revoked_at: doc.revoked_at || null,
    revocation_note: doc.status === "REVOKED" ? doc.reject_reason : null,
    doc,
    template: tpl,
    data_json: doc.data_json || {}
  };
}
