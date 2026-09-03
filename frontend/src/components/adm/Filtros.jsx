"use client";

import { Box, Button, Flex, Icon, Input, InputGroup, Menu, Text } from "@chakra-ui/react";
import { FiChevronDown, FiRefreshCcw, FiSearch } from "react-icons/fi";
import {
  VINHO,
  VINHO_HOVER,
  BRANCO,
  BORDA,
  REALCE,
  TEXTO,
  TEXTO_APOIO,
  TEXTO_MIUDO,
  ALTURA_CAMPO,
  SOMBRA_MENU,
  TRANSICAO,
  RAIO,
} from "./tema";

// Barra de busca e menus de filtro do painel, no formato da tela de busca do
// cliente. Estavam escritos dentro da página de livros; usuários repetia o
// desenho antigo (dois campos empilhados dentro de um cartão), então as duas
// listagens filtravam de jeitos diferentes.

export function BarraBusca({ valor, onChange, onBuscar, placeholder }) {
  return (
    <Flex gap={4} flexWrap={{ base: "wrap", md: "nowrap" }}>
      <InputGroup flex="1" startElement={<Icon as={FiSearch} color={VINHO} ml={2} />}>
        <Input
          placeholder={placeholder}
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onBuscar()}
          bg={BRANCO}
          border="1px solid"
          borderColor={BORDA}
          borderRadius={RAIO}
          h={ALTURA_CAMPO}
          pl={10}
          fontSize={TEXTO_APOIO}
          _placeholder={{ color: "#A8A29E" }}
          _focus={{ borderColor: VINHO, boxShadow: `0 0 0 1px ${VINHO}` }}
          transition={TRANSICAO}
        />
      </InputGroup>

      <Button
        onClick={onBuscar}
        bg={VINHO}
        color={BRANCO}
        h={ALTURA_CAMPO}
        px={8}
        borderRadius={RAIO}
        fontSize={TEXTO_APOIO}
        _hover={{ bg: VINHO_HOVER }}
        transition={TRANSICAO}
      >
        Buscar
      </Button>
    </Flex>
  );
}

export function FiltroMenu({ label, opcoes, valor, onChange }) {
  const selecionada = opcoes.find((opcao) => opcao.valor === valor) || opcoes[0];

  return (
    <Box flex={{ base: "1 1 100%", md: "1" }} minW="170px">
      <Text fontSize={TEXTO_MIUDO} color={TEXTO} mb={1.5} fontWeight="semibold" ml={2}>
        {label}
      </Text>

      <Menu.Root positioning={{ sameWidth: true }} onSelect={(d) => onChange(d.value)}>
        <Menu.Trigger asChild>
          <Button
            variant="outline"
            bg={BRANCO}
            border="1px solid"
            borderColor={BORDA}
            borderRadius={RAIO}
            h={ALTURA_CAMPO}
            px={4}
            w="full"
            justifyContent="space-between"
            color={TEXTO}
            fontWeight="500"
            fontSize={TEXTO_APOIO}
            transition={TRANSICAO}
            _hover={{ borderColor: VINHO, bg: REALCE }}
            _focus={{ borderColor: VINHO, boxShadow: `0 0 0 1px ${VINHO}` }}
          >
            {selecionada.label}
            <Icon as={FiChevronDown} color={VINHO} />
          </Button>
        </Menu.Trigger>

        <Menu.Positioner>
          <Menu.Content
            bg={BRANCO}
            borderRadius={RAIO}
            border="1px solid"
            borderColor={BORDA}
            boxShadow={SOMBRA_MENU}
            p={2}
            zIndex="popover"
          >
            {opcoes.map((opcao) => (
              <Menu.Item
                key={opcao.valor || opcao.label}
                value={opcao.valor}
                px={3}
                py={2.5}
                borderRadius={RAIO}
                cursor="pointer"
                color={TEXTO}
                fontWeight="500"
                fontSize={TEXTO_APOIO}
                transition={TRANSICAO}
                _hover={{ bg: REALCE, color: VINHO }}
              >
                {opcao.label}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </Box>
  );
}

// Alinhado com os menus, não com os rótulos acima deles — daí o mt.
export function BotaoLimpar({ onClick }) {
  return (
    <Button
      variant="ghost"
      color={VINHO}
      px={2}
      h={ALTURA_CAMPO}
      mt="22px"
      fontSize={TEXTO_APOIO}
      _hover={{ bg: "transparent", textDecoration: "underline" }}
      onClick={onClick}
    >
      <Icon as={FiRefreshCcw} mr={2} /> Limpar filtros
    </Button>
  );
}
