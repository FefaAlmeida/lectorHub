// Rotas do painel administrativo.
//
// Ficam aqui porque três lugares precisam saber quais são: a sidebar (para
// marcar o item ativo), o Header e o Footer (para sumirem no painel). Antes o
// Header e o Footer só conheciam as telas de autenticação, então o cabeçalho
// da área do cliente aparecia por cima do painel — com logo duplicado e dois
// links que jogavam o administrador para fora dele.
export const ROTAS_ADMIN = [
  "/inicioAdm",
  "/catalogoDeLivros",
  "/gestaoCategorias",
  "/gestaoUsuarios",
  "/gestaoEeR",
];

// Prefixo, não igualdade: `/catalogoDeLivros?novo=1` e futuras rotas com
// parâmetro (`/gestaoEeR/123`) continuam contando como painel.
export function ehRotaAdmin(pathname = "") {
  return ROTAS_ADMIN.some((rota) => pathname.startsWith(rota));
}
