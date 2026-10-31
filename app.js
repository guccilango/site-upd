import {
  store,
  getCurrentOfficer,
  logoutOfficer,
  loginOwnerDirect,
  getDiscordOAuthUrl,
  handleDiscordOAuthCallbackIfPresent,
  canIssueTemplate,
  canApproveDocument,
  createDraftLocal,
  approveDocumentLocal,
  rejectDocumentLocal,
  revokeDocumentLocal,
  saveOfficerLocal,
  saveRankLocal,
  saveTemplateLocal
} from "./api.js";
import {
  DOC_I18N,
  getLanguage,
  setLanguage,
  getDocumentLanguage,
  setDocumentLanguage,
  t,
  resolveTemplateForLang
} from "./i18n.js";

function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function statusPill(status) {
  const s = (status || "PENDING").toUpperCase();
  if (s === "APPROVED") return `<span class="pill pill-approved">${esc(t("statusApproved"))}</span>`;
  if (s === "PENDING") return `<span class="pill pill-pending">${esc(t("statusPending"))}</span>`;
  if (s === "REJECTED") return `<span class="pill pill-rejected">${esc(t("statusRejected"))}</span>`;
  if (s === "REVOKED") return `<span class="pill pill-revoked">${esc(t("statusRevoked"))}</span>`;
  return `<span class="pill pill-neutral">${esc(s)}</span>`;
}

function renderFilledBodyHtml(bodyTemplate, vars) {
  return String(bodyTemplate || "").replace(/\{([a-zA-Z0-9_]+)\}/g, (_, k) => {
    const val = vars[k];
    return val !== undefined && val !== "" ? esc(val) : `[${esc(k)}]`;
  });
}

export function buildLiveSheetHtml(template, fieldValues, docMeta = {}) {
  const officer = docMeta.issuer || getCurrentOfficer() || {
    rp_name: "Command Officer",
    badge: "01",
    rank_name: "Commander"
  };
  const status = docMeta.status || "PENDING";
  const ctrl = docMeta.control_no || "DRAFT-PREVIEW";
  const dateStr = (docMeta.approved_at || docMeta.created_at || new Date().toISOString()).slice(0, 10);

  const docLang = docMeta.lang || fieldValues._lang || getDocumentLanguage() || "pt";
  const chrome = DOC_I18N[docLang] || DOC_I18N.pt;
  const resolvedTpl = resolveTemplateForLang(template, docLang);

  const vars = {
    ...fieldValues,
    issuer_name: officer.rp_name,
    issuer_badge: officer.badge,
    issuer_rank: officer.rank_name,
    issuer_division: officer.division || (docLang === "pt" ? "Divisão de Patrulha" : "Command Division")
  };
  const bodyHtml = renderFilledBodyHtml(resolvedTpl.body, vars);
  const reqRankLabel = resolvedTpl.category === "doj" ? chrome.sigReqCommander : chrome.sigReqCorporal;

  const approverBlock =
    status === "APPROVED" && docMeta.approver_name
      ? `
        <div class="sheet-sig-role">${esc(chrome.sigApproverRole)}</div>
        <div class="sheet-sig-cursive">${esc(docMeta.approver_name)}</div>
        <div class="sheet-sig-line"></div>
        <div class="sheet-sig-name">${esc(docMeta.approver_name.toUpperCase())}</div>
        <div class="sheet-sig-meta">${esc(docMeta.approver_rank)} · Badge #${esc(docMeta.approver_badge)}</div>
        <div class="sheet-sig-meta">${esc(chrome.sigCountersigned.replace("{date}", dateStr))}</div>
      `
      : `
        <div class="sheet-sig-role">${esc(chrome.sigApproverRole)}</div>
        <div style="height:28px;display:flex;align-items:center;justify-content:center;font-family:var(--font);font-size:10px;font-weight:700;color:#9e1b1b;">
          ${esc(chrome.sigAwaiting)}
        </div>
        <div class="sheet-sig-line"></div>
        <div class="sheet-sig-name">${esc(reqRankLabel)}</div>
        <div class="sheet-sig-meta">Unified Police Department</div>
      `;

  return `
    <div class="us-letter-sheet" data-ui="us-letter-preview">
      <div class="us-letter-inner">
        <img class="sheet-watermark" src="./assets/opacidade2.png" alt="UPD Watermark" />
        ${status !== "APPROVED" ? `<div class="sheet-draft-stamp">${status === "PENDING" ? esc(chrome.stampDraft) : esc(status)}</div>` : ""}

        <div class="sheet-content">
          <div class="sheet-masthead">
            <div class="sheet-masthead-left">
              <img src="./assets/opacidade2.png" alt="UPD Crest" />
              <div>
                <div class="sheet-dept-title">${esc(chrome.deptTitle)}</div>
                <div class="sheet-dept-sub">${esc(chrome.deptSub)}</div>
                <div class="sheet-dept-juris">${esc(chrome.deptJuris)}</div>
              </div>
            </div>
            <div class="sheet-masthead-right">
              <div>${esc(chrome.ctrlNoLabel)} <strong class="mono">${esc(ctrl)}</strong></div>
              <div>${esc(chrome.dateLabel)} <strong class="mono">${esc(dateStr)}</strong></div>
              <div>${esc(chrome.seriesLabel)} <strong>${resolvedTpl.category === "doj" ? esc(chrome.seriesDoj) : esc(chrome.seriesInternal)}</strong></div>
              <div>${esc(chrome.statusLabel)} <strong>${esc(status === "APPROVED" ? (docLang === "pt" ? "APROVADO" : "APPROVED") : status)}</strong></div>
            </div>
          </div>
          <div class="sheet-gold-rule"></div>

          <div class="sheet-caption-box">
            <div class="sheet-court-line">${esc(resolvedTpl.court_header || "UNIFIED POLICE DEPARTMENT")}</div>
            <div class="sheet-doc-title">${esc(resolvedTpl.title || resolvedTpl.name)}</div>
          </div>

          <div class="sheet-body-text">${bodyHtml}</div>
        </div>

        <div>
          <div class="sheet-sig-box">
            <div>
              <div class="sheet-sig-role">${esc(chrome.sigIssuerRole)}</div>
              <div class="sheet-sig-cursive">${esc(officer.rp_name)}</div>
              <div class="sheet-sig-line"></div>
              <div class="sheet-sig-name">${esc(officer.rp_name.toUpperCase())}</div>
              <div class="sheet-sig-meta">${esc(officer.rank_name)} · Badge #${esc(officer.badge)}</div>
              <div class="sheet-sig-meta">Unified Police Department</div>
            </div>
            <div class="sheet-seal-col">
              <img src="./assets/selo.png" alt="Official Seal" />
              <div class="sheet-seal-caption">${esc(chrome.sealText)}</div>
            </div>
            <div>
              ${approverBlock}
            </div>
          </div>

          <div class="sheet-footer-bar">
            <span>${esc(chrome.footerVerify.replace("{ctrl}", ctrl))}</span>
            <span>${esc(chrome.footerSensitive)}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ─── Login Screen (Mandatory Discord / Owner Auth) ────────────────────────────

let authErrorMessage = "";

function maskId(id) {
  const s = String(id || "");
  if (!s) return "—";
  return s.length > 4 ? `••••${s.slice(-4)}` : "••••";
}

function renderLoginScreen() {
  const sidebar = document.getElementById("sidebar-nav");
  const main = document.getElementById("main-canvas");
  const lang = getLanguage();

  sidebar.innerHTML = `
    <div>
      <div class="brand-switcher" style="display:flex;justify-content:space-between;align-items:center;">
        <div style="display:flex;align-items:center;gap:10px;">
          <img class="brand-crest" src="./assets/opacidade2.png" alt="UPD Crest" />
          <div class="brand-meta">
            <div class="brand-title">${esc(t("brandTitle"))}</div>
            <div class="brand-sub">${esc(t("restrictedPortal"))}</div>
          </div>
        </div>
        <button class="btn btn-ghost btn-lang-toggle" type="button" style="padding:4px 8px;font-size:13px;font-weight:700;" title="Alternar Idioma / Switch Language">
          ${lang === 'pt' ? '🇧🇷 PT' : '🇺🇸 EN'}
        </button>
      </div>
      <div class="nav-group">
        <div class="nav-group-label">${esc(t("publicVerifier"))}</div>
        <ul class="nav-list">
          <li>
            <a class="nav-btn" href="./verify.html" style="text-decoration:none;">
              <span class="nav-btn-left">
                <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                <span>${esc(t("publicVerifier"))}</span>
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="sidebar-footer">
      <div style="font-size:12px;color:var(--muted);">
        ${esc(t("deptNotice"))}
      </div>
    </div>
  `;

  main.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">${esc(t("loginTitle"))}</h1>
        <p class="page-sub">${esc(t("loginSub"))}</p>
      </div>
      <div class="header-actions" style="display:flex;gap:8px;align-items:center;">
        <button class="btn btn-secondary btn-lang-toggle" type="button" style="font-weight:700;">
          ${lang === 'pt' ? '🇧🇷 PT' : '🇺🇸 EN'}
        </button>
        <a class="btn btn-secondary" href="./verify.html">${esc(t("publicVerifier"))}</a>
      </div>
    </div>

    ${
      authErrorMessage
        ? `<div class="notice-bar" style="background:var(--pill-negative-bg);color:var(--pill-negative-ink);border-color:#f8c6c0;">
             <span>${esc(authErrorMessage)}</span>
           </div>`
        : ""
    }

    <div style="max-width:500px;margin:36px auto 0;">
      <section class="panel" style="padding:28px 24px;text-align:center;">
        <img src="./assets/opacidade2.png" alt="UPD Crest" style="width:68px;height:68px;margin:0 auto 14px;" />
        <h2 class="panel-title" style="font-size:18px;margin-bottom:6px;">${esc(t("loginAuthTitle"))}</h2>
        <div class="panel-sub" style="margin-bottom:16px;">${esc(t("loginAuthSub"))}</div>
        <p style="margin:0 auto 22px;color:var(--muted);font-size:13.5px;line-height:1.55;max-width:420px;">
          ${esc(t("loginAuthDesc"))}
        </p>
        <a class="btn btn-primary" href="${esc(getDiscordOAuthUrl())}" style="width:100%;justify-content:center;height:42px;font-size:14px;font-weight:600;">
          ${esc(t("btnDiscordLogin"))}
        </a>
      </section>
    </div>
  `;

  document.querySelectorAll(".btn-lang-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      setLanguage(getLanguage() === "pt" ? "en" : "pt");
      renderApp();
    });
  });
}

