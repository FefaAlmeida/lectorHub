// Tokens visuais do painel administrativo.
// A referência é o desenho da branch `front`: fundo #F5F2EE, cartões de canto
// curto sem sombra, tipografia compacta e título em Georgia.
// A paleta é a mesma da área do cliente (components/cliente/tema.js) — as duas
// áreas mudam de densidade, não de cor.

import { RAIO as RAIO_BASE } from "../tema";

export const VINHO = "#4A0E17";
export const VINHO_HOVER = "#360A11";
export const VINHO_ATIVO = "#69333C"; // item selecionado na sidebar
export const TEXTO_SIDEBAR = "#F8EEE8";

export const FUNDO = "#F5F2EE";
export const BRANCO = "#FFFFFF";
export const BORDA = "#EFEBE3";
export const TEXTO = "#333333";
export const TEXTO_SUAVE = "#777777";
export const REALCE = "#F5EDEE"; // hover de botão secundário e selos

// Estados
export const OK_BG = "#E6F4EA";
export const OK_COR = "#137333";
export const ALERTA_BG = "#FFF3E0";
export const ALERTA_COR = "#B78103";
export const ERRO_BG = "#FCE8E6";
export const ERRO_COR = "#C5221F";
export const ERRO_HOVER = "#A11B19"; // botão destrutivo em hover

// --- TIPOGRAFIA ---
// Mesma escala da área do cliente (components/cliente/tema.js). O painel tinha
// a própria — título em px fixo, campo 12px, rótulo 11px — e ficava com um
// texto visivelmente menor que o resto do sistema.
export const FONTE_TITULO = "Georgia, serif";
export const TITULO_PAGINA = { base: "3xl", md: "4xl" }; // h1 da página
export const TITULO_SECAO = "2xl"; // h2 dentro da página
export const TITULO_CARTAO = "md"; // h3 dentro de um cartão
export const TEXTO_APOIO = "sm"; // subtítulo, campos e botões
export const TEXTO_MIUDO = "xs"; // rótulos e metadados
// Item de menu — o mesmo `md` que a barra lateral do cliente usa.
export const TEXTO_MENU = "md";

// Nomes antigos, mantidos porque as páginas já os importam.
export const TITULO_TAMANHO = TITULO_PAGINA;
export const TEXTO_PEQUENO = TEXTO_APOIO;
export const TEXTO_ROTULO = TEXTO_MIUDO;

// --- ARREDONDAMENTO ---
// Mesmo raio da área do cliente (ver components/tema.js): o painel não tem
// mais um canto próprio, senão botão do admin e botão do cliente divergem.
export { RAIO, RAIO_PILULA } from "../tema";
export const RAIO_CARTAO = RAIO_BASE;
export const RAIO_CAMPO = RAIO_BASE;
export const RAIO_MENU = RAIO_BASE;

// --- ESPAÇAMENTO ---
// Também igual ao cliente: o painel respirava menos (padding 5/7 contra 6/8,
// gap 5 contra 8) e a diferença aparecia ao alternar entre as duas áreas.
export const PADDING_PAGINA = { base: 6, md: 8 };
export const LARGURA_CONTEUDO = "1200px";
export const GAP_SECAO = 8; // entre blocos da página
export const GAP_CARTAO = 6; // dentro de um cartão / entre cards
export const GAP_ITEM = 3; // entre linhas de um mesmo bloco
export const PADDING_CARTAO = 6;

// --- ELEVAÇÃO ---
export const SOMBRA_BOTAO = "0 4px 12px rgba(74,14,23,.15)";
export const SOMBRA_MENU = "0 8px 24px rgba(74,14,23,.12)";

// Alvo de clique igual ao do cliente: eram 42px e 40px aqui contra 48px lá.
export const ALTURA_CAMPO = "48px";
export const ALTURA_BOTAO = "48px";
// Ação dentro de cartão pequeno (grade de livros). Botão com a altura de campo
// de formulário fica desproporcional num cartão de ~200px de largura.
export const ALTURA_ACAO = "34px";

// --- INTERAÇÃO ---
// Mesmo hover da área do cliente: levantar 2px e uma sombra baixa.
export const SOMBRA_HOVER = "0 6px 16px rgba(74, 14, 23, 0.10)";
export const TRANSICAO = "all 0.2s ease";

export const HOVER_CARTAO = {
  transform: "translateY(-2px)",
  boxShadow: SOMBRA_HOVER,
};

// Linha de tabela: só realce de fundo, sem levantar (a linha não é clicável;
// o destaque serve para não perder a linha ao ir até a coluna de ações).
export const HOVER_LINHA = { bg: "#FAF7F4" };

// Botão levanta menos que cartão: elemento menor, movimento menor.
export const HOVER_BOTAO = { transform: "translateY(-1px)" };
