// UPD Records Bureau — Internationalization (i18n) Engine (PT-BR & EN)

export const UI_I18N = {
  pt: {
    langName: "Português",
    altLangName: "English",
    brandTitle: "UPD Records Bureau",
    brandSub: "Divisão de Registros",
    restrictedPortal: "Acesso restrito",
    publicVerifier: "Consulta Pública",
    verifyControlNo: "Consultar Registro",
    newDocument: "Novo Documento",
    deptNotice: "Unified Police Department",

    // Login screen
    loginTitle: "Portal de Registros",
    loginSub: "Sistema oficial de emissão e registro de documentos.",
    loginAuthTitle: "Identificação",
    loginAuthSub: "Acesso restrito a oficiais autorizados.",
    loginAuthDesc: "Conecte sua conta do Discord para acessar o painel de emissão e assinaturas.",
    btnDiscordLogin: "Entrar com Discord",
    authorizedStaff: "Oficiais autorizados",
    recoveryLoginBtn: "Acesso alternativo",
    hideRecoveryBtn: "Ocultar",
    recoveryCredLabel: "ID do Discord",
    recoveryCredPlaceholder: "ID numérico",
    recoverySigLabel: "Nome do oficial",
    recoveryBadgeLabel: "Distintivo",
    recoveryKeyLabel: "Chave de acesso",
    recoveryKeyPlaceholder: "Chave de acesso",
    recoverySubmitBtn: "Entrar",

    // Navigation
    navOperations: "Documentos",
    navOverview: "Registros",
    navIssue: "Novo Documento",
    navApprovals: "Aprovações",
    navAdmin: "Administração",
    navOfficers: "Oficiais",
    navRanks: "Patentes",
    navTemplates: "Modelos",
    signOut: "Sair",

    // Overview KPIs & Table
    kpiPendingLabel: "Pendentes",
    kpiPendingCap: "Aguardando assinatura",
    kpiDojLabel: "Processos judiciais",
    kpiDojCap: "Aprovados pelo comando",
    kpiInternalLabel: "Registros internos",
    kpiInternalCap: "Aprovados",
    kpiOfficersLabel: "Oficiais ativos",
    kpiOfficersCap: "{total} cadastrados",
    ledgerTitle: "Documentos Emitidos",
    filterAll: "Todos ({count})",
    filterPending: "Pendentes ({count})",
    filterApproved: "Aprovados ({count})",
    filterMine: "Meus ({count})",
    colControlNo: "Nº de Controle",
    colTemplate: "Tipo",
    colIssuer: "Emissor",
    colStatus: "Status",
    colApproval: "Competência",
    colActions: "Ações",
    btnViewDoc: "Visualizar",
    btnPdf: "PDF",
    btnPng: "Imagem",

    // Status Pills
    statusApproved: "Aprovado",
    statusPending: "Pendente",
    statusRejected: "Rejeitado",
    statusRevoked: "Revogado",

    // Composer
    composerTitle: "Emissão de Documento",
    composerSub: "Preencha os campos para emissão oficial.",
    docLangLabel: "Idioma",
    docLangPt: "Português",
    docLangEn: "English",
    docEmissionLangLabel: "Idioma do Documento",
    docEmissionLangHelp: "",
    btnDocLangPt: "Português",
    btnDocLangEn: "English",
    siteLangNotice: "Idioma da interface",
    templatePickerLabel: "Modelo",
    fieldAuthorityNotice: "Emissão: Nível {minIssue} · Assinatura: Nível {minApprove}+",
    btnSubmitDraft: "Enviar para aprovação",
    liveStageTitle: "Documento oficial",
    liveStageSub: "Pré-visualização em tempo real",

    // Approvals View
    approvalsTitle: "Aprovações Pendentes",
    approvalsSub: "Minutas aguardando revisão e assinatura de autoridade de comando.",
    btnApprove: "Aprovar",
    btnReject: "Rejeitar",
    btnRevoke: "Revogar",
    noPendingDocs: "Nenhum documento aguardando assinatura.",

    // Officers View
    officersTitle: "Quadro de Oficiais",
    officersSub: "Oficiais com permissão de emissão e assinatura.",
    colOfficerName: "Oficial",
    colRank: "Patente",
    colSig: "Assinatura",
    btnAdmit: "Admitir",
    btnSuspend: "Suspender",
    panelAddOfficer: "Cadastrar Oficial",

    // Ranks View
    ranksTitle: "Hierarquia de Patentes",
    ranksSub: "Nível 5+ assina registros internos. Nível 11+ assina processos judiciais.",
    colLevel: "Nível",
    colRankTitle: "Patente",
    colAuthority: "Autoridade",
    colRoleInput: "ID do Cargo (Discord)",
    btnSave: "Salvar",
    panelAddRank: "Nova Patente",

    // Templates View
    templatesTitle: "Modelos de Documento",
    templatesSub: "Configuração dos modelos do sistema.",
    btnSaveTemplate: "Salvar Modelo",

    // QR Verifier
    qrTitle: "Consulta de Autenticidade",
    qrSub: "Unified Police Department · Validação de documentos oficiais",
    qrPlaceholder: "Nº de Controle (ex: UPD-SW-2026-0001)",
    btnVerify: "Consultar",
    backToPortal: "Voltar ao Portal",
    verifiedValid: "VÁLIDO",
    recordNotFound: "Registro Não Localizado",
    notFoundDesc: "Nenhum registro oficial encontrado para o número de controle {code}."
  },
  en: {
    langName: "English",
    altLangName: "Português",
    brandTitle: "UPD Records Bureau",
    brandSub: "Records Division",
    restrictedPortal: "Restricted Access",
    publicVerifier: "Public Verification",
    verifyControlNo: "Verify Control No.",
    newDocument: "New Document",
    deptNotice: "Unified Police Department",

    // Login screen
    loginTitle: "Records Portal",
    loginSub: "Official records and document management system.",
    loginAuthTitle: "Authentication",
    loginAuthSub: "Restricted to authorized personnel.",
    loginAuthDesc: "Sign in with your Discord account to access the portal.",
    btnDiscordLogin: "Sign in with Discord",
    authorizedStaff: "Authorized Personnel",
    recoveryLoginBtn: "Alternative Login",
    hideRecoveryBtn: "Hide",
    recoveryCredLabel: "Discord ID",
    recoveryCredPlaceholder: "Numeric ID",
    recoverySigLabel: "Officer Name",
    recoveryBadgeLabel: "Badge",
    recoveryKeyLabel: "Access Key",
    recoveryKeyPlaceholder: "Access key",
    recoverySubmitBtn: "Sign in",

    // Navigation
    navOperations: "Documents",
    navOverview: "Ledger",
    navIssue: "New Document",
    navApprovals: "Approvals",
    navAdmin: "Administration",
    navOfficers: "Officers",
    navRanks: "Ranks",
    navTemplates: "Templates",
    signOut: "Sign Out",

    // Overview KPIs & Table
    kpiPendingLabel: "Pending",
    kpiPendingCap: "Awaiting signature",
    kpiDojLabel: "Judicial Filings",
    kpiDojCap: "Approved",
    kpiInternalLabel: "Internal Records",
    kpiInternalCap: "Approved",
    kpiOfficersLabel: "Active Officers",
    kpiOfficersCap: "{total} registered",
    ledgerTitle: "Issued Documents",
    filterAll: "All ({count})",
    filterPending: "Pending ({count})",
    filterApproved: "Approved ({count})",
    filterMine: "Mine ({count})",
    colControlNo: "Control No.",
    colTemplate: "Type",
    colIssuer: "Issuer",
    colStatus: "Status",
    colApproval: "Authority",
    colActions: "Actions",
    btnViewDoc: "View",
    btnPdf: "PDF",
    btnPng: "Image",

    // Status Pills
    statusApproved: "Approved",
    statusPending: "Pending",
    statusRejected: "Rejected",
    statusRevoked: "Revoked",

    // Composer
    composerTitle: "Issue Document",
    composerSub: "Complete the fields to submit for approval.",
    docLangLabel: "Language",
    docLangPt: "Português",
    docLangEn: "English",
    docEmissionLangLabel: "Document Language",
    docEmissionLangHelp: "",
    btnDocLangPt: "Português",
    btnDocLangEn: "English",
    siteLangNotice: "Interface language",
    templatePickerLabel: "Template",
    fieldAuthorityNotice: "Issue: Level {minIssue} · Approval: Level {minApprove}+",
    btnSubmitDraft: "Submit for Approval",
    liveStageTitle: "Official Document",
    liveStageSub: "Live preview",

    // Approvals View
    approvalsTitle: "Pending Approvals",
    approvalsSub: "Drafts awaiting review and counter-signature.",
    btnApprove: "Approve",
    btnReject: "Reject",
    btnRevoke: "Revoke",
    noPendingDocs: "No documents awaiting approval.",

    // Officers View
    officersTitle: "Officer Roster",
    officersSub: "Personnel authorized to issue and sign documents.",
    colOfficerName: "Officer",
    colRank: "Rank",
    colSig: "Signature",
    btnAdmit: "Admit",
    btnSuspend: "Suspend",
    panelAddOfficer: "Register Officer",

    // Ranks View
    ranksTitle: "Rank Hierarchy",
    ranksSub: "Level 5+ signs internal records. Level 11+ signs judicial filings.",
    colLevel: "Level",
    colRankTitle: "Rank",
    colAuthority: "Authority",
    colRoleInput: "Discord Role ID",
    btnSave: "Save",
    panelAddRank: "New Rank",

    // Templates View
    templatesTitle: "Document Templates",
    templatesSub: "Statutory templates and field definitions.",
    btnSaveTemplate: "Save Template",

    // QR Verifier
    qrTitle: "Record Verification",
    qrSub: "Unified Police Department · Authenticity Registry",
    qrPlaceholder: "Control No. (e.g. UPD-SW-2026-0001)",
    btnVerify: "Verify",
    backToPortal: "Back to Portal",
    verifiedValid: "VALID",
    recordNotFound: "Record Not Found",
    notFoundDesc: "No official record matching control number {code} was found."
  }
};

