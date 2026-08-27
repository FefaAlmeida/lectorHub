"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Box, Button, Flex, Heading, Icon, Input, InputGroup, Stack, Text, Spinner } from "@chakra-ui/react";
import { FiUser, FiMail, FiPhone, FiLock, FiCheck, FiChevronDown, FiChevronUp } from "react-icons/fi";

import Sidebar from "../../../components/sideBar/sideBar";
import { getPerfil, atualizarPerfil } from "../../../api";
import { toaster } from "@/components/ui/toaster";

const PRIMARY = "#4A0E17";
const PRIMARY_DARK = "#360A11";
const BORDER = "#E7DED8";
const TEXT_DARK = "#2D2D2D";
const TEXT_LIGHT = "#777777";

const SENHAS_VAZIAS = { senha_atual: "", senha: "", confirmar: "" };

// (00) 00000-0000 — só dígitos, no máximo 11
function mascaraTelefone(valor) {
  const d = (valor || "").replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function Campo({ icone, label, value, onChange, type = "text", placeholder }) {
  return (
    <Stack gap={1.5}>
      <Text fontSize="sm" fontWeight="medium" color={TEXT_DARK}>{label}</Text>
      <InputGroup startElement={<Icon as={icone} color={PRIMARY} />}>
        <Input
          type={type}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          h="48px"
          bg="white"
          border="1px solid"
          borderColor={BORDER}
          borderRadius="10px"
          fontSize="md"
          color={TEXT_DARK}
          _placeholder={{ color: "#A8A29E" }}
          _focus={{ borderColor: PRIMARY, boxShadow: `0 0 0 1px ${PRIMARY}` }}
        />
      </InputGroup>
    </Stack>
  );
}

function Cartao(props) {
  return <Box bg="white" border="1px solid" borderColor={BORDER} borderRadius="16px" p={{ base: 5, md: 7 }} {...props} />;
}

export default function MeuCadastro() {
  const router = useRouter();

  const [perfil, setPerfil] = useState({}); // como está no servidor
  const [dados, setDados] = useState(null); // como está no formulário
  const [senhas, setSenhas] = useState(SENHAS_VAZIAS);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false); // "Salvo ✓" por 2s

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
      setDados({ ...r.dados, telefone: mascaraTelefone(r.dados.telefone) });
    });
    return () => {
      ativo = false;
    };
  }, [router]);

  const alterar = (campo) => (valor) =>
    setDados((d) => ({ ...d, [campo]: campo === "telefone" ? mascaraTelefone(valor) : valor }));
  const alterarSenha = (campo) => (valor) => setSenhas((s) => ({ ...s, [campo]: valor }));

  // O botão só ativa quando algo realmente mudou.
  const mudouDados =
    Boolean(dados) &&
    (dados.nome !== perfil?.nome ||
      dados.email !== perfil?.email ||
      (dados.telefone || "") !== mascaraTelefone(perfil?.telefone));

  function avisar(titulo, descricao, tipo = "error") {
    toaster.create({ title: titulo, description: descricao || undefined, type: tipo });
  }

  async function enviar(payload) {
    setSalvando(true);
    const r = await atualizarPerfil(payload);
    setSalvando(false);

    if (!r?.sucesso) {
      avisar("Não foi possível salvar", r?.mensagem);
      return false;
    }

    const atualizado = r.dados || perfil;
    setPerfil(atualizado);
    setDados({ ...atualizado, telefone: mascaraTelefone(atualizado.telefone) });
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
    return true;
  }

  async function salvarDados(e) {
    e.preventDefault();
    if (!mudouDados) return;

    const payload = {};
    if (dados.nome !== perfil?.nome) payload.nome = dados.nome;
    if (dados.email !== perfil?.email) payload.email = dados.email;
    if ((dados.telefone || "") !== mascaraTelefone(perfil?.telefone)) payload.telefone = dados.telefone || null;

    // Trocar e-mail exige a senha atual (regra do backend).
    if (payload.email) {
      if (!senhas.senha_atual) {
        setMostrarSenha(true);
        return avisar("Senha atual obrigatória", 'Para alterar o e-mail, informe sua senha atual em "Alterar senha".');
      }
      payload.senha_atual = senhas.senha_atual;
    }

    if (await enviar(payload)) avisar("Dados atualizados", null, "success");
  }

  async function salvarSenha(e) {
    e.preventDefault();

    if (!senhas.senha_atual) return avisar("Senha atual obrigatória", "Informe sua senha atual.");
    if (senhas.senha.length < 6) return avisar("Senha inválida", "A nova senha deve ter pelo menos 6 caracteres.");
    if (senhas.senha !== senhas.confirmar) return avisar("Senhas diferentes", "A confirmação não coincide com a nova senha.");

    if (await enviar({ senha: senhas.senha, senha_atual: senhas.senha_atual })) {
      setSenhas(SENHAS_VAZIAS);
      setMostrarSenha(false);
      avisar("Senha alterada", "Use a nova senha no próximo login.", "success");
    }
  }

  if (!dados) {
    return (
      <Flex minH="100vh" bg="#F5F2EE" align="center" justify="center">
        <Spinner size="xl" color={PRIMARY} />
      </Flex>
    );
  }

  const inicial = (perfil?.nome || "?").trim()[0]?.toUpperCase();

  return (
    <Flex minH="100vh" bg="#F5F2EE">
      <Sidebar />

      <Box flex={1} p={{ base: 6, md: 10 }}>
        <Stack maxW="640px" mx="auto" gap={6}>
          {/* IDENTIDADE */}
          <Flex align="center" gap={5}>
            <Flex w="72px" h="72px" borderRadius="full" bg={PRIMARY} color="white" align="center" justify="center" fontSize="2xl" fontWeight="semibold" flexShrink={0}>
              {inicial}
            </Flex>
            <Box minW={0}>
              <Heading fontSize={{ base: "2xl", md: "3xl" }} color={PRIMARY} fontFamily="Georgia, serif" lineClamp={1}>
                {perfil?.nome}
              </Heading>
              <Text color={TEXT_LIGHT} lineClamp={1}>{perfil?.email}</Text>
              <Badge mt={2} bg="#F5EDEE" color={PRIMARY} borderRadius="full" px={3} textTransform="capitalize">
                {perfil?.tipo} · #{perfil?.id}
              </Badge>
            </Box>
          </Flex>

          {/* DADOS */}
          <Cartao as="form" onSubmit={salvarDados}>
            <Stack gap={5}>
              <Campo icone={FiUser} label="Nome completo" value={dados.nome} onChange={alterar("nome")} placeholder="Seu nome" />
              <Campo icone={FiMail} label="E-mail" type="email" value={dados.email} onChange={alterar("email")} placeholder="voce@exemplo.com" />
              <Campo icone={FiPhone} label="Telefone" type="tel" value={dados.telefone} onChange={alterar("telefone")} placeholder="(00) 00000-0000" />

              <Flex justify="flex-end" align="center" gap={4} pt={1}>
                {salvo && (
                  <Text fontSize="sm" color="#388E3C" display="flex" alignItems="center" gap={1}>
                    <FiCheck /> Salvo
                  </Text>
                )}
                <Button type="submit" bg={PRIMARY} color="white" borderRadius="10px" px={6} h="44px" disabled={!mudouDados} loading={salvando} _hover={{ bg: PRIMARY_DARK }}>
                  Salvar
                </Button>
              </Flex>
            </Stack>
          </Cartao>

          {/* SENHA (dobrável) */}
          <Cartao as="form" onSubmit={salvarSenha} p={0}>
            <Button
              type="button"
              variant="ghost"
              w="100%"
              h="56px"
              px={{ base: 5, md: 7 }}
              justifyContent="space-between"
              color={PRIMARY}
              fontWeight="medium"
              _hover={{ bg: "#FAF5F6" }}
              onClick={() => setMostrarSenha((v) => !v)}
            >
              <Flex align="center" gap={2}><Icon as={FiLock} /> Alterar senha</Flex>
              <Icon as={mostrarSenha ? FiChevronUp : FiChevronDown} />
            </Button>

            {mostrarSenha && (
              <Stack gap={5} px={{ base: 5, md: 7 }} pb={7} pt={5} borderTop="1px solid" borderColor={BORDER}>
                <Campo icone={FiLock} label="Senha atual" type="password" value={senhas.senha_atual} onChange={alterarSenha("senha_atual")} placeholder="Sua senha atual" />
                <Campo icone={FiLock} label="Nova senha" type="password" value={senhas.senha} onChange={alterarSenha("senha")} placeholder="Mínimo 6 caracteres" />
                <Campo icone={FiLock} label="Confirmar nova senha" type="password" value={senhas.confirmar} onChange={alterarSenha("confirmar")} placeholder="Repita a nova senha" />
                <Flex justify="flex-end">
                  <Button type="submit" variant="outline" borderColor={PRIMARY} color={PRIMARY} borderRadius="10px" px={6} h="44px" loading={salvando} _hover={{ bg: "#FAF5F6" }}>
                    Atualizar senha
                  </Button>
                </Flex>
              </Stack>
            )}
          </Cartao>
        </Stack>
      </Box>
    </Flex>
  );
}
