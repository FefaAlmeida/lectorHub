"use client";

import { Box, Button, Flex, Icon, IconButton, Input, Stack, Text, Textarea } from "@chakra-ui/react";
import {
  VINHO,
  VINHO_HOVER,
  BORDA,
  BRANCO,
  TEXTO,
  TEXTO_SUAVE,
  REALCE,
  TEXTO_APOIO,
  RAIO_CAMPO,
  ALTURA_CAMPO,
  ALTURA_BOTAO,
  SOMBRA_BOTAO,
  HOVER_BOTAO,
  TRANSICAO,
  TEXTO_MIUDO,
  GAP_ITEM,
  ALTURA_ACAO,
  SOMBRA_MENU,
} from "./tema";

const estiloInput = {
  bg: BRANCO,
  border: "1px solid",
  borderColor: BORDA,
  borderRadius: RAIO_CAMPO,
  h: ALTURA_CAMPO,
  fontSize: TEXTO_APOIO,
  _focus: { borderColor: VINHO, boxShadow: `0 0 0 1px ${VINHO}` },
};

// Botões do painel: baixos, texto pequeno e um leve levantar no hover.
const estiloBotao = {
  borderRadius: RAIO_CAMPO,
  h: ALTURA_BOTAO,
  px: 5,
  fontSize: TEXTO_APOIO,
  fontWeight: "600",
  transition: TRANSICAO,
};

export function Campo({ label, children }) {
  return (
    <Stack gap={2}>
      <Text fontSize={TEXTO_APOIO} fontWeight="medium" color={TEXTO}>
        {label}
      </Text>
      {children}
    </Stack>
  );
}

export function CampoTexto({ label, value, onChange, type = "text", ...props }) {
  return (
    <Campo label={label}>
      <Input value={value ?? ""} onChange={(e) => onChange(e.target.value)} type={type} {...estiloInput} {...props} />
    </Campo>
  );
}

export function CampoArea({ label, value, onChange, ...props }) {
  return (
    <Campo label={label}>
      <Textarea value={value ?? ""} onChange={(e) => onChange(e.target.value)} rows={4} {...estiloInput} h="auto" {...props} />
    </Campo>
  );
}

// <select> nativo — sem dependência de componente composto.
export function CampoSelect({ label, value, onChange, opcoes, ...props }) {
  return (
    <Campo label={label}>
      <Box as="select" value={value ?? ""} onChange={(e) => onChange(e.target.value)} px={3} {...estiloInput} {...props}>
        {opcoes.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.label}
          </option>
        ))}
      </Box>
    </Campo>
  );
}

export function BotaoPrimario(props) {
  return (
    <Button
      bg={VINHO}
      color={BRANCO}
      boxShadow={SOMBRA_BOTAO}
      _hover={{ bg: VINHO_HOVER, ...HOVER_BOTAO }}
      {...estiloBotao}
      {...props}
    />
  );
}

export function BotaoSecundario(props) {
  return (
    <Button
      variant="outline"
      borderColor={VINHO}
      color={VINHO}
      _hover={{ bg: REALCE, ...HOVER_BOTAO }}
      {...estiloBotao}
      {...props}
    />
  );
}

// Paginação simples: anterior / "x de y" / próxima
export function Paginacao({ pagina, totalPaginas, onChange }) {
  if (!totalPaginas || totalPaginas <= 1) return null;

  return (
    <Flex justify="center" align="center" gap={4} mt={6}>
      <BotaoSecundario size="sm" disabled={pagina <= 1} onClick={() => onChange(pagina - 1)}>
        Anterior
      </BotaoSecundario>
      <Text fontSize={TEXTO_APOIO} color={TEXTO_SUAVE}>
        Página {pagina} de {totalPaginas}
      </Text>
      <BotaoSecundario size="sm" disabled={pagina >= totalPaginas} onClick={() => onChange(pagina + 1)}>
        Próxima
      </BotaoSecundario>
    </Flex>
  );
}

export function Vazio({ children }) {
  return (
    <Flex justify="center" py={12}>
      <Text color={TEXTO_SUAVE}>{children}</Text>
    </Flex>
  );
}

// Botão dentro de uma linha de tabela. Os botões de formulário têm 48px de
// altura — o alvo de clique do resto do sistema — e dentro da linha isso
// inflava a tabela inteira. `icone` deixa o botão quadrado, para ação sem
// rótulo.
const estiloAcao = (icone) => ({
  h: ALTURA_ACAO,
  w: icone ? ALTURA_ACAO : undefined,
  px: icone ? 0 : 3,
  fontSize: TEXTO_MIUDO,
});

export function AcaoPrimaria({ icone, ...props }) {
  return <BotaoPrimario {...estiloAcao(icone)} {...props} />;
}

export function AcaoSecundaria({ icone, ...props }) {
  return <BotaoSecundario {...estiloAcao(icone)} {...props} />;
}

// Ação sem rótulo: editar e excluir, nas tabelas e sobre a capa dos livros.
// Branco com borda e sombra baixa porque sobre uma capa escura um ícone vinho
// sem fundo sumiria; no hover a cor da ação preenche o botão. Sem texto
// visível, `rotulo` é o que o leitor de tela anuncia.
export function BotaoIcone({ icone, rotulo, cor = VINHO, ...props }) {
  return (
    <IconButton
      aria-label={rotulo}
      title={rotulo}
      w={ALTURA_ACAO}
      h={ALTURA_ACAO}
      minW={ALTURA_ACAO}
      borderRadius={RAIO_CAMPO}
      bg={BRANCO}
      color={cor}
      border="1px solid"
      borderColor={BORDA}
      boxShadow={SOMBRA_MENU}
      transition={TRANSICAO}
      _hover={{ bg: cor, color: BRANCO, borderColor: cor }}
      _disabled={{ opacity: 0.4, cursor: "not-allowed", bg: BRANCO, color: cor, borderColor: BORDA }}
      {...props}
    >
      <Icon as={icone} boxSize={4} />
    </IconButton>
  );
}

// Rótulo de grupo dentro de um formulário. A barra vinho à esquerda e a linha
// que segue até a borda existem porque o miolo do modal era branco de ponta a
// ponta: só o cabeçalho tinha cor, e os campos vinham todos com o mesmo peso.
export function GrupoCampos({ titulo, children }) {
  return (
    <Stack gap={GAP_ITEM}>
      <Flex align="center" gap={2}>
        <Box w="3px" h="14px" bg={VINHO} borderRadius="full" flexShrink={0} />
        <Text fontSize={TEXTO_MIUDO} fontWeight="700" color={VINHO} letterSpacing="wider" textTransform="uppercase" flexShrink={0}>
          {titulo}
        </Text>
        <Box flex={1} h="1px" bg={REALCE} />
      </Flex>
      {children}
    </Stack>
  );
}