// ─── Authenticated Sidebar & Views ────────────────────────────────────────────

let currentDocFilter = "all";
let selectedInspectDocId = null;

function renderSidebar() {
  const officer = getCurrentOfficer();
  const pendingCount = store.documents.filter(d => d.status === "PENDING").length;
  const pendingOfficers = store.officers.filter(o => o.status === "pending").length;
  const hash = window.location.hash || "#/";
  const lang = getLanguage();

  document.getElementById("sidebar-nav").innerHTML = `
    <div>
      <div class="brand-switcher" style="display:flex;justify-content:space-between;align-items:center;">
        <div style="display:flex;align-items:center;gap:10px;">
          <img class="brand-crest" src="./assets/opacidade2.png" alt="UPD Crest" />
          <div class="brand-meta">
            <div class="brand-title">${esc(t("brandTitle"))}</div>
            <div class="brand-sub">${esc(t("brandSub"))}</div>
          </div>
        </div>
        <button class="btn btn-ghost btn-lang-toggle" type="button" style="padding:4px 8px;font-size:13px;font-weight:700;" title="Alternar Idioma / Switch Language">
          ${lang === 'pt' ? '🇧🇷 PT' : '🇺🇸 EN'}
        </button>
      </div>

      <div class="nav-group">
        <div class="nav-group-label">${esc(t("navOperations"))}</div>
        <ul class="nav-list">
          <li>
            <button class="nav-btn ${hash === "#/" ? "active" : ""}" data-route="#/">
              <span class="nav-btn-left">
                <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>
                <span>${esc(t("navOverview"))}</span>
              </span>
              <span class="nav-count">${store.documents.length}</span>
            </button>
          </li>
          <li>
            <button class="nav-btn ${hash.startsWith("#/emitir") ? "active" : ""}" data-route="#/emitir/SW">
              <span class="nav-btn-left">
                <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                <span>${esc(t("navIssue"))}</span>
              </span>
            </button>
          </li>
          <li>
            <button class="nav-btn ${hash === "#/aprovacoes" ? "active" : ""}" data-route="#/aprovacoes">
              <span class="nav-btn-left">
                <svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                <span>${esc(t("navApprovals"))}</span>
              </span>
              <span class="nav-count">${pendingCount}</span>
            </button>
          </li>
        </ul>
      </div>

      <div class="nav-group">
        <div class="nav-group-label">${esc(t("navAdmin"))}</div>
        <ul class="nav-list">
          <li>
            <button class="nav-btn ${hash === "#/oficiais" ? "active" : ""}" data-route="#/oficiais">
              <span class="nav-btn-left">
                <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>${esc(t("navOfficers"))}</span>
              </span>
              <span class="nav-count">${pendingOfficers > 0 ? `${pendingOfficers} pending` : store.officers.length}</span>
            </button>
          </li>
          <li>
            <button class="nav-btn ${hash === "#/patentes" ? "active" : ""}" data-route="#/patentes">
              <span class="nav-btn-left">
                <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                <span>${esc(t("navRanks"))}</span>
              </span>
              <span class="nav-count">${store.ranks.length}</span>
            </button>
          </li>
          <li>
            <button class="nav-btn ${hash === "#/modelos" ? "active" : ""}" data-route="#/modelos">
              <span class="nav-btn-left">
                <svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                <span>${esc(t("navTemplates"))}</span>
              </span>
              <span class="nav-count">${store.templates.length}</span>
            </button>
          </li>
          <li>
            <a class="nav-btn" href="./verify.html" style="text-decoration:none;">
              <span class="nav-btn-left">
                <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                <span>${esc(t("publicVerifier"))}</span>
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="sidebar-footer">
      <div class="officer-card">
        <div class="officer-card-top">
          <span class="officer-name">${esc(officer.rp_name)}</span>
          <span class="mono" style="font-size:12px;color:var(--muted);">#${esc(officer.badge)}</span>
        </div>
        <div class="officer-rank">${esc(officer.rank_name)} · Lvl ${officer.rank_level}${officer.is_admin ? " · Admin" : ""}</div>
        <div class="officer-sig-preview" title="Auto-generated cursive signature">${esc(officer.rp_name)}</div>
      </div>
      <button class="btn btn-secondary" id="btn-logout" type="button" style="justify-content:center;">
        ${esc(t("signOut"))}
      </button>
    </div>
  `;

  document.querySelectorAll(".btn-lang-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      setLanguage(getLanguage() === "pt" ? "en" : "pt");
      renderApp();
    });
  });

  document.querySelectorAll("[data-route]").forEach(btn => {
    btn.addEventListener("click", () => {
      window.location.hash = btn.getAttribute("data-route");
      document.getElementById("sidebar-nav").classList.remove("open");
    });
  });

  document.getElementById("btn-logout").addEventListener("click", () => {
    logoutOfficer();
    renderApp();
  });
}

