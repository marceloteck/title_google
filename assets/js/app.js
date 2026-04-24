const state = {
  copies: [],
  filtered: []
};

const CATEGORY_LABELS = [
  "Atração e Curiosidade",
  "Urgência e Escassez",
  "Autoridade e Prova Social",
  "Benefícios Diretos",
  "Transformação e Resultados"
];

const TYPE_LIMITS = {
  "Título curto": 30,
  "Título longo": 90,
  "Descrição": 90,
  "CTA": 30
};

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("copyForm");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = getFormData();

    if (!data.produto || !data.beneficio) {
      setFeedback("Preencha ao menos o nome do produto e o benefício principal para gerar anúncios.");
      return;
    }

    setFeedback("");
    state.copies = generateCopies(data);
    populateFilterOptions(state.copies);
    applyFilters();
  });

  document.getElementById("btnClear").addEventListener("click", clearForm);
  document.getElementById("btnCopyAll").addEventListener("click", () => copyGroup("all"));
  document.getElementById("btnCopyTitles").addEventListener("click", () => copyGroup("titles"));
  document.getElementById("btnCopyDescriptions").addEventListener("click", () => copyGroup("descriptions"));
  document.getElementById("btnExport").addEventListener("click", exportCSV);

  ["filterCategory", "filterType", "filterStatus"].forEach((id) => {
    document.getElementById(id).addEventListener("change", applyFilters);
  });

  populateFilterOptions([]);
  renderResults([]);
});

function getFormData() {
  const value = (id) => document.getElementById(id).value.trim();
  const checked = (id) => document.getElementById(id).checked;

  return {
    produto: value("produto"),
    nicho: value("nicho") || "este assunto",
    publico: value("publico") || "pessoas interessadas",
    beneficio: value("beneficio"),
    problema: value("problema") || "desafios comuns",
    resultado: value("resultado") || "alcançar mais clareza",
    tempo: value("tempo"),
    precoVista: value("precoVista"),
    precoParcelado: value("precoParcelado"),
    parcelas: value("parcelas"),
    garantia: value("garantia"),
    bonus: value("bonus"),
    link: value("link"),
    tom: value("tom"),
    categoria: value("categoria"),
    sensivel: checked("sensivel"),
    evitarDireto: checked("evitarDireto"),
    evitarPromessa: checked("evitarPromessa"),
    evitarUrgencia: checked("evitarUrgencia"),
    modoSeguro: checked("modoSeguro")
  };
}

function generateCopies(data) {
  const produto = data.produto || "esta solução";
  const beneficio = data.beneficio || "melhorar sua experiência";
  const resultado = data.resultado || "alcançar mais clareza";
  const nicho = data.nicho || "este assunto";
  const publico = data.publico || "pessoas interessadas";
  const problema = data.problema || "desafios comuns";

  const urgenteComBaseReal = Boolean(data.tempo || data.garantia || data.precoVista || data.precoParcelado);
  const includeUrgent = !data.evitarUrgencia;

  const baseByCategory = {
    "Atração e Curiosidade": [
      `Descubra como ${beneficio} com ${produto}`,
      `Conheça uma forma prática de ${resultado}`,
      `Veja como ${produto} pode ajudar em ${beneficio}`,
      `O método para entender melhor ${nicho}`,
      `Uma nova forma de se preparar para ${resultado}`,
      `Saiba como melhorar sua experiência com ${produto}`
    ],
    "Urgência e Escassez": [
      `Acesse enquanto a oferta estiver disponível`,
      `Condição especial por tempo limitado`,
      `Conheça a oferta atual de ${produto}`,
      `Veja os detalhes antes de decidir`,
      `A oportunidade está disponível agora`
    ],
    "Autoridade e Prova Social": [
      `Conheça uma solução para ${beneficio}`,
      `Método criado para quem busca ${resultado}`,
      `Conteúdo pensado para ${publico}`,
      `Uma abordagem prática sobre ${nicho}`,
      `Veja por que ${produto} chama atenção`
    ],
    "Benefícios Diretos": [
      `Aprenda técnicas para ${beneficio}`,
      `Simplifique sua jornada com ${produto}`,
      `Mais clareza para alcançar ${resultado}`,
      `Conteúdo prático sobre ${nicho}`,
      `Guia direto para ${beneficio}`,
      `Acesso ao método completo`
    ],
    "Transformação e Resultados": [
      `Um caminho prático para ${resultado}`,
      `Prepare-se melhor com ${produto}`,
      `De ${problema} para mais ${beneficio}`,
      `Evolua com conteúdo passo a passo`,
      `Transforme sua rotina com mais clareza`,
      `Uma preparação mais simples para ${resultado}`
    ]
  };

  if (includeUrgent && urgentComBaseReal && data.tom === "Urgente") {
    baseByCategory["Urgência e Escassez"].push(`Oferta válida por ${data.tempo || "tempo limitado"}`);
    baseByCategory["Urgência e Escassez"].push(`Condição ativa para ${produto}`);
  }

  let categories = Object.keys(baseByCategory);
  if (data.categoria !== "Todas") categories = [data.categoria];

  const copies = [];
  categories.forEach((category) => {
    baseByCategory[category].forEach((text) => {
      const adjusted = applyToneAndSafety(text, data);
      copies.push(...buildTypesFromBase(category, adjusted, data));
    });
  });

  const deduped = deduplicateByText(copies);
  return deduped.map((item) => {
    const chars = countCharacters(item.copy);
    const policy = analyzePolicyRisk(item.copy);
    const limit = TYPE_LIMITS[item.tipo] || 90;
    return {
      ...item,
      chars,
      limit,
      sizeWarning: chars > limit,
      status: policy
    };
  });
}

