"use client";

import { useState } from "react";
import { loginUsuario, solicitarRedefinicaoSenha } from "../../../api";
import Image from "next/image";

import {
  Flex,
  Box,
  Heading,
  Field,
  Input,
  Link,
  Button,
  Text,
  VStack,
} from "@chakra-ui/react";

export default function Logar() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingRedefinicao, setLoadingRedefinicao] = useState(false);

  async function handleLogin() {
    if (!email || !senha) {
      toast.error("Preencha todos os campos.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Formato de email inválido.");
      return;
    }

    setLoading(true);

    try {
      const response = await loginUsuario({
        email: email.trim().toLowerCase(),
        senha,
      });

      if (response?.sucesso) {
        toast.success("Login realizado com sucesso!");

        const destino =
          response.dados?.usuario?.tipo_usuario === "ADMIN"
            ? "/inicio-adm"
            : "/inicio-dashboard";

        window.location.href = destino;
      } else {
        toast.error(
          response?.erro ||
            response?.mensagem ||
            "Erro ao realizar login."
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSolicitarRedefinicaoSenha() {
    if (!email) {
      toast.error("Digite seu e-mail para redefinir a senha.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toast.error("Formato de email inválido.");
      return;
    }

    setLoadingRedefinicao(true);

    try {
      const response = await solicitarRedefinicaoSenha(
        email.trim().toLowerCase()
      );

      if (response?.sucesso) {
        toast.success(
          response.mensagem ||
            "Enviamos o link de redefinição para seu e-mail."
        );
      } else {
        toast.error(
          response?.erro ||
            response?.mensagem ||
            "Erro ao solicitar redefinição de senha."
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro de conexão com o servidor.");
    } finally {
      setLoadingRedefinicao(false);
    }
  }

  return (
    <Flex
      as="main"
      w="100%"
      minH="100vh"
      bg="#f3e6cd"
      justify="center"
      align="center"
      p={{ base: 6, lg: 10 }}
    >
      <Flex
        w="100%"
        maxW="1150px"
        h={{ base: "auto", lg: "650px" }}
        bg="white"
        borderRadius="22px"
        overflow="hidden"
        direction={{ base: "column", lg: "row" }}
      >
        {/* Lado esquerdo */}
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
            style={{ width: "100%", height: "auto" }}
            priority
          />
        </Flex>

        {/* Lado direito */}
        <Flex
          w={{ base: "100%", lg: "50%" }}
          direction="column"
          justify="center"
          align="center"
          p={{ base: "40px 30px", lg: "70px" }}
        >
          <Heading
            as="h2"
            color="#4A0E17"
            fontSize={{ base: "42px", lg: "52px" }}
            fontFamily="Georgia, serif"
            mb="45px"
            textAlign="center"
          >
            LOGIN
          </Heading>

          <VStack
            as="form"
            w="100%"
            maxW="420px"
            gap={5}
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            {/* Email */}
            <Field.Root>
              <Field.Label color="#666">Username</Field.Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                h="58px"
                borderRadius="8px"
                border="1px solid"
                borderColor="#dbcdb4"
                _hover={{ borderColor: "#c4b59d" }}
                _focus={{
                  borderColor: "#4A0E17",
                  boxShadow: "0 0 0 1px #4A0E17",
                }}
              />
            </Field.Root>

            {/* Senha */}
            <Field.Root>
              <Field.Label color="#666">Password</Field.Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                h="58px"
                borderRadius="8px"
                border="1px solid"
                borderColor="#dbcdb4"
                _hover={{ borderColor: "#c4b59d" }}
                _focus={{
                  borderColor: "#4A0E17",
                  boxShadow: "0 0 0 1px #4A0E17",
                }}
              />
            </Field.Root>

            {/* Esqueceu a senha */}
            <Flex w="100%" justify="flex-start" mt={2} mb={2}>
              <Button
                variant="link"
                color="#4A0E17"
                onClick={handleSolicitarRedefinicaoSenha}
                disabled={loadingRedefinicao}
              >
                {loadingRedefinicao
                  ? "Enviando link..."
                  : "Esqueceu a senha?"}
              </Button>
            </Flex>

            {/* Botão Entrar */}
            <Button
              type="submit"
              w="100%"
              h="54px"
              bg="#4A0E17"
              color="white"
              borderRadius="8px"
              fontSize="18px"
              fontWeight="600"
              transition="0.3s"
              _hover={{ bg: "#641320" }}
              _active={{ bg: "#380a11" }}
              loading={loading}
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            {/* Cadastro */}
            <Text
              mt="25px"
              textAlign="center"
              fontSize="16px"
              fontWeight="bold"
              color="#4A0E17"
            >
              Não tem uma conta?{" "}
              <Box
                as="span"
                cursor="pointer"
                _hover={{ textDecoration: "underline" }}
              >
                Cadastre-se
              </Box>
            </Text>
          </VStack>
        </Flex>
      </Flex>
    </Flex>
  );
}