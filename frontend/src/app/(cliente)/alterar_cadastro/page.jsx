"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Card, Flex, Heading, HStack, Icon, Input, Stack, Text, Spinner } from "@chakra-ui/react";
import { FiUser, FiLock, FiEdit3, FiCreditCard, FiCheckCircle, FiSave } from "react-icons/fi";

import Sidebar from "../../../components/sideBar/sideBar";
import { getPerfil, atualizarPerfil } from "../../../api";
import { toaster } from "@/components/ui/toaster";

const PRIMARY_COLOR = "#4A0E17";
const PRIMARY_DARK = "#360A11";
const BG_COLOR = "#F5F2EE";
const BORDER_COLOR = "#EFEBE3";
const TEXT_DARK = "#333333";
const TEXT_LIGHT = "#777777";

const SENHAS_VAZIAS = { senha_atual: "", senha: "", confirmar: "" };

function Campo({ label, value, onChange, type = "text", editando, placeholder }) {
  return (
    <Stack gap={1.5} flex="1">
      <Text fontSize="xs" color={TEXT_DARK} fontWeight="semibold">{label}</Text>
      {editando ? (
        <Input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          type={type}
          placeholder={placeholder}
          bg="white"
          border="1px solid"
          borderColor={PRIMARY_COLOR}
          borderRadius="6px"
          h="38px"
          fontSize="sm"
          color={TEXT_DARK}
          _focus={{ borderColor: PRIMARY_COLOR, boxShadow: `0 0 0 1px ${PRIMARY_COLOR}` }}
        />
      ) : (
        <Flex align="center" px={3} h="38px" bg="#FAFAFA" border="1px solid #E7DED8" borderRadius="6px">
          <Text fontSize="sm" color={TEXT_DARK}>{value || "—"}</Text>
        </Flex>
      )}
    </Stack>
  );
}

function Secao({ icone, titulo, children }) {
  return (
    <Card.Root bg="white" borderRadius="8px" border="1px solid" borderColor={BORDER_COLOR}>
      <Card.Header px={5} pt={5} pb={3}>
        <HStack gap={2}>
          <Icon as={icone} color={PRIMARY_COLOR} boxSize={4} />
          <Heading fontSize="sm" fontWeight="bold" color={PRIMARY_COLOR}>{titulo}</Heading>
        </HStack>
      </Card.Header>
      <Card.Body px={5} pb={5}>{children}</Card.Body>
    </Card.Root>
  );
}

