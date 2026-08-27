"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../../components/sideBar/sideBar";
import { getPerfil, atualizarPerfil } from "../../../api";

import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  HStack,
  Icon,
  Input,
  Stack,
  Text,
  Switch,
  Spinner,
} from "@chakra-ui/react";

import {
  FiUser,
  FiLock,
  FiEdit3,
  FiBell,
  FiCreditCard,
  FiCheckCircle,
  FiSave,
} from "react-icons/fi";

const toast = {
  success: (msg) => alert(msg),
  error: (msg) => alert(msg),
};

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const PRIMARY_COLOR = "#4A0E17";
const PRIMARY_DARK = "#360A11";
const BG_COLOR = "#F5F2EE";
const CARD_BG = "#FFFFFF";
const BORDER_COLOR = "#EFEBE3";
const TEXT_DARK = "#333333";
const TEXT_LIGHT = "#777777";

// Componente ajustado para alternar a estrutura do DOM entre leitura e edição
function Campo({
  label,
  value,
  onChange,
  type = "text",
  editando = false,
  placeholder,
}) {
  return (
    <Stack gap={1.5} flex="1">
      <Text fontSize="xs" color={TEXT_DARK} fontWeight="semibold">
        {label}
      </Text>

      {editando ? (
        <Input
          value={value ?? ""}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          bg={CARD_BG}
          border="1px solid"
          borderColor={PRIMARY_COLOR}
          borderRadius="6px"
          h="38px"
          fontSize="sm"
          color={TEXT_DARK}
          _focus={{
            borderColor: PRIMARY_COLOR,
            boxShadow: `0 0 0 1px ${PRIMARY_COLOR}`,
          }}
        />
      ) : (
        <Flex
          align="center"
          px={3}
          h="38px"
          bg="#FAFAFA"
          border="1px solid #E7DED8"
          borderRadius="6px"
          userSelect="text"
        >
          <Text fontSize="sm" color={TEXT_DARK}>
            {type === "password"
              ? value
                ? "••••••••"
                : "••••••••"
              : value || "—"}
          </Text>
        </Flex>
      )}
    </Stack>
  );
}

