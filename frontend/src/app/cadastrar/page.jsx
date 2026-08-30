"use client";

import { RAIO } from "@/components/tema";
import { useState } from "react";
import { criarUsuario, loginUsuario } from "../../api";

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
    <AuthShell>
      <VStack w="100%" gap={0} align="stretch">
          {/* TÍTULO */}
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
            <Field.Root gap="3px" mb="18px" w="100%">
              <Field.Label color="#4A4542" fontSize="13px" m={0}>
                Nome
              </Field.Label>

              <Input
                id="nome"
                type="text"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                h={ALTURA_CAMPO}
                borderRadius={RAIO}
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
            <Field.Root gap="3px" mb="18px" w="100%">
              <Field.Label color="#4A4542" fontSize="13px" m={0}>
                E-mail
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
                _placeholder={{ color: "#918A84" }}
                _hover={{ borderColor: "#B9B2AC" }}
                _focus={{
                  borderColor: "#4A0E17",
                  boxShadow: "0 0 0 1px #4A0E17",
                }}
              />
            </Field.Root>

            {/* Senha */}
            <Field.Root gap="3px" mb="18px" w="100%">
              <Field.Label color="#4A4542" fontSize="13px" m={0}>
                Insira uma senha
              </Field.Label>

              <Input
                id="senha"
                type="password"
                placeholder="Password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                h={ALTURA_CAMPO}
                borderRadius={RAIO}
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
            <Field.Root gap="3px" mb="20px" w="100%">
              <Field.Label color="#4A4542" fontSize="13px" m={0}>
                Confirme a senha
              </Field.Label>

              <Input
                id="confirmPassword"
                type="password"
                placeholder="Password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                h={ALTURA_CAMPO}
                borderRadius={RAIO}
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
              h={ALTURA_CAMPO}
              loading={loading}
              disabled={loading}
              bg="#4A0E17"
              color="#FFFFFF"
              borderRadius={RAIO}
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
              mt="14px"
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
    </AuthShell>
  );
}

