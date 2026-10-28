# Manual do Usuário — Cartão de Cena (Story Genius)

Aplicativo web (PWA) para montar a **Cena de Sequência Narrativa** em 7 passos, com base na metodologia Story Genius, de Lisa Cron. Funciona offline, não envia nenhum dado para a internet e guarda tudo no seu próprio navegador.

---

## 1. O que o aplicativo faz

- Apresenta os 7 passos da cena, sempre na mesma ordem, cada um com sua instrução e um exemplo prático.
- Marca cada passo com uma bolinha de cor:
  - 🟢 **Verde** = ENREDO (o que acontece no mundo físico).
  - 🟠 **Laranja** = TERCEIRO TRILHO (a dimensão interior/psicológica do protagonista).
- Salva o que você escreve automaticamente.
- Exporta a cena em **JSON, Markdown, TXT e Word (.docx)**.

---

## 2. Arquivos do projeto

| Arquivo | Função |
|---|---|
| `index.html` | Estrutura da página e dos 7 passos |
| `styles.css` | Aparência e cores das bolinhas |
| `app.js` | Exemplos expansíveis, salvamento e exportação |
| `sw.js` | Service Worker (funcionamento offline) |
| `manifest.json` | Dados de instalação do PWA |
| `icon.svg` | Ícone do app (texto puro, sem Base64) |

Mantenha todos os arquivos **na mesma pasta**.

---

## 3. Como abrir o aplicativo

### Uso rápido (sem instalar)
Dê dois cliques em `index.html`. Tudo funciona: preenchimento, salvamento e exportação. Só o modo offline e a instalação como app não ficam disponíveis, porque o navegador exige `https` ou `localhost` para isso.

### Uso completo (com instalação e offline)
**Opção A — servidor local**
1. Abra um terminal dentro da pasta do projeto.
2. Execute: `python3 -m http.server 8080`
3. Acesse `http://localhost:8080` no navegador.

**Opção B — hospedagem estática** (GitHub Pages, Netlify ou similar): envie os 6 arquivos e abra o endereço `https` gerado.

### Instalar como aplicativo
Com o app aberto por `localhost` ou `https`, use no Chrome ou Edge o ícone de instalação na barra de endereço (ou menu → "Instalar aplicativo"). Depois de aberto uma vez, ele funciona sem internet.

---

## 4. Como preencher uma cena

1. No topo, escreva o **Título / identificação da cena** (ex.: "Capítulo 1, Cena 3"). Esse nome também vira o nome dos arquivos exportados.
2. Percorra os 7 passos, de cima para baixo.
3. Em cada passo, leia a instrução e escreva na caixa de texto.
4. Se precisar de uma referência, clique em **💡 Ver exemplo**. O exemplo prático daquele passo se abre logo abaixo. Clique em **Ocultar exemplo** para fechá-lo.

O texto que você escreve é salvo sozinho (a mensagem no rodapé mostra "Salvo às HH:MM:SS").

---

## 5. Os 7 passos

### 1. 🟢 ENREDO — PONTO ALFA (Função Causal Global)
A razão indispensável pela qual a cena existe na arquitetura do romance. Responde à pergunta: "Qual é a função narrativa estrita desta cena na trajetória de causa e efeito do livro?". Se a cena não possui um Ponto Alfa claro que mova a história, ela é considerada palha (filler) e deve ser cortada.

### 2. 🟢 ENREDO — CAUSA (Gatilho Físico na 1ª Metade)
A ação concreta, externa e observável que acontece na primeira metade da cena, interrompendo a intenção ou a rotina atual do protagonista no mundo físico.

### 3. 🟠 TERCEIRO TRILHO — POR QUE IMPORTA? (Filtro da Falsa Crença)
O choque entre o evento externo e o mundo interior do protagonista. Explica por que aquele acontecimento específico ameaça o objetivo imediato (Want) ou atinge diretamente o ponto cego da sua Falsa Crença (Misbelief).

### 4. 🟢 ENREDO — EFEITO (Consequência Prática na 2ª Metade)
O resultado prático e objetivo no mundo físico gerado pela Causa na segunda metade da cena. A complicação que altera as condições materiais e impede que o personagem simplesmente ignore o problema.

