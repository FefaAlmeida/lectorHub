"use client";

import { Box, Button, Flex, Input, Stack, Text, Textarea } from "@chakra-ui/react";
import { VINHO, TEXTO_SUAVE } from "./Shell";

const estiloInput = {
  bg: "white",
  border: "1px solid #E8DCC4",
  borderRadius: "10px",
  h: "42px",
  _focus: { borderColor: VINHO, boxShadow: `0 0 0 1px ${VINHO}` },
};

export function Campo({ label, children }) {
  return (
    <Stack gap={1.5}>
      <Text fontSize="xs" fontWeight="semibold" color="#2D2D2D">
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
  return <Button bg={VINHO} color="white" borderRadius="10px" _hover={{ bg: "#360A11" }} {...props} />;
}

export function BotaoSecundario(props) {
  return <Button variant="outline" borderColor={VINHO} color={VINHO} borderRadius="10px" _hover={{ bg: "#F5EDEE" }} {...props} />;
}

// Paginação simples: anterior / "x de y" / próxima
export function Paginacao({ pagina, totalPaginas, onChange }) {
  if (!totalPaginas || totalPaginas <= 1) return null;

  return (
    <Flex justify="center" align="center" gap={4} mt={6}>
      <BotaoSecundario size="sm" disabled={pagina <= 1} onClick={() => onChange(pagina - 1)}>
        Anterior
      </BotaoSecundario>
      <Text fontSize="sm" color={TEXTO_SUAVE}>
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