function applyToneAndSafety(text, data) {
  let out = text;

  if (data.tom === "Emocional") out = out.replace(/^Conheça|^Descubra|^Saiba/, "Sinta");
  if (data.tom === "Autoridade") out = out.replace("conteúdo", "conteúdo especializado");
  if (data.tom === "Direto") out = out.replace("Conheça", "Veja");
  if (data.tom === "Neutro") out = out;

  if (data.evitarPromessa || data.modoSeguro) {
    out = out
      .replace(/garantido/gi, "pode ajudar")
      .replace(/resultado certo/gi, "caminho prático");
  }

  if (data.evitarDireto || data.modoSeguro) {
    out = out
      .replace(/\bvoc[eê]\b/gi, "pessoas")
      .replace(/sua/gi, "mais")
      .replace(/seu/gi, "o");
  }

  if (data.modoSeguro) {
    out = out
      .replace(/descubra/gi, "Conheça")
      .replace(/transforme/gi, "Desenvolva")
      .replace(/urgente|corra|última chance/gi, "veja detalhes");
  }

  if (data.sensivel && !/conteúdo para|guia sobre|aprenda|conheça|veja detalhes/i.test(out)) {
    out = `Conteúdo para ${data.publico || "pessoas interessadas"}: ${out}`;
  }

  return out;
}

function buildTypesFromBase(categoria, baseText, data) {
  const product = data.produto || "esta solução";
  const descontoTexto = data.precoVista ? ` por ${data.precoVista}` : "";
  const parcelasTexto = data.parcelas && data.precoParcelado ? ` ou ${data.parcelas}x de ${data.precoParcelado}` : "";

  const shortTitle = baseText.length > 38 ? baseText.slice(0, 30).trimEnd() : baseText;
  const longTitle = `${baseText}${descontoTexto}`.trim();

  const descriptionParts = [
    `${baseText}.`,
    data.garantia ? `Garantia ${data.garantia}.` : "",
    data.bonus ? `Bônus: ${data.bonus}.` : "",
    parcelasTexto ? `${parcelasTexto}.` : ""
  ].filter(Boolean);

  const description = descriptionParts.join(" ").replace(/\s+/g, " ").trim();
  const cta = data.modoSeguro ? `Veja detalhes de ${product}` : `Conheça ${product} agora`;

  return [
    { categoria, tipo: "Título curto", copy: shortTitle },
    { categoria, tipo: "Título longo", copy: longTitle },
    { categoria, tipo: "Descrição", copy: description },
    { categoria, tipo: "CTA", copy: cta }
  ];
}

function analyzePolicyRisk(text) {
  const lowered = text.toLowerCase();

  const highRiskPatterns = [
    "você está grávida",
    "para você que está grávida",
    "você sofre",
    "cure",
    "garantido",
    "100%",
    "sem dor",
    "resultado garantido",
    "compre agora ou vai perder",
    "última chance",
    "não fique de fora",
    "antes que seja tarde",
    "pare de sofrer"
  ];

  const sensitiveTerms = [
    "gravidez", "gestante", "parto", "emagrecimento", "renda", "dinheiro", "saúde",
    "dor", "ansiedade", "depressão", "cura", "tratamento"
  ];

  if (highRiskPatterns.some((pattern) => lowered.includes(pattern))) return "Risco alto";
  if (sensitiveTerms.some((term) => lowered.includes(term))) return "Atenção";
  return "Seguro";
}

function countCharacters(text) {
  return (text || "").length;
}

