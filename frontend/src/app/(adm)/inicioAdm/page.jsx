"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flex, Heading, SimpleGrid, Spinner, Text, Icon } from "@chakra-ui/react";
import { FiBook, FiUsers, FiClock, FiBookOpen, FiAlertCircle, FiCheckCircle, FiArrowRight } from "react-icons/fi";

import Shell, { Cartao, VINHO, TEXTO_SUAVE } from "@/components/adm/Shell";
import { getResumoAdmin } from "../../../api";
import { toaster } from "@/components/ui/toaster";

const ATALHOS = [
  { label: "Aprovar pedidos pendentes", href: "/gestaoEeR?status=PENDENTE", icon: FiClock },
  { label: "Cadastrar livro", href: "/catalogoDeLivros?novo=1", icon: FiBook },
  { label: "Gerenciar usuários", href: "/gestaoUsuarios", icon: FiUsers },
];

function Metrica({ icon, label, valor, cor, bg }) {
  return (
    <Cartao>
      <Flex align="center" gap={4}>
        <Flex w="48px" h="48px" borderRadius="xl" bg={bg} color={cor} align="center" justify="center" flexShrink={0}>
          <Icon as={icon} boxSize={6} />
        </Flex>
        <Flex direction="column">
          <Text fontSize="sm" color={TEXTO_SUAVE}>{label}</Text>
          <Heading size="2xl" color="#2D2D2D">{valor}</Heading>
        </Flex>
      </Flex>
    </Cartao>
  );
}

export default function InicioAdm() {
  const [resumo, setResumo] = useState(null);

  useEffect(() => {
    getResumoAdmin().then((r) => {
      if (r?.sucesso) setResumo(r.dados);
      else toaster.create({ title: "Erro", description: r?.mensagem, type: "error" });
    });
  }, []);

  return (
    <Shell titulo="Dashboard" subtitulo="Visão geral da biblioteca.">
      {!resumo ? (
        <Flex justify="center" py={20}><Spinner color={VINHO} size="xl" /></Flex>
      ) : (
        <>
          <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={5} mb={10}>
            <Metrica icon={FiBook} label="Livros no acervo" valor={resumo.livros} cor="#1976D2" bg="#E3F2FD" />
            <Metrica icon={FiCheckCircle} label="Disponíveis na estante" valor={resumo.livros_disponiveis} cor="#388E3C" bg="#E8F5E9" />
            <Metrica icon={FiUsers} label="Leitores cadastrados" valor={resumo.usuarios} cor={VINHO} bg="#F5EDEE" />
            <Metrica icon={FiClock} label="Pedidos pendentes" valor={resumo.pendentes} cor="#E65100" bg="#FFF3E0" />
            <Metrica icon={FiBookOpen} label="Livros emprestados" valor={resumo.emprestados} cor="#F57F17" bg="#FFFDE7" />
            <Metrica icon={FiAlertCircle} label="Empréstimos atrasados" valor={resumo.atrasados} cor="#D32F2F" bg="#FFEBEE" />
          </SimpleGrid>

          <Heading size="lg" color={VINHO} fontFamily="serif" mb={4}>Ações rápidas</Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={5}>
            {ATALHOS.map((a) => (
              <Cartao key={a.href} as={Link} href={a.href} _hover={{ borderColor: VINHO, transform: "translateY(-2px)" }} transition="all .2s">
                <Flex align="center" justify="space-between">
                  <Flex align="center" gap={3} color={VINHO}>
                    <Icon as={a.icon} boxSize={5} />
                    <Text fontWeight="semibold">{a.label}</Text>
                  </Flex>
                  <Icon as={FiArrowRight} color={VINHO} />
                </Flex>
              </Cartao>
            ))}
          </SimpleGrid>
        </>
      )}
    </Shell>
  );
}