export const DOC_I18N = {
  pt: {
    deptTitle: "UNIFIED POLICE DEPARTMENT",
    deptSub: "GABINETE DO CHEFE DE POLÍCIA · QUARTEL GENERAL",
    deptJuris: "Estado de San Andreas · Condado de Los Santos",
    ctrlNoLabel: "Nº DE CONTROLE:",
    dateLabel: "DATA:",
    seriesLabel: "SÉRIE:",
    statusLabel: "STATUS:",
    seriesDoj: "PROCESSO JUDICIAL DOJ",
    seriesInternal: "REGISTRO INTERNO",
    stampDraft: "MINUTA - AGUARDANDO APROVAÇÃO",
    sealText: "SELO OFICIAL · AUTENTICADO",
    sigIssuerRole: "OFICIAL DECLARANTE",
    sigApproverRole: "AUTORIDADE DE COMANDO",
    sigAwaiting: "[ AGUARDANDO ASSINATURA ]",
    sigReqCommander: "PATENTE EXIGIDA: COMMANDER+ (NÍVEL 11+)",
    sigReqCorporal: "PATENTE EXIGIDA: CORPORAL+ (NÍVEL 5+)",
    sigCountersigned: "Assinado: {date}",
    footerVerifyLabel: "VERIFICAÇÃO:",
    footerVerify: "VERIFICAÇÃO: {url}",
    footerSensitive: "USO OFICIAL RESTRITO · Pág. 1/1",
  },
  en: {
    deptTitle: "UNIFIED POLICE DEPARTMENT",
    deptSub: "OFFICE OF THE CHIEF OF POLICE · HEADQUARTERS",
    deptJuris: "State of San Andreas · County of Los Santos",
    ctrlNoLabel: "CONTROL NO.:",
    dateLabel: "DATE:",
    seriesLabel: "SERIES:",
    statusLabel: "STATUS:",
    seriesDoj: "DOJ JUDICIAL FILING",
    seriesInternal: "INTERNAL RECORD",
    stampDraft: "DRAFT - PENDING APPROVAL",
    sealText: "OFFICIAL SEAL · AUTHENTICATED",
    sigIssuerRole: "AFFIANT OFFICER",
    sigApproverRole: "COMMANDING OFFICER",
    sigAwaiting: "[ AWAITING SIGNATURE ]",
    sigReqCommander: "REQUIRED: COMMANDER+ (LVL 11+)",
    sigReqCorporal: "REQUIRED: CORPORAL+ (LVL 5+)",
    sigCountersigned: "Signed: {date}",
    footerVerifyLabel: "VERIFY:",
    footerVerify: "VERIFY: {url}",
    footerSensitive: "LAW ENFORCEMENT SENSITIVE · Pg. 1/1",
  }
};

