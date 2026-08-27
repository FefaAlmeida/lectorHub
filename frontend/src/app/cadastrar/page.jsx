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
    const nomeNormalizado = nome.trim();
    const emailNormalizado = email.trim().toLowerCase();

    // Verifica campos obrigatórios
    if (!nomeNormalizado || !emailNormalizado || !senha || !confirmarSenha) {
      toaster.create({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos.",
        type: "error",
      });

      return;
    }

    // Verifica formato do e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailNormalizado)) {
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
        nome: nomeNormalizado,
        email: emailNormalizado,
        senha,
      };

      const response = await criarUsuario(data);

      if (response?.sucesso) {
        // Login automático após o cadastro
        const loginResponse = await loginUsuario({
          email: emailNormalizado,
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
    position="relative"
    overflow="hidden"
    justify="center"
    align="center"
    p={{ base: 6, lg: 10 }}
    bg="#F8F5F0"
  >
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      w="100%"
      h="100%"
      pointerEvents="none"
      zIndex={0}
      overflow="hidden"
      bg="radial-gradient(circle at 50% 50%, #FAF8F5 0%, #F0EAE1 60%, #E6DCD0 100%)"
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.35}
        backgroundImage="radial-gradient(#A39382 0.8px, transparent 0.8px)"
        backgroundSize="24px 24px"
      />

      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        w={{ base: "700px", md: "1100px" }}
        h={{ base: "700px", md: "1100px" }}
        borderRadius="full"
        bg="radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(232, 220, 196, 0.3) 45%, rgba(248, 245, 240, 0) 70%)"
        filter="blur(50px)"
      />

      <Box
        position="absolute"
        top="-15%"
        left="-10%"
        w="650px"
        h="650px"
        borderRadius="full"
        bg="radial-gradient(circle, rgba(74, 14, 23, 0.06) 0%, rgba(248, 245, 240, 0) 70%)"
        filter="blur(80px)"
      />

      <Box
        position="absolute"
        bottom="-15%"
        right="-10%"
        w="700px"
        h="700px"
        borderRadius="full"
        bg="radial-gradient(circle, rgba(74, 14, 23, 0.07) 0%, rgba(248, 245, 240, 0) 70%)"
        filter="blur(80px)"
      />

      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.45 }}
      >
        <path d="M -50 150 L 300 150 L 420 270 L 650 270" stroke="#8C7A6B" strokeWidth="1.2" />
        <circle cx="650" cy="270" r="4" fill="#4A0E17" />
        <circle cx="650" cy="270" r="8" stroke="#8C7A6B" strokeWidth="1" />

        <path d="M 150 -50 L 150 200 L 280 330 L 280 500" stroke="#8C7A6B" strokeWidth="1" strokeDasharray="5 5" />
        <circle cx="280" cy="500" r="3" fill="#8C7A6B" />

        <path d="M 1970 150 L 1620 150 L 1500 270 L 1270 270" stroke="#8C7A6B" strokeWidth="1.2" />
        <circle cx="1270" cy="270" r="4" fill="#4A0E17" />
        <circle cx="1270" cy="270" r="8" stroke="#8C7A6B" strokeWidth="1" />

        <path d="M 1770 -50 L 1770 200 L 1640 330 L 1640 500" stroke="#8C7A6B" strokeWidth="1" strokeDasharray="5 5" />
        <circle cx="1640" cy="500" r="3" fill="#8C7A6B" />

        <path d="M -50 930 L 300 930 L 450 780 L 680 780" stroke="#8C7A6B" strokeWidth="1.2" />
        <circle cx="680" cy="780" r="4" fill="#4A0E17" />
        <circle cx="680" cy="780" r="8" stroke="#8C7A6B" strokeWidth="1" />

        <path d="M 220 1130 L 220 880 L 350 750 L 350 600" stroke="#8C7A6B" strokeWidth="1" strokeDasharray="5 5" />
        <circle cx="350" cy="600" r="3" fill="#8C7A6B" />

        <path d="M 1970 930 L 1620 930 L 1470 780 L 1240 780" stroke="#8C7A6B" strokeWidth="1.2" />
        <circle cx="1240" cy="780" r="4" fill="#4A0E17" />
        <circle cx="1240" cy="780" r="8" stroke="#8C7A6B" strokeWidth="1" />

        <path d="M 1700 1130 L 1700 880 L 1570 750 L 1570 600" stroke="#8C7A6B" strokeWidth="1" strokeDasharray="5 5" />
        <circle cx="1570" cy="600" r="3" fill="#8C7A6B" />

        <path d="M 960 -50 L 960 180" stroke="#8C7A6B" strokeWidth="1.2" />
        <circle cx="960" cy="180" r="4" fill="#4A0E17" />

        <path d="M 960 1130 L 960 900" stroke="#8C7A6B" strokeWidth="1.2" />
        <circle cx="960" cy="900" r="4" fill="#4A0E17" />

        <circle cx="420" cy="270" r="2.5" fill="#8C7A6B" />
        <circle cx="1500" cy="270" r="2.5" fill="#8C7A6B" />
        <circle cx="450" cy="780" r="2.5" fill="#8C7A6B" />
        <circle cx="1470" cy="780" r="2.5" fill="#8C7A6B" />
      </svg>
    </Box>

    {/* =================================================
        CAIXA PRINCIPAL
    ================================================= */}

    <Flex
      w="100%"
      maxW="1150px"
      minH={{ base: "auto", lg: "700px" }}
      bg="#FFFFFF"
      borderRadius="22px"
      overflow="hidden"
      direction={{ base: "column", lg: "row" }}
      boxShadow="0 25px 60px -15px rgba(74, 14, 23, 0.12), 0 10px 30px -10px rgba(0, 0, 0, 0.05)"
      border="1px solid rgba(255, 255, 255, 0.8)"
      position="relative"
      zIndex={1}
    >
      {/* LADO ESQUERDO */}
      <Flex
        w={{ base: "100%", lg: "50%" }}
        bg="#4A0E17"
        justify="center"
        align="center"
        h={{ base: "280px", lg: "auto" }}
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
        p={{ base: "35px 25px", lg: "40px 60px" }}
        bg="#FFFFFF"
      >
        <VStack w="100%" maxW="420px" gap={0} align="stretch">
          {/* TÍTULO */}
          <VStack align="center" gap={1} mb="28px">
            <Heading
              as="h2"
              fontSize={{ base: "30px", lg: "38px" }}
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
                  borderRadius: "2px",
                }}
              >
                CADASTRO
              </Box>
            </Heading>
          </VStack>

          {/* FORMULÁRIO */}
          <VStack
            as="form"
            w="100%"
            gap={0}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {/* Nome */}
            <Field.Root gap="3px" mb="22px" w="100%">
              <Field.Label color="#4A4542" fontSize="13px" m={0}>
                Nome
              </Field.Label>

              <Input
                id="nome"
                type="text"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                h="48px"
                borderRadius="8px"
                border="1px solid"
                borderColor="#DED8D0"
                color="#333333"
                _placeholder={{ color: "#918A84" }}
                _hover={{ borderColor: "#B9B2AC" }}
                _focus={{
                  borderColor: "#4A0E17",
                  boxShadow: "0 0 0 1px #4A0E17",
                }}
              />
            </Field.Root>

            {/* E-mail */}
            <Field.Root gap="3px" mb="22px" w="100%">
              <Field.Label color="#4A4542" fontSize="13px" m={0}>
                E-mail
              </Field.Label>

              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                h="48px"
                borderRadius="8px"
                border="1px solid"
                borderColor="#DED8D0"
                color="#333333"
                _placeholder={{ color: "#918A84" }}
                _hover={{ borderColor: "#B9B2AC" }}
                _focus={{
                  borderColor: "#4A0E17",
                  boxShadow: "0 0 0 1px #4A0E17",
                }}
              />
            </Field.Root>

            {/* Senha */}
            <Field.Root gap="3px" mb="22px" w="100%">
              <Field.Label color="#4A4542" fontSize="13px" m={0}>
                Insira uma senha
              </Field.Label>

              <Input
                id="senha"
                type="password"
                placeholder="Password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                h="48px"
                borderRadius="8px"
                border="1px solid"
                borderColor="#DED8D0"
                color="#333333"
                _placeholder={{ color: "#918A84" }}
                _hover={{ borderColor: "#B9B2AC" }}
                _focus={{
                  borderColor: "#4A0E17",
                  boxShadow: "0 0 0 1px #4A0E17",
                }}
              />
            </Field.Root>

            {/* Confirmação da senha */}
            <Field.Root gap="3px" mb="26px" w="100%">
              <Field.Label color="#4A4542" fontSize="13px" m={0}>
                Confirme a senha
              </Field.Label>

              <Input
                id="confirmPassword"
                type="password"
                placeholder="Password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                h="48px"
                borderRadius="8px"
                border="1px solid"
                borderColor="#DED8D0"
                color="#333333"
                _placeholder={{ color: "#918A84" }}
                _hover={{ borderColor: "#B9B2AC" }}
                _focus={{
                  borderColor: "#4A0E17",
                  boxShadow: "0 0 0 1px #4A0E17",
                }}
              />
            </Field.Root>

            {/* Botão */}
            <Button
              type="submit"
              w="100%"
              h="50px"
              loading={loading}
              disabled={loading}
              bg="#4A0E17"
              color="#FFFFFF"
              borderRadius="8px"
              fontSize="17px"
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
            >
              Cadastrar
            </Button>

            {/* Link para Login */}
            <Text
              mt="18px"
              textAlign="center"
              fontSize="14px"
              fontWeight="600"
              color="#4A0E17"
            >
              Já tem uma conta?{" "}
              <Box
                as="span"
                cursor="pointer"
                fontWeight="700"
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
        </VStack>
      </Flex>
    </Flex>
  </Flex>
);
}

