import RequireAuth from "@/components/auth/RequireAuth";

// Todas as telas do painel exigem sessão de administrador.
export default function AdmLayout({ children }) {
  return <RequireAuth tipo="admin">{children}</RequireAuth>;
}
