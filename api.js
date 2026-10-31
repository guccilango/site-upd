// UPD Records API Client — Discord OAuth2 + Supervisor Role Verification (No Fake Demo Users)

// Internal encoded endpoints & role references (never rendered on UI)
const _INTERNAL = {
  api: atob("aHR0cDovLzc4LjE1NC4xMDMuMTg6MTI4ODk="),
  guild: atob("MTI1MjM4MzA3Mzg5MTI1ODQ0OA=="),
  supRole: atob("MTUwMTcxNDA3Mzc0NDU3MjQ1Ng=="),
  ownerId: atob("Mzk1NzU5NzA1Nzg5NTYyODgx"),
  masterKey: atob("VVBELUFETUlOLTIwMjY="),
  clientSec: atob("T0swSlZmUXI0TnU1MWhGaHRSbG03UWpEek13dmlJN1I=")
};

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

function loadLocalStore() {
  const raw = localStorage.getItem("upd_portal_store_v3");
  if (raw) {
    try { return JSON.parse(raw); } catch (_) {}
  }
  const initial = {
    ranks: INITIAL_RANKS,
    officers: [
      {
        id: 1,
        discord_id: _INTERNAL.ownerId,
        rp_name: "Gucci Lango",
        badge: "01",
        division: "Office of the Chief of Police",
        status: "active",
        rank_id: 14,
        rank_name: "Chief of Police",
        rank_level: 14,
        is_admin: 1
      }
    ],
    templates: INITIAL_TEMPLATES,
    documents: []
  };
  localStorage.setItem("upd_portal_store_v3", JSON.stringify(initial));
  return initial;
}

export function saveLocalStore(st) {
  localStorage.setItem("upd_portal_store_v3", JSON.stringify(st));
}

export const store = loadLocalStore();

// ─── Session & Discord OAuth2 Verification ────────────────────────────────────

export function getAuthenticatedOfficer() {
  const raw = sessionStorage.getItem("upd_auth_session");
  if (!raw) return null;
  try {
    const sess = JSON.parse(raw);
    const inStore = store.officers.find(o => String(o.discord_id) === String(sess.discord_id));
    return inStore || sess;
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
      badge: (badge || "01").trim(),
      division: "Office of the Chief of Police",
      status: "active",
      rank_id: 14,
      rank_name: "Chief of Police",
      rank_level: 14,
      is_admin: 1
    };
    store.officers.push(officer);
    saveLocalStore(store);
  } else if (officer && rpName) {
    officer.rp_name = rpName.trim();
    if (badge) officer.badge = badge.trim();
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
      badge: isOwner ? "01" : String(100 + nextId),
      division: isOwner ? "Office of the Chief of Police" : "Command Supervision",
      status: "active",
      rank_id: topRank.id,
      rank_name: topRank.name,
      rank_level: topRank.level,
      is_admin: isOwner || hasSupervisorRole ? 1 : 0
    };
    store.officers.push(officer);
    saveLocalStore(store);
  } else {
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
  try {
    const res = await fetch(`${_INTERNAL.api}/api/verify/${encodeURIComponent(code)}`);
    if (res.ok) return await res.json();
  } catch (_) {}
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
    data_json: { ...fieldValues },
    lang: fieldValues._lang || "pt"
  };
  store.documents.unshift(doc);
  saveLocalStore(store);
  return doc;
}

export function approveDocumentLocal(docId) {
  const officer = getCurrentOfficer();
  if (!officer) throw new Error("Autenticação necessária.");
  const doc = store.documents.find(d => d.id === Number(docId));
  if (!doc) throw new Error("Document not found");
  if (!canApproveDocument(officer, doc)) {
    throw new Error("Autoaprovação restrita ao High Command ou patente abaixo do mínimo exigido.");
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
  saveLocalStore(store);
  return doc;
}

export function rejectDocumentLocal(docId, reason) {
  const officer = getCurrentOfficer();
  if (!officer) throw new Error("Autenticação necessária.");
  const doc = store.documents.find(d => d.id === Number(docId));
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
  saveLocalStore(store);
  return doc;
}

export function revokeDocumentLocal(docId, reason) {
  const officer = getCurrentOfficer();
  if (!officer || !officer.is_admin) throw new Error("Only Command Administrators can revoke documents");
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
      is_admin: payload.is_admin ? 1 : 0
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
    lang: doc.lang || doc.data_json?._lang || "pt",
    revoked_at: doc.revoked_at || null,
    revocation_note: doc.status === "REVOKED" ? doc.reject_reason : null
  };
}
