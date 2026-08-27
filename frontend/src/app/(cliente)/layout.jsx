import RequireAuth from "@/components/auth/RequireAuth";

// Área do cliente exige login, exceto a página de detalhe do livro,
// que visitantes podem ver (ela oferece "Entrar" para emprestar).
export default function ClienteLayout({ children }) {
  return <RequireAuth rotasPublicas={["/detalhe_livro"]}>{children}</RequireAuth>;
}