// ─── View 1: Overview & Operational Ledger ────────────────────────────────────

function renderOverview(container) {
  const officer = getCurrentOfficer();
  const docs = store.documents;
  const pendingDocs = docs.filter(d => d.status === "PENDING");
  const approvedDoj = docs.filter(d => d.status === "APPROVED" && d.category === "doj");
  const approvedInternal = docs.filter(d => d.status === "APPROVED" && d.category === "internal");
  const activeOfficers = store.officers.filter(o => o.status === "active");
  const lang = getLanguage();

  const filteredDocs = docs.filter(d => {
    if (currentDocFilter === "pending") return d.status === "PENDING";
    if (currentDocFilter === "approved") return d.status === "APPROVED";
    if (currentDocFilter === "mine") return d.issuer_id === officer.id;
    return true;
  });

  container.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">${esc(t("brandTitle"))} — ${esc(t("ledgerTitle"))}</h1>
        <p class="page-sub">Unified Police Department · ${esc(t("composerSub"))}</p>
      </div>
      <div class="header-actions" style="display:flex;align-items:center;gap:8px;">
        <button class="btn btn-secondary btn-lang-toggle" type="button" style="font-weight:700;">
          ${lang === 'pt' ? '🇧🇷 PT' : '🇺🇸 EN'}
        </button>
        <a class="btn btn-secondary" href="./verify.html">${esc(t("verifyControlNo"))}</a>
        <button class="btn btn-primary" id="btn-new-filing">${esc(t("newDocument"))}</button>
      </div>
    </div>

    <section class="kpi-strip" aria-label="Key Registry Metrics">
      <div class="kpi-cell">
        <div class="kpi-label">${esc(t("kpiPendingLabel"))}</div>
        <div class="kpi-value accent-data">${pendingDocs.length}</div>
        <div class="kpi-caption">${esc(t("kpiPendingCap"))}</div>
      </div>
      <div class="kpi-cell">
        <div class="kpi-label">${esc(t("kpiDojLabel"))}</div>
        <div class="kpi-value">${approvedDoj.length}</div>
        <div class="kpi-caption">${esc(t("kpiDojCap"))}</div>
      </div>
      <div class="kpi-cell">
        <div class="kpi-label">${esc(t("kpiInternalLabel"))}</div>
        <div class="kpi-value">${approvedInternal.length}</div>
        <div class="kpi-caption">${esc(t("kpiInternalCap"))}</div>
      </div>
      <div class="kpi-cell">
        <div class="kpi-label">${esc(t("kpiOfficersLabel"))}</div>
        <div class="kpi-value">${activeOfficers.length} <span style="font-size:14px;color:var(--muted);font-weight:400;">/ ${store.officers.length}</span></div>
        <div class="kpi-caption">${esc(t("kpiOfficersCap", { total: store.officers.length }))}</div>
      </div>
    </section>

    <div class="grid-asymmetric">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">${esc(t("ledgerTitle"))}</h2>
            <div class="panel-sub">${filteredDocs.length} / ${docs.length}</div>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;">
            <button class="btn ${currentDocFilter === "all" ? "btn-primary" : "btn-secondary"}" data-filter="all">${esc(t("filterAll", { count: docs.length }))}</button>
            <button class="btn ${currentDocFilter === "pending" ? "btn-primary" : "btn-secondary"}" data-filter="pending">${esc(t("filterPending", { count: pendingDocs.length }))}</button>
            <button class="btn ${currentDocFilter === "approved" ? "btn-primary" : "btn-secondary"}" data-filter="approved">${esc(t("filterApproved", { count: approvedDoj.length + approvedInternal.length }))}</button>
            <button class="btn ${currentDocFilter === "mine" ? "btn-primary" : "btn-secondary"}" data-filter="mine">${esc(t("filterMine", { count: docs.filter(d => d.issuer_id === officer.id).length }))}</button>
          </div>
        </div>

        ${
          filteredDocs.length === 0
            ? `<div style="border:1px dashed var(--control);border-radius:var(--radius-card);padding:18px;color:var(--muted);font-size:13px;">
                 Nenhum documento emitido neste filtro.
               </div>`
            : `
              <div class="table-wrap">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>${esc(t("colControlNo"))}</th>
                      <th>${esc(t("colTemplate"))}</th>
                      <th>${esc(t("colIssuer"))}</th>
                      <th>${esc(t("colStatus"))}</th>
                      <th class="num">${esc(t("colActions"))}</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${filteredDocs
                      .map(d => {
                        const canApp = d.status === "PENDING" && canApproveDocument(officer, d);
                        const tplResolved = resolveTemplateForLang(
                          store.templates.find(t => t.code === d.template_code) || { code: d.template_code, name: d.template_name },
                          d.lang || "pt"
                        );
                        const docLangBadge = (d.lang || "pt") === "en"
                          ? '<span class="pill pill-pending" style="font-size:10px;padding:2px 6px;margin-left:6px;" title="English Document">🇺🇸 EN</span>'
                          : '<span class="pill pill-approved" style="font-size:10px;padding:2px 6px;margin-left:6px;" title="Documento em Português">🇧🇷 PT</span>';
                        return `
                          <tr>
                            <td class="mono" style="font-weight:500;">
                              ${d.control_no ? `<a href="./verify.html?n=${encodeURIComponent(d.control_no)}" style="color:var(--text);text-decoration:underline;">${esc(d.control_no)}</a>` : `Draft #${d.id}`}
                            </td>
                            <td>
                              <div style="font-weight:500;display:flex;align-items:center;">
                                <span>[${esc(d.template_code)}] ${esc(tplResolved.name || d.template_name)}</span>
                                ${docLangBadge}
                              </div>
                              <div style="font-size:12px;color:var(--muted);">
                                ${d.category === "doj" ? "DOJ Judicial Filing (Commander+)" : "Internal Record (Corporal+)"} · ${esc(d.created_at.slice(0, 10))}
                              </div>
                            </td>
                            <td>
                              <div>${esc(d.issuer_rank)} ${esc(d.issuer_name)}</div>
                              <div class="mono" style="font-size:12px;color:var(--muted);">Badge #${esc(d.issuer_badge)}</div>
                            </td>
                            <td>
                              ${statusPill(d.status)}
                              ${d.approver_name ? `<div style="font-size:11px;color:var(--muted);margin-top:2px;">Signed: ${esc(d.approver_rank)} ${esc(d.approver_name)}</div>` : ""}
                            </td>
                            <td class="num">
                              <div style="display:inline-flex;gap:6px;justify-content:flex-end;">
                                <button class="btn btn-secondary" data-inspect="${d.id}">${esc(t("btnViewDoc"))}</button>
                                ${canApp ? `<button class="btn btn-primary" data-quick-approve="${d.id}">${esc(t("btnApprove"))}</button>` : ""}
                              </div>
                            </td>
                          </tr>
                        `;
                      })
                      .join("")}
                  </tbody>
                </table>
              </div>
            `
        }
      </section>

      <aside class="panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">${esc(t("navTemplates"))}</h2>
            <div class="panel-sub">${esc(t("composerSub"))}</div>
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>${esc(t("colTemplate"))}</th>
              <th>${esc(t("colApproval"))}</th>
              <th class="num">${esc(t("navIssue"))}</th>
            </tr>
          </thead>
          <tbody>
            ${store.templates
              .filter(t => t.active)
              .map(t => {
                const allowed = canIssueTemplate(officer, t);
                const tplResolved = resolveTemplateForLang(t, lang);
                return `
                  <tr>
                    <td class="mono" style="font-weight:600;">${esc(t.code)}</td>
                    <td>
                      <div style="font-weight:500;">${esc(tplResolved.name)}</div>
                      <div style="font-size:12px;color:var(--muted);">
                        ${t.category === "doj" ? "DOJ · Approver: Commander+" : "Internal · Approver: Corporal+"}
                      </div>
                    </td>
                    <td class="num">
                      <button class="btn ${allowed ? "btn-secondary" : ""}" data-issue="${esc(t.code)}" ${!allowed ? "disabled" : ""}>
                        ${esc(t("navIssue"))}
                      </button>
                    </td>
                  </tr>
                `;
              })
              .join("")}
          </tbody>
        </table>
      </aside>
    </div>

    <div id="inspect-drawer"></div>
  `;

  document.getElementById("btn-new-filing").addEventListener("click", () => {
    window.location.hash = "#/emitir/SW";
  });

  container.querySelectorAll("[data-filter]").forEach(btn => {
    btn.addEventListener("click", () => {
      currentDocFilter = btn.getAttribute("data-filter");
      renderOverview(container);
    });
  });

  container.querySelectorAll("[data-issue]").forEach(btn => {
    btn.addEventListener("click", () => {
      window.location.hash = `#/emitir/${btn.getAttribute("data-issue")}`;
    });
  });

  container.querySelectorAll("[data-quick-approve]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-quick-approve"));
      try {
        approveDocumentLocal(id);
        selectedInspectDocId = id;
        renderApp();
      } catch (err) {
        alert(err.message);
      }
    });
  });

  container.querySelectorAll("[data-inspect]").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedInspectDocId = Number(btn.getAttribute("data-inspect"));
      renderInspectModal(container);
    });
  });

  if (selectedInspectDocId) {
    renderInspectModal(container);
  }
}

