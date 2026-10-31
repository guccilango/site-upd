// UPD Records Bureau — Internationalization (i18n) Engine (PT-BR & EN)

export const UI_I18N = {
  pt: {
    flag: "🇧🇷",
    langName: "Português",
    altFlag: "🇺🇸",
    altLangName: "English",
    brandTitle: "UPD Records Bureau",
    brandSub: "Los Santos · Registros Judiciais e Internos",
    restrictedPortal: "Los Santos · Portal Restrito",
    publicVerifier: "Validador Público de QR",
    verifyControlNo: "Verificar Nº de Controle",
    newDocument: "Novo Documento Oficial",
    deptNotice: "Unified Police Department · Registros de Comando e Justiça",

    // Login screen
    loginTitle: "Unified Police Department — Portal de Comando e Registros",
    loginSub: "Acesso restrito ao Quadro de Oficiais de Comando e Supervisores da UPD",
    loginAuthTitle: "Autenticação de Comando via Discord",
    loginAuthSub: "Valida sua filiação e cargo de Supervisão no servidor oficial",
    loginAuthDesc: "Entre com sua conta oficial do Discord. O acesso é concedido automaticamente a membros com cargo de supervisão ou admitidos pelo Comando.",
    btnDiscordLogin: "Entrar com Discord",
    authorizedStaff: "Oficiais de Comando Autorizados",
    recoveryLoginBtn: "Login de Contingência do Comando",
    hideRecoveryBtn: "Ocultar Login de Contingência",
    recoveryCredLabel: "ID da Credencial Autorizada",
    recoveryCredPlaceholder: "Digite seu Discord Snowflake ID",
    recoverySigLabel: "Nome Roleplay do Oficial (Assinatura)",
    recoveryBadgeLabel: "Distintivo #",
    recoveryKeyLabel: "Chave de Supervisão do Comando",
    recoveryKeyPlaceholder: "Digite a chave do comando",
    recoverySubmitBtn: "Autenticar Sessão de Comando",

    // Navigation
    navOperations: "Operações",
    navOverview: "Visão Geral & Registros",
    navIssue: "Emitir Documento",
    navApprovals: "Aprovações do Comando",
    navAdmin: "Administração do Comando",
    navOfficers: "Oficiais & Admissão",
    navRanks: "Patentes & Sincronização Discord",
    navTemplates: "Modelos de Documento",
    signOut: "Encerrar Sessão",

    // Overview KPIs & Table
    kpiPendingLabel: "Aguardando assinatura de comando",
    kpiPendingCap: "Commander+ para DOJ · Corporal+ para interno",
    kpiDojLabel: "Processos judiciais DOJ aprovados",
    kpiDojCap: "Mandados de busca, prisão, 2703(d) e pacificação",
    kpiInternalLabel: "Registros internos aprovados",
    kpiInternalCap: "Certificações de tiro e condecorações",
    kpiOfficersLabel: "Oficiais juramentados ativos",
    kpiOfficersCap: "de {total} registrados no bureau",
    ledgerTitle: "Registro Geral de Processos e Documentos",
    filterAll: "Todos ({count})",
    filterPending: "Aguardando Aprovação ({count})",
    filterApproved: "Aprovados ({count})",
    filterMine: "Emitidos por Mim ({count})",
    colControlNo: "Nº de Controle",
    colTemplate: "Tipo / Modelo",
    colIssuer: "Oficial Emissor",
    colStatus: "Status",
    colApproval: "Aprovação / Ação",
    colActions: "Ações",
    btnViewDoc: "Visualizar",
    btnPdf: "PDF",
    btnPng: "Imagem",

    // Status Pills
    statusApproved: "Aprovado",
    statusPending: "Pendente de Aprovação",
    statusRejected: "Rejeitado",
    statusRevoked: "Revogado",

    // Composer
    composerTitle: "Criador de Documentos e Mandados Oficiais",
    composerSub: "Emissão padronizada em papel US-Letter, validação de competência e contra-assinatura hierárquica",
    docLangLabel: "Idioma do Documento",
    docLangPt: "🇧🇷 Português (RP Americano Traduzido)",
    docLangEn: "🇺🇸 English (US Official Standards)",
    docEmissionLangLabel: "Idioma de Emissão do Documento",
    docEmissionLangHelp: "Define o idioma em que a folha física oficial (cabeçalho, carimbos, texto e assinaturas) será gerada",
    btnDocLangPt: "🇧🇷 Documento em Português",
    btnDocLangEn: "🇺🇸 Document in English",
    siteLangNotice: "Idioma da Interface do Site",
    templatePickerLabel: "Selecione o Modelo de Documento",
    fieldAuthorityNotice: "Patente mínima para emissão: Nível {minIssue} · Contra-assinatura exigida: Nível {minApprove}+",
    btnSubmitDraft: "Enviar Minuta para Aprovação do Comando",
    liveStageTitle: "Folha US-Letter Oficial (8.5 × 11 pol.)",
    liveStageSub: "Atualiza instantaneamente conforme você digita",

    // Approvals View
    approvalsTitle: "Fila de Contra-Assinatura do Comando",
    approvalsSub: "Oficiais de Comando (Corporal+ interno / Commander+ DOJ) devem auditar os fatos da causa provável antes de contra-assinar",
    btnApprove: "Contra-Assinar & Aprovar",
    btnReject: "Rejeitar com Justificativa",
    btnRevoke: "Revogar Documento",
    noPendingDocs: "Nenhum documento aguardando contra-assinatura no momento.",

    // Officers View
    officersTitle: "Quadro de Oficiais Juramentados & Admissões",
    officersSub: "Gerencie o status de oficiais autorizados a emitir e assinar documentos no bureau",
    colOfficerName: "Oficial / Identificação",
    colRank: "Patente & Nível",
    colSig: "Assinatura Cursiva",
    btnAdmit: "Admitir",
    btnSuspend: "Suspender",
    panelAddOfficer: "Registrar / Admitir Oficial Manualmente",

    // Ranks View
    ranksTitle: "Hierarquia de Patentes & Vinculação Discord",
    ranksSub: "Nível 5+ (Corporal+) contra-assina registros internos · Nível 11+ (Commander+) contra-assina processos do DOJ",
    colLevel: "Nível",
    colRankTitle: "Título da Patente",
    colAuthority: "Competência de Comando",
    colRoleInput: "Cargo do Discord",
    btnSave: "Salvar",
    panelAddRank: "Adicionar / Configurar Patente",

    // Templates View
    templatesTitle: "Modelos Oficiais de Documentos & Seções",
    templatesSub: "Configuração das seções legislativas, cabeçalho de tribunal e variáveis dinâmicas",
    btnSaveTemplate: "Salvar Alterações do Modelo",

    // QR Verifier
    qrTitle: "Registro Público de Autenticidade Documental",
    qrSub: "Unified Police Department · Condado de Los Santos · Validação Criptográfica e Nº de Controle",
    qrPlaceholder: "Digite o Nº de Controle (ex: UPD-SW-2026-0001 ou UPD-FQ-2026-0001)",
    btnVerify: "Verificar Registro",
    backToPortal: "Voltar ao Portal do Oficial",
    verifiedValid: "VÁLIDO · AUTENTICADO",
    recordNotFound: "Registro Não Encontrado",
    notFoundDesc: "Nenhum registro oficial correspondente ao número de controle {code} foi localizado no Registro da UPD."
  },
  en: {
    flag: "🇺🇸",
    langName: "English",
    altFlag: "🇧🇷",
    altLangName: "Português",
    brandTitle: "UPD Records Bureau",
    brandSub: "Los Santos · Judicial & Internal Records",
    restrictedPortal: "Los Santos · Restricted Portal",
    publicVerifier: "Public QR Verifier",
    verifyControlNo: "Verify Control No.",
    newDocument: "New Official Document",
    deptNotice: "Unified Police Department · Command & Judicial Records",

    // Login screen
    loginTitle: "Unified Police Department — Command & Records Portal",
    loginSub: "Restricted to authenticated UPD Command & Supervisory personnel",
    loginAuthTitle: "Discord Command Authentication",
    loginAuthSub: "Verifies your membership and Supervisory role on the official server",
    loginAuthDesc: "Sign in with your official Discord account. Access is automatically granted to members holding the UPD Command / Supervision role or admitted by Command Staff.",
    btnDiscordLogin: "Sign in with Discord",
    authorizedStaff: "Authorized Command Personnel",
    recoveryLoginBtn: "Command Recovery Login",
    hideRecoveryBtn: "Hide Recovery Login",
    recoveryCredLabel: "Authorized Credential ID",
    recoveryCredPlaceholder: "Enter your Discord ID",
    recoverySigLabel: "Officer Roleplay Name (Signature)",
    recoveryBadgeLabel: "Badge #",
    recoveryKeyLabel: "Command Supervision Key",
    recoveryKeyPlaceholder: "Enter Command Key",
    recoverySubmitBtn: "Authenticate Command Session",

    // Navigation
    navOperations: "Operations",
    navOverview: "Overview & Ledger",
    navIssue: "Issue Document",
    navApprovals: "Command Approvals",
    navAdmin: "Command Administration",
    navOfficers: "Officers & Admission",
    navRanks: "Ranks & Discord Sync",
    navTemplates: "Document Templates",
    signOut: "Sign Out",

    // Overview KPIs & Table
    kpiPendingLabel: "Awaiting command signature",
    kpiPendingCap: "Commander+ for DOJ · Corporal+ for internal",
    kpiDojLabel: "Approved DOJ filings",
    kpiDojCap: "Warrants, 2703(d) orders & operations",
    kpiInternalLabel: "Approved internal records",
    kpiInternalCap: "Firearms certifications & commendations",
    kpiOfficersLabel: "Admitted sworn officers",
    kpiOfficersCap: "of {total} registered in bureau",
    ledgerTitle: "Records & Judicial Filings Ledger",
    filterAll: "All ({count})",
    filterPending: "Pending Approval ({count})",
    filterApproved: "Approved ({count})",
    filterMine: "Issued by Me ({count})",
    colControlNo: "Control No.",
    colTemplate: "Template / Code",
    colIssuer: "Issuing Officer",
    colStatus: "Status",
    colApproval: "Approval / Authority",
    colActions: "Actions",
    btnViewDoc: "View Sheet",
    btnPdf: "PDF",
    btnPng: "PNG Image",

    // Status Pills
    statusApproved: "Approved",
    statusPending: "Pending approval",
    statusRejected: "Rejected",
    statusRevoked: "Revoked",

    // Composer
    composerTitle: "Official Document & Warrant Composer",
    composerSub: "Standardized US-Letter emission, authority verification, and hierarchical counter-signature",
    docLangLabel: "Document Language",
    docLangPt: "🇧🇷 Portuguese (Translated US RP)",
    docLangEn: "🇺🇸 English (US Official Standards)",
    docEmissionLangLabel: "Document Emission Language",
    docEmissionLangHelp: "Controls the language printed on the official physical sheet (masthead, stamps, body text, and signatures)",
    btnDocLangPt: "🇧🇷 Document in Portuguese",
    btnDocLangEn: "🇺🇸 Document in English",
    siteLangNotice: "Site Interface Language",
    templatePickerLabel: "Select Document Template",
    fieldAuthorityNotice: "Minimum rank to issue: Level {minIssue} · Counter-signature required: Level {minApprove}+",
    btnSubmitDraft: "Submit Draft for Command Approval",
    liveStageTitle: "Live US-Letter Sheet (8.5 × 11 in)",
    liveStageSub: "Updates as you type",

    // Approvals View
    approvalsTitle: "Command Counter-Signature Queue",
    approvalsSub: "Command Officers (Corporal+ internal / Commander+ DOJ) must audit probable cause facts before signing",
    btnApprove: "Approve & Counter-Sign",
    btnReject: "Reject with Reason",
    btnRevoke: "Revoke Document",
    noPendingDocs: "No documents currently awaiting command signature.",

    // Officers View
    officersTitle: "Sworn Officer Roster & Admission",
    officersSub: "Manage officer admission status and command signing privileges",
    colOfficerName: "Officer / Identifier",
    colRank: "Rank & Level",
    colSig: "Cursive Signature",
    btnAdmit: "Admit",
    btnSuspend: "Suspend",
    panelAddOfficer: "Register / Admit Officer Manually",

    // Ranks View
    ranksTitle: "Rank Hierarchy & Discord Role Mapping",
    ranksSub: "Level 5+ (Corporal+) counter-signs internal records · Level 11+ (Commander+) counter-signs DOJ filings",
    colLevel: "Level",
    colRankTitle: "Rank Title",
    colAuthority: "Approval Authority",
    colRoleInput: "Discord Role ID",
    btnSave: "Save",
    panelAddRank: "Add / Customize Rank",

    // Templates View
    templatesTitle: "Document Templates & Sections",
    templatesSub: "Configure statutory sections, court headers, and dynamic placeholders",
    btnSaveTemplate: "Save Template Modifications",

    // QR Verifier
    qrTitle: "Public Record Authenticity Registry",
    qrSub: "Unified Police Department · County of Los Santos · Cryptographic & Control Number Verification",
    qrPlaceholder: "Enter Control Number (e.g., UPD-SW-2026-0001 or UPD-FQ-2026-0001)",
    btnVerify: "Verify Record",
    backToPortal: "Back to Officer Portal",
    verifiedValid: "VALID · AUTHENTICATED",
    recordNotFound: "Record Not Found",
    notFoundDesc: "No official record matching control number {code} exists in the Unified Police Department Registry."
  }
};

