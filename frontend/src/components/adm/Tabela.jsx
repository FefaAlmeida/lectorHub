"use client";

import { Box, Flex, Spinner, Table, Text } from "@chakra-ui/react";
import {
  BRANCO,
  BORDA,
  VINHO,
  REALCE,
  RAIO,
  TEXTO_SUAVE,
  TEXTO_MIUDO,
  TRANSICAO,
  HOVER_LINHA,
} from "./tema";

// Moldura única das listagens do painel.
//
// Cada página desenhava a própria tabela e as três saíam diferentes: o
// cabeçalho usava FUNDO, que é exatamente a cor de fundo da página, então a
// faixa se fundia com o entorno e os cantos arredondados sumiam; o padding das
// células vinha do padrão do Chakra, mais apertado que o resto do sistema; e
// carregando/vazio eram escritos de novo em cada arquivo.
//
// `colunas` aceita { label, alinhar, largura }.
export function Tabela({ colunas, carregando, vazio, children }) {
  const moldura = {
    bg: BRANCO,
    border: "1px solid",
    borderColor: BORDA,
    borderRadius: RAIO,
    overflow: "hidden",
  };

  if (carregando) {
    return (
      <Box {...moldura}>
        <Flex justify="center" py={16}>
          <Spinner color={VINHO} size="lg" />
        </Flex>
      </Box>
    );
  }

  if (vazio) {
    return (
      <Box {...moldura}>
        <Flex justify="center" py={16}>
          <Text color={TEXTO_SUAVE}>{vazio}</Text>
        </Flex>
      </Box>
    );
  }

  return (
    <Box {...moldura}>
      <Box overflowX="auto">
        <Table.Root size="md" w="100%">
          <Table.Header>
            {/* Faixa em realce (vinho claro) no lugar do bege do fundo: é o que
                torna o canto arredondado visível e amarra a tabela à paleta. */}
            <Table.Row bg={REALCE}>
              {colunas.map((coluna) => (
                <Table.ColumnHeader
                  key={coluna.label}
                  w={coluna.largura}
                  textAlign={coluna.alinhar}
                  color={VINHO}
                  fontSize={TEXTO_MIUDO}
                  fontWeight="700"
                  letterSpacing="wider"
                  textTransform="uppercase"
                  whiteSpace="nowrap"
                  borderBottom="none"
                  px={5}
                  py={4}
                >
                  {coluna.label}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>

          <Table.Body>{children}</Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );
}

// Linha da tabela. A última perde a borda inferior — com ela, sobrava um
// risco encostado no canto arredondado da moldura.
export function Linha(props) {
  return (
    <Table.Row
      transition={TRANSICAO}
      _hover={HOVER_LINHA}
      css={{ "&:last-of-type td": { borderBottom: "none" } }}
      {...props}
    />
  );
}

export function Celula(props) {
  return <Table.Cell px={5} py={4} borderColor={BORDA} verticalAlign="middle" {...props} />;
}

// Par rótulo/valor dentro de uma célula — usado onde duas informações do mesmo
// assunto dividem uma coluna, em vez de virarem duas colunas quase vazias.
export function CelulaDupla({ topo, base }) {
  return (
    <Box minW={0}>
      <Text fontWeight="semibold" lineClamp={1}>
        {topo}
      </Text>
      <Text fontSize={TEXTO_MIUDO} color={TEXTO_SUAVE} lineClamp={1}>
        {base}
      </Text>
    </Box>
  );
}
