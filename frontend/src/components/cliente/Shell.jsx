"use client";

import { Box, Flex, Heading, Icon, Spinner, Stack, Text } from "@chakra-ui/react";
import Sidebar from "@/components/sideBar/sideBar";

import {
  PRIMARY_COLOR,
  BG_COLOR,
  CARD_BG,
  BORDER_COLOR,
  TEXT_DARK,
  TEXT_LIGHT,
  FONTE_TITULO,
  TITULO_PAGINA,
  TITULO_SECAO,
  TEXTO_APOIO,
  TITULO_CARTAO,
  SUAVE_BG,
  HOVER_CARTAO,
  TRANSICAO,
  RAIO_CARTAO,
  PADDING_PAGINA,
  PADDING_CARTAO,
  GAP_SECAO,
  LARGURA_CONTEUDO,
} from "./tema";

// Moldura comum das telas do cliente: sidebar + cabeçalho + conteúdo.
// Existe pelo mesmo motivo do Shell do admin: antes cada página definia a
// própria largura (8xl, 5xl, 640px, nenhuma), o próprio gap de seção (12, 8, 5)
// e o próprio tamanho de título, e a diferença aparecia ao navegar entre elas.
// `largura` estreita apenas o CONTEÚDO, nunca o cabeçalho: a moldura é sempre
// a mesma, então o título fica na mesma distância da barra lateral em todas as
// telas. Centralizar o bloco inteiro numa largura menor (era o que acontecia no
// "Meu cadastro") empurrava só aquele título para a direita.
export default function Shell({
  titulo,
  subtitulo,
  acoes,
  largura,
  children,
}) {
  return (
    <Flex minH="100vh" bg={BG_COLOR} direction={{ base: "column", md: "row" }}>
      <Sidebar />

      <Box flex={1} minW={0} p={PADDING_PAGINA} pb={16}>
        <Stack maxW={LARGURA_CONTEUDO} mx="auto" gap={GAP_SECAO} align="stretch">
          {titulo && (
            <Flex justify="space-between" align="flex-end" gap={4} flexWrap="wrap">
              <Stack gap={1}>
                <Heading
                  as="h1"
                  fontSize={TITULO_PAGINA}
                  fontWeight="bold"
                  color={PRIMARY_COLOR}
                  fontFamily={FONTE_TITULO}
                  lineHeight="1.1"
                >
                  {titulo}
                </Heading>
                {subtitulo && (
                  <Text fontSize={TEXTO_APOIO} color={TEXT_LIGHT}>
                    {subtitulo}
                  </Text>
                )}
              </Stack>
              {acoes}
            </Flex>
          )}

          {largura ? (
            <Stack maxW={largura} w="100%" gap={GAP_SECAO} align="stretch">
              {children}
            </Stack>
          ) : (
            children
          )}
        </Stack>
      </Box>
    </Flex>
  );
}

// Cartão branco padrão da área do cliente.
export function Cartao(props) {
  return (
    <Box
      bg={CARD_BG}
      border="1px solid"
      borderColor={BORDER_COLOR}
      borderRadius={RAIO_CARTAO}
      p={PADDING_CARTAO}
      {...props}
    />
  );
}

// Título de seção dentro da página (h2).
export function TituloSecao({ children, ...props }) {
  return (
    <Heading
      as="h2"
      fontSize={TITULO_SECAO}
      fontWeight="bold"
      color={PRIMARY_COLOR}
      fontFamily={FONTE_TITULO}
      {...props}
    >
      {children}
    </Heading>
  );
}

// Cartão de aviso: ícone em círculo + título + explicação.
// Vive aqui porque é usado em mais de uma tela (avisos da home e regras de
// empréstimo) e antes era o mesmo bloco copiado três vezes na mesma página.
export function CartaoAviso({ icone, titulo, children }) {
  return (
    <Box
      bg={SUAVE_BG}
      border="1px solid"
      borderColor={BORDER_COLOR}
      borderRadius={RAIO_CARTAO}
      p={5}
      w="100%"
      transition={TRANSICAO}
      _hover={HOVER_CARTAO}
    >
      <Flex gap={4} align="start">
        <Flex
          align="center"
          justify="center"
          w="44px"
          h="44px"
          borderRadius="full"
          border="2px solid"
          borderColor={PRIMARY_COLOR}
          color={PRIMARY_COLOR}
          flexShrink={0}
        >
          <Icon as={icone} boxSize={5} />
        </Flex>

        <Box>
          <Text fontWeight="bold" fontSize={TITULO_CARTAO} color={TEXT_DARK} mb={1}>
            {titulo}
          </Text>
          <Text fontSize={TEXTO_APOIO} color={TEXT_LIGHT} lineHeight="relaxed" whiteSpace="pre-line">
            {children}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}

// Estados de carregamento e vazio — para não haver um spinner diferente por tela.
export function Carregando({ texto = "Carregando..." }) {
  return (
    <Flex justify="center" align="center" py={20}>
      <Stack align="center" gap={4}>
        <Spinner color={PRIMARY_COLOR} size="xl" borderWidth="3px" />
        <Text color={TEXT_LIGHT} fontSize={TEXTO_APOIO}>
          {texto}
        </Text>
      </Stack>
    </Flex>
  );
}

// `acao` deixa o estado vazio oferecer uma saída em vez de só constatar o vazio.
export function Vazio({ titulo, icone, acao, children }) {
  return (
    <Flex justify="center" align="center" py={16}>
      <Stack align="center" gap={3} textAlign="center" maxW="md">
        {icone && (
          <Flex
            w="56px"
            h="56px"
            borderRadius="full"
            bg={SUAVE_BG}
            align="center"
            justify="center"
            color={PRIMARY_COLOR}
          >
            <Icon as={icone} boxSize={6} />
          </Flex>
        )}
        {titulo && (
          <Text color={PRIMARY_COLOR} fontWeight="bold">
            {titulo}
          </Text>
        )}
        <Text color={TEXT_LIGHT} fontSize={TEXTO_APOIO}>
          {children}
        </Text>
        {acao}
      </Stack>
    </Flex>
  );
}

// Tela inteira de carregamento (antes de existir cabeçalho para mostrar).
export function TelaCarregando() {
  return (
    <Flex minH="100vh" bg={BG_COLOR} align="center" justify="center">
      <Spinner color={PRIMARY_COLOR} size="xl" borderWidth="3px" />
    </Flex>
  );
}