function renderInspectModal(container) {
  const drawer = container.querySelector("#inspect-drawer");
  if (!drawer || !selectedInspectDocId) return;
  const doc = store.documents.find(d => d.id === selectedInspectDocId);
  if (!doc) return;
  const tpl = store.templates.find(t => t.code === doc.template_code) || store.templates[0];
  const officer = getCurrentOfficer();
  const canApp = doc.status === "PENDING" && canApproveDocument(officer, doc);

  drawer.innerHTML = `
    <section class="panel" style="margin-top:8px;">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Official Sheet Inspection — ${esc(doc.control_no || `Draft #${doc.id}`)}</h2>
          <div class="panel-sub">
            Issued by ${esc(doc.issuer_rank)} ${esc(doc.issuer_name)} (#${esc(doc.issuer_badge)})
          </div>
        </div>
        <div style="display:flex;gap:8px;">
          ${canApp ? `<button class="btn btn-primary" id="btn-modal-approve">Approve & Counter-Sign</button>` : ""}
          ${doc.status === "APPROVED" && officer.is_admin ? `<button class="btn btn-danger" id="btn-modal-revoke">Revoke Record</button>` : ""}
          <button class="btn btn-secondary" id="btn-close-inspect">Close Preview</button>
        </div>
      </div>
      <div style="max-width:780px;margin:0 auto;">
        ${buildLiveSheetHtml(tpl, doc.data_json, {
          status: doc.status,
          control_no: doc.control_no,
          created_at: doc.created_at,
          approved_at: doc.approved_at,
          lang: doc.lang || doc.data_json?._lang || "pt",
          issuer: { rp_name: doc.issuer_name, badge: doc.issuer_badge, rank_name: doc.issuer_rank },
          approver_name: doc.approver_name,
          approver_badge: doc.approver_badge,
          approver_rank: doc.approver_rank
        })}
      </div>
    </section>
  `;

  drawer.querySelector("#btn-close-inspect").addEventListener("click", () => {
    selectedInspectDocId = null;
    drawer.innerHTML = "";
  });

  const appBtn = drawer.querySelector("#btn-modal-approve");
  if (appBtn) {
    appBtn.addEventListener("click", () => {
      try {
        approveDocumentLocal(doc.id);
        renderApp();
      } catch (e) {
        alert(e.message);
      }
    });
  }

  const revBtn = drawer.querySelector("#btn-modal-revoke");
  if (revBtn) {
    revBtn.addEventListener("click", () => {
      const reason = prompt("Enter official reason for revoking this record:", "Superseded / Administrative Revocation");
      if (!reason) return;
      try {
        revokeDocumentLocal(doc.id, reason);
        renderApp();
      } catch (e) {
        alert(e.message);
      }
    });
  }
}

// ─── View 2: Split Document Composer + Live US-Letter Sheet ───────────────────

function renderComposer(container, codeParam, savedValues = null) {
  const officer = getCurrentOfficer();

  // If query string has ?lang=pt or ?lang=en, configure document language
  const hashParts = (window.location.hash || "").split("?");
  if (hashParts[1]) {
    const p = new URLSearchParams(hashParts[1]);
    const requested = p.get("lang");
    if (requested === "pt" || requested === "en") {
      setDocumentLanguage(requested);
    }
  }

  const docLang = getDocumentLanguage();
  const rawTpl = store.templates.find(t => t.code === (codeParam || "SW").toUpperCase()) || store.templates[0];
  const tpl = resolveTemplateForLang(rawTpl, docLang);
  
  const fieldValues = { _lang: docLang, ...(savedValues || {}) };
  tpl.fields.forEach(f => {
    if (fieldValues[f.key] === undefined) {
      fieldValues[f.key] = "";
    }
  });

  const lang = getLanguage(); // Site UI language

  container.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">${esc(t("composerTitle"))} — [${esc(tpl.code)}]</h1>
        <p class="page-sub">
          ${esc(tpl.name)} · ${esc(t("fieldAuthorityNotice", {
            minIssue: tpl.min_issue_level,
            minApprove: tpl.category === "doj" ? 11 : 5
          }))}
        </p>
      </div>
      <div class="header-actions" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
        <button class="btn btn-secondary btn-lang-toggle" type="button" style="font-weight:700;" title="${esc(t("siteLangNotice"))}">
          ${lang === 'pt' ? '🇧🇷 PT' : '🇺🇸 EN'}
        </button>
        <select id="tpl-picker" class="select" style="width:280px;">
          ${store.templates
            .filter(t => t.active)
            .map(t => {
              const res = resolveTemplateForLang(t, docLang);
              return `<option value="${esc(t.code)}" ${t.code === tpl.code ? "selected" : ""}>[${esc(t.code)}] ${esc(res.name)}</option>`;
            })
            .join("")}
        </select>
      </div>
    </div>

    <div class="composer-layout">
      <section class="panel">
        <div class="panel-header" style="margin-bottom:14px;">
          <div>
            <h2 class="panel-title">${esc(tpl.name)}</h2>
            <div class="panel-sub">${esc(officer.rank_name)} ${esc(officer.rp_name)} (Badge #${esc(officer.badge)})</div>
          </div>
        </div>

        <!-- BOTÕES DEDICADOS EXCLUSIVOS PARA O IDIOMA DO DOCUMENTO -->
        <div class="doc-emission-lang-box" style="margin-bottom:18px;padding:12px 16px;background:rgba(15,23,42,0.65);border:1px solid var(--border);border-radius:var(--radius-card);">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
            <div>
              <div style="font-weight:700;font-size:13px;color:var(--text);display:flex;align-items:center;gap:6px;">
                <span>📄</span>
                <span>${esc(t("docEmissionLangLabel"))}</span>
              </div>
              <div style="font-size:11px;color:var(--muted);margin-top:2px;">
                ${esc(t("docEmissionLangHelp"))}
              </div>
            </div>
            <div class="btn-group" role="group" aria-label="Document Emission Language" style="display:inline-flex;gap:6px;">
              <button type="button" class="btn btn-sm ${docLang === 'pt' ? 'btn-primary' : 'btn-secondary'} btn-doc-lang-choice" data-doc-lang="pt" style="font-weight:700;padding:6px 14px;border-radius:6px;cursor:pointer;">
                ${esc(t("btnDocLangPt"))}
              </button>
              <button type="button" class="btn btn-sm ${docLang === 'en' ? 'btn-primary' : 'btn-secondary'} btn-doc-lang-choice" data-doc-lang="en" style="font-weight:700;padding:6px 14px;border-radius:6px;cursor:pointer;">
                ${esc(t("btnDocLangEn"))}
              </button>
            </div>
          </div>
        </div>

        <form id="composer-form">
          ${tpl.fields
            .map(
              f => `
              <div class="field-group">
                <label class="field-label" for="fld-${esc(f.key)}">
                  <span>${esc(f.label)}</span>
                  <span class="field-hint mono">max ${f.max_length || 1000}</span>
                </label>
                ${
                  f.type === "textarea"
                    ? `<textarea class="textarea" id="fld-${esc(f.key)}" data-key="${esc(f.key)}" maxlength="${f.max_length || 3500}" placeholder="${esc(f.placeholder || "")}" required>${esc(fieldValues[f.key] || "")}</textarea>`
                    : `<input class="input" id="fld-${esc(f.key)}" data-key="${esc(f.key)}" type="text" maxlength="${f.max_length || 250}" placeholder="${esc(f.placeholder || "")}" value="${esc(fieldValues[f.key] || "")}" required />`
                }
              </div>
            `
            )
            .join("")}

          <div style="display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:1px solid var(--border);">
            <span style="font-size:12px;color:var(--muted);">
              Channel: <strong>#upd-official-documents</strong>
            </span>
            <button type="submit" class="btn btn-primary">${esc(t("btnSubmitDraft"))}</button>
          </div>
        </form>
      </section>

      <aside class="sheet-stage">
        <div class="sheet-toolbar">
          <span><strong>${esc(t("liveStageTitle"))}</strong> · ${esc(t("liveStageSub"))}</span>
          <span class="mono">${docLang.toUpperCase()} · Watermark · Seal</span>
        </div>
        <div id="live-sheet-holder">
          ${buildLiveSheetHtml(rawTpl, fieldValues, { lang: docLang })}
        </div>
      </aside>
    </div>
  `;

  // Site language switcher (switches website UI interface only)
  document.querySelectorAll(".btn-lang-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      container.querySelectorAll("[data-key]").forEach(inp => {
        fieldValues[inp.getAttribute("data-key")] = inp.value;
      });
      setLanguage(getLanguage() === "pt" ? "en" : "pt");
      renderApp();
    });
  });

  // Dedicated Document Emission Language buttons (switches document language and sheet only)
  container.querySelectorAll(".btn-doc-lang-choice").forEach(btn => {
    btn.addEventListener("click", () => {
      const selected = btn.getAttribute("data-doc-lang");
      if (selected === docLang) return;
      container.querySelectorAll("[data-key]").forEach(inp => {
        fieldValues[inp.getAttribute("data-key")] = inp.value;
      });
      fieldValues._lang = selected;
      setDocumentLanguage(selected);
      renderComposer(container, tpl.code, fieldValues);
    });
  });

  document.getElementById("tpl-picker").addEventListener("change", e => {
    window.location.hash = `#/emitir/${e.target.value}`;
  });

  const holder = document.getElementById("live-sheet-holder");
  container.querySelectorAll("[data-key]").forEach(inp => {
    inp.addEventListener("input", () => {
      fieldValues[inp.getAttribute("data-key")] = inp.value;
      holder.innerHTML = buildLiveSheetHtml(rawTpl, fieldValues, { lang: docLang });
    });
  });

  document.getElementById("composer-form").addEventListener("submit", e => {
    e.preventDefault();
    try {
      fieldValues._lang = docLang;
      const created = createDraftLocal(tpl.code, fieldValues);
      selectedInspectDocId = created.id;
      window.location.hash = "#/aprovacoes";
    } catch (err) {
      alert(err.message);
    }
  });
}

