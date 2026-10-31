import { DOC_I18N, resolveTemplateForLang, getDocumentLanguage } from "./i18n.js?v=8";
import { getCurrentOfficer } from "./api.js?v=8";

export function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderFilledBodyHtml(bodyTemplate, vars) {
  return String(bodyTemplate || "").replace(/\{([a-zA-Z0-9_]+)\}/g, (_, k) => {
    const val = vars[k];
    return val !== undefined && val !== "" ? esc(val) : `[${esc(k)}]`;
  });
}

export function getSiteVerifyUrl(ctrl) {
  const code = (ctrl || "").trim().toUpperCase();
  const cfgUrl = window.UPD_CONFIG?.SITE_URL;
  let base = "";
  if (cfgUrl && typeof cfgUrl === "string" && cfgUrl.trim()) {
    base = cfgUrl.trim().replace(/\/+$/, "");
  } else if (typeof window !== "undefined" && window.location?.origin && window.location.origin !== "null") {
    const path = (window.location.pathname || "").replace(/\/[^/]*$/, "");
    base = `${window.location.origin}${path}`.replace(/\/+$/, "");
  } else {
    base = "https://guccilango.github.io/site-upd";
  }
  return `${base}/verify.html?n=${encodeURIComponent(code)}`;
}

export function buildLiveSheetHtml(template, fieldValues, docMeta = {}) {
  const officer = docMeta.issuer || getCurrentOfficer() || {
    rp_name: "Command Officer",
    badge: "101",
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
        <div style="height:28px;display:flex;align-items:center;justify-content:center;font-family:var(--font);font-size:11px;font-weight:700;color:#9e1b1b;">
          ${esc(chrome.sigAwaiting)}
        </div>
        <div class="sheet-sig-line"></div>
        <div class="sheet-sig-name">${esc(reqRankLabel)}</div>
        <div class="sheet-sig-meta">Unified Police Department</div>
      `;

  const verifyUrl = getSiteVerifyUrl(ctrl);
  const verifyLabel = docLang === "pt" ? "VERIFICAR NO REGISTRO:" : "VERIFY REGISTRY:";

  return `
    <div class="us-letter-sheet">
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
            <span>${esc(verifyLabel)} <a href="${esc(verifyUrl)}" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline;font-weight:600;">${esc(verifyUrl)}</a></span>
            <span>${esc(chrome.footerSensitive)}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}
