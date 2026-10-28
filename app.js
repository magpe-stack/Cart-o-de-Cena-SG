"use strict";

var CHAVE = "cartao_cena_story_genius_v1";

var PASSOS = [
  { id: "ponto_alfa", tipo: "enredo", titulo: "ENREDO — PONTO ALFA (Função Causal Global)" },
  { id: "causa", tipo: "enredo", titulo: "ENREDO — CAUSA (Gatilho Físico na 1ª Metade)" },
  { id: "por_que_importa", tipo: "terceiro_trilho", titulo: "TERCEIRO TRILHO — POR QUE IMPORTA? (Filtro da Falsa Crença)" },
  { id: "efeito", tipo: "enredo", titulo: "ENREDO — EFEITO (Consequência Prática na 2ª Metade)" },
  { id: "realizacao", tipo: "terceiro_trilho", titulo: "TERCEIRO TRILHO — A REALIZAÇÃO (Micro-Deslocamento Interno)" },
  { id: "e_entao", tipo: "enredo", titulo: "ENREDO — O CONECTOR \"E ENTÃO?\" (Decisão e Ação Concreta)" },
  { id: "conector_causal", tipo: "enredo", titulo: "ENREDO — CONECTOR CAUSAL (\"Por causa disso...\")" }
];

var TITULO_DOC = "Cartão de Cena — Sequência Narrativa (Story Genius)";

var elTitulo = document.getElementById("tituloCena");
var elStatus = document.getElementById("status");
var temporizador = null;

/* ---------- Dados ---------- */

function campo(id) {
  return document.getElementById("campo_" + id);
}

function coletar() {
  var dados = { titulo_cena: elTitulo.value, passos: {} };
  PASSOS.forEach(function (p) {
    dados.passos[p.id] = campo(p.id).value;
  });
  return dados;
}

function aplicar(dados) {
  if (!dados || typeof dados !== "object") { return; }
  elTitulo.value = typeof dados.titulo_cena === "string" ? dados.titulo_cena : "";
  PASSOS.forEach(function (p) {
    var v = dados.passos && typeof dados.passos[p.id] === "string" ? dados.passos[p.id] : "";
    campo(p.id).value = v;
  });
}

/* ---------- localStorage ---------- */

function mostrarStatus(texto) {
  elStatus.textContent = texto;
}

function salvar() {
  try {
    window.localStorage.setItem(CHAVE, JSON.stringify(coletar()));
    var h = new Date();
    mostrarStatus("Salvo às " + h.toLocaleTimeString("pt-BR"));
  } catch (e) {
    mostrarStatus("Não foi possível salvar no navegador");
  }
}

function carregar() {
  try {
    var bruto = window.localStorage.getItem(CHAVE);
    if (bruto) { aplicar(JSON.parse(bruto)); }
  } catch (e) {
    mostrarStatus("Não foi possível ler os dados salvos");
  }
}

function agendarSalvar() {
  mostrarStatus("Salvando...");
  clearTimeout(temporizador);
  temporizador = setTimeout(salvar, 400);
}

/* ---------- Accordion de exemplos ---------- */

function iniciarExemplos() {
  var botoes = document.querySelectorAll(".btn-exemplo");
  Array.prototype.forEach.call(botoes, function (btn) {
    btn.addEventListener("click", function () {
      var caixa = btn.nextElementSibling;
      var aberto = caixa.classList.toggle("aberto");
      btn.setAttribute("aria-expanded", aberto ? "true" : "false");
      btn.textContent = aberto ? "💡 Ocultar exemplo" : "💡 Ver exemplo";
    });
  });
}

/* ---------- Download seguro ---------- */

function baixar(nome, blob) {
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
}

function nomeBase() {
  var t = elTitulo.value.trim() || "cartao-de-cena";
  var limpo = t.normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase();
  return limpo || "cartao-de-cena";
}

/* ---------- Exportadores ---------- */

function exportarJSON() {
  var d = coletar();
  var saida = {
    metodologia: "Story Genius",
    documento: TITULO_DOC,
    exportado_em: new Date().toISOString(),
    titulo_cena: d.titulo_cena,
    passos: PASSOS.map(function (p, i) {
      return { ordem: i + 1, id: p.id, tipo: p.tipo, titulo: p.titulo, resposta: d.passos[p.id] };
    })
  };
  baixar(nomeBase() + ".json", new Blob([JSON.stringify(saida, null, 2)], { type: "application/json" }));
}

function exportarMD() {
  var d = coletar();
  var linhas = ["# " + TITULO_DOC, ""];
  if (d.titulo_cena.trim()) { linhas.push("**Cena:** " + d.titulo_cena.trim(), ""); }
  PASSOS.forEach(function (p, i) {
    var bola = p.tipo === "enredo" ? "🟢" : "🟠";
    linhas.push("## " + (i + 1) + ". " + bola + " " + p.titulo, "");
    linhas.push(d.passos[p.id].trim() || "_(vazio)_", "");
  });
  baixar(nomeBase() + ".md", new Blob([linhas.join("\n")], { type: "text/markdown;charset=utf-8" }));
}

