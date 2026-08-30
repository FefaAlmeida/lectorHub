"use client";

import { RAIO } from "@/components/tema";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

import { loginUsuario, solicitarRedefinicaoSenha } from "../../api";


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

import { toaster } from "@/components/ui/toaster";
import AuthShell from "@/components/auth/AuthShell";
import { ALTURA_CAMPO } from "@/components/cliente/tema";

function Logar() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingRedefinicao, setLoadingRedefinicao] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function handleLogin() {
    const emailNormalizado = email.trim().toLowerCase();

    if (!emailNormalizado || !senha) {
      toaster.create({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos.",
        type: "error",
      });
      return;
    }

    if (!emailRegex.test(emailNormalizado)) {
      toaster.create({
        title: "E-mail inválido",
        description: "Digite um e-mail válido.",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await loginUsuario({
        email: emailNormalizado,
        senha,
      });

      if (response?.sucesso) {
        toaster.create({
          title: "Login realizado!",
          description: "Redirecionando para a sua biblioteca...",
          type: "success",
        });

        // Volta para a rota que pediu login (?next=), senão:
        // admin cai no catálogo de gestão; cliente, na própria biblioteca.
        const next = searchParams.get("next");
        const nextSeguro = next && next.startsWith("/") && !next.startsWith("//") ? next : null;
        const destino =
          nextSeguro ||
          (response?.dados?.usuario?.tipo === "admin"
            ? "/catalogoDeLivros"
            : "/inicio");

        setTimeout(() => {
          window.location.href = destino;
        }, 800);
      } else {
        toaster.create({
          title: "Erro ao entrar",
          description:
            response?.erro ||
            response?.mensagem ||
            "Erro ao realizar login.",
          type: "error",
        });

        setLoading(false);
      }
    } catch (error) {
      console.error(error);

      toaster.create({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor.",
        type: "error",
      });

      setLoading(false);
    }
  }

  async function handleSolicitarRedefinicaoSenha() {
    const emailNormalizado = email.trim().toLowerCase();

    if (!emailNormalizado) {
      toaster.create({
        title: "E-mail obrigatório",
        description: "Digite seu e-mail para redefinir a senha.",
        type: "error",
      });
      return;
    }

    if (!emailRegex.test(emailNormalizado)) {
      toaster.create({
        title: "E-mail inválido",
        description: "Digite um e-mail válido.",
        type: "error",
      });
      return;
    }

    setLoadingRedefinicao(true);

    try {
      const response = await solicitarRedefinicaoSenha(emailNormalizado);

      if (response?.sucesso) {
        toaster.create({
          title: "Link enviado",
          description:
            response.mensagem ||
            "Enviamos o link de redefinição para seu e-mail.",
          type: "success",
        });
      } else {
        toaster.create({
          title: "Erro ao solicitar",
          description:
            response?.erro ||
            response?.mensagem ||
            "Erro ao solicitar redefinição de senha.",
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
      setLoadingRedefinicao(false);
    }
  }

return (
    <AuthShell>
      <VStack w="100%" gap={0} align="stretch">
          {/* =================================================
              TÍTULO IMPACTANTE
          ================================================= */}

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
              FAÇA SEU{" "}
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
                LOGIN
              </Box>
            </Heading>
          </VStack>

          {/* =================================================
              FORMULÁRIO
          ================================================= */}

          <VStack
            as="form"
            w="100%"
            gap={0}
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <Field.Root mb="18px">
              <Field.Label
                color="#4A4542"
                fontSize="13px"
                mb="7px"
              >
                Username
              </Field.Label>

              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                h={ALTURA_CAMPO}
                borderRadius={RAIO}
                border="1px solid"
                borderColor="#DED8D0"
                color="#333333"
                _placeholder={{
                  color: "#918A84",
                }}
                _hover={{
                  borderColor: "#B9B2AC",
                }}
                _focus={{
                  borderColor: "#4A0E17",
                  boxShadow: "0 0 0 1px #4A0E17",
                }}
              />
            </Field.Root>

            <Field.Root mb="6px">
              <Field.Label
                color="#4A4542"
                fontSize="13px"
                mb="7px"
              >
                Password
              </Field.Label>

              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                h={ALTURA_CAMPO}
                borderRadius={RAIO}
                border="1px solid"
                borderColor="#DED8D0"
                color="#333333"
                _placeholder={{
                  color: "#918A84",
                }}
                _hover={{
                  borderColor: "#B9B2AC",
                }}
                _focus={{
                  borderColor: "#4A0E17",
                  boxShadow: "0 0 0 1px #4A0E17",
                }}
              />
            </Field.Root>

            <Flex
              w="100%"
              justify="flex-start"
              mb="24px"
            >
              <Button
                variant="link"
                color="#4A0E17"
                fontSize="13px"
                fontWeight="500"
                h="auto"
                minH="auto"
                p={0}
                onClick={handleSolicitarRedefinicaoSenha}
                disabled={loadingRedefinicao}
                _hover={{
                  textDecoration: "underline",
                }}
              >
                {loadingRedefinicao
                  ? "Enviando link..."
                  : "Esqueceu a senha?"}
              </Button>
            </Flex>

            <Button
              type="submit"
              w="100%"
              h={ALTURA_CAMPO}
              bg="#4A0E17"
              color="#FFFFFF"
              borderRadius={RAIO}
              fontSize="18px"
              fontWeight="600"
              transition="0.3s"
              boxShadow="0 5px 14px rgba(74,14,23,0.10)"
              _hover={{
                bg: "#360A11",
                boxShadow: "0 7px 18px rgba(74,14,23,0.16)",
              }}
              _active={{
                bg: "#360A11",
              }}
              loading={loading}
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            <Text
              mt="17px"
              textAlign="center"
              fontSize="14px"
              fontWeight="600"
              color="#4A0E17"
            >
              Não tem uma conta?{" "}
              <Box
                as="span"
                cursor="pointer"
                fontWeight="700"
                _hover={{
                  textDecoration: "underline",
                }}
                onClick={() => {
                  window.location.href = "/cadastrar";
                }}
              >
                Cadastre-se
              </Box>
            </Text>
        </VStack>
      </VStack>
    </AuthShell>
  );
}

// useSearchParams exige um limite de Suspense na página.
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <Logar />
    </Suspense>
  );
}
