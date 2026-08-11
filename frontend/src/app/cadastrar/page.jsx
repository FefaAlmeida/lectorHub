"use client";

import { useState } from "react";
import { criarUsuario, loginUsuario } from "../../api";
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

export default function Cadastrar() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    // Verifica campos obrigatórios
    if (!nome || !email || !senha || !confirmarSenha) {
      toaster.create({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos.",
        type: "error",
      });

      return;
    }

    // Verifica formato do e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      toaster.create({
        title: "E-mail inválido",
        description: "Digite um e-mail válido.",
        type: "error",
      });

      return;
    }

    // Verifica tamanho da senha
    if (senha.length < 6) {
      toaster.create({
        title: "Senha inválida",
        description: "A senha deve ter pelo menos 6 caracteres.",
        type: "error",
      });

      return;
    }

    // Verifica confirmação da senha
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
      const data = {
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha,
      };

      const response = await criarUsuario(data);

      if (response?.sucesso) {
        // Login automático após o cadastro
        const loginResponse = await loginUsuario({
          email: email.trim().toLowerCase(),
          senha,
        });

        if (!loginResponse?.sucesso) {
          toaster.create({
            title: "Cadastro realizado",
            description:
              "Sua conta foi criada, mas não foi possível realizar o login automático.",
            type: "warning",
          });

          return;
        }

        toaster.create({
          title: "Cadastro realizado!",
          description: "Sua conta foi criada com sucesso.",
          type: "success",
        });

        setTimeout(() => {
          window.location.href = "/inicio";
        }, 1000);
      } else {
        toaster.create({
          title: "Erro ao cadastrar",
          description:
            response?.erro ||
            response?.mensagem ||
            "Erro ao cadastrar usuário.",
          type: "error",
        });
      }
    } catch (error) {
      console.error(error);

      if (error?.response?.data) {
        const apiError =
          error.response.data.erro ||
          error.response.data.mensagem;

        toaster.create({
          title: "Erro",
          description:
            apiError || "Erro de conexão com o servidor.",
          type: "error",
        });
      } else {
        toaster.create({
          title: "Erro de conexão",
          description: "Não foi possível conectar ao servidor.",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
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
        {/* LADO ESQUERDO */}
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

        {/* LADO DIREITO */}
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
            CADASTRO
          </Heading>

          <VStack
            as="form"
            w="100%"
            maxW="420px"
            gap={5}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {/* Nome */}
            <Field.Root>
              <Field.Label color="#666">
                Nome
              </Field.Label>

              <Input
                id="nome"
                type="text"
                placeholder="Seu nome"
                h="58px"
                borderRadius="8px"
                border="1px solid"
                borderColor="#dbcdb4"
                _hover={{
                  borderColor: "#c4b59d",
                }}
                _focus={{
                  borderColor: "#4A0E17",
                  boxShadow: "0 0 0 1px #4A0E17",
                }}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </Field.Root>

            {/* E-mail */}
            <Field.Root>
              <Field.Label color="#666">
                E-mail
              </Field.Label>

              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                h="58px"
                borderRadius="8px"
                border="1px solid"
                borderColor="#dbcdb4"
                _hover={{
                  borderColor: "#c4b59d",
                }}
                _focus={{
                  borderColor: "#4A0E17",
                  boxShadow: "0 0 0 1px #4A0E17",
                }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field.Root>

            {/* Senha */}
            <Field.Root>
              <Field.Label color="#666">
                Insira uma senha
              </Field.Label>

              <Input
                id="senha"
                type="password"
                placeholder="Password"
                h="58px"
                borderRadius="8px"
                border="1px solid"
                borderColor="#dbcdb4"
                _hover={{
                  borderColor: "#c4b59d",
                }}
                _focus={{
                  borderColor: "#4A0E17",
                  boxShadow: "0 0 0 1px #4A0E17",
                }}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </Field.Root>

            {/* Confirmação da senha */}
            <Field.Root>
              <Field.Label color="#666">
                Confirme a senha
              </Field.Label>

              <Input
                id="confirmPassword"
                type="password"
                placeholder="Password"
                h="58px"
                borderRadius="8px"
                border="1px solid"
                borderColor="#dbcdb4"
                _hover={{
                  borderColor: "#c4b59d",
                }}
                _focus={{
                  borderColor: "#4A0E17",
                  boxShadow: "0 0 0 1px #4A0E17",
                }}
                value={confirmarSenha}
                onChange={(e) =>
                  setConfirmarSenha(e.target.value)
                }
              />
            </Field.Root>

            {/* Botão de cadastro */}
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
              _hover={{
                bg: "#641320",
              }}
              _active={{
                bg: "#380a11",
              }}
              disabled={loading}
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </Button>

            {/* Login */}
            <Text
              mt="25px"
              textAlign="center"
              fontSize="16px"
              fontWeight="bold"
              color="#4A0E17"
            >
              Já tem uma conta?{" "}
              <Box
                as="span"
                cursor="pointer"
                _hover={{
                  textDecoration: "underline",
                }}
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                Faça login
              </Box>
            </Text>
          </VStack>
        </Flex>
      </Flex>
    </Flex>
  );
}