// ─── View 3: Command Approvals Queue ──────────────────────────────────────────

function renderApprovals(container) {
  const officer = getCurrentOfficer();
  const pending = store.documents.filter(d => d.status === "PENDING");
  const activeDoc = pending.find(d => d.id === selectedInspectDocId) || pending[0] || null;
  const lang = getLanguage();

  container.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">${esc(t("approvalsTitle"))}</h1>
        <p class="page-sub">
          ${esc(t("approvalsSub"))}
        </p>
      </div>
      <div class="header-actions" style="display:flex;align-items:center;gap:8px;">
        <button class="btn btn-secondary btn-lang-toggle" type="button" style="font-weight:700;">
          ${lang === 'pt' ? '🇧🇷 PT' : '🇺🇸 EN'}
        </button>
      </div>
    </div>

    ${
      pending.length === 0
        ? `<div class="panel"><p style="margin:0;color:var(--muted);">${esc(t("noPendingDocs"))}</p></div>`
        : `
        <div class="composer-layout">
          <section class="panel">
            <div class="panel-header">
              <h2 class="panel-title">${esc(t("approvalsTitle"))} (${pending.length})</h2>
            </div>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Draft</th>
                  <th>${esc(t("colIssuer"))}</th>
                  <th>${esc(t("colApproval"))}</th>
                  <th class="num">${esc(t("colActions"))}</th>
                </tr>
              </thead>
              <tbody>
                ${pending
                  .map(d => {
                    const allowed = canApproveDocument(officer, d);
                    const isSelf = Number(officer.id) === Number(d.issuer_id);
                    const docLangBadge = (d.lang || "pt") === "en"
                      ? '<span class="pill pill-pending" style="font-size:10px;padding:2px 6px;margin-left:6px;" title="English Document">🇺🇸 EN</span>'
                      : '<span class="pill pill-approved" style="font-size:10px;padding:2px 6px;margin-left:6px;" title="Documento em Português">🇧🇷 PT</span>';
                    const tplRes = resolveTemplateForLang(
                      store.templates.find(t => t.code === d.template_code) || { code: d.template_code, name: d.template_name },
                      d.lang || "pt"
                    );
                    return `
                      <tr style="${activeDoc && d.id === activeDoc.id ? "background:var(--raised);" : ""}">
                        <td>
                          <div style="font-weight:600;display:flex;align-items:center;">
                            <span>#${d.id} · [${esc(d.template_code)}]</span>
                            ${docLangBadge}
                          </div>
                          <div style="font-size:12px;color:var(--muted);">${esc(tplRes.name || d.template_name)}</div>
                        </td>
                        <td>
                          <div>${esc(d.issuer_rank)} ${esc(d.issuer_name)}</div>
                          <div class="mono" style="font-size:12px;color:var(--muted);">Badge #${esc(d.issuer_badge)}</div>
                        </td>
                        <td>
                          <span class="pill pill-neutral">${d.category === "doj" ? "Commander+" : "Corporal+"}</span>
                        </td>
                        <td class="num">
                          <div style="display:inline-flex;gap:6px;">
                            <button class="btn btn-secondary" data-select-pending="${d.id}">${esc(t("btnViewDoc"))}</button>
                            <button class="btn btn-primary" data-approve-id="${d.id}" ${!allowed ? "disabled" : ""} title="${!allowed && isSelf ? "Autoaprovação restrita ao High Command" : ""}">
                              ${esc(t("btnApprove"))}
                            </button>
                            <button class="btn btn-danger" data-reject-id="${d.id}" ${!allowed ? "disabled" : ""}>
                              ${esc(t("btnReject"))}
                            </button>
                          </div>
                        </td>
                      </tr>
                    `;
                  })
                  .join("")}
              </tbody>
            </table>
          </section>

          <aside class="sheet-stage">
            ${
              activeDoc
                ? `
                  <div class="sheet-toolbar">
                    <span><strong>Draft #${activeDoc.id} (${esc(activeDoc.template_code)})</strong></span>
                    <span class="mono">${esc(activeDoc.issuer_name)} (#${esc(activeDoc.issuer_badge)})</span>
                  </div>
                  ${buildLiveSheetHtml(
                    store.templates.find(t => t.code === activeDoc.template_code) || store.templates[0],
                    activeDoc.data_json,
                    {
                      status: activeDoc.status,
                      control_no: activeDoc.control_no,
                      created_at: activeDoc.created_at,
                      lang: activeDoc.lang || "pt",
                      issuer: {
                        rp_name: activeDoc.issuer_name,
                        badge: activeDoc.issuer_badge,
                        rank_name: activeDoc.issuer_rank
                      }
                    }
                  )}
                `
                : ""
            }
          </aside>
        </div>
      `
    }
  `;

  document.querySelectorAll(".btn-lang-toggle").forEach(btn => {
    btn.addEventListener("click", () => {
      setLanguage(getLanguage() === "pt" ? "en" : "pt");
      renderApp();
    });
  });

  container.querySelectorAll("[data-select-pending]").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedInspectDocId = Number(btn.getAttribute("data-select-pending"));
      renderApprovals(container);
    });
  });

  container.querySelectorAll("[data-approve-id]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-approve-id"));
      try {
        const approved = approveDocumentLocal(id);
        selectedInspectDocId = approved.id;
        window.location.hash = "#/";
      } catch (e) {
        alert(e.message);
      }
    });
  });

  container.querySelectorAll("[data-reject-id]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-reject-id"));
      const reason = prompt("Reason for rejecting this draft:", "Insufficient probable cause narrative.");
      if (!reason) return;
      try {
        rejectDocumentLocal(id, reason);
        renderApprovals(container);
        renderSidebar();
      } catch (e) {
        alert(e.message);
      }
    });
  });
}

// ─── View 4: Officers & Admission Management ──────────────────────────────────

function renderOfficers(container) {
  const caller = getCurrentOfficer();
  container.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Sworn Officers & Manual Admission</h1>
        <p class="page-sub">Officers sync their rank automatically from Discord roles, but require Admin Admission before issuing documents</p>
      </div>
    </div>

    <div class="grid-asymmetric">
      <section class="panel">
        <div class="panel-header">
          <h2 class="panel-title">Departmental Roster (${store.officers.length})</h2>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Officer & Division</th>
                <th>Rank</th>
                <th>Cursive Signature</th>
                <th>Status</th>
                <th class="num">Action</th>
              </tr>
            </thead>
            <tbody>
              ${store.officers
                .map(
                  o => `
                  <tr>
                    <td>
                      <div style="font-weight:600;">${esc(o.rp_name)} ${o.is_admin ? `<span class="pill pill-neutral" style="margin-left:4px;">Admin</span>` : ""}</div>
                      <div class="mono" style="font-size:12px;color:var(--muted);">Badge #${esc(o.badge)} · Discord ${esc(maskId(o.discord_id))}</div>
                    </td>
                    <td>${esc(o.rank_name)} (Lvl ${o.rank_level})</td>
                    <td><span style="font-family:var(--font-sig);font-size:22px;color:var(--pen);">${esc(o.rp_name)}</span></td>
                    <td>
                      <span class="pill ${o.status === "active" ? "pill-approved" : o.status === "pending" ? "pill-pending" : "pill-rejected"}">
                        ${esc(o.status)}
                      </span>
                    </td>
                    <td class="num">
                      ${
                        o.status !== "active"
                          ? `<button class="btn btn-primary" data-admit="${esc(o.discord_id)}" ${!caller.is_admin ? "disabled" : ""}>Admit</button>`
                          : `<button class="btn btn-secondary" data-suspend="${esc(o.discord_id)}" ${!caller.is_admin ? "disabled" : ""}>Suspend</button>`
                      }
                    </td>
                  </tr>
                `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </section>

      <aside class="panel">
        <div class="panel-header">
          <h2 class="panel-title">Register / Admit Officer Manually</h2>
        </div>
        <form id="officer-form">
          <div class="field-group">
            <label class="field-label">Discord User ID</label>
            <input class="input mono" name="discord_id" placeholder="Discord Snowflake ID" required />
          </div>
          <div class="field-group">
            <label class="field-label">Roleplay Full Name (Used for Auto-Signature)</label>
            <input class="input" name="rp_name" placeholder="Officer Full Name" required />
          </div>
          <div class="field-group">
            <label class="field-label">Badge Number</label>
            <input class="input mono" name="badge" placeholder="4210" required />
          </div>
          <div class="field-group">
            <label class="field-label">Division</label>
            <input class="input" name="division" value="Patrol Division" required />
          </div>
          <div class="field-group">
            <label class="field-label">Assigned Rank</label>
            <select class="select" name="rank_id">
              ${store.ranks.map(r => `<option value="${r.id}">[Lvl ${r.level}] ${esc(r.name)}</option>`).join("")}
            </select>
          </div>
          <div class="field-group">
            <label style="display:flex;align-items:center;gap:8px;font-size:13px;">
              <input type="checkbox" name="is_admin" /> Grant Command System Admin privileges
            </label>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;" ${!caller.is_admin ? "disabled" : ""}>
            Save & Admit Officer
          </button>
        </form>
      </aside>
    </div>
  `;

  container.querySelectorAll("[data-admit]").forEach(btn => {
    btn.addEventListener("click", () => {
      const o = store.officers.find(x => String(x.discord_id) === String(btn.getAttribute("data-admit")));
      if (o) {
        saveOfficerLocal({ ...o, status: "active" });
        renderApp();
      }
    });
  });

  container.querySelectorAll("[data-suspend]").forEach(btn => {
    btn.addEventListener("click", () => {
      const o = store.officers.find(x => String(x.discord_id) === String(btn.getAttribute("data-suspend")));
      if (o) {
        saveOfficerLocal({ ...o, status: "suspended" });
        renderApp();
      }
    });
  });

  document.getElementById("officer-form").addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    saveOfficerLocal({
      discord_id: fd.get("discord_id"),
      rp_name: fd.get("rp_name"),
      badge: fd.get("badge"),
      division: fd.get("division"),
      rank_id: Number(fd.get("rank_id")),
      status: "active",
      is_admin: fd.get("is_admin") === "on"
    });
    renderApp();
  });
}

