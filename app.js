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
  saveTemplateLocal,
  pullSharedStore,
  downloadDocumentPdf,
  ensureDocumentFivemanageUrl
} from "./api.js?v=8";
import {
  DOC_I18N,
  getLanguage,
  setLanguage,
  getDocumentLanguage,
  setDocumentLanguage,
  t,
  resolveTemplateForLang,
  mountLangSwitch
} from "./i18n.js?v=8";
import {
  buildLiveSheetHtml,
  renderFilledBodyHtml,
  esc,
  getSiteVerifyUrl
} from "./sheet-renderer.js?v=8";

let beforeLangChange = null;

function copyTextWithFeedback(text, btnEl) {
  if (!text) return;
  const doFeedback = () => {
    if (!btnEl) return;
    const orig = btnEl.innerHTML;
    btnEl.innerHTML = "Copiado";
    setTimeout(() => {
      btnEl.innerHTML = orig;
    }, 1800);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(doFeedback).catch(() => {
      window.prompt("Copie o link:", text);
    });
  } else {
    window.prompt("Copie o link:", text);
  }
}

export { buildLiveSheetHtml, renderFilledBodyHtml, esc, getSiteVerifyUrl };

function statusPill(status) {
  const s = (status || "PENDING").toUpperCase();
  if (s === "APPROVED") return `<span class="pill pill-approved">${esc(t("statusApproved"))}</span>`;
  if (s === "PENDING") return `<span class="pill pill-pending">${esc(t("statusPending"))}</span>`;
  if (s === "REJECTED") return `<span class="pill pill-rejected">${esc(t("statusRejected"))}</span>`;
  if (s === "REVOKED") return `<span class="pill pill-revoked">${esc(t("statusRevoked"))}</span>`;
  return `<span class="pill pill-neutral">${esc(s)}</span>`;
}

// ─── Login Screen (Mandatory Discord / Owner Auth) ────────────────────────────

let authErrorMessage = "";

