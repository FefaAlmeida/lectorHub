// Tokens compartilhados por TODO o sistema — área do cliente, painel do admin
// e telas de autenticação.
//
// Arredondamento: um valor só.
// Antes havia três escalas convivendo (cliente 18/14/12/8, admin 7/8/10, auth
// 22/8) mais literais soltos (2px, 4px, "md", "2xl"), então botão, campo e
// cartão tinham cantos diferentes dependendo da tela em que você estivesse.
// Agora todo elemento retangular usa RAIO. Só forma circular escapa: avatar,
// selo em pílula e ícone redondo continuam com RAIO_PILULA.
export const RAIO = "10px";
export const RAIO_PILULA = "full";
