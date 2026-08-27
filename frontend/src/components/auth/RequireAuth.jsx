"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Flex, Spinner, Text } from "@chakra-ui/react";

import { getPerfil } from "../../api";

// Guard único de rotas protegidas.
//
// - Sem sessão: manda para /login?next=<rota atual>.
// - `tipo="admin"`: além de logado, exige usuario.tipo === "admin";
//   um cliente logado é mandado para /inicio.
// - `rotasPublicas`: prefixos que renderizam sem sessão (ex.: /detalhe_livro,
//   que mostra "Entrar para emprestar" a visitantes).
//
// A sessão vive num cookie httpOnly, então a única fonte de verdade é a
// própria API (/usuarios/me). O backend continua protegendo cada rota;
// este componente só evita expor telas a quem não deveria vê-las.
export default function RequireAuth({ children, tipo, rotasPublicas = [] }) {
  const router = useRouter();
  const pathname = usePathname();

  const ehPublica = rotasPublicas.some((prefixo) => pathname.startsWith(prefixo));
  const [estado, setEstado] = useState(ehPublica ? "ok" : "verificando");

  useEffect(() => {
    if (ehPublica) {
      setEstado("ok");
      return;
    }

    let ativo = true;

    async function verificar() {
      let usuario = null;

      try {
        const resposta = await getPerfil();
        if (resposta?.sucesso) usuario = resposta.dados;
      } catch {
        usuario = null;
      }

      if (!ativo) return;

      if (!usuario) {
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      if (tipo === "admin" && usuario.tipo !== "admin") {
        router.replace("/inicio");
        return;
      }

      setEstado("ok");
    }

    setEstado("verificando");
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

  return children;
}