function maskId(id) {
  const s = String(id || "");
  if (!s) return "-";
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
        <a class="btn btn-secondary" href="./verify.html">${esc(t("publicVerifier"))}</a>
      </div>
    </div>

    ${
      authErrorMessage
        ? `<div class="notice-bar" style="background:var(--pill-negative-bg);color:var(--pill-negative-ink);margin-bottom:20px;padding:10px 14px;border-radius:var(--radius-control);">
             <span>${esc(authErrorMessage)}</span>
           </div>`
        : ""
    }

    <div class="grid-asymmetric">
      <section class="panel">
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:20px;">
          <img src="./assets/opacidade2.png" alt="UPD Crest" style="width:52px;height:52px;object-fit:contain;" />
          <div>
            <h2 class="panel-title" style="font-size:17px;margin:0 0 4px;">${esc(t("loginAuthTitle"))}</h2>
            <div class="panel-sub" style="margin:0;">${esc(t("loginAuthSub"))}</div>
          </div>
        </div>

        <p style="margin:0 0 24px;color:var(--muted);font-size:13.5px;line-height:1.5;">
          ${esc(t("loginAuthDesc"))}
        </p>

        <a class="btn btn-primary" href="${esc(getDiscordOAuthUrl())}" style="width:100%;justify-content:center;height:38px;font-size:13.5px;font-weight:600;">
          ${esc(t("btnDiscordLogin"))}
        </a>
      </section>

      <aside class="panel">
        <div class="panel-header" style="margin-bottom:14px;">
          <div>
            <h2 class="panel-title">${esc(t("publicVerifier"))}</h2>
            <div class="panel-sub">${esc(t("qrSub"))}</div>
          </div>
        </div>

        <p style="margin:0 0 16px;color:var(--muted);font-size:13px;line-height:1.5;">
          ${lang === "pt"
            ? "A verificação pública autentica a validade de mandados e certidões emitidos pelo bureau através do número de controle oficial."
            : "Public verification validates warrants and certificates issued by the bureau using the official control number."}
        </p>

        <form action="./verify.html" method="GET" style="display:flex;gap:8px;margin-bottom:20px;">
          <input
            class="input mono"
            name="n"
            placeholder="${esc(t("qrPlaceholder"))}"
            style="flex:1;"
            required
          />
          <button class="btn btn-secondary" type="submit">${esc(t("btnVerify"))}</button>
        </form>

        <div style="border-top:1px solid var(--border);padding-top:16px;">
          <div style="font-size:12px;font-weight:600;color:var(--text);margin-bottom:8px;">
            ${lang === "pt" ? "Séries de Documentos" : "Document Series"}
          </div>
          <div style="display:flex;flex-direction:column;gap:6px;font-size:12px;color:var(--muted);">
            <div><strong>DOJ</strong> · SW, AW, CO, SO (${lang === "pt" ? "Processos Judiciais" : "Judicial Filings"})</div>
            <div><strong>UPD</strong> · FQ, CM (${lang === "pt" ? "Registros Internos" : "Internal Records"})</div>
          </div>
        </div>
      </aside>
    </div>

    <section class="panel" style="margin-top:20px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <h2 class="panel-title" style="font-size:14px;font-weight:600;margin:0;">
          ${lang === "pt" ? "Modelos Oficiais Registrados" : "Official Registered Templates"}
        </h2>
        <span class="mono" style="font-size:12px;color:var(--muted);">Los Santos · DOJ & UPD</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:10px;">
        <div style="padding:10px 12px;background:var(--raised);border:1px solid var(--border);border-radius:var(--radius-control);">
          <div style="font-weight:600;font-size:13px;display:flex;justify-content:space-between;">
            <span>[SW] ${lang === "pt" ? "Mandado de Busca" : "Search Warrant"}</span>
            <span class="mono" style="font-size:11px;color:var(--muted);">DOJ</span>
          </div>
          <div style="font-size:12px;color:var(--muted);margin-top:2px;">Commander+ (Lvl 11)</div>
        </div>
        <div style="padding:10px 12px;background:var(--raised);border:1px solid var(--border);border-radius:var(--radius-control);">
          <div style="font-weight:600;font-size:13px;display:flex;justify-content:space-between;">
            <span>[AW] ${lang === "pt" ? "Mandado de Prisão" : "Arrest Warrant"}</span>
            <span class="mono" style="font-size:11px;color:var(--muted);">DOJ</span>
          </div>
          <div style="font-size:12px;color:var(--muted);margin-top:2px;">Commander+ (Lvl 11)</div>
        </div>
        <div style="padding:10px 12px;background:var(--raised);border:1px solid var(--border);border-radius:var(--radius-control);">
          <div style="font-weight:600;font-size:13px;display:flex;justify-content:space-between;">
            <span>[CO] ${lang === "pt" ? "Quebra de Sigilo (2703(d))" : "Court Order (2703(d))"}</span>
            <span class="mono" style="font-size:11px;color:var(--muted);">DOJ</span>
          </div>
          <div style="font-size:12px;color:var(--muted);margin-top:2px;">Commander+ (Lvl 11)</div>
        </div>
        <div style="padding:10px 12px;background:var(--raised);border:1px solid var(--border);border-radius:var(--radius-control);">
          <div style="font-weight:600;font-size:13px;display:flex;justify-content:space-between;">
            <span>[SO] ${lang === "pt" ? "Operação Tática (SMEAC)" : "Tactical Operation (SMEAC)"}</span>
            <span class="mono" style="font-size:11px;color:var(--muted);">DOJ</span>
          </div>
          <div style="font-size:12px;color:var(--muted);margin-top:2px;">Commander+ (Lvl 11)</div>
        </div>
        <div style="padding:10px 12px;background:var(--raised);border:1px solid var(--border);border-radius:var(--radius-control);">
          <div style="font-weight:600;font-size:13px;display:flex;justify-content:space-between;">
            <span>[FQ] ${lang === "pt" ? "Certificado de Armamento" : "Firearms Qualification"}</span>
            <span class="mono" style="font-size:11px;color:var(--muted);">UPD</span>
          </div>
          <div style="font-size:12px;color:var(--muted);margin-top:2px;">Corporal+ (Lvl 5)</div>
        </div>
        <div style="padding:10px 12px;background:var(--raised);border:1px solid var(--border);border-radius:var(--radius-control);">
          <div style="font-weight:600;font-size:13px;display:flex;justify-content:space-between;">
            <span>[CM] ${lang === "pt" ? "Condecoração Oficial" : "Commendation"}</span>
            <span class="mono" style="font-size:11px;color:var(--muted);">UPD</span>
          </div>
          <div style="font-size:12px;color:var(--muted);margin-top:2px;">Corporal+ (Lvl 5)</div>
        </div>
      </div>
    </section>
  `;
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
              <span class="nav-count">${pendingOfficers > 0 ? `${pendingOfficers} pendentes` : store.officers.length}</span>
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
        <div class="officer-rank">${esc(officer.rank_name)} · Nível ${officer.rank_level}${officer.is_admin ? " · Admin" : ""}</div>
        <div class="officer-sig-preview">${esc(officer.rp_name)}</div>
      </div>
      <button class="btn btn-secondary" id="btn-logout" type="button" style="justify-content:center;">
        ${esc(t("signOut"))}
      </button>
    </div>
  `;

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
        <h1 class="page-title">${esc(t("brandTitle"))} · ${esc(t("ledgerTitle"))}</h1>
        <p class="page-sub">Unified Police Department · Los Santos</p>
      </div>
      <div class="header-actions" style="display:flex;align-items:center;gap:8px;">
        <a class="btn btn-secondary" href="./verify.html">${esc(t("verifyControlNo"))}</a>
        <button class="btn btn-primary" id="btn-new-filing">${esc(t("newDocument"))}</button>
      </div>
    </div>

    <section class="kpi-strip" aria-label="Key Registry Metrics">
      <div class="kpi-cell">
        <div class="kpi-label">${esc(t("kpiPendingLabel"))}</div>
        <div class="kpi-value accent-data">${pendingDocs.length}</div>
      </div>
      <div class="kpi-cell">
        <div class="kpi-label">${esc(t("kpiDojLabel"))}</div>
        <div class="kpi-value">${approvedDoj.length}</div>
      </div>
      <div class="kpi-cell">
        <div class="kpi-label">${esc(t("kpiInternalLabel"))}</div>
        <div class="kpi-value">${approvedInternal.length}</div>
      </div>
      <div class="kpi-cell">
        <div class="kpi-label">${esc(t("kpiOfficersLabel"))}</div>
        <div class="kpi-value">${activeOfficers.length} <span style="font-size:13px;color:var(--muted);font-weight:400;">/ ${store.officers.length}</span></div>
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
                 Nenhum documento encontrado neste filtro.
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
                          store.templates.find(tplItem => tplItem.code === d.template_code) || { code: d.template_code, name: d.template_name },
                          d.lang || "pt"
                        );
                        const docLangBadge = `<span class="pill pill-neutral" style="font-size:10px;padding:2px 6px;margin-left:6px;">${(d.lang || "pt").toUpperCase()}</span>`;
                        return `
                          <tr>
                            <td class="mono" style="font-weight:500;">
                              ${d.control_no ? `<a href="./verify.html?n=${encodeURIComponent(d.control_no)}" style="color:var(--text);text-decoration:underline;">${esc(d.control_no)}</a>` : `Draft #${d.id}`}
                            </td>
                            <td>
                              <div style="font-weight:500;display:flex;align-items:center;flex-wrap:wrap;gap:4px;">
                                <span>[${esc(d.template_code)}] ${esc(tplResolved.name || d.template_name)}</span>
                                ${docLangBadge}
                              </div>
                              <div style="font-size:12px;color:var(--muted);">
                                ${d.category === "doj" ? "DOJ (Commander+)" : "Interno (Corporal+)"} · ${esc(d.created_at.slice(0, 10))}
                              </div>
                            </td>
                            <td>
                              <div>${esc(d.issuer_rank)} ${esc(d.issuer_name)}</div>
                              <div class="mono" style="font-size:12px;color:var(--muted);">Distintivo #${esc(d.issuer_badge)}</div>
                            </td>
                            <td>
                              ${statusPill(d.status)}
                              ${d.approver_name ? `<div style="font-size:11px;color:var(--muted);margin-top:2px;">Assinado: ${esc(d.approver_rank)} ${esc(d.approver_name)}</div>` : ""}
                            </td>
                            <td class="num">
                              <div style="display:flex;gap:6px;justify-content:flex-end;flex-wrap:wrap;align-items:center;">
                                ${
                                  d.png_url
                                    ? `
                                      <button type="button" class="btn btn-secondary" data-copy-fm="${esc(d.png_url)}" title="${esc(d.png_url)}">
                                        ${lang === "pt" ? "Copiar Link" : "Copy Link"}
                                      </button>
                                      <a class="btn btn-secondary" href="${esc(d.png_url)}" target="_blank" rel="noopener" title="${esc(d.png_url)}">
                                        Fivemanage
                                      </a>
                                    `
                                    : d.status === "APPROVED"
                                      ? `
                                        <button type="button" class="btn btn-secondary" data-gen-fm="${d.id}">
                                          Fivemanage
                                        </button>
                                      `
                                      : ""
                                }
                                <button type="button" class="btn btn-secondary" data-inspect="${d.id}">${esc(t("btnViewDoc"))}</button>
                                ${canApp ? `<button type="button" class="btn btn-primary" data-quick-approve="${d.id}">${esc(t("btnApprove"))}</button>` : ""}
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
            <div class="panel-sub">${esc(t("templatesSub"))}</div>
          </div>
        </div>

        <div class="table-wrap">
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
                .filter(tplItem => tplItem.active)
                .map(tplItem => {
                  const allowed = canIssueTemplate(officer, tplItem);
                  const tplResolved = resolveTemplateForLang(tplItem, lang);
                  return `
                    <tr>
                      <td class="mono" style="font-weight:600;">${esc(tplItem.code)}</td>
                      <td>
                        <div style="font-weight:500;">${esc(tplResolved.name)}</div>
                        <div style="font-size:12px;color:var(--muted);">
                          ${tplItem.category === "doj" ? "DOJ · Assinatura: Commander+" : "Interno · Assinatura: Corporal+"}
                        </div>
                      </td>
                      <td class="num">
                        <button type="button" class="btn ${allowed ? "btn-secondary" : ""}" data-issue="${esc(tplItem.code)}" ${!allowed ? "disabled" : ""}>
                          ${esc(t("navIssue"))}
                        </button>
                      </td>
                    </tr>
                  `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
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
      const drw = container.querySelector("#inspect-drawer");
      if (drw) drw.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  container.querySelectorAll("[data-copy-fm]").forEach(btn => {
    btn.addEventListener("click", () => {
      copyTextWithFeedback(btn.getAttribute("data-copy-fm"), btn);
    });
  });

  container.querySelectorAll("[data-gen-fm]").forEach(btn => {
    const id = Number(btn.getAttribute("data-gen-fm"));
    ensureDocumentFivemanageUrl(id);
    btn.addEventListener("click", () => {
      btn.textContent = lang === "pt" ? "Enviando..." : "Uploading...";
      ensureDocumentFivemanageUrl(id);
    });
  });

  if (selectedInspectDocId) {
    renderInspectModal(container);
  }
}

function renderInspectModal(container) {
  const drawer = container.querySelector("#inspect-drawer");
  if (!drawer || !selectedInspectDocId) return;
  const doc = store.documents.find(d => Number(d.id) === Number(selectedInspectDocId));
  if (!doc) return;
  const tpl = store.templates.find(tplItem => tplItem.code === doc.template_code) || store.templates[0];
  const officer = getCurrentOfficer();
  const canApp = doc.status === "PENDING" && canApproveDocument(officer, doc);
  const lang = getLanguage();

  if (doc.status === "APPROVED" && (!doc.png_url || !String(doc.png_url).includes("fivemanage.com"))) {
    ensureDocumentFivemanageUrl(doc);
  }

  drawer.innerHTML = `
    <section class="panel inspect-sheet-panel" style="margin-top:8px;">
      <div class="panel-header no-print" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
        <div>
          <h2 class="panel-title">${lang === "pt" ? "Visualização do Documento" : "Document Inspection"} · ${esc(doc.control_no || `Draft #${doc.id}`)}</h2>
          <div class="panel-sub">
            ${esc(doc.issuer_rank)} ${esc(doc.issuer_name)} (Distintivo #${esc(doc.issuer_badge)})
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${canApp ? `<button type="button" class="btn btn-primary" id="btn-modal-approve">${esc(t("btnApprove"))}</button>` : ""}
          ${canApp ? `<button type="button" class="btn btn-danger" id="btn-modal-reject">${esc(t("btnReject"))}</button>` : ""}
          <button type="button" class="btn btn-primary" id="btn-modal-pdf">${lang === "pt" ? "Salvar PDF" : "Save PDF"}</button>
          <button type="button" class="btn btn-secondary" id="btn-modal-print">${lang === "pt" ? "Imprimir" : "Print"}</button>
          ${doc.status === "APPROVED" && officer.is_admin ? `<button type="button" class="btn btn-danger" id="btn-modal-revoke">${esc(t("btnRevoke"))}</button>` : ""}
          <button type="button" class="btn btn-secondary" id="btn-close-inspect">${lang === "pt" ? "Fechar" : "Close"}</button>
        </div>
      </div>

      ${
        doc.png_url
          ? `
            <div class="fvm-link-bar no-print" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:10px 14px;margin-bottom:16px;background:var(--raised);border:1px solid var(--border);border-radius:var(--radius-control);">
              <strong style="font-size:12.5px;white-space:nowrap;">${lang === "pt" ? "Link da imagem:" : "Image URL:"}</strong>
              <input
                type="text"
                class="input mono"
                id="fvm-url-input"
                readonly
                value="${esc(doc.png_url)}"
                style="flex:1;min-width:220px;height:30px;font-size:12.5px;background:var(--surface);"
              />
              <button type="button" class="btn btn-secondary" id="btn-copy-fm-modal">
                ${lang === "pt" ? "Copiar Link" : "Copy Link"}
              </button>
              <a class="btn btn-secondary" href="${esc(doc.png_url)}" target="_blank" rel="noopener">
                ${lang === "pt" ? "Abrir Imagem" : "Open Image"}
              </a>
            </div>
          `
          : doc.status === "APPROVED"
            ? `
              <div class="fvm-link-bar no-print" style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 14px;margin-bottom:16px;background:var(--raised);border:1px solid var(--border);border-radius:var(--radius-control);font-size:12.5px;color:var(--muted);">
                <span>${lang === "pt" ? "Enviando imagem ao Fivemanage..." : "Uploading image to Fivemanage..."}</span>
              </div>
            `
            : ""
      }

      <div class="printable-sheet-wrap" style="max-width:780px;margin:0 auto;">
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

  const fmInput = drawer.querySelector("#fvm-url-input");
  if (fmInput) {
    fmInput.addEventListener("click", () => fmInput.select());
  }

  const copyFmBtn = drawer.querySelector("#btn-copy-fm-modal");
  if (copyFmBtn) {
    copyFmBtn.addEventListener("click", () => {
      copyTextWithFeedback(doc.png_url, copyFmBtn);
    });
  }

  const pdfBtn = drawer.querySelector("#btn-modal-pdf");
  if (pdfBtn) {
    pdfBtn.addEventListener("click", async () => {
      const origText = pdfBtn.innerHTML;
      pdfBtn.disabled = true;
      pdfBtn.innerHTML = lang === "pt" ? "Gerando..." : "Generating...";
      try {
        await downloadDocumentPdf(doc);
      } catch (err) {
        console.error("PDF generation error:", err);
        alert(lang === "pt" ? `Erro ao gerar PDF: ${err.message}` : `Error generating PDF: ${err.message}`);
      } finally {
        pdfBtn.disabled = false;
        pdfBtn.innerHTML = origText;
      }
    });
  }

  const printBtn = drawer.querySelector("#btn-modal-print");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }

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

  const rejBtn = drawer.querySelector("#btn-modal-reject");
  if (rejBtn) {
    rejBtn.addEventListener("click", () => {
      const reason = prompt(lang === "pt" ? "Justificativa da rejeição:" : "Rejection reason:", lang === "pt" ? "Causa provável insuficiente." : "Insufficient probable cause narrative.");
      if (!reason) return;
      try {
        rejectDocumentLocal(doc.id, reason);
        renderApp();
      } catch (e) {
        alert(e.message);
      }
    });
  }

  const revBtn = drawer.querySelector("#btn-modal-revoke");
  if (revBtn) {
    revBtn.addEventListener("click", () => {
      const reason = prompt(lang === "pt" ? "Motivo oficial de revogação:" : "Official reason for revocation:", "Revogação administrativa");
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

  const hashParts = (window.location.hash || "").split("?");
  if (hashParts[1]) {
    const p = new URLSearchParams(hashParts[1]);
    const requested = p.get("lang");
    if (requested === "pt" || requested === "en") {
      setDocumentLanguage(requested);
    }
  }

  const docLang = getDocumentLanguage();
  const rawTpl = store.templates.find(tplItem => tplItem.code === (codeParam || "SW").toUpperCase()) || store.templates[0];
  const tpl = resolveTemplateForLang(rawTpl, docLang);
  
  const fieldValues = { _lang: docLang, ...(savedValues || {}) };
  tpl.fields.forEach(f => {
    if (fieldValues[f.key] === undefined) {
      fieldValues[f.key] = "";
    }
  });

  const lang = getLanguage();
  const canSelfApproveThis = canApproveDocument(officer, {
    issuer_id: officer.id,
    min_approve_level: rawTpl.min_approve_level,
    category: rawTpl.category,
    status: "PENDING"
  });

  container.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">${esc(t("composerTitle"))} · [${esc(tpl.code)}]</h1>
        <p class="page-sub">
          ${esc(tpl.name)} · ${esc(t("fieldAuthorityNotice", {
            minIssue: tpl.min_issue_level,
            minApprove: tpl.category === "doj" ? 11 : 5
          }))}
        </p>
      </div>
      <div class="header-actions" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
        <select id="tpl-picker" class="select" style="width:280px;">
          ${store.templates
            .filter(tplItem => tplItem.active)
            .map(tplItem => {
              const res = resolveTemplateForLang(tplItem, docLang);
              return `<option value="${esc(tplItem.code)}" ${tplItem.code === tpl.code ? "selected" : ""}>[${esc(tplItem.code)}] ${esc(res.name)}</option>`;
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
            <div class="panel-sub">${esc(officer.rank_name)} ${esc(officer.rp_name)} (Distintivo #${esc(officer.badge)})</div>
          </div>
        </div>

        <div class="doc-emission-lang-box" style="margin-bottom:18px;padding:12px 16px;background:var(--raised);border:1px solid var(--border);border-radius:var(--radius-card);">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
            <div style="font-weight:600;font-size:13px;color:var(--text);">
              ${esc(t("docEmissionLangLabel"))}
            </div>
            <div class="btn-group" role="group" aria-label="Document Language" style="display:inline-flex;gap:6px;">
              <button type="button" class="btn ${docLang === 'pt' ? 'btn-primary' : 'btn-secondary'} btn-doc-lang-choice" data-doc-lang="pt" style="font-weight:600;">
                ${esc(t("btnDocLangPt"))}
              </button>
              <button type="button" class="btn ${docLang === 'en' ? 'btn-primary' : 'btn-secondary'} btn-doc-lang-choice" data-doc-lang="en" style="font-weight:600;">
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

          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;padding-top:12px;border-top:1px solid var(--border);">
            <span style="font-size:12px;color:var(--muted);">
              Canal de registro: #emitir-docs · Sincronizado
            </span>
            <div style="display:flex;flex-wrap:wrap;gap:8px;">
              ${
                canSelfApproveThis
                  ? `
                    <button type="button" id="btn-submit-draft-only" class="btn btn-secondary">${esc(t("btnSubmitDraft"))}</button>
                    <button type="submit" id="btn-issue-and-approve" class="btn btn-primary">${lang === "pt" ? "Emitir e Aprovar" : "Issue & Approve"}</button>
                  `
                  : `<button type="submit" class="btn btn-primary">${esc(t("btnSubmitDraft"))}</button>`
              }
            </div>
          </div>
        </form>
      </section>

      <aside class="sheet-stage">
        <div class="sheet-toolbar">
          <span><strong>${esc(t("liveStageTitle"))}</strong> · ${esc(t("liveStageSub"))}</span>
          <span class="mono">${docLang.toUpperCase()}</span>
        </div>
        <div id="live-sheet-holder">
          ${buildLiveSheetHtml(rawTpl, fieldValues, { lang: docLang })}
        </div>
      </aside>
    </div>
  `;

  beforeLangChange = () => {
    container.querySelectorAll("[data-key]").forEach(inp => {
      fieldValues[inp.getAttribute("data-key")] = inp.value;
    });
  };

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
      container.querySelectorAll("[data-key]").forEach(inp => {
        fieldValues[inp.getAttribute("data-key")] = inp.value;
      });
      fieldValues._lang = docLang;
      const created = createDraftLocal(tpl.code, fieldValues);
      if (canSelfApproveThis) {
        const approved = approveDocumentLocal(created.id);
        selectedInspectDocId = approved.id;
        window.location.hash = "#/";
      } else {
        selectedInspectDocId = created.id;
        window.location.hash = "#/aprovacoes";
      }
    } catch (err) {
      alert(err.message);
    }
  });

  const draftOnlyBtn = document.getElementById("btn-submit-draft-only");
  if (draftOnlyBtn) {
    draftOnlyBtn.addEventListener("click", () => {
      const form = document.getElementById("composer-form");
      if (form && !form.reportValidity()) return;
      try {
        container.querySelectorAll("[data-key]").forEach(inp => {
          fieldValues[inp.getAttribute("data-key")] = inp.value;
        });
        fieldValues._lang = docLang;
        const created = createDraftLocal(tpl.code, fieldValues);
        selectedInspectDocId = created.id;
        window.location.hash = "#/aprovacoes";
      } catch (err) {
        alert(err.message);
      }
    });
  }
}

// ─── View 3: Command Approvals Queue ──────────────────────────────────────────

function renderApprovals(container) {
  const officer = getCurrentOfficer();
  const pending = store.documents.filter(d => d.status === "PENDING");
  const activeDoc = pending.find(d => Number(d.id) === Number(selectedInspectDocId)) || pending[0] || null;
  const lang = getLanguage();

  container.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">${esc(t("approvalsTitle"))}</h1>
        <p class="page-sub">
          ${esc(t("approvalsSub"))}
        </p>
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
            <div style="display:flex;flex-direction:column;gap:12px;">
              ${pending
                .map(d => {
                  const allowed = canApproveDocument(officer, d);
                  const isSelf = Number(officer.id) === Number(d.issuer_id);
                  const isSelected = activeDoc && Number(d.id) === Number(activeDoc.id);
                  const docLangBadge = `<span class="pill pill-neutral" style="font-size:10px;padding:2px 6px;">${(d.lang || "pt").toUpperCase()}</span>`;
                  const tplRes = resolveTemplateForLang(
                    store.templates.find(tplItem => tplItem.code === d.template_code) || { code: d.template_code, name: d.template_name },
                    d.lang || "pt"
                  );
                  return `
                    <div style="padding:14px;border:1px solid ${isSelected ? "var(--text)" : "var(--border)"};border-radius:var(--radius-card);background:${isSelected ? "var(--raised)" : "var(--surface)"};display:flex;flex-direction:column;gap:10px;">
                      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;">
                        <div>
                          <div style="font-weight:600;font-size:14px;display:flex;align-items:center;flex-wrap:wrap;gap:6px;">
                            <span>#${d.id} · [${esc(d.template_code)}] ${esc(tplRes.name || d.template_name)}</span>
                            ${docLangBadge}
                          </div>
                          <div style="font-size:12px;color:var(--muted);margin-top:4px;">
                            ${esc(t("colIssuer"))}: <strong>${esc(d.issuer_rank)} ${esc(d.issuer_name)}</strong> <span class="mono">(Distintivo #${esc(d.issuer_badge)})</span>
                          </div>
                        </div>
                        <span class="pill pill-neutral">${d.category === "doj" ? "Commander+" : "Corporal+"}</span>
                      </div>

                      <div style="display:flex;flex-wrap:wrap;gap:8px;padding-top:8px;border-top:1px solid var(--rule);">
                        <button type="button" class="btn btn-primary" data-approve-id="${d.id}" ${!allowed ? "disabled" : ""} title="${!allowed && isSelf ? "Autoaprovação restrita ao High Command" : ""}">
                          ${esc(t("btnApprove"))}
                        </button>
                        <button type="button" class="btn btn-danger" data-reject-id="${d.id}" ${!allowed ? "disabled" : ""}>
                          ${esc(t("btnReject"))}
                        </button>
                        <button type="button" class="btn btn-secondary" data-select-pending="${d.id}">
                          ${esc(t("btnViewDoc"))}
                        </button>
                      </div>
                    </div>
                  `;
                })
                .join("")}
            </div>
          </section>

          <aside class="sheet-stage">
            ${
              activeDoc
                ? `
                  <div class="sheet-toolbar" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
                    <div>
                      <strong>Draft #${activeDoc.id} (${esc(activeDoc.template_code)})</strong>
                      <span class="mono" style="margin-left:8px;">${esc(activeDoc.issuer_name)} (#${esc(activeDoc.issuer_badge)})</span>
                    </div>
                    <div style="display:flex;flex-wrap:wrap;gap:8px;">
                      <button type="button" class="btn btn-secondary" id="btn-approval-pdf">
                        ${lang === "pt" ? "Salvar PDF" : "Save PDF"}
                      </button>
                      <button type="button" class="btn btn-primary" data-approve-id="${activeDoc.id}" ${!canApproveDocument(officer, activeDoc) ? "disabled" : ""}>
                        ${esc(t("btnApprove"))}
                      </button>
                      <button type="button" class="btn btn-danger" data-reject-id="${activeDoc.id}" ${!canApproveDocument(officer, activeDoc) ? "disabled" : ""}>
                        ${esc(t("btnReject"))}
                      </button>
                    </div>
                  </div>
                  ${buildLiveSheetHtml(
                    store.templates.find(tplItem => tplItem.code === activeDoc.template_code) || store.templates[0],
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

  const appPdfBtn = container.querySelector("#btn-approval-pdf");
  if (appPdfBtn && activeDoc) {
    appPdfBtn.addEventListener("click", async () => {
      const origText = appPdfBtn.innerHTML;
      appPdfBtn.disabled = true;
      appPdfBtn.innerHTML = lang === "pt" ? "Gerando..." : "Generating...";
      try {
        await downloadDocumentPdf(activeDoc);
      } catch (err) {
        console.error("PDF generation error:", err);
        alert(lang === "pt" ? `Erro ao gerar PDF: ${err.message}` : `Error generating PDF: ${err.message}`);
      } finally {
        appPdfBtn.disabled = false;
        appPdfBtn.innerHTML = origText;
      }
    });
  }

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
        if (window.location.hash === "#/") {
          renderApp();
        } else {
          window.location.hash = "#/";
        }
      } catch (e) {
        alert(e.message);
      }
    });
  });

  container.querySelectorAll("[data-reject-id]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.getAttribute("data-reject-id"));
      const reason = prompt(
        lang === "pt" ? "Justificativa da rejeição:" : "Rejection reason:",
        lang === "pt" ? "Causa provável insuficiente." : "Insufficient probable cause narrative."
      );
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
        <h1 class="page-title">${esc(t("officersTitle"))}</h1>
        <p class="page-sub">${esc(t("officersSub"))}</p>
      </div>
    </div>

    <div class="grid-asymmetric">
      <section class="panel">
        <div class="panel-header">
          <h2 class="panel-title">${esc(t("officersTitle"))} (${store.officers.length})</h2>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>${esc(t("colOfficerName"))}</th>
                <th>${esc(t("colRank"))}</th>
                <th>${esc(t("colSig"))}</th>
                <th>${esc(t("colStatus"))}</th>
                <th class="num">${esc(t("colActions"))}</th>
              </tr>
            </thead>
            <tbody>
              ${store.officers
                .map(
                  o => `
                  <tr>
                    <td>
                      <div style="font-weight:600;">${esc(o.rp_name)} ${o.is_admin ? `<span class="pill pill-neutral" style="margin-left:4px;">Admin</span>` : ""}</div>
                      <div class="mono" style="font-size:12px;color:var(--muted);">Distintivo #${esc(o.badge)} · Discord ${esc(maskId(o.discord_id))}</div>
                    </td>
                    <td>${esc(o.rank_name)} (Nível ${o.rank_level})</td>
                    <td><span style="font-family:var(--font-sig);font-size:22px;color:var(--pen);">${esc(o.rp_name)}</span></td>
                    <td>
                      <span class="pill ${o.status === "active" ? "pill-approved" : o.status === "pending" ? "pill-pending" : "pill-rejected"}">
                        ${esc(o.status)}
                      </span>
                    </td>
                    <td class="num">
                      ${
                        o.status !== "active"
                          ? `<button class="btn btn-primary" data-admit="${esc(o.discord_id)}" ${!caller.is_admin ? "disabled" : ""}>${esc(t("btnAdmit"))}</button>`
                          : `<button class="btn btn-secondary" data-suspend="${esc(o.discord_id)}" ${!caller.is_admin ? "disabled" : ""}>${esc(t("btnSuspend"))}</button>`
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
          <h2 class="panel-title">${esc(t("panelAddOfficer"))}</h2>
        </div>
        <form id="officer-form">
          <div class="field-group">
            <label class="field-label">Discord ID</label>
            <input class="input mono" name="discord_id" placeholder="Snowflake ID" required />
          </div>
          <div class="field-group">
            <label class="field-label">${esc(t("recoverySigLabel"))}</label>
            <input class="input" name="rp_name" placeholder="Nome Completo" required />
          </div>
          <div class="field-group">
            <label class="field-label">${esc(t("recoveryBadgeLabel"))}</label>
            <input class="input mono" name="badge" placeholder="101" required />
          </div>
          <div class="field-group">
            <label class="field-label">Divisão</label>
            <input class="input" name="division" value="Patrol Division" required />
          </div>
          <div class="field-group">
            <label class="field-label">Patente</label>
            <select class="select" name="rank_id">
              ${store.ranks.map(r => `<option value="${r.id}">[Nível ${r.level}] ${esc(r.name)}</option>`).join("")}
            </select>
          </div>
          <div class="field-group">
            <label style="display:flex;align-items:center;gap:8px;font-size:13px;">
              <input type="checkbox" name="is_admin" /> Conceder permissão de Administrador
            </label>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;" ${!caller.is_admin ? "disabled" : ""}>
            Salvar Oficial
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
        <h1 class="page-title">${esc(t("ranksTitle"))}</h1>
        <p class="page-sub">${esc(t("ranksSub"))}</p>
      </div>
    </div>

    <div class="grid-asymmetric">
      <section class="panel">
        <div class="panel-header">
          <h2 class="panel-title">Patentes (${store.ranks.length})</h2>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th class="num">${esc(t("colLevel"))}</th>
              <th>${esc(t("colRankTitle"))}</th>
              <th>${esc(t("colAuthority"))}</th>
              <th>${esc(t("colRoleInput"))}</th>
              <th class="num">${esc(t("btnSave"))}</th>
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
                        ? `<span class="pill pill-approved">DOJ e Interno</span>`
                        : r.level >= 5
                        ? `<span class="pill pill-pending">Interno (Corporal+)</span>`
                        : `<span class="pill pill-neutral">Emissor</span>`
                    }
                  </td>
                  <td>
                    <input class="input mono" type="password" data-role-input="${r.id}" value="${esc(r.discord_role_id || "")}" placeholder="Role ID" style="height:28px;font-size:12px;" />
                  </td>
                  <td class="num">
                    <button class="btn btn-secondary" data-save-rank="${r.id}" ${!caller.is_admin ? "disabled" : ""}>${esc(t("btnSave"))}</button>
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
          <h2 class="panel-title">${esc(t("panelAddRank"))}</h2>
        </div>
        <form id="rank-form">
          <div class="field-group">
            <label class="field-label">${esc(t("colRankTitle"))}</label>
            <input class="input" name="name" placeholder="Título da patente" required />
          </div>
          <div class="field-group">
            <label class="field-label">${esc(t("colLevel"))}</label>
            <input class="input mono" name="level" type="number" min="1" max="99" placeholder="5" required />
          </div>
          <div class="field-group">
            <label class="field-label">${esc(t("colRoleInput"))}</label>
            <input class="input mono" name="discord_role_id" placeholder="ID opcional do cargo" />
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;" ${!caller.is_admin ? "disabled" : ""}>
            Salvar Patente
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
  const tpl = store.templates.find(tplItem => tplItem.code === editingTplCode) || store.templates[0];
  const sampleValues = {};
  tpl.fields.forEach(f => (sampleValues[f.key] = f.placeholder || ""));

  container.innerHTML = `
    <div class="page-header">
      <div>
        <h1 class="page-title">${esc(t("templatesTitle"))}</h1>
        <p class="page-sub">${esc(t("templatesSub"))}</p>
      </div>
      <div class="header-actions">
        <select id="admin-tpl-select" class="select" style="width:320px;">
          ${store.templates.map(tplItem => `<option value="${esc(tplItem.code)}" ${tplItem.code === tpl.code ? "selected" : ""}>[${esc(tplItem.code)}] ${esc(tplItem.name)}</option>`).join("")}
        </select>
      </div>
    </div>

    <div class="composer-layout">
      <section class="panel">
        <form id="tpl-edit-form">
          <div class="field-group">
            <label class="field-label">Nome do Modelo</label>
            <input class="input" name="name" value="${esc(tpl.name)}" required />
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;">
            <div class="field-group">
              <label class="field-label">Categoria</label>
              <select class="select" name="category">
                <option value="doj" ${tpl.category === "doj" ? "selected" : ""}>DOJ Judicial</option>
                <option value="internal" ${tpl.category === "internal" ? "selected" : ""}>Interno UPD</option>
              </select>
            </div>
            <div class="field-group">
              <label class="field-label">Nível Mínimo Emissão</label>
              <input class="input mono" type="number" name="min_issue_level" value="${tpl.min_issue_level}" required />
            </div>
            <div class="field-group">
              <label class="field-label">Nível Mínimo Assinatura</label>
              <input class="input mono" type="number" name="min_approve_level" value="${tpl.min_approve_level}" required />
            </div>
          </div>
          <div class="field-group">
            <label class="field-label">Cabeçalho de Tribunal</label>
            <textarea class="textarea" name="court_header" style="min-height:54px;">${esc(tpl.court_header)}</textarea>
          </div>
          <div class="field-group">
            <label class="field-label">Título Formal do Documento</label>
            <textarea class="textarea" name="title" style="min-height:54px;">${esc(tpl.title)}</textarea>
          </div>
          <div class="field-group">
            <label class="field-label">
              <span>Texto Padrão do Documento</span>
              <span class="field-hint mono">{issuer_name}, {issuer_badge}, ${tpl.fields.map(f => `{${f.key}}`).join(", ")}</span>
            </label>
            <textarea class="textarea mono" name="body" id="tpl-body-editor" style="min-height:240px;font-size:12.5px;">${esc(tpl.body)}</textarea>
          </div>
          <button type="submit" class="btn btn-primary" ${!caller.is_admin ? "disabled" : ""}>Salvar Modelo</button>
        </form>
      </section>

      <aside class="sheet-stage">
        <div class="sheet-toolbar">
          <span><strong>Pré-visualização do Modelo</strong></span>
          <span class="mono">v${tpl.version || 1}</span>
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
  beforeLangChange = null;
  mountLangSwitch(() => {
    beforeLangChange?.();
    renderApp();
  });

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
}

window.addEventListener("hashchange", renderApp);
window.addEventListener("upd:store-updated", e => {
  const src = e.detail?.source;
  if (src !== "cloud" && src !== "tab" && src !== "async-upload") return;
  if (!getCurrentOfficer()) return;

  const activeEl = document.activeElement;
  const isTyping =
    activeEl &&
    (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || activeEl.tagName === "SELECT");
  const routeBase = (window.location.hash || "#/").split("?")[0];

  if (isTyping || routeBase.startsWith("#/emitir") || routeBase === "#/modelos") {
    renderSidebar();
  } else {
    renderApp();
  }
});

window.addEventListener("DOMContentLoaded", async () => {
  const menuBtn = document.getElementById("mobile-menu-btn");
  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      document.getElementById("sidebar-nav").classList.toggle("open");
    });
  }
  try {
    await pullSharedStore(true);
    await handleDiscordOAuthCallbackIfPresent();
  } catch (err) {
    authErrorMessage = err.message;
  }
  renderApp();
});