// ─── View 5: Ranks & Discord Role Sync ────────────────────────────────────────

function renderRanks(container) {
  const caller = getCurrentOfficer();
  container.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">UPD Rank Hierarchy & Discord Role Mapping</h1>
        <p class="page-sub">Level 5+ (Corporal+) counter-signs Internal records · Level 11+ (Commander+) counter-signs DOJ Judicial Filings</p>
      </div>
    </div>

    <div class="grid-asymmetric">
      <section class="panel">
        <div class="panel-header">
          <h2 class="panel-title">Configured Hierarchy (${store.ranks.length} Levels)</h2>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th class="num">Level</th>
              <th>Rank Title</th>
              <th>Approval Authority</th>
              <th>Mapped Discord Role ID</th>
              <th class="num">Update</th>
            </tr>
          </thead>
          <tbody>
            ${store.ranks
              .map(
                r => `
                <tr>
                  <td class="num">${r.level}</td>
                  <td style="font-weight:600;">${esc(r.name)}</td>
                  <td>
                    ${
                      r.level >= 11
                        ? `<span class="pill pill-approved">DOJ & Internal Approver</span>`
                        : r.level >= 5
                        ? `<span class="pill pill-pending">Internal Approver (Corporal+)</span>`
                        : `<span class="pill pill-neutral">Issuing Officer</span>`
                    }
                  </td>
                  <td>
                    <input class="input mono" type="password" data-role-input="${r.id}" value="${esc(r.discord_role_id || "")}" placeholder="Link Discord Role" style="height:28px;font-size:12px;" />
                  </td>
                  <td class="num">
                    <button class="btn btn-secondary" data-save-rank="${r.id}" ${!caller.is_admin ? "disabled" : ""}>Save</button>
                  </td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>
      </section>

      <aside class="panel">
        <div class="panel-header">
          <h2 class="panel-title">Add / Customize Rank</h2>
        </div>
        <form id="rank-form">
          <div class="field-group">
            <label class="field-label">Rank Title</label>
            <input class="input" name="name" placeholder="Senior Lead Officer" required />
          </div>
          <div class="field-group">
            <label class="field-label">Numeric Authority Level</label>
            <input class="input mono" name="level" type="number" min="1" max="99" placeholder="5" required />
          </div>
          <div class="field-group">
            <label class="field-label">Discord Role ID</label>
            <input class="input mono" name="discord_role_id" placeholder="Optional Discord Role ID" />
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;" ${!caller.is_admin ? "disabled" : ""}>
            Save Rank Level
          </button>
        </form>
      </aside>
    </div>
  `;

  container.querySelectorAll("[data-save-rank]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-save-rank"));
      const rk = store.ranks.find(x => x.id === id);
      const roleInput = container.querySelector(`[data-role-input="${id}"]`);
      if (rk && roleInput) {
        saveRankLocal(id, rk.name, rk.level, roleInput.value.trim());
        renderApp();
      }
    });
  });

  document.getElementById("rank-form").addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    saveRankLocal(null, fd.get("name"), Number(fd.get("level")), fd.get("discord_role_id"));
    renderApp();
  });
}

