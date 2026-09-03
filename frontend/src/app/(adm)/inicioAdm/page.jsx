"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, Flex, Heading, HStack, Image, SimpleGrid, Spinner, Stack, Text, Icon, VStack } from "@chakra-ui/react";
import {
  FiBook,
  FiUsers,
  FiClock,
  FiBookOpen,
  FiAlertCircle,
  FiBarChart2,
  FiCheckCircle,
  FiArrowRight,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";

import Shell, { Cartao, VINHO, TEXTO_SUAVE } from "@/components/adm/Shell";
import {
  FONTE_TITULO,
  TITULO_SECAO,
  TEXTO,
  TEXTO_APOIO,
  TEXTO_MIUDO,
  BORDA,
  REALCE,
  BRANCO,
  FUNDO,
  ALERTA_BG,
  ALERTA_COR,
  ERRO_BG,
  ERRO_COR,
  GAP_CARTAO,
  HOVER_CARTAO,
  HOVER_LINHA,
  TRANSICAO,
  RAIO,
} from "@/components/adm/tema";
import { getResumoAdmin } from "../../../api";
import { toaster } from "@/components/ui/toaster";

// Rótulo curto: "Aprovar pedidos pendentes" não cabia numa coluna de três e
// saía cortado com reticências.
const ATALHOS = [
  { label: "Aprovar pedidos", href: "/gestaoEeR?status=PENDENTE", icon: FiClock },
  { label: "Cadastrar livro", href: "/catalogoDeLivros?novo=1", icon: FiBook },
  { label: "Gerenciar leitores", href: "/gestaoUsuarios", icon: FiUsers },
];

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function rotuloMes(chave) {
  const [ano, mes] = chave.split("-");
  return `${MESES[Number(mes) - 1]}/${ano.slice(2)}`;
}

// Título de seção no mesmo formato das telas do cliente.
function TituloSecao({ children }) {
  return (
    <Heading fontSize={TITULO_SECAO} fontWeight="bold" color={VINHO} fontFamily={FONTE_TITULO}>
      {children}
    </Heading>
  );
}

// Contador do panorama. Vira link quando o número leva a uma tela onde se age
// sobre ele — era isso que o cartão "Alertas e Pendências" fazia, repetindo os
// mesmos três números que já estavam logo acima.
function Metrica({ icon, label, valor, href }) {
  return (
    <Cartao as={Link} href={href} h="100%" transition={TRANSICAO} _hover={HOVER_CARTAO}>
      <Flex align="center" gap={4}>
        <Flex w="48px" h="48px" borderRadius="full" bg={REALCE} color={VINHO} align="center" justify="center" flexShrink={0}>
          <Icon as={icon} boxSize={5} />
        </Flex>

        {/* Rótulo em uma linha só, sem corte: quem garante que ele cabe é a
            grade abaixo, que só vai a quatro colunas quando há largura para
            o mais longo deles ("Disponíveis na estante"). */}
        <Box minW={0}>
          <Text fontSize={TEXTO_MIUDO} color={TEXTO_SUAVE} whiteSpace="nowrap" lineHeight="1.4">
            {label}
          </Text>
          <Heading fontSize={TITULO_SECAO} color={TEXTO} lineHeight="1.2">
            {valor}
          </Heading>
        </Box>
      </Flex>
    </Cartao>
  );
}

// Atalho do rodapé do painel. Ele carregava o mesmo desenho dos contadores de
// cima — mesma caixa branca, mesmo ícone solto — e a página terminava com duas
// fileiras de retângulos idênticos que diziam coisas diferentes. Aqui a
// superfície é o realce da paleta e a seta anda para a direita no hover, para
// o cartão se ler como "vá para", não como "veja este número".
function Atalho({ icon, label, href }) {
  return (
    <Cartao
      as={Link}
      href={href}
      h="100%"
      bg={REALCE}
      borderColor="transparent"
      transition={TRANSICAO}
      css={{ "&:hover .seta-atalho": { transform: "translateX(4px)" } }}
      _hover={{ ...HOVER_CARTAO, borderColor: VINHO }}
    >
      <Flex align="center" gap={4}>
        <Flex
          w="40px"
          h="40px"
          borderRadius="full"
          bg={BRANCO}
          color={VINHO}
          align="center"
          justify="center"
          flexShrink={0}
        >
          <Icon as={icon} boxSize={5} />
        </Flex>

        <Text fontSize={TEXTO_APOIO} fontWeight="600" color={TEXTO} lineClamp={1} flex={1} minW={0}>
          {label}
        </Text>

        <Icon
          as={FiArrowRight}
          className="seta-atalho"
          color={VINHO}
          flexShrink={0}
          transition={TRANSICAO}
        />
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

  const porMes = resumo?.por_mes ?? [];
  const pico = Math.max(1, ...porMes.map((m) => m.total));

  // Uma pendência por vez, a mais urgente — mesmo padrão da home do cliente.
  const alerta = !resumo
    ? null
    : resumo.atrasados > 0
    ? {
        icone: FiAlertCircle,
        bg: ERRO_BG,
        cor: ERRO_COR,
        texto: `${resumo.atrasados} ${resumo.atrasados === 1 ? "empréstimo está atrasado" : "empréstimos estão atrasados"}.`,
        href: "/gestaoEeR?status=EMPRESTADO",
        acao: "Ver empréstimos",
      }
    : resumo.pendentes > 0
    ? {
        icone: FiClock,
        bg: ALERTA_BG,
        cor: ALERTA_COR,
        texto: `${resumo.pendentes} ${resumo.pendentes === 1 ? "pedido aguarda" : "pedidos aguardam"} sua aprovação.`,
        href: "/gestaoEeR?status=PENDENTE",
        acao: "Aprovar pedidos",
      }
    : null;

  return (
    <Shell titulo="Dashboard" subtitulo="Panorama do acervo, da circulação e do que aguarda aprovação.">
      {!resumo ? (
        <Flex justify="center" py={20}><Spinner color={VINHO} size="xl" /></Flex>
      ) : (
        <>
          {/* O que precisa de ação vem primeiro, como na home do cliente */}
          {alerta && (
            <Flex
              bg={alerta.bg}
              border="1px solid"
              borderColor={alerta.cor}
              borderRadius={RAIO}
              p={4}
              gap={3}
              align="center"
              flexWrap="wrap"
            >
              <Icon as={alerta.icone} color={alerta.cor} boxSize={5} />
              <Text fontSize={TEXTO_APOIO} color={alerta.cor} flex={1} minW="200px">
                {alerta.texto}
              </Text>
              <Text
                as={Link}
                href={alerta.href}
                fontSize={TEXTO_APOIO}
                fontWeight="medium"
                color={alerta.cor}
                _hover={{ textDecoration: "underline" }}
              >
                {alerta.acao} <Icon as={FiArrowRight} ml={1} display="inline" />
              </Text>
            </Flex>
          )}

          {/* PANORAMA — cada número aparece uma única vez no painel */}
          {/* Quatro colunas só a partir de 2xl. Em xl a área de conteúdo tem
              ~936px e cada cartão ficaria com ~216px — menos que os 48px do
              ícone mais o rótulo mais o padding, e o texto era cortado. */}
          <SimpleGrid columns={{ base: 1, sm: 2, "2xl": 4 }} gap={GAP_CARTAO}>
            <Metrica icon={FiBook} label="Livros no acervo" valor={resumo.livros} href="/catalogoDeLivros" />
            <Metrica icon={FiCheckCircle} label="Disponíveis na estante" valor={resumo.livros_disponiveis} href="/catalogoDeLivros" />
            <Metrica icon={FiBookOpen} label="Emprestados" valor={resumo.emprestados} href="/gestaoEeR?status=EMPRESTADO" />
            <Metrica icon={FiUsers} label="Leitores cadastrados" valor={resumo.usuarios} href="/gestaoUsuarios" />
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={GAP_CARTAO}>
            {/* MAIS EMPRESTADOS */}
            <Cartao display="flex" flexDirection="column" gap={GAP_CARTAO} h="100%">
              <HStack gap={3} color={VINHO}>
                <Icon as={FiTrendingUp} boxSize={5} />
                <TituloSecao>Mais emprestados</TituloSecao>
              </HStack>

              {resumo.mais_emprestados.length === 0 ? (
                <Text fontSize={TEXTO_APOIO} color={TEXTO_SUAVE}>
                  Nenhum empréstimo concedido ainda.
                </Text>
              ) : (
                <VStack align="stretch" gap={1}>
                  {resumo.mais_emprestados.map((livro, indice) => (
                    <Flex
                      key={livro.id}
                      align="center"
                      gap={3}
                      p={2}
                      borderRadius={RAIO}
                      transition={TRANSICAO}
                      _hover={HOVER_LINHA}
                    >
                      <Text fontWeight="bold" color={VINHO} fontSize={TEXTO_APOIO} w="14px">
                        {indice + 1}
                      </Text>

                      {livro.capa_url ? (
                        <Image src={livro.capa_url} alt={livro.titulo} w="34px" h="48px" fit="cover" borderRadius={RAIO} flexShrink={0} />
                      ) : (
                        <Flex w="34px" h="48px" borderRadius={RAIO} bg={FUNDO} align="center" justify="center" flexShrink={0}>
                          <Icon as={FiBook} boxSize={4} color={TEXTO_SUAVE} />
                        </Flex>
                      )}

                      <Box minW={0} flex={1}>
                        <Text fontSize={TEXTO_APOIO} fontWeight="600" color={TEXTO} lineClamp={1}>
                          {livro.titulo}
                        </Text>
                        <Text fontSize={TEXTO_MIUDO} color={TEXTO_SUAVE} lineClamp={1}>
                          {livro.autor}
                        </Text>
                      </Box>

                      <Text fontSize={TEXTO_MIUDO} color={TEXTO_SUAVE} flexShrink={0}>
                        {livro.total}x
                      </Text>
                    </Flex>
                  ))}
                </VStack>
              )}
            </Cartao>

            {/* EMPRÉSTIMOS POR MÊS */}
            <Cartao display="flex" flexDirection="column" gap={GAP_CARTAO} h="100%">
              <HStack gap={3} color={VINHO}>
                <Icon as={FiBarChart2} boxSize={5} />
                <TituloSecao>Empréstimos por mês</TituloSecao>
              </HStack>

              <Flex align="flex-end" justify="space-between" gap={2} flex={1} minH="160px">
                {porMes.map((m) => (
                  <Flex key={m.mes} direction="column" align="center" gap={2} flex={1} h="100%" justify="flex-end">
                    <Text fontSize={TEXTO_MIUDO} color={TEXTO_SUAVE}>{m.total}</Text>
                    <Box
                      w="100%"
                      maxW="36px"
                      // Barra zerada vira um traço: sem isso o mês some do
                      // gráfico e dá impressão de período faltando.
                      h={m.total === 0 ? "2px" : `${Math.round((m.total / pico) * 100)}%`}
                      bg={m.total === 0 ? BORDA : VINHO}
                      borderTopRadius={RAIO}
                      transition={TRANSICAO}
                    />
                    <Text fontSize={TEXTO_MIUDO} color={TEXTO_SUAVE}>{rotuloMes(m.mes)}</Text>
                  </Flex>
                ))}
              </Flex>
            </Cartao>
          </SimpleGrid>

          {/* AÇÕES RÁPIDAS */}
          <Stack gap={GAP_CARTAO}>
            {/* As outras duas seções têm ícone no título; esta não tinha. */}
            <HStack gap={3} color={VINHO}>
              <Icon as={FiZap} boxSize={5} />
              <TituloSecao>Ações rápidas</TituloSecao>
            </HStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={GAP_CARTAO}>
              {ATALHOS.map((a) => (
                <Atalho key={a.href} {...a} />
              ))}
            </SimpleGrid>
          </Stack>
        </>
      )}
    </Shell>
  );
}