export default function MeuCadastro() {
  const router = useRouter();

  const [perfil, setPerfil] = useState({}); // como está no servidor
  const [dados, setDados] = useState(null); // como está no formulário
  const [senhas, setSenhas] = useState(SENHAS_VAZIAS);
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    let ativo = true;

    getPerfil().then((r) => {
      if (!ativo) return;
      if (!r?.sucesso) {
        toaster.create({ title: "Erro", description: r?.mensagem || "Não foi possível carregar seu perfil.", type: "error" });
        router.replace("/inicio");
        return;
      }
      setPerfil(r.dados);
      setDados(r.dados);
    });

    return () => {
      ativo = false;
    };
  }, [router]);

  const alterar = (campo) => (valor) => setDados((d) => ({ ...d, [campo]: valor }));
  const alterarSenha = (campo) => (valor) => setSenhas((s) => ({ ...s, [campo]: valor }));

  function cancelar() {
    setDados(perfil);
    setSenhas(SENHAS_VAZIAS);
    setEditando(false);
  }

  async function salvar(e) {
    e.preventDefault();

    if (!dados || !perfil) return;

    const payload = {};
    if (dados.nome !== perfil.nome) payload.nome = dados.nome;
    if (dados.email !== perfil.email) payload.email = dados.email;
    if ((dados.telefone || "") !== (perfil.telefone || "")) payload.telefone = dados.telefone || null;

    if (senhas.senha) {
      if (senhas.senha.length < 6) {
        return toaster.create({ title: "Senha inválida", description: "A nova senha deve ter pelo menos 6 caracteres.", type: "error" });
      }
      if (senhas.senha !== senhas.confirmar) {
        return toaster.create({ title: "Senhas diferentes", description: "A confirmação não coincide com a nova senha.", type: "error" });
      }
      payload.senha = senhas.senha;
    }

    // Backend exige a senha atual para trocar e-mail ou senha.
    if ((payload.senha || payload.email) && !senhas.senha_atual) {
      return toaster.create({ title: "Senha atual obrigatória", description: "Informe sua senha atual para alterar e-mail ou senha.", type: "error" });
    }
    if (senhas.senha_atual) payload.senha_atual = senhas.senha_atual;

    if (Object.keys(payload).length === 0) {
      setEditando(false);
      return;
    }

    setSalvando(true);
    const r = await atualizarPerfil(payload);
    setSalvando(false);

    if (!r?.sucesso) {
      return toaster.create({ title: "Erro ao salvar", description: r?.mensagem || "Não foi possível atualizar o perfil.", type: "error" });
    }

    toaster.create({ title: "Perfil atualizado", description: r.mensagem, type: "success" });
    const atualizado = r.dados || dados;
    setPerfil(atualizado);
    setDados(atualizado);
    setSenhas(SENHAS_VAZIAS);
    setEditando(false);
  }

  if (!dados) {
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

      <Box flex={1} p={{ base: 6, md: 8 }} pb={16}>
        <Stack as="form" onSubmit={salvar} gap={7} align="stretch" maxW="8xl" mx="auto">
          <Stack gap={2}>
            <Heading as="h1" fontSize={{ base: "3xl", md: "4xl" }} fontWeight="bold" color={PRIMARY_COLOR} fontFamily="Georgia, serif">
              Meu Cadastro
            </Heading>
            <Text fontSize="md" color={TEXT_LIGHT}>Atualize seus dados cadastrais e mantenha suas informações sempre em dia.</Text>
          </Stack>

          <Flex gap={6} align="flex-start" direction={{ base: "column", lg: "row" }}>
            <Stack flex="1" w="full" gap={5}>
              <Secao icone={FiUser} titulo="Dados Pessoais">
                <Stack gap={4}>
                  <Campo label="Nome Completo" value={dados.nome} editando={editando} placeholder="Seu nome completo" onChange={alterar("nome")} />
                  <Campo label="E-mail" value={dados.email} editando={editando} type="email" placeholder="seu.email@exemplo.com" onChange={alterar("email")} />
                  <Campo label="Telefone" value={dados.telefone} editando={editando} placeholder="(00) 00000-0000" onChange={alterar("telefone")} />
                </Stack>
              </Secao>

              <Secao icone={FiCheckCircle} titulo="Informações da Conta">
                <Flex gap={8} direction={{ base: "column", md: "row" }}>
                  <HStack flex="1">
                    <Flex w="36px" h="36px" bg="#F8EEE9" borderRadius="full" align="center" justify="center">
                      <Icon as={FiCreditCard} color={PRIMARY_COLOR} boxSize={4} />
                    </Flex>
                    <Stack gap={0}>
                      <Text fontSize="xs" color={TEXT_LIGHT}>Código do Usuário (ID)</Text>
                      <Text fontSize="sm" fontWeight="bold" color={TEXT_DARK}>#{dados.id}</Text>
                    </Stack>
                  </HStack>
                  <HStack flex="1">
                    <Flex w="36px" h="36px" bg="#EAF5EC" borderRadius="full" align="center" justify="center">
                      <Icon as={FiCheckCircle} color="#48BB78" boxSize={4} />
                    </Flex>
                    <Stack gap={0}>
                      <Text fontSize="xs" color={TEXT_LIGHT}>Tipo de Perfil</Text>
                      <Text fontSize="sm" color="#48BB78" fontWeight="bold" textTransform="capitalize">{dados.tipo}</Text>
                    </Stack>
                  </HStack>
                </Flex>
              </Secao>
            </Stack>

            <Stack w={{ base: "full", lg: "390px" }} gap={5}>
              <Secao icone={FiLock} titulo="Segurança da Conta">
                {editando ? (
                  <Stack gap={4}>
                    <Text fontSize="xs" color={TEXT_LIGHT}>
                      A senha atual é obrigatória para alterar o e-mail ou a senha.
                    </Text>
                    <Campo label="Senha atual" value={senhas.senha_atual} editando type="password" placeholder="Sua senha atual" onChange={alterarSenha("senha_atual")} />
                    <Campo label="Nova senha" value={senhas.senha} editando type="password" placeholder="Deixe em branco para manter" onChange={alterarSenha("senha")} />
                    <Campo label="Confirmar nova senha" value={senhas.confirmar} editando type="password" placeholder="Repita a nova senha" onChange={alterarSenha("confirmar")} />
                  </Stack>
                ) : (
                  <Text fontSize="sm" color={TEXT_LIGHT}>Clique em &quot;Editar Dados&quot; para alterar sua senha.</Text>
                )}
              </Secao>
            </Stack>
          </Flex>

          <Flex justify="flex-end" gap={3} mt={1}>
            {editando ? (
              <>
                <Button type="button" variant="outline" color={PRIMARY_COLOR} borderColor={PRIMARY_COLOR} borderRadius="14px" disabled={salvando} onClick={cancelar}>
                  Cancelar
                </Button>
                <Button type="submit" bg={PRIMARY_COLOR} color="white" borderRadius="14px" px={6} loading={salvando} _hover={{ bg: PRIMARY_DARK }}>
                  <Icon as={FiSave} mr={2} /> Salvar Alterações
                </Button>
              </>
            ) : (
              <Button type="button" bg={PRIMARY_COLOR} color="white" borderRadius="14px" px={6} onClick={() => setEditando(true)} _hover={{ bg: PRIMARY_DARK }}>
                <Icon as={FiEdit3} mr={2} /> Editar Dados
              </Button>
            )}
          </Flex>
        </Stack>
      </Box>
    </Flex>
  );
}
