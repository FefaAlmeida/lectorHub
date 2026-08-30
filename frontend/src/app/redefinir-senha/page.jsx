"use client";

import { RAIO } from "@/components/tema";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Flex,
  Box,
  Heading,
  Field,
  Input,
  Button,
  Text,
  VStack,
} from "@chakra-ui/react";

import { redefinirSenha } from "../../api";
import { toaster } from "@/components/ui/toaster";
import AuthShell from "@/components/auth/AuthShell";
import { ALTURA_CAMPO } from "@/components/cliente/tema";

const inputProps = {
  h: "54px",
  borderRadius: RAIO,
  border: "1px solid",
  borderColor: "#DED8D0",
  color: "#333333",
  _placeholder: { color: "#918A84" },
  _hover: { borderColor: "#B9B2AC" },
  _focus: { borderColor: "#4A0E17", boxShadow: "0 0 0 1px #4A0E17" },
};

function RedefinirSenhaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [concluido, setConcluido] = useState(false);

  async function handleSubmit() {
    if (!senha || !confirmarSenha) {
      toaster.create({
        title: "Campos obrigatórios",
        description: "Preencha a nova senha e a confirmação.",
        type: "error",
      });
      return;
    }

    if (senha.length < 6) {
      toaster.create({
        title: "Senha inválida",
        description: "A senha deve ter pelo menos 6 caracteres.",
        type: "error",
      });
      return;
    }

    if (senha !== confirmarSenha) {
      toaster.create({
        title: "Senhas diferentes",
        description: "As senhas não coincidem.",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await redefinirSenha(token, senha);

      if (response?.sucesso) {
        setConcluido(true);
        toaster.create({
          title: "Senha redefinida!",
          description: "Faça login com a nova senha.",
          type: "success",
        });
        setTimeout(() => router.replace("/login"), 1200);
      } else {
        toaster.create({
          title: "Não foi possível redefinir",
          description:
            response?.mensagem ||
            response?.erro ||
            "Link inválido ou expirado. Solicite uma nova redefinição.",
          type: "error",
        });
      }
    } catch (error) {
      console.error(error);
      toaster.create({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <VStack gap={4} align="stretch" textAlign="center">
        <Heading as="h2" fontSize="26px" fontFamily="Georgia, serif" color="#2B1D1F">
          Link inválido
        </Heading>
        <Text color="#4A4542" fontSize="15px">
          Este link de redefinição está incompleto. Volte ao login e clique em
          &quot;Esqueceu a senha?&quot; para receber um novo.
        </Text>
        <Button bg="#4A0E17" color="white" h={ALTURA_CAMPO} onClick={() => router.push("/login")}>
          Voltar ao login
        </Button>
      </VStack>
    );
  }

  return (
    <VStack w="100%" gap={0} align="stretch">
      <VStack align="center" gap={1} mb="24px">
        <Heading
          as="h2"
          fontSize={{ base: "28px", md: "34px", xl: "40px" }}
          fontFamily="Georgia, serif"
          fontWeight="800"
          lineHeight="1.1"
          textAlign="center"
          color="#2B1D1F"
        >
          NOVA{" "}
          <Box
            as="span"
            color="#4A0E17"
            position="relative"
            display="inline-block"
            _after={{
              content: '""',
              position: "absolute",
              bottom: "-4px",
              left: 0,
              width: "100%",
              height: "4px",
              bg: "#4A0E17",
              borderRadius: "full",
            }}
          >
            SENHA
          </Box>
        </Heading>
        <Text color="#4A4542" fontSize="14px" textAlign="center" mt={3}>
          Escolha uma nova senha para a sua conta.
        </Text>
      </VStack>

      <VStack
        as="form"
        w="100%"
        gap={0}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Field.Root gap="3px" mb="18px" w="100%">
          <Field.Label color="#4A4542" fontSize="13px" m={0}>
            Nova senha
          </Field.Label>
          <Input
            id="senha"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="new-password"
            {...inputProps}
          />
        </Field.Root>

        <Field.Root gap="3px" mb="20px" w="100%">
          <Field.Label color="#4A4542" fontSize="13px" m={0}>
            Confirme a nova senha
          </Field.Label>
          <Input
            id="confirmarSenha"
            type="password"
            placeholder="Repita a senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            autoComplete="new-password"
            {...inputProps}
          />
        </Field.Root>

        <Button
          type="submit"
          w="100%"
          h={ALTURA_CAMPO}
          bg="#4A0E17"
          color="#FFFFFF"
          borderRadius={RAIO}
          fontSize="17px"
          fontWeight="600"
          _hover={{ bg: "#360A11" }}
          loading={loading}
          disabled={loading || concluido}
        >
          {concluido ? "Senha redefinida" : "Redefinir senha"}
        </Button>

        <Text mt="14px" textAlign="center" fontSize="14px" fontWeight="600" color="#4A0E17">
          Lembrou a senha?{" "}
          <Box
            as="span"
            cursor="pointer"
            fontWeight="700"
            _hover={{ textDecoration: "underline" }}
            onClick={() => router.push("/login")}
          >
            Faça login
          </Box>
        </Text>
      </VStack>
    </VStack>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <AuthShell>
      <Suspense fallback={null}>
        <RedefinirSenhaForm />
      </Suspense>
    </AuthShell>
  );
}