export const TEMPLATE_TRANSLATIONS = {
  SW: {
    pt: {
      name: "Mandado de Busca e Apreensão",
      title: "DECLARAÇÃO JURAMENTADA E PEDIDO DE MANDADO DE BUSCA E APREENSÃO",
      court_header: "NO TRIBUNAL SUPERIOR DO ESTADO DE SAN ANDREAS\nNO E PARA O CONDADO DE LOS SANTOS",
      body: "<b>PROCESSO / DOCKET Nº:</b> {case_no}\n<b>ALVO(S) DA INVESTIGAÇÃO:</b> {target_subject}\n<b>VIOLAÇÕES PENAIS:</b> {statutes_violated}\n<b>PARÂMETROS DE EXECUÇÃO:</b> {night_service}\n\n<b>I. DECLARAÇÃO JURAMENTADA DO OFICIAL DECLARANTE</b>\nEu, <b>{issuer_name}</b>, Distintivo <b>#{issuer_badge}</b>, ocupante do posto de <b>{issuer_rank}</b> do Unified Police Department (UPD), prestando compromisso legal sob pena de perjúrio sob as leis do Estado de San Andreas, declaro ter fundada suspeita e causa provável para crer que evidências materiais de crime grave encontram-se ocultadas no local abaixo descrito.\n\n<b>II. DESCRIÇÃO PORMENORIZADA DO IMÓVEL / LOCAL</b>\n{target_premises}\n\n<b>III. BENS E EVIDÊNCIAS A SEREM APREENDIDOS (ANEXO A)</b>\n{items_to_seize}\n\n<b>IV. DEMONSTRAÇÃO DE CAUSA PROVÁVEL E CIRCUNSTÂNCIAS DOS FATOS</b>\n{probable_cause}\n\n<b>V. REQUERIMENTO FINAL</b>\nDiante do exposto, o Declarante requer a expedição do competente Mandado de Busca e Apreensão por este Tribunal Superior, autorizando qualquer Oficial de Paz do Unified Police Department a adentrar as dependências descritas e apreender os bens especificados.",
      fields: [
        { key: "case_no", label: "Nº do Processo", type: "text", required: true, max_length: 60, placeholder: "26-CR-00418" },
        { key: "target_subject", label: "Alvo da Investigação", type: "text", required: true, max_length: 200, placeholder: "Nome e identificação do investigado" },
        { key: "target_premises", label: "Local da Busca", type: "textarea", required: true, max_length: 800, placeholder: "Endereço e características do imóvel" },
        { key: "statutes_violated", label: "Infrações Penais", type: "text", required: true, max_length: 300, placeholder: "Artigos do Código Penal" },
        { key: "items_to_seize", label: "Bens e Evidências a Apreender", type: "textarea", required: true, max_length: 1500, placeholder: "1. Armas e munições;\n2. Dispositivos e mídias;\n3. Documentos." },
        { key: "probable_cause", label: "Causa Provável e Fatos", type: "textarea", required: true, max_length: 3500, placeholder: "Descrição dos fatos e evidências apuradas" },
        { key: "night_service", label: "Parâmetros de Cumprimento", type: "text", required: true, max_length: 200, placeholder: "Cumprimento diurno (07h às 22h)" }
      ]
    }
  },
  AW: {
    pt: {
      name: "Mandado de Prisão",
      title: "DECLARAÇÃO DE CAUSA PROVÁVEL PARA MANDADO DE PRISÃO",
      court_header: "NO TRIBUNAL SUPERIOR DO ESTADO DE SAN ANDREAS\nNO E PARA O CONDADO DE LOS SANTOS",
      body: "<b>PROCESSO / DOCKET Nº:</b> {case_no}\n<b>INDICIADO / RÉU:</b> {defendant_name}\n<b>ÚLTIMO ENDEREÇO CONHECIDO:</b> {last_known_address}\n<b>STATUS DE FIANÇA RECOMENDADO:</b> {bail_request}\n\n<b>I. REPRESENTAÇÃO FORMAL DE PRISÃO</b>\nPerante o Tribunal Superior do Estado de San Andreas, comparece o oficial <b>{issuer_name}</b> ({issuer_rank}, Distintivo #{issuer_badge}), do Unified Police Department, o qual, prestando compromisso legal, declara sob pena da lei que no Condado de Los Santos o réu acima nominado praticou os crimes especificados nesta representação.\n\n<b>II. IMPUTAÇÕES E DISPOSITIVOS PENAIS</b>\n{charges}\n\n<b>III. DEMONSTRAÇÃO DE CAUSA PROVÁVEL E INDÍCIOS DE AUTORIA</b>\n{probable_cause}\n\n<b>IV. PEDIDO DE MANDADO DE PRISÃO</b>\nDiante do exposto, o Declarante requer a expedição de Mandado de Prisão autorizando qualquer Oficial de Paz a capturar e apresentar o réu perante o Magistrado competente.",
      fields: [
        { key: "case_no", label: "Nº do Processo", type: "text", required: true, max_length: 60, placeholder: "26-CR-00419" },
        { key: "defendant_name", label: "Nome do Réu", type: "text", required: true, max_length: 250, placeholder: "Nome completo e identificadores" },
        { key: "last_known_address", label: "Último Endereço Conhecido", type: "text", required: true, max_length: 250, placeholder: "Endereço em Los Santos, SA" },
        { key: "charges", label: "Imputações Penais", type: "textarea", required: true, max_length: 800, placeholder: "Tipificação dos delitos imputados" },
        { key: "probable_cause", label: "Causa Provável", type: "textarea", required: true, max_length: 3500, placeholder: "Fatos demonstrando autoria e materialidade" },
        { key: "bail_request", label: "Fiança / Custódia", type: "text", required: true, max_length: 150, placeholder: "Prisão preventiva / Sem fiança" }
      ]
    }
  },
  CO: {
    pt: {
      name: "Quebra de Sigilo (18 U.S.C. § 2703(d))",
      title: "REQUERIMENTO DE ORDEM JUDICIAL PARA QUEBRA DE SIGILO E REGISTROS\nNOS TERMOS DO 18 U.S.C. § 2703(d)",
      court_header: "NO TRIBUNAL SUPERIOR DO ESTADO DE SAN ANDREAS\nNO E PARA O CONDADO DE LOS SANTOS",
      body: "<b>INQUÉRITO / REGISTRO Nº:</b> {case_no}\n<b>IDENTIFICADOR / TITULAR DO ALVO:</b> {target_account}\n<b>CUSTODIANTE DOS REGISTROS:</b> {custodian_entity}\n<b>PRAZO DE SIGILO E NÃO DIVULGAÇÃO:</b> {nondisclosure_period}\n\n<b>I. REQUERIMENTO LEGAL</b>\n<b>{issuer_name}</b> ({issuer_rank}, Distintivo #{issuer_badge}), investigador juramentado do Unified Police Department, requer a este Tribunal Superior a expedição de Ordem Judicial nos termos do 18 U.S.C. § 2703(d) determinando que <b>{custodian_entity}</b> forneça os dados especificados a seguir.\n\n<b>II. REGISTROS E DADOS REQUISITADOS</b>\n{records_scope}\n\n<b>III. FATOS ARTICULADOS E RELEVÂNCIA PROBATÓRIA</b>\n{articulable_facts}",
      fields: [
        { key: "case_no", label: "Nº do Inquérito", type: "text", required: true, max_length: 60, placeholder: "26-INV-00109" },
        { key: "target_account", label: "Conta / Linha / Alvo", type: "text", required: true, max_length: 250, placeholder: "Identificador da conta ou linha" },
        { key: "custodian_entity", label: "Provedor / Instituição", type: "text", required: true, max_length: 200, placeholder: "Entidade custodiante dos registros" },
        { key: "records_scope", label: "Escopo dos Dados", type: "textarea", required: true, max_length: 1200, placeholder: "Registros requeridos e período temporal" },
        { key: "articulable_facts", label: "Relevância Probatória", type: "textarea", required: true, max_length: 3500, placeholder: "Fatos demonstrando a necessidade dos dados" },
        { key: "nondisclosure_period", label: "Ordem de Sigilo", type: "text", required: true, max_length: 150, placeholder: "Sigilo por 90 dias (18 U.S.C. § 2705(b))" }
      ]
    }
  },
  SO: {
    pt: {
      name: "Operação Tática Especial (SMEAC)",
      title: "PEDIDO DE AUTORIZAÇÃO JUDICIAL E EXECUTIVA\nOPERAÇÃO ESPECIAL TÁTICA E PACIFICAÇÃO (SMEAC)",
      court_header: "PERANTE O DEPARTAMENTO DE JUSTIÇA E TRIBUNAL SUPERIOR\nESTADO DE SAN ANDREAS · CONDADO DE LOS SANTOS",
      body: "<b>DESIGNAÇÃO DA OPERAÇÃO:</b> {operation_name}\n<b>JANELA OPERACIONAL:</b> {operational_window}\n<b>OFICIAL DE COMANDO RESPONSÁVEL:</b> {issuer_name} ({issuer_rank}, Distintivo #{issuer_badge})\n\n<b>I. SITUAÇÃO E INTELIGÊNCIA OPERACIONAL</b>\n{situation}\n\n<b>II. DECLARAÇÃO DE MISSÃO</b>\n{mission}\n\n<b>III. PLANO DE EXECUÇÃO E FASES TÁTICAS</b>\n{execution}\n\n<b>IV. REGRAS DE ENGAJAMENTO E SALVAGUARDAS CONSTITUCIONAIS</b>\n{roe_safeguards}",
      fields: [
        { key: "operation_name", label: "Codinome da Operação", type: "text", required: true, max_length: 200, placeholder: "Designação e setor de atuação" },
        { key: "operational_window", label: "Janela Operacional", type: "text", required: true, max_length: 150, placeholder: "Início e término previstos" },
        { key: "situation", label: "Situação e Inteligência", type: "textarea", required: true, max_length: 1500, placeholder: "Relatório de ameaça armada e inteligência" },
        { key: "mission", label: "Missão", type: "textarea", required: true, max_length: 800, placeholder: "Objetivos táticos da operação" },
        { key: "execution", label: "Execução e Perímetros", type: "textarea", required: true, max_length: 1500, placeholder: "Fases, unidades e pontos de cerco" },
        { key: "roe_safeguards", label: "Regras de Engajamento", type: "textarea", required: true, max_length: 1000, placeholder: "Diretrizes de uso progressivo da força" }
      ]
    }
  },
  FQ: {
    pt: {
      name: "Certificado de Armamento UPD",
      title: "CERTIFICADO DE QUALIFICAÇÃO EM ARMAS DE FOGO\nE AUTORIZAÇÃO DE CUSTÓDIA DE ARMAMENTO DEPARTAMENTAL",
      court_header: "UNIFIED POLICE DEPARTMENT · DIVISÃO DE TIRO E TREINAMENTO COM ARMAS\nCERTIFICAÇÃO OFICIAL POST DO ESTADO DE SAN ANDREAS",
      body: "<b>INDIVÍDUO AUTORIZADO:</b> {holder_name} (Documento ID: {holder_id})\n<b>Nº DO PROCESSO / REGISTRO DOJ:</b> {doj_permit_ref}\n<b>INSTRUTOR RESPONSÁVEL:</b> {issuer_name} ({issuer_rank}, Distintivo #{issuer_badge})\n\n<b>I. ATESTADO DE APTIDÃO EM TIRO</b>\nEm conformidade com a autorização do Departamento de Justiça (<b>{doj_permit_ref}</b>), a Divisão de Tiro do Unified Police Department certifica que <b>{holder_name}</b> concluiu satisfatoriamente a instrução e avaliação prática de tiro:\n\n<b>Resultado da Qualificação:</b> {course_score}\n\n<b>II. TERMO DE CUSTÓDIA E POSSE DE ARMAMENTO DO UPD</b>\nO armamento abaixo identificado permanece, a todo momento, como patrimônio exclusivo do <b>Unified Police Department (UPD)</b>:\n\n<b>Armamento Designado:</b> {weapon_details}\n\n<b>Condições de Custódia e Uso:</b>\n{conditions}",
      fields: [
        { key: "holder_name", label: "Nome do Titular", type: "text", required: true, max_length: 150, placeholder: "Nome completo do agente ou cidadão" },
        { key: "holder_id", label: "Documento ID", type: "text", required: true, max_length: 60, placeholder: "SA-ID 00000" },
        { key: "doj_permit_ref", label: "Protocolo DOJ", type: "text", required: true, max_length: 100, placeholder: "DOJ-CCW-2026-0001" },
        { key: "course_score", label: "Avaliação do Curso", type: "text", required: true, max_length: 150, placeholder: "Aprovado - 98/100" },
        { key: "weapon_details", label: "Armamento Designado", type: "text", required: true, max_length: 250, placeholder: "Glock 17 Gen 5 - Calibre 9mm - Série UPD-ARM-0001" },
        { key: "conditions", label: "Termos de Custódia", type: "textarea", required: true, max_length: 800, placeholder: "Patrimônio exclusivo UPD. Porte restrito a serviço autorizado." }
      ]
    }
  },
  CM: {
    pt: {
      name: "Condecoração Departamental",
      title: "CONDECORAÇÃO E ELOGIO DEPARTAMENTAL OFICIAL\nGABINETE DO CHEFE DE POLÍCIA",
      court_header: "UNIFIED POLICE DEPARTMENT · CONSELHO DE HONRARIAS E CONDECORAÇÕES\nCONDADO DE LOS SANTOS, ESTADO DE SAN ANDREAS",
      body: "<b>PARA:</b> {recipient_name}\n<b>HONRARIA / CONDECORAÇÃO:</b> {award_class}\n<b>DATA E LOCAL DO ATO:</b> {incident_date}\n<b>SUPERVISOR PROPORENTE:</b> {issuer_name} ({issuer_rank}, Distintivo #{issuer_badge})\n\n<b>CITAÇÃO POR SERVIÇO RELEVANTE E CORAGEM</b>\nO Comando do Unified Police Department confere o presente Elogio Departamental Oficial a <b>{recipient_name}</b> em reconhecimento ao exemplar profissionalismo, distinção e bravura em cumprimento do dever policial:\n\n{citation_narrative}",
      fields: [
        { key: "recipient_name", label: "Oficial Homenageado", type: "text", required: true, max_length: 150, placeholder: "Nome e distintivo do oficial" },
        { key: "award_class", label: "Classe da Condecoração", type: "text", required: true, max_length: 120, placeholder: "Medalha de Bravura / Honra ao Mérito" },
        { key: "incident_date", label: "Data e Local do Fato", type: "text", required: true, max_length: 150, placeholder: "Data e local da ocorrência" },
        { key: "citation_narrative", label: "Justificativa da Condecoração", type: "textarea", required: true, max_length: 2500, placeholder: "Narrativa dos atos de bravura e mérito" }
      ]
    }
  }
};