function exportarTXT() {
  var d = coletar();
  var linhas = [TITULO_DOC.toUpperCase(), ""];
  if (d.titulo_cena.trim()) { linhas.push("Cena: " + d.titulo_cena.trim(), ""); }
  PASSOS.forEach(function (p, i) {
    linhas.push((i + 1) + ". " + p.titulo);
    linhas.push(d.passos[p.id].trim() || "(vazio)");
    linhas.push("");
  });
  baixar(nomeBase() + ".txt", new Blob([linhas.join("\r\n")], { type: "text/plain;charset=utf-8" }));
}

/* ---------- DOCX (ZIP sem compressão, APIs nativas) ---------- */

var TABELA_CRC = (function () {
  var t = new Uint32Array(256);
  for (var n = 0; n < 256; n++) {
    var c = n;
    for (var k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(bytes) {
  var c = 0xFFFFFFFF;
  for (var i = 0; i < bytes.length; i++) {
    c = TABELA_CRC[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function criarZip(arquivos) {
  var enc = new TextEncoder();
  var partes = [];
  var central = [];
  var offset = 0;
  var agora = new Date();
  var hora = (agora.getHours() << 11) | (agora.getMinutes() << 5) | (agora.getSeconds() >> 1);
  var data = ((agora.getFullYear() - 1980) << 9) | ((agora.getMonth() + 1) << 5) | agora.getDate();

  arquivos.forEach(function (arq) {
    var nome = enc.encode(arq.nome);
    var corpo = enc.encode(arq.conteudo);
    var crc = crc32(corpo);

    var lh = new DataView(new ArrayBuffer(30));
    lh.setUint32(0, 0x04034b50, true);
    lh.setUint16(4, 20, true);
    lh.setUint16(6, 0x0800, true);
    lh.setUint16(8, 0, true);
    lh.setUint16(10, hora, true);
    lh.setUint16(12, data, true);
    lh.setUint32(14, crc, true);
    lh.setUint32(18, corpo.length, true);
    lh.setUint32(22, corpo.length, true);
    lh.setUint16(26, nome.length, true);
    lh.setUint16(28, 0, true);

    partes.push(new Uint8Array(lh.buffer), nome, corpo);

    var ch = new DataView(new ArrayBuffer(46));
    ch.setUint32(0, 0x02014b50, true);
    ch.setUint16(4, 20, true);
    ch.setUint16(6, 20, true);
    ch.setUint16(8, 0x0800, true);
    ch.setUint16(10, 0, true);
    ch.setUint16(12, hora, true);
    ch.setUint16(14, data, true);
    ch.setUint32(16, crc, true);
    ch.setUint32(20, corpo.length, true);
    ch.setUint32(24, corpo.length, true);
    ch.setUint16(28, nome.length, true);
    ch.setUint16(30, 0, true);
    ch.setUint16(32, 0, true);
    ch.setUint16(34, 0, true);
    ch.setUint16(36, 0, true);
    ch.setUint32(38, 0, true);
    ch.setUint32(42, offset, true);
    central.push(new Uint8Array(ch.buffer), nome);

    offset += 30 + nome.length + corpo.length;
  });

  var tamCentral = 0;
  central.forEach(function (c) { tamCentral += c.length; });

  var fim = new DataView(new ArrayBuffer(22));
  fim.setUint32(0, 0x06054b50, true);
  fim.setUint16(4, 0, true);
  fim.setUint16(6, 0, true);
  fim.setUint16(8, arquivos.length, true);
  fim.setUint16(10, arquivos.length, true);
  fim.setUint32(12, tamCentral, true);
  fim.setUint32(16, offset, true);
  fim.setUint16(20, 0, true);

  return new Blob(partes.concat(central, [new Uint8Array(fim.buffer)]), {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  });
}

function xmlEsc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function runs(texto, extra) {
  var partes = String(texto).replace(/\r\n/g, "\n").split("\n");
  var xml = "";
  partes.forEach(function (linha, i) {
    xml += "<w:r>" + (extra || "") + (i > 0 ? "<w:br/>" : "") +
      "<w:t xml:space=\"preserve\">" + xmlEsc(linha) + "</w:t></w:r>";
  });
  return xml;
}

function paragrafo(texto, estilo, extra) {
  var pPr = estilo ? "<w:pPr><w:pStyle w:val=\"" + estilo + "\"/></w:pPr>" : "";
  return "<w:p>" + pPr + runs(texto, extra) + "</w:p>";
}

function exportarDOCX() {
  var d = coletar();
  var corpo = paragrafo(TITULO_DOC, "Title");
  if (d.titulo_cena.trim()) {
    corpo += paragrafo("Cena: " + d.titulo_cena.trim(), null, "<w:rPr><w:b/></w:rPr>");
  }
  PASSOS.forEach(function (p, i) {
    var cor = p.tipo === "enredo" ? "2E9E5B" : "F08A24";
    var marcador = "<w:r><w:rPr><w:color w:val=\"" + cor + "\"/><w:sz w:val=\"28\"/></w:rPr><w:t xml:space=\"preserve\">● </w:t></w:r>";
    corpo += "<w:p><w:pPr><w:pStyle w:val=\"Heading1\"/></w:pPr>" + marcador +
      "<w:r><w:t xml:space=\"preserve\">" + xmlEsc((i + 1) + ". " + p.titulo) + "</w:t></w:r></w:p>";
    corpo += paragrafo(d.passos[p.id].trim() || "(vazio)");
  });

  var NS = "xmlns:w=\"http://schemas.openxmlformats.org/wordprocessingml/2006/main\"";
  var cab = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>";

  var documento = cab + "<w:document " + NS + "><w:body>" + corpo +
    "<w:sectPr><w:pgSz w:w=\"11906\" w:h=\"16838\"/>" +
    "<w:pgMar w:top=\"1440\" w:right=\"1440\" w:bottom=\"1440\" w:left=\"1440\" w:header=\"708\" w:footer=\"708\" w:gutter=\"0\"/>" +
    "</w:sectPr></w:body></w:document>";

  var estilos = cab + "<w:styles " + NS + ">" +
    "<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii=\"Calibri\" w:hAnsi=\"Calibri\" w:cs=\"Calibri\"/><w:sz w:val=\"22\"/><w:lang w:val=\"pt-BR\"/></w:rPr></w:rPrDefault>" +
    "<w:pPrDefault><w:pPr><w:spacing w:after=\"160\" w:line=\"276\" w:lineRule=\"auto\"/></w:pPr></w:pPrDefault></w:docDefaults>" +
    "<w:style w:type=\"paragraph\" w:default=\"1\" w:styleId=\"Normal\"><w:name w:val=\"Normal\"/></w:style>" +
    "<w:style w:type=\"paragraph\" w:styleId=\"Title\"><w:name w:val=\"Title\"/><w:basedOn w:val=\"Normal\"/><w:next w:val=\"Normal\"/>" +
    "<w:pPr><w:spacing w:after=\"240\"/></w:pPr><w:rPr><w:b/><w:color w:val=\"1F2A44\"/><w:sz w:val=\"40\"/></w:rPr></w:style>" +
    "<w:style w:type=\"paragraph\" w:styleId=\"Heading1\"><w:name w:val=\"heading 1\"/><w:basedOn w:val=\"Normal\"/><w:next w:val=\"Normal\"/>" +
    "<w:pPr><w:keepNext/><w:spacing w:before=\"280\" w:after=\"100\"/><w:outlineLvl w:val=\"0\"/></w:pPr>" +
    "<w:rPr><w:b/><w:color w:val=\"1F2A44\"/><w:sz w:val=\"26\"/></w:rPr></w:style>" +
    "</w:styles>";

  var tipos = cab + "<Types xmlns=\"http://schemas.openxmlformats.org/package/2006/content-types\">" +
    "<Default Extension=\"rels\" ContentType=\"application/vnd.openxmlformats-package.relationships+xml\"/>" +
    "<Default Extension=\"xml\" ContentType=\"application/xml\"/>" +
    "<Override PartName=\"/word/document.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml\"/>" +
    "<Override PartName=\"/word/styles.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml\"/>" +
    "</Types>";

  var relsRaiz = cab + "<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">" +
    "<Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument\" Target=\"word/document.xml\"/>" +
    "</Relationships>";

  var relsDoc = cab + "<Relationships xmlns=\"http://schemas.openxmlformats.org/package/2006/relationships\">" +
    "<Relationship Id=\"rId1\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles\" Target=\"styles.xml\"/>" +
    "</Relationships>";

  var zip = criarZip([
    { nome: "[Content_Types].xml", conteudo: tipos },
    { nome: "_rels/.rels", conteudo: relsRaiz },
    { nome: "word/document.xml", conteudo: documento },
    { nome: "word/_rels/document.xml.rels", conteudo: relsDoc },
    { nome: "word/styles.xml", conteudo: estilos }
  ]);
  baixar(nomeBase() + ".docx", zip);
}

/* ---------- Inicialização ---------- */

function limparCena() {
  if (window.confirm("Apagar todos os campos desta cena? Esta ação não pode ser desfeita.")) {
    aplicar({ titulo_cena: "", passos: {} });
    salvar();
  }
}

function iniciar() {
  carregar();
  iniciarExemplos();

  elTitulo.addEventListener("input", agendarSalvar);
  PASSOS.forEach(function (p) {
    campo(p.id).addEventListener("input", agendarSalvar);
  });

  document.getElementById("expJson").addEventListener("click", exportarJSON);
  document.getElementById("expMd").addEventListener("click", exportarMD);
  document.getElementById("expTxt").addEventListener("click", exportarTXT);
  document.getElementById("expDocx").addEventListener("click", exportarDOCX);
  document.getElementById("limpar").addEventListener("click", limparCena);

  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    navigator.serviceWorker.register("sw.js").catch(function () {});
  }
}

iniciar();