function renderResults(rows) {
  const tbody = document.querySelector("#resultsTable tbody");
  tbody.innerHTML = "";

  if (!rows.length) {
    tbody.innerHTML = '<tr><td class="empty-row" colspan="6">Nenhuma copy gerada ainda.</td></tr>';
    document.getElementById("totals").innerHTML = "";
    return;
  }

  rows.forEach((row, index) => {
    const tr = document.createElement("tr");

    const statusClass = row.status === "Seguro" ? "status-seguro" : (row.status === "Atenção" ? "status-atencao" : "status-risco");
    const charClass = row.sizeWarning ? "char-warning" : "";

    tr.innerHTML = `
      <td>${row.categoria}</td>
      <td>${row.tipo}</td>
      <td>${escapeHtml(row.copy)}</td>
      <td class="${charClass}">${row.chars}/${row.limit}${row.sizeWarning ? " - Ajustar tamanho" : ""}</td>
      <td><span class="status-pill ${statusClass}">${row.status}</span></td>
      <td><button class="copy-btn" data-index="${index}">Copiar</button></td>
    `;

    tbody.appendChild(tr);
  });

  tbody.querySelectorAll(".copy-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const idx = Number(button.dataset.index);
      copyToClipboard(rows[idx].copy);
    });
  });

  updateTotals(rows);
}

function applyFilters() {
  const category = document.getElementById("filterCategory").value;
  const type = document.getElementById("filterType").value;
  const status = document.getElementById("filterStatus").value;

  state.filtered = state.copies.filter((item) => {
    const byCategory = category === "Todas" || item.categoria === category;
    const byType = type === "Todos" || item.tipo === type;
    const byStatus = status === "Todos" || item.status === status;
    return byCategory && byType && byStatus;
  });

  renderResults(state.filtered);
}

function updateTotals(rows) {
  const total = rows.length;
  const seguro = rows.filter((r) => r.status === "Seguro").length;
  const atencao = rows.filter((r) => r.status === "Atenção").length;
  const risco = rows.filter((r) => r.status === "Risco alto").length;

  document.getElementById("totals").innerHTML = `
    <span class="badge">Total de copies: ${total}</span>
    <span class="badge">Total seguras: ${seguro}</span>
    <span class="badge">Total atenção: ${atencao}</span>
    <span class="badge">Total risco alto: ${risco}</span>
  `;
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => setFeedback("Copy copiada com sucesso."))
    .catch(() => setFeedback("Não foi possível copiar automaticamente."));
}

function exportCSV() {
  const rows = state.filtered.length ? state.filtered : state.copies;
  if (!rows.length) {
    setFeedback("Gere anúncios antes de exportar o CSV.");
    return;
  }

  const header = ["Categoria", "Tipo", "Copy", "Caracteres", "Status"];
  const csvRows = [header.join(",")];

  rows.forEach((row) => {
    const values = [row.categoria, row.tipo, row.copy, row.chars, row.status]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`);
    csvRows.push(values.join(","));
  });

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "copies-google-ads-display.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function clearForm() {
  document.getElementById("copyForm").reset();
  state.copies = [];
  state.filtered = [];
  populateFilterOptions([]);
  renderResults([]);
  setFeedback("");
}

function copyGroup(mode) {
  const rows = state.filtered.length ? state.filtered : state.copies;
  if (!rows.length) {
    setFeedback("Gere anúncios antes de copiar.");
    return;
  }

  let selected = rows;
  if (mode === "titles") selected = rows.filter((r) => r.tipo === "Título curto" || r.tipo === "Título longo" || r.tipo === "CTA");
  if (mode === "descriptions") selected = rows.filter((r) => r.tipo === "Descrição");

  const text = selected.map((r) => `[${r.categoria}] (${r.tipo}) ${r.copy}`).join("\n");
  copyToClipboard(text);
}

function deduplicateByText(rows) {
  const seen = new Set();
  return rows.filter((row) => {
    const key = `${row.categoria}|${row.tipo}|${row.copy.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function populateFilterOptions(copies) {
  const categories = ["Todas", ...new Set(copies.map((c) => c.categoria))];
  const types = ["Todos", "Título curto", "Título longo", "Descrição", "CTA"];
  const statuses = ["Todos", "Seguro", "Atenção", "Risco alto"];

  fillSelect("filterCategory", categories);
  fillSelect("filterType", types);
  fillSelect("filterStatus", statuses);
}

function fillSelect(id, options) {
  const select = document.getElementById(id);
  select.innerHTML = "";
  options.forEach((label) => {
    const option = document.createElement("option");
    option.value = label;
    option.textContent = label;
    select.appendChild(option);
  });
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function setFeedback(message) {
  document.getElementById("feedback").textContent = message;
}