### 5. 🟠 TERCEIRO TRILHO — A REALIZAÇÃO (Micro-Deslocamento Interno)
O insight ou virada de percepção emocional provocada pelo Efeito. O personagem é forçado a reavaliar sua estratégia defensiva, gerando um micro-deslocamento na sua visão de mundo.

### 6. 🟢 ENREDO — O CONECTOR "E ENTÃO?" (Decisão e Ação Concreta)
A ponte decisória em que a nova realização obriga o personagem a formular um plano ou tomar uma atitude física imediata, evitando a paralisia introspectiva.

### 7. 🟢 ENREDO — CONECTOR CAUSAL ("Por causa disso...")
A consequência prática da decisão tomada no "E Então?", que estabelece o novo estado de desequilíbrio e aciona inevitavelmente o Ponto Alfa da cena seguinte, eliminando o conector fraco "E depois...".

### Como ler o encadeamento
A ordem alterna o que acontece **fora** (🟢) e o que acontece **dentro** do protagonista (🟠):

`Ponto Alfa 🟢 → Causa 🟢 → Por que importa 🟠 → Efeito 🟢 → Realização 🟠 → E então? 🟢 → Por causa disso 🟢`

Dica de uso: preencher na ordem ajuda, mas o Ponto Alfa também pode ser revisado no fim, quando você já sabe o que a cena realmente faz.

---

## 6. Salvamento automático

- O app grava no `localStorage` do navegador cerca de meio segundo depois que você para de digitar.
- Os dados ficam **neste navegador, neste computador ou celular**. Não são enviados a nenhum servidor.
- **Atenção:** limpar os dados do site ou usar janela anônima apaga ou impede o salvamento. Para guardar com segurança, exporte um **JSON** ou **DOCX** com frequência.
- O app guarda **uma cena por vez**. Para começar outra, exporte a atual e use **Limpar cena**.

---

## 7. Exportar

Na seção **Exportar**, no fim da página:

| Botão | Arquivo | Para que serve |
|---|---|---|
| **JSON** | `.json` | Backup estruturado, com ordem, tipo (enredo ou terceiro trilho), título e resposta de cada passo |
| **Markdown (.md)** | `.md` | Cabeçalhos e marcações limpos, para colar em Obsidian ou Notion |
| **Texto (.txt)** | `.txt` | Texto simples, sem asteriscos, hashtags ou outras marcas |
| **Word (.docx)** | `.docx` | Documento com título, os 7 passos e suas respostas, abre no Word |

Os arquivos vão para a pasta de downloads do navegador. Campos em branco saem marcados como "(vazio)".

---

## 8. Limpar a cena

O botão **Limpar cena** apaga o título e os 7 campos, depois de uma confirmação. Não há como desfazer; exporte antes se quiser guardar.

---

## 9. Privacidade e segurança

- Sem rastreadores, sem anúncios, sem scripts de terceiros.
- Nenhum código é carregado de outros sites e não há iframes.
- Não há Base64 nem dados binários embutidos no HTML ou no manifesto.
- Os downloads usam apenas as funções nativas do navegador.

Se algum antivírus sinalizar o app mesmo assim, trata-se de falso positivo: todos os arquivos são texto legível e podem ser conferidos em qualquer editor.

---

## 10. Solução de problemas

| Problema | O que fazer |
|---|---|
| Não aparece a opção de instalar | Abra por `localhost` ou `https`, não direto do arquivo; recarregue a página |
| Não funciona offline | Abra uma vez com internet (por `localhost` ou `https`) para o app ser guardado |
| Mudei os arquivos e nada mudou | O app antigo está em cache. Recarregue com Ctrl+Shift+R, ou altere `CACHE` em `sw.js` (ex.: `cartao-cena-v2`) |
| "Não foi possível salvar no navegador" | O navegador bloqueou o armazenamento (modo anônimo ou dados desativados). Exporte um JSON para não perder o texto |
| O download não começa | Permita downloads para o site nas configurações do navegador |
| O Word avisa sobre o arquivo | Clique em "Habilitar edição"; o arquivo foi gerado localmente e é um .docx comum |

---

## 11. Atualizando o app

1. Substitua os arquivos na pasta (ou na hospedagem).
2. Em `sw.js`, aumente o número da versão em `var CACHE = "cartao-cena-v1";`.
3. Recarregue a página duas vezes para o navegador adotar a nova versão.

Seus textos salvos não são apagados por atualizações.