export default function MeuCadastro() {
  const [dados, setDados] = useState({
    id_usuario: "",
    nome: "",
    email: "",
    telefone: "",
    tipo: "",
    senha: "",
    emailNotificacao: true,
    novidades: true,
  });

  const [editando, setEditando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  async function carregarDados() {
    setCarregando(true);
    try {
      const perfilResponse = await getPerfil();
      const usuarioAtual =
        perfilResponse?.dados || perfilResponse?.usuario || perfilResponse || {};

      if (!usuarioAtual || perfilResponse.sucesso === false) {
        toast.error(perfilResponse?.erro || "Erro ao carregar dados do perfil.");
        return;
      }

      setDados((prev) => ({
        ...prev,
        id_usuario: usuarioAtual.id_usuario || usuarioAtual.id || "",
        nome: usuarioAtual.nome || "",
        email: usuarioAtual.email || "",
        telefone: usuarioAtual.telefone || "",
        tipo: usuarioAtual.tipo || "cliente",
        senha: "",
      }));
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
      toast.error("Erro de conexão ao carregar o perfil.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  function alterarCampo(campo, valor) {
    setDados((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  async function salvarAlteracoes() {
    setSalvando(true);
    try {
      const payload = {
        nome: dados.nome,
        email: dados.email,
        telefone: dados.telefone,
      };

      if (dados.senha && dados.senha.trim() !== "") {
        payload.senha = dados.senha;
      }

      const response = await atualizarPerfil(
        dados.id_usuario ? { id_usuario: dados.id_usuario, ...payload } : payload
      );

      if (response?.sucesso === false) {
        toast.error(response?.erro || "Erro ao atualizar perfil.");
        return;
      }

      toast.success("Perfil atualizado com sucesso!");
      setEditando(false);
      await carregarDados();
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      toast.error(
        error.response?.data?.message || "Erro de conexão ao salvar alterações."
      );
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <Flex minH="100vh" bg={BG_COLOR} align="center" justify="center">
        <Stack align="center" gap={3}>
          <Spinner size="xl" color={PRIMARY_COLOR} />
          <Text color={TEXT_LIGHT}>Carregando dados do perfil...</Text>
        </Stack>
      </Flex>
    );
  }

  return (
    <Flex minH="100vh" bg={BG_COLOR}>
      <Sidebar />

      <Box
        flex={1}
        p={{ base: 6, md: 8 }}
        pb={16}
        overflow="hidden"
      >
        <Box
          maxW="8xl"
          mx="auto"
          bg="white"
          borderRadius="12px"
          border="1px solid"
          borderColor={BORDER_COLOR}
          p={{ base: 5, md: 7 }}
        >
          <Stack gap={7}>

            {/* CABEÇALHO */}
            <Flex justify="space-between" align="center">
              <Stack gap={2}>
                <Heading
                  as="h1"
                  fontSize={{ base: "3xl", md: "4xl" }}
                  fontWeight="bold"
                  color={PRIMARY_COLOR}
                  fontFamily="Georgia, serif"
                >
                  Meu Cadastro
                </Heading>

                <Text fontSize="md" color={TEXT_LIGHT}>
                  Atualize seus dados cadastrais e mantenha suas informações sempre em dia.
                </Text>
              </Stack>
            </Flex>

            {/* CONTEÚDO */}
            <Flex
              gap={6}
              align="flex-start"
              direction={{ base: "column", lg: "row" }}
            >

              {/* COLUNA ESQUERDA */}
              <Stack flex="1" w="full" gap={6}>

                <Box>
                  <HStack gap={2} mb={5}>
                    <Icon as={FiUser} color={PRIMARY_COLOR} boxSize={4} />
                    <Heading
                      fontSize="sm"
                      fontWeight="bold"
                      color={PRIMARY_COLOR}
                    >
                      Dados Pessoais
                    </Heading>
                  </HStack>

                  <Stack gap={4}>
                    <Campo
                      label="Nome Completo"
                      value={dados.nome}
                      editando={editando}
                      placeholder="Seu nome completo"
                      onChange={(e) => alterarCampo("nome", e.target.value)}
                    />

                    <Campo
                      label="E-mail"
                      value={dados.email}
                      editando={editando}
                      type="email"
                      placeholder="seu.email@exemplo.com"
                      onChange={(e) => alterarCampo("email", e.target.value)}
                    />

                    <Campo
                      label="Telefone"
                      value={dados.telefone}
                      editando={editando}
                      placeholder="(00) 00000-0000"
                      onChange={(e) => alterarCampo("telefone", e.target.value)}
                    />
                  </Stack>
                </Box>

                

              </Stack>

              {/* COLUNA DIREITA */}
              <Stack
                w={{ base: "full", lg: "390px" }}
                gap={6}
              >

                <Box>
                  <HStack gap={2} mb={5}>
                    <Icon
                      as={FiLock}
                      color={PRIMARY_COLOR}
                      boxSize={4}
                    />

                    <Heading
                      fontSize="sm"
                      fontWeight="bold"
                      color={PRIMARY_COLOR}
                    >
                      Segurança da Conta
                    </Heading>
                  </HStack>

                  <Campo
                    label="Nova Senha"
                    value={dados.senha}
                    editando={editando}
                    type="password"
                    placeholder="Digite para alterar a senha"
                    onChange={(e) => alterarCampo("senha", e.target.value)}
                  />
                </Box>

                <Box>
                  <HStack gap={2} mb={5}>
                    <Icon
                      as={FiBell}
                      color={PRIMARY_COLOR}
                      boxSize={4}
                    />

                    <Heading
                      fontSize="sm"
                      fontWeight="bold"
                      color={PRIMARY_COLOR}
                    >
                      Preferências de Notificação
                    </Heading>
                  </HStack>

                  <Stack gap={5}>

                    <Flex
                      justify="space-between"
                      align="center"
                    >
                      <Stack gap={0} pr={4}>
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color={TEXT_DARK}
                        >
                          E-mail
                        </Text>

                        <Text
                          fontSize="10px"
                          color={TEXT_LIGHT}
                        >
                          Avisos sobre devoluções e empréstimos.
                        </Text>
                      </Stack>

                      <Switch.Root
                        checked={dados.emailNotificacao}
                        disabled={!editando}
                        onCheckedChange={(e) =>
                          alterarCampo(
                            "emailNotificacao",
                            e.checked
                          )
                        }
                      >
                        <Switch.HiddenInput />
                        <Switch.Control />
                      </Switch.Root>
                    </Flex>

                    <Flex
                      justify="space-between"
                      align="center"
                    >
                      <Stack gap={0} pr={4}>
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color={TEXT_DARK}
                        >
                          Novidades
                        </Text>

                        <Text
                          fontSize="10px"
                          color={TEXT_LIGHT}
                        >
                          Novidades do acervo.
                        </Text>
                      </Stack>

                      <Switch.Root
                        checked={dados.novidades}
                        disabled={!editando}
                        onCheckedChange={(e) =>
                          alterarCampo(
                            "novidades",
                            e.checked
                          )
                        }
                      >
                        <Switch.HiddenInput />
                        <Switch.Control />
                      </Switch.Root>
                    </Flex>

                  </Stack>
                </Box>

              </Stack>

            </Flex>

            {/* AÇÕES */}
            <Flex justify="flex-end" gap={3} mt={1}>
              {editando && (
                <Button
                  variant="outline"
                  color={PRIMARY_COLOR}
                  borderColor={PRIMARY_COLOR}
                  borderRadius="14px"
                  size="md"
                  disabled={salvando}
                  onClick={() => {
                    setEditando(false);
                    carregarDados();
                  }}
                >
                  Cancelar
                </Button>
              )}

              {!editando ? (
                <Button
                  bg={PRIMARY_COLOR}
                  color="white"
                  borderRadius="14px"
                  size="md"
                  px={6}
                  boxShadow="0 4px 12px rgba(74,14,23,.15)"
                  onClick={() => setEditando(true)}
                  _hover={{
                    bg: PRIMARY_DARK,
                    transform: "translateY(-2px)",
                  }}
                  transition={`all .3s ${EASE}`}
                >
                  <Icon as={FiEdit3} mr={2} />
                  Editar Dados
                </Button>
              ) : (
                <Button
                  bg={PRIMARY_COLOR}
                  color="white"
                  borderRadius="14px"
                  size="md"
                  px={6}
                  boxShadow="0 4px 12px rgba(74,14,23,.15)"
                  disabled={salvando}
                  onClick={salvarAlteracoes}
                  _hover={{
                    bg: PRIMARY_DARK,
                    transform: "translateY(-2px)",
                  }}
                  transition={`all .3s ${EASE}`}
                >
                  <Icon as={FiSave} mr={2} />
                  {salvando ? "Salvando..." : "Salvar Alterações"}
                </Button>
              )}
            </Flex>

          </Stack>
        </Box>
      </Box>
    </Flex>
  );
}