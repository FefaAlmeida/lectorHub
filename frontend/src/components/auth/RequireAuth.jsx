"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Flex, Spinner, Text } from "@chakra-ui/react";

import { getPerfil } from "../../api";

// Usuário logado, disponível para qualquer página dentro de um RequireAuth.
// Evita que cada tela chame /usuarios/me de novo.
const UsuarioContext = createContext(null);
export const useUsuario = () => useContext(UsuarioContext);

// Guard único de rotas protegidas.
//
// - Sem sessão: manda para /login?next=<rota atual>.
// - `tipo="admin"`: além de logado, exige usuario.tipo === "admin";
//   um cliente logado é mandado para /inicio.
// - `rotasPublicas`: prefixos que renderizam sem sessão (ex.: /detalhe_livro,
//   que mostra "Entrar para emprestar" a visitantes). Nelas `useUsuario()`
//   devolve o usuário se houver sessão, ou null.
export default function RequireAuth({ children, tipo, rotasPublicas = [] }) {
  const router = useRouter();
  const pathname = usePathname();

  const ehPublica = rotasPublicas.some((prefixo) => pathname.startsWith(prefixo));
  const [estado, setEstado] = useState("verificando");
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    let ativo = true;

    async function verificar() {
      const resposta = await getPerfil();
      const logado = resposta?.sucesso ? resposta.dados : null;

      if (!ativo) return;
      setUsuario(logado);

      if (!logado && !ehPublica) {
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      if (tipo === "admin" && logado?.tipo !== "admin") {
        router.replace("/inicio");
        return;
      }

      setEstado("ok");
    }

    verificar();

    return () => {
      ativo = false;
    };
  }, [pathname, ehPublica, tipo, router]);

  if (estado !== "ok") {
    return (
      <Flex minH="60vh" align="center" justify="center" direction="column" gap={3}>
        <Spinner size="lg" color="#4A0E17" />
        <Text color="gray.600" fontSize="sm">
          Verificando sessão...
        </Text>
      </Flex>
    );
  }

  return <UsuarioContext.Provider value={usuario}>{children}</UsuarioContext.Provider>;
}
