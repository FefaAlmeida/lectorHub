"use client";

import { useState } from "react";

import { loginUsuario, solicitarRedefinicaoSenha } from "../../api";

import Image from "next/image";

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

export default function Logar() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingRedefinicao, setLoadingRedefinicao] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function handleLogin() {
    if (!email || !senha) {
      toaster.create({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos.",
        type: "error",
      });
      return;
    }

    if (!emailRegex.test(email)) {
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
        email: email.trim().toLowerCase(),
        senha,
      });

      if (response?.sucesso) {
        toaster.create({
          title: "Login realizado!",
          description: "Redirecionando para a sua biblioteca...",
          type: "success",
        });

        // Admin cai no catálogo de gestão; cliente, na própria biblioteca.
        const destino =
          response?.dados?.usuario?.tipo === "admin"
            ? "/catalogoDeLivros"
            : "/inicio";

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
    if (!email) {
      toaster.create({
        title: "E-mail obrigatório",
        description: "Digite seu e-mail para redefinir a senha.",
        type: "error",
      });
      return;
    }

    if (!emailRegex.test(email)) {
      toaster.create({
        title: "E-mail inválido",
        description: "Digite um e-mail válido.",
        type: "error",
      });
      return;
    }

    setLoadingRedefinicao(true);

    try {
      const response = await solicitarRedefinicaoSenha(
        email.trim().toLowerCase()
      );

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
    <Flex
      as="main"
      w="100%"
      minH="100vh"
      position="relative"
      overflow="hidden"
      justify="center"
      align="center"
      p={{ base: 6, lg: 10 }}
      bg="#F3EDE3"
    >
      {/* =================================================
          BOLHAS DO FUNDO
          FICAM ATRÁS DA CAIXA PRINCIPAL
      ================================================= */}

      <Box
        position="absolute"
        top="-180px"
        left="-140px"
        w="420px"
        h="420px"
        borderRadius="full"
        bg="rgba(74,14,23,0.10)"
        pointerEvents="none"
      />

      <Box
        position="absolute"
        bottom="-220px"
        right="-150px"
        w="500px"
        h="500px"
        borderRadius="full"
        bg="rgba(74,14,23,0.12)"
        pointerEvents="none"
      />

      <Box
        position="absolute"
        top="12%"
        right="8%"
        w="90px"
        h="90px"
        borderRadius="full"
        border="1px solid rgba(74,14,23,0.18)"
        pointerEvents="none"
      />

      <Box
        position="absolute"
        bottom="15%"
        left="7%"
        w="55px"
        h="55px"
        borderRadius="full"
        border="1px solid rgba(74,14,23,0.15)"
        pointerEvents="none"
      />

      {/* =================================================
          CAIXA PRINCIPAL
          SEM BOLHAS INTERNAS
      ================================================= */}

      <Flex
        w="100%"
        maxW="1150px"
        h={{ base: "auto", lg: "650px" }}
        bg="#FFFFFF"
        borderRadius="22px"
        overflow="hidden"
        direction={{ base: "column", lg: "row" }}
        boxShadow="0 20px 55px rgba(74,14,23,0.15)"
        position="relative"
        zIndex={1}
      >
        {/* =================================================
            LADO ESQUERDO
        ================================================= */}

        <Flex
          w={{ base: "100%", lg: "50%" }}
          bg="#4A0E17"
          justify="center"
          align="center"
          h={{ base: "300px", lg: "auto" }}
          overflow="hidden"
        >
          <Image
            src="/logoLectorHub.png"
            alt="Lector Hub"
            width={350}
            height={350}
            style={{
              width: "100%",
              height: "auto",
            }}
            priority
          />
        </Flex>

        {/* =================================================
            LADO DIREITO
        ================================================= */}

        <Flex
          w={{ base: "100%", lg: "50%" }}
          direction="column"
          justify="center"
          align="center"
          p={{ base: "40px 30px", lg: "70px" }}
          bg="#FFFFFF"
        >
          <VStack
            w="100%"
            maxW="420px"
            gap={0}
            align="stretch"
          >
            {/* =================================================
                TÍTULO
            ================================================= */}

            <Heading
              as="h2"
              color="#4A0E17"
              fontSize={{ base: "42px", lg: "52px" }}
              fontFamily="Georgia, serif"
              lineHeight="1.05"
              mb="34px"
              textAlign="center"
            >
              LOGIN
            </Heading>

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
              {/* =================================================
                  EMAIL
              ================================================= */}

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
                  h="58px"
                  borderRadius="8px"
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

              {/* =================================================
                  SENHA
              ================================================= */}

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
                  h="58px"
                  borderRadius="8px"
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

              {/* =================================================
                  ESQUECEU A SENHA
              ================================================= */}

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

              {/* =================================================
                  BOTÃO ENTRAR
              ================================================= */}

              <Button
                type="submit"
                w="100%"
                h="54px"
                bg="#4A0E17"
                color="#FFFFFF"
                borderRadius="8px"
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

              {/* =================================================
                  CADASTRO
              ================================================= */}

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
        </Flex>
      </Flex>
    </Flex>
  );
}