// ─── View 6: Admin Template Editor ────────────────────────────────────────────

let editingTplCode = "SW";

function renderTemplatesAdmin(container) {
  const caller = getCurrentOfficer();
  const tpl = store.templates.find(t => t.code === editingTplCode) || store.templates[0];
  const sampleValues = {};
  tpl.fields.forEach(f => (sampleValues[f.key] = f.placeholder || ""));

  container.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">Document Templates Content Editor</h1>
        <p class="page-sub">Edit statutory text, placeholders, and rank thresholds while keeping the official US-Letter layout locked</p>
      </div>
      <div class="header-actions">
        <select id="admin-tpl-select" class="select" style="width:320px;">
          ${store.templates.map(t => `<option value="${esc(t.code)}" ${t.code === tpl.code ? "selected" : ""}>[${esc(t.code)}] ${esc(t.name)}</option>`).join("")}
        </select>
      </div>
    </div>

    <div class="composer-layout">
      <section class="panel">
        <form id="tpl-edit-form">
          <div class="field-group">
            <label class="field-label">Template Name</label>
            <input class="input" name="name" value="${esc(tpl.name)}" required />
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
            <div class="field-group">
              <label class="field-label">Series Category</label>
              <select class="select" name="category">
                <option value="doj" ${tpl.category === "doj" ? "selected" : ""}>DOJ Judicial</option>
                <option value="internal" ${tpl.category === "internal" ? "selected" : ""}>Internal UPD</option>
              </select>
            </div>
            <div class="field-group">
              <label class="field-label">Min Issue Lvl</label>
              <input class="input mono" type="number" name="min_issue_level" value="${tpl.min_issue_level}" required />
            </div>
            <div class="field-group">
              <label class="field-label">Min Approve Lvl</label>
              <input class="input mono" type="number" name="min_approve_level" value="${tpl.min_approve_level}" required />
            </div>
          </div>
          <div class="field-group">
            <label class="field-label">Court / Departmental Caption Banner</label>
            <textarea class="textarea" name="court_header" style="min-height:54px;">${esc(tpl.court_header)}</textarea>
          </div>
          <div class="field-group">
            <label class="field-label">Document Formal Heading</label>
            <textarea class="textarea" name="title" style="min-height:54px;">${esc(tpl.title)}</textarea>
          </div>
          <div class="field-group">
            <label class="field-label">
              <span>Standardized Body Template</span>
              <span class="field-hint mono">Placeholders: {issuer_name}, {issuer_badge}, ${tpl.fields.map(f => `{${f.key}}`).join(", ")}</span>
            </label>
            <textarea class="textarea mono" name="body" id="tpl-body-editor" style="min-height:240px;font-size:12.5px;">${esc(tpl.body)}</textarea>
          </div>
          <button type="submit" class="btn btn-primary" ${!caller.is_admin ? "disabled" : ""}>Save Template Version (v${(tpl.version || 1) + 1})</button>
        </form>
      </section>

      <aside class="sheet-stage">
        <div class="sheet-toolbar">
          <span><strong>Live Template Layout Preview</strong></span>
          <span class="mono">Version ${tpl.version || 1}</span>
        </div>
        <div id="tpl-live-preview">
          ${buildLiveSheetHtml(tpl, sampleValues)}
        </div>
      </aside>
    </div>
  `;

  document.getElementById("admin-tpl-select").addEventListener("change", e => {
    editingTplCode = e.target.value;
    renderTemplatesAdmin(container);
  });

  document.getElementById("tpl-body-editor").addEventListener("input", e => {
    const tempTpl = { ...tpl, body: e.target.value };
    document.getElementById("tpl-live-preview").innerHTML = buildLiveSheetHtml(tempTpl, sampleValues);
  });

  document.getElementById("tpl-edit-form").addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    saveTemplateLocal({
      ...tpl,
      name: fd.get("name"),
      category: fd.get("category"),
      min_issue_level: Number(fd.get("min_issue_level")),
      min_approve_level: Number(fd.get("min_approve_level")),
      court_header: fd.get("court_header"),
      title: fd.get("title"),
      body: fd.get("body")
    });
    renderApp();
  });
}

// ─── Main App Dispatcher ──────────────────────────────────────────────────────

export function renderApp() {
  const officer = getCurrentOfficer();
  if (!officer) {
    renderLoginScreen();
    return;
  }

  renderSidebar();
  const main = document.getElementById("main-canvas");
  const hash = window.location.hash || "#/";
  const routeBase = hash.split("?")[0];

  if (routeBase.startsWith("#/emitir")) {
    const code = routeBase.split("/")[2] || "SW";
    renderComposer(main, code);
  } else if (routeBase === "#/aprovacoes") {
    renderApprovals(main);
  } else if (routeBase === "#/oficiais") {
    renderOfficers(main);
  } else if (routeBase === "#/patentes") {
    renderRanks(main);
  } else if (routeBase === "#/modelos") {
    renderTemplatesAdmin(main);
  } else {
    renderOverview(main);
  }

  const lang = getLanguage();
  document.querySelectorAll(".btn-lang-toggle").forEach(btn => {
    btn.textContent = lang === "pt" ? "🇧🇷 PT" : "🇺🇸 EN";
    btn.onclick = () => {
      setLanguage(getLanguage() === "pt" ? "en" : "pt");
      renderApp();
    };
  });
}

window.addEventListener("hashchange", renderApp);
window.addEventListener("DOMContentLoaded", async () => {
  const menuBtn = document.getElementById("mobile-menu-btn");
  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      document.getElementById("sidebar-nav").classList.toggle("open");
    });
  }
  try {
    await handleDiscordOAuthCallbackIfPresent();
  } catch (err) {
    authErrorMessage = err.message;
  }
  renderApp();
});
