// Tokens visuais da área do cliente.
// A referência é a tela "Buscar Livros": as outras páginas tinham nascido com
// fundos (#FFFFFF, #FAF7F2), bordas (#E8DCC4, #E7DED8), fontes (serif) e
// arredondamentos próprios, e a diferença aparecia ao navegar entre elas.
// Mexer aqui muda todas de uma vez — é o ponto único de verdade.

import { RAIO as RAIO_BASE } from "../tema";

export const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

// --- CORES ---
export const PRIMARY_COLOR = "#4A0E17"; // vinho da marca
export const PRIMARY_HOVER = "#360A11";
export const BG_COLOR = "#F5F2EE"; // fundo de toda página do cliente
export const CARD_BG = "#FFFFFF";
export const BORDER_COLOR = "#EFEBE3";
export const TEXT_DARK = "#333333";
export const TEXT_LIGHT = "#777777";

export const SIDEBAR_BG = "#FFFFFF";
export const PLACEHOLDER_BG = "#F7F3EF"; // fundo de capa ausente
export const SUAVE_BG = "#FAF5F6"; // realce discreto (badges, avisos)
export const HOVER_BG = "#F5F1E9";

// Estados — usados em selos e mensagens
export const OK_BG = "#E6F4EA";
export const OK_COR = "#137333";
export const ALERTA_BG = "#FFF3E0";
export const ALERTA_COR = "#B78103";
export const ERRO_BG = "#FCE8E6";
export const ERRO_COR = "#C5221F";
export const ERRO_HOVER = "#A11B19"; // botão destrutivo em hover

// --- TIPOGRAFIA ---
// Títulos em Georgia; o corpo segue a fonte padrão do app.
// Uma escala só, usada por todas as telas — antes cada página inventava a sua
// (size="3xl" numa, {base:"2xl", md:"3xl"} noutra, "4xl" em outra).
export const FONTE_TITULO = "Georgia, serif";
export const TITULO_PAGINA = { base: "3xl", md: "4xl" }; // h1 da página
export const TITULO_SECAO = "2xl"; // h2 dentro da página
export const TITULO_CARTAO = "md"; // h3 dentro de um cartão
export const TEXTO_APOIO = "sm"; // subtítulo e legendas
export const TEXTO_MIUDO = "xs"; // metadados

// --- ARREDONDAMENTO ---
// Um raio só no sistema inteiro (ver components/tema.js). Os quatro nomes
// continuam existindo porque as páginas já os importam, mas todos apontam
// para o mesmo valor — cartão, campo, botão e selo têm o mesmo canto.
export { RAIO, RAIO_PILULA } from "../tema";
export const RAIO_CARTAO = RAIO_BASE;
export const RAIO_CAMPO = RAIO_BASE;
export const RAIO_MEDIO = RAIO_BASE;
export const RAIO_PEQUENO = RAIO_BASE;

// --- ESPAÇAMENTO ---
export const PADDING_PAGINA = { base: 6, md: 8 };
export const GAP_SECAO = 8; // entre blocos da página
export const GAP_CARTAO = 6; // dentro de um cartão / entre cards
export const GAP_ITEM = 3; // entre linhas de um mesmo bloco
export const PADDING_CARTAO = 6;

// Largura máxima do conteúdo. Telas de leitura/tabela usam a padrão; o
// formulário de cadastro passa `largura` menor, porque campo largo demais
// atrapalha a leitura.
// Altura de campo e botão. O cliente usa alvos maiores que o painel admin
// (48px contra 42px): são telas de leitura, com menos densidade.
export const ALTURA_CAMPO = "48px";

export const LARGURA_CONTEUDO = "1200px";
export const LARGURA_FORMULARIO = "720px";

// --- INTERAÇÃO ---
// Um hover só para toda a interface: levantar 2px e uma sombra baixa.
// Antes cada card tinha o seu (-6px na busca, -4px nos destaques, -2px com
// troca de borda no início), e o efeito pesado dava sensação de "pulo".
// Regra: hover de cartão só em coisa que o clique inteiro leva a algum lugar —
// cartão estático com hover promete uma interação que não existe.
export const SOMBRA_HOVER = "0 6px 16px rgba(74, 14, 23, 0.10)";
export const TRANSICAO = "all 0.2s ease";

export const HOVER_CARTAO = {
  transform: "translateY(-2px)",
  boxShadow: SOMBRA_HOVER,
};

// Links de texto ("Ver todos"): sublinhado, sem deslocar o texto.
export const HOVER_LINK = { textDecoration: "underline" };

// Item de vitrine (capa + título solto, sem cartão em volta).
// Aqui o HOVER_CARTAO não serve: a sombra dele cairia num contêiner
// transparente e desenhava um retângulo em volta do texto, no ar. Então o
// bloco só levanta e a sombra vai na capa, que é o único elemento com fundo.
export const HOVER_VITRINE = { transform: "translateY(-2px)" };
export const HOVER_CAPA = { boxShadow: SOMBRA_HOVER };

// Única cor fora da paleta vinho: a estrela de avaliação. Fica aqui para não
// ficar solta no meio de uma página.
export const ESTRELA = "#E2B93B";