export const DOC_I18N = {
  pt: {
    deptTitle: "UNIFIED POLICE DEPARTMENT",
    deptSub: "GABINETE DO CHEFE DE POLÍCIA · QUARTEL GENERAL",
    deptJuris: "Estado de San Andreas · Condado de Los Santos",
    ctrlNoLabel: "Nº DE CONTROLE:",
    dateLabel: "DATA DO REGISTRO:",
    seriesLabel: "SÉRIE:",
    statusLabel: "STATUS:",
    seriesDoj: "PROCESSO JUDICIAL DOJ",
    seriesInternal: "REGISTRO INTERNO",
    stampDraft: "MINUTA — AGUARDANDO APROVAÇÃO",
    sealText: "SELO OFICIAL · AUTENTICADO",
    sigIssuerRole: "OFICIAL REQUERENTE / DECLARANTE",
    sigApproverRole: "AUTORIDADE DE COMANDO RESPONSÁVEL",
    sigAwaiting: "[ AGUARDANDO CONTRA-ASSINATURA ]",
    sigReqCommander: "PATENTE EXIGIDA: COMMANDER+ (NÍVEL 11+)",
    sigReqCorporal: "PATENTE EXIGIDA: CORPORAL+ (NÍVEL 5+)",
    sigCountersigned: "Contra-Assinado: {date}",
    footerVerify: "VERIFICAR NO REGISTRO: verify.html?n={ctrl}",
    footerSensitive: "USO RESTRITO POLICIAL · Página 1 de 1",
  },
  en: {
    deptTitle: "UNIFIED POLICE DEPARTMENT",
    deptSub: "OFFICE OF THE CHIEF OF POLICE · HEADQUARTERS",
    deptJuris: "State of San Andreas · County of Los Santos",
    ctrlNoLabel: "CONTROL NO.:",
    dateLabel: "DATE OF RECORD:",
    seriesLabel: "SERIES:",
    statusLabel: "STATUS:",
    seriesDoj: "DOJ JUDICIAL FILING",
    seriesInternal: "INTERNAL RECORD",
    stampDraft: "DRAFT — PENDING APPROVAL",
    sealText: "OFFICIAL SEAL · AUTHENTICATED",
    sigIssuerRole: "SUBMITTING / AFFIANT OFFICER",
    sigApproverRole: "APPROVING COMMAND AUTHORITY",
    sigAwaiting: "[ AWAITING COUNTER-SIGNATURE ]",
    sigReqCommander: "REQUIRED: COMMANDER+ (LVL 11+)",
    sigReqCorporal: "REQUIRED: CORPORAL+ (LVL 5+)",
    sigCountersigned: "Counter-Signed: {date}",
    footerVerify: "VERIFY REGISTRY: verify.html?n={ctrl}",
    footerSensitive: "LAW ENFORCEMENT SENSITIVE · Page 1 of 1",
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
        { key: "case_no", label: "Nº do Processo / Docket", type: "text", required: true, max_length: 60, placeholder: "26-CR-00418" },
        { key: "target_subject", label: "Alvo(s) da Investigação / Ocupante(s)", type: "text", required: true, max_length: 200, placeholder: "Nome completo, data de nascimento e identificadores conhecidos" },
        { key: "target_premises", label: "Local da Busca (Endereço e Descrição Completa)", type: "textarea", required: true, max_length: 800, placeholder: "Endereço completo e características físicas do imóvel..." },
        { key: "statutes_violated", label: "Infrações Penais / Artigos do Código Penal", type: "text", required: true, max_length: 300, placeholder: "Artigos infringidos do Código Penal de San Andreas" },
        { key: "items_to_seize", label: "Bens e Evidências a Serem Apreendidos (Anexo A)", type: "textarea", required: true, max_length: 1500, placeholder: "1. Armas de fogo, munições e carregadores;\n2. Dispositivos de comunicação e mídias;\n3. Documentos e comprovantes." },
        { key: "probable_cause", label: "Declaração de Causa Provável (Fatos e Investigação)", type: "textarea", required: true, max_length: 3500, placeholder: "Narrativa detalhada dos atos investigatórios e demonstração dos indícios..." },
        { key: "night_service", label: "Horário de Cumprimento e Dispensa de Notificação", type: "text", required: true, max_length: 200, placeholder: "Cumprimento diurno padrão (07h às 22h)" }
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
        { key: "case_no", label: "Nº do Processo / Docket", type: "text", required: true, max_length: 60, placeholder: "26-CR-00419" },
        { key: "defendant_name", label: "Nome Completo do Réu e Dados", type: "text", required: true, max_length: 250, placeholder: "Nome Completo · RG / ID · Data de Nascimento" },
        { key: "last_known_address", label: "Último Endereço / Local Conhecido", type: "text", required: true, max_length: 250, placeholder: "Último endereço conhecido em Los Santos, SA" },
        { key: "charges", label: "Imputações Penais (Artigos e Contagens)", type: "textarea", required: true, max_length: 800, placeholder: "Contagem 1: Artigo penal e tipificação" },
        { key: "probable_cause", label: "Demonstração de Causa Provável", type: "textarea", required: true, max_length: 3500, placeholder: "Fatos demonstrando a materialidade delitiva e os indícios suficientes de autoria..." },
        { key: "bail_request", label: "Recomendação de Fiança / Custódia", type: "text", required: true, max_length: 150, placeholder: "Prisão Preventiva / Sem Fiança — Risco à Ordem Pública" }
      ]
    }
  },
  CO: {
    pt: {
      name: "Quebra de Sigilo e Registros (18 U.S.C. § 2703(d))",
      title: "REQUERIMENTO DE ORDEM JUDICIAL PARA QUEBRA DE SIGILO E REGISTROS\nNOS TERMOS DO 18 U.S.C. § 2703(d) E LEI DE PRIVACIDADE FINANCEIRA",
      court_header: "NO TRIBUNAL SUPERIOR DO ESTADO DE SAN ANDREAS\nNO E PARA O CONDADO DE LOS SANTOS",
      body: "<b>INQUÉRITO / REGISTRO Nº:</b> {case_no}\n<b>IDENTIFICADOR / TITULAR DO ALVO:</b> {target_account}\n<b>CUSTODIANTE DOS REGISTROS:</b> {custodian_entity}\n<b>PRAZO DE SIGILO E NÃO DIVULGAÇÃO:</b> {nondisclosure_period}\n\n<b>I. REQUERIMENTO LEGAL</b>\n<b>{issuer_name}</b> ({issuer_rank}, Distintivo #{issuer_badge}), investigador juramentado do Unified Police Department, requer a este Tribunal Superior a expedição de Ordem Judicial nos termos do 18 U.S.C. § 2703(d) determinando que <b>{custodian_entity}</b> forneça os dados especificados a seguir.\n\n<b>II. REGISTROS E DADOS REQUISITADOS</b>\n{records_scope}\n\n<b>III. FATOS ARTICULADOS E RELEVÂNCIA PROBATÓRIA</b>\n{articulable_facts}",
      fields: [
        { key: "case_no", label: "Nº do Inquérito / Investigação", type: "text", required: true, max_length: 60, placeholder: "26-INV-00109" },
        { key: "target_account", label: "Alvo e Conta / Telefone / Identificador", type: "text", required: true, max_length: 250, placeholder: "Número de conta / Linha telefônica e titular" },
        { key: "custodian_entity", label: "Provedor do Serviço / Instituição Financeira", type: "text", required: true, max_length: 200, placeholder: "Instituição bancária ou operadora de telecomunicações" },
        { key: "records_scope", label: "Escopo dos Dados e Período Requisitado", type: "textarea", required: true, max_length: 1200, placeholder: "Extratos, registros de chamadas, dados cadastrais e intervalo temporal..." },
        { key: "articulable_facts", label: "Fatos Concretos e Articulados (Relevância Legal)", type: "textarea", required: true, max_length: 3500, placeholder: "Demonstração de fatos concretos evidenciando a imprescindibilidade dos registros..." },
        { key: "nondisclosure_period", label: "Pedido de Sigilo e Não Divulgação", type: "text", required: true, max_length: 150, placeholder: "Sigilo Absoluto por 90 dias (18 U.S.C. § 2705(b))" }
      ]
    }
  },
  SO: {
    pt: {
      name: "Operação de Pacificação Comunitária (SMEAC)",
      title: "PEDIDO DE AUTORIZAÇÃO JUDICIAL E EXECUTIVA\nOPERAÇÃO ESPECIAL TÁTICA E PACIFICAÇÃO COMUNITÁRIA (SMEAC)",
      court_header: "PERANTE O DEPARTAMENTO DE JUSTIÇA E TRIBUNAL SUPERIOR\nESTADO DE SAN ANDREAS · CONDADO DE LOS SANTOS",
      body: "<b>DESIGNAÇÃO DA OPERAÇÃO:</b> {operation_name}\n<b>JANELA OPERACIONAL:</b> {operational_window}\n<b>OFICIAL DE COMANDO RESPONSÁVEL:</b> {issuer_name} ({issuer_rank}, Distintivo #{issuer_badge})\n\n<b>I. SITUAÇÃO E INTELIGÊNCIA OPERACIONAL</b>\n{situation}\n\n<b>II. DECLARAÇÃO DE MISSÃO</b>\n{mission}\n\n<b>III. PLANO DE EXECUÇÃO E FASES TÁTICAS</b>\n{execution}\n\n<b>IV. REGRAS DE ENGAJAMENTO E SALVAGUARDAS CONSTITUCIONAIS</b>\n{roe_safeguards}",
      fields: [
        { key: "operation_name", label: "Codinome da Operação e Zona Designada", type: "text", required: true, max_length: 200, placeholder: "Codinome da operação e setor geográfico" },
        { key: "operational_window", label: "Janela Operacional (Início e Fim / Horários)", type: "text", required: true, max_length: 150, placeholder: "Data e horário de início e encerramento previsto" },
        { key: "situation", label: "1. SITUAÇÃO (Inteligência e Ameaça Armada)", type: "textarea", required: true, max_length: 1500, placeholder: "Inteligência sobre facções, atuação armada e crimes violentos no setor..." },
        { key: "mission", label: "2. MISSÃO OPERACIONAL", type: "textarea", required: true, max_length: 800, placeholder: "Objetivos táticos e metas de estabilização comunitária..." },
        { key: "execution", label: "3. EXECUÇÃO E FASES TÁTICAS (Unidades e Perímetros)", type: "textarea", required: true, max_length: 1500, placeholder: "Fases da operação, unidades empenhadas e pontos de bloqueio..." },
        { key: "roe_safeguards", label: "4. REGRAS DE ENGAJAMENTO E SALVAGUARDAS", type: "textarea", required: true, max_length: 1000, placeholder: "Uso progressivo da força, câmeras operacionais e suporte médico..." }
      ]
    }
  },
  FQ: {
    pt: {
      name: "Certificado e Porte de Armas de Fogo UPD",
      title: "CERTIFICADO DE QUALIFICAÇÃO EM ARMAS DE FOGO\nE AUTORIZAÇÃO DE CUSTÓDIA DE ARMAMENTO DEPARTAMENTAL",
      court_header: "UNIFIED POLICE DEPARTMENT · DIVISÃO DE TIRO E TREINAMENTO COM ARMAS\nCERTIFICAÇÃO OFICIAL POST DO ESTADO DE SAN ANDREAS",
      body: "<b>INDIVÍDUO AUTORIZADO:</b> {holder_name} (Documento ID: {holder_id})\n<b>Nº DO PROCESSO / REGISTRO DOJ:</b> {doj_permit_ref}\n<b>INSTRUTOR RESPONSÁVEL:</b> {issuer_name} ({issuer_rank}, Distintivo #{issuer_badge})\n\n<b>I. ATESTADO DE APTIDÃO EM TIRO</b>\nEm conformidade com a autorização do Departamento de Justiça (<b>{doj_permit_ref}</b>), a Divisão de Tiro do Unified Police Department certifica que <b>{holder_name}</b> concluiu satisfatoriamente a instrução e avaliação prática de tiro:\n\n<b>Resultado da Qualificação:</b> {course_score}\n\n<b>II. TERMO DE CUSTÓDIA E POSSE DE ARMAMENTO DO UPD</b>\nO armamento abaixo identificado permanece, a todo momento, como patrimônio exclusivo do <b>Unified Police Department (UPD)</b>:\n\n<b>Armamento Designado:</b> {weapon_details}\n\n<b>Condições de Custódia e Uso:</b>\n{conditions}",
      fields: [
        { key: "holder_name", label: "Nome Completo do Cidadão / Agente", type: "text", required: true, max_length: 150, placeholder: "Nome Completo" },
        { key: "holder_id", label: "Documento ID Estadual / RG / Passaporte", type: "text", required: true, max_length: 60, placeholder: "SA-ID #00000" },
        { key: "doj_permit_ref", label: "Porte DOJ / Nº do Protocolo", type: "text", required: true, max_length: 100, placeholder: "DOJ-CCW-2026-0001" },
        { key: "course_score", label: "Curso de Tiro e Aproveitamento", type: "text", required: true, max_length: 150, placeholder: "Curso de Combate e Tiro Defensivo — Nota: 98/100 (QUALIFICADO)" },
        { key: "weapon_details", label: "Armamento Designado (Marca, Modelo, Calibre e Nº Série)", type: "text", required: true, max_length: 250, placeholder: "Glock 17 Gen 5 · 9x19mm · Nº de Série UPD-ARM-0001" },
        { key: "conditions", label: "Termos de Custódia e Restrições de Uso", type: "textarea", required: true, max_length: 800, placeholder: "Armamento de propriedade exclusiva da UPD. Portador certificado em manuseio seguro, retenção e uso proporcional da força." }
      ]
    }
  },
  CM: {
    pt: {
      name: "Elogio e Condecoração Policial",
      title: "CONDECORAÇÃO E ELOGIO DEPARTAMENTAL OFICIAL\nGABINETE DO CHEFE DE POLÍCIA",
      court_header: "UNIFIED POLICE DEPARTMENT · CONSELHO DE HONRARIAS E CONDECORAÇÕES\nCONDADO DE LOS SANTOS, ESTADO DE SAN ANDREAS",
      body: "<b>PARA:</b> {recipient_name}\n<b>HONRARIA / CONDECORAÇÃO:</b> {award_class}\n<b>DATA E LOCAL DO ATO:</b> {incident_date}\n<b>SUPERVISOR PROPORENTE:</b> {issuer_name} ({issuer_rank}, Distintivo #{issuer_badge})\n\n<b>CITAÇÃO POR SERVIÇO RELEVANTE E CORAGEM</b>\nO Comando do Unified Police Department confere o presente Elogio Departamental Oficial a <b>{recipient_name}</b> em reconhecimento ao exemplar profissionalismo, distinção e bravura em cumprimento do dever policial:\n\n{citation_narrative}",
      fields: [
        { key: "recipient_name", label: "Oficial Homenageado (Nome e Distintivo)", type: "text", required: true, max_length: 150, placeholder: "Oficial Nome e Distintivo #" },
        { key: "award_class", label: "Classe da Condecoração / Honraria", type: "text", required: true, max_length: 120, placeholder: "Medalha de Bravura / Citação de Honra ao Mérito" },
        { key: "incident_date", label: "Data e Local do Ato Meritório", type: "text", required: true, max_length: 150, placeholder: "Data e localização do ato" },
        { key: "citation_narrative", label: "Narrativa dos Fatos e Justificativa do Elogio", type: "textarea", required: true, max_length: 2500, placeholder: "Narrativa pormenorizada dos fatos e bravura..." }
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