let _currentLang = localStorage.getItem("upd_site_lang") || "pt";
let _currentDocLang = localStorage.getItem("upd_doc_lang") || "pt";

export function getLanguage() {
  return _currentLang;
}

export function setLanguage(lang) {
  _currentLang = lang === "en" ? "en" : "pt";
  localStorage.setItem("upd_site_lang", _currentLang);
}

/**
 * Single global language switcher (fixed top-left, 🇧🇷 / 🇺🇸).
 * Created once per page; `onChange(lang)` runs after the language is saved.
 */
export function mountLangSwitch(onChange) {
  let el = document.getElementById("lang-switch");
  if (!el) {
    el = document.createElement("div");
    el.id = "lang-switch";
    el.className = "lang-switch no-print";
    el.setAttribute("role", "group");
    el.setAttribute("aria-label", "Idioma / Language");
    el.innerHTML = `
      <button type="button" data-lang="pt" title="Português (Brasil)"><span class="flag">🇧🇷</span></button>
      <button type="button" data-lang="en" title="English (US)"><span class="flag">🇺🇸</span></button>
    `;
    document.body.prepend(el);
  }
  const sync = () => {
    el.querySelectorAll("[data-lang]").forEach(b => {
      const on = b.dataset.lang === _currentLang;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", String(on));
    });
  };
  el.onclick = e => {
    const btn = e.target.closest("[data-lang]");
    if (!btn || btn.dataset.lang === _currentLang) return;
    setLanguage(btn.dataset.lang);
    sync();
    onChange?.(_currentLang);
  };
  sync();
  return sync;
}

export function getDocumentLanguage() {
  return _currentDocLang;
}

export function setDocumentLanguage(lang) {
  _currentDocLang = lang === "en" ? "en" : "pt";
  localStorage.setItem("upd_doc_lang", _currentDocLang);
}

export function t(key, params = {}) {
  const dict = UI_I18N[_currentLang] || UI_I18N.pt;
  let str = dict[key] || UI_I18N.pt[key] || UI_I18N.en[key] || key;
  for (const [k, v] of Object.entries(params)) {
    str = str.replace(new RegExp(`\\{${k}\\}`, "g"), v);
  }
  return str;
}

export function resolveTemplateForLang(template, lang = "pt") {
  const code = (template.code || "").toUpperCase();
  const trans = TEMPLATE_TRANSLATIONS[code]?.[lang];
  if (!trans) return template;
  return {
    ...template,
    name: trans.name || template.name,
    title: trans.title || template.title,
    court_header: trans.court_header || template.court_header,
    body: trans.body || template.body,
    fields: trans.fields || template.fields
  };
}
