"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Flex, Heading, Icon, IconButton, Input, InputGroup, Stack, Text, Spinner } from "@chakra-ui/react";
import { FiUser, FiMail, FiPhone, FiLock, FiCheck, FiChevronDown, FiChevronUp, FiEye, FiEyeOff, FiLogOut, FiRefreshCw } from "react-icons/fi";

import Sidebar from "../../../components/sideBar/sideBar";
import { getPerfil, atualizarPerfil, logoutUsuario } from "../../../api";
import { toaster } from "@/components/ui/toaster";

const PRIMARY = "#4A0E17";
const PRIMARY_DARK = "#360A11";
const BORDER = "#E7DED8";
const TEXT_DARK = "#2D2D2D";
const TEXT_LIGHT = "#777777";
const ERRO = "#C5221F";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SENHAS_VAZIAS = { senha_atual: "", senha: "", confirmar: "" };

// Tons de vinho/terra: a cor do avatar vem do nome, estável entre visitas.
const CORES_AVATAR = ["#4A0E17", "#6B2D3A", "#8C4A2F", "#5C3A21", "#7A3131"];
function corDoNome(nome = "") {
  let h = 0;
  for (const c of nome) h = (h * 31 + c.charCodeAt(0)) % 997;
  return CORES_AVATAR[h % CORES_AVATAR.length];
}

// (00) 00000-0000 — só dígitos, no máximo 11
function mascaraTelefone(valor) {
  const d = (valor || "").replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

// 0..3 — comprimento + variedade (letras, números, símbolos)
function forcaSenha(s) {
  if (!s) return 0;
  let pontos = s.length >= 8 ? 1 : 0;
  if (/[a-z]/i.test(s) && /\d/.test(s)) pontos++;
  if (/[^a-z0-9]/i.test(s) && s.length >= 10) pontos++;
  return s.length < 6 ? 0 : Math.max(1, pontos);
}
const FORCA = [
  { rotulo: "", cor: BORDER },
  { rotulo: "Fraca", cor: ERRO },
  { rotulo: "Ok", cor: "#E6A100" },
  { rotulo: "Forte", cor: "#388E3C" },
];

function validarDados(d) {
  const erros = {};
  if (!d.nome?.trim()) erros.nome = "Informe seu nome.";
  if (!EMAIL_REGEX.test(d.email || "")) erros.email = "E-mail inválido.";
  const digitos = (d.telefone || "").replace(/\D/g, "");
  if (digitos && digitos.length < 10) erros.telefone = "Telefone incompleto.";
  return erros;
}

function Campo({ icone, label, value, onChange, type = "text", placeholder, erro, senha }) {
  const [visivel, setVisivel] = useState(false);
  const tipo = senha ? (visivel ? "text" : "password") : type;

  return (
    <Stack gap={1.5}>
      <Text fontSize="sm" fontWeight="medium" color={TEXT_DARK}>{label}</Text>
      <InputGroup
        startElement={<Icon as={icone} color={PRIMARY} />}
        endElement={
          senha ? (
            <IconButton aria-label={visivel ? "Ocultar senha" : "Mostrar senha"} variant="ghost" size="sm" color={TEXT_LIGHT} onClick={() => setVisivel((v) => !v)}>
              {visivel ? <FiEyeOff /> : <FiEye />}
            </IconButton>
          ) : undefined
        }
      >
        <Input
          type={tipo}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          h="48px"
          bg="white"
          border="1px solid"
          borderColor={erro ? ERRO : BORDER}
          borderRadius="10px"
          fontSize="md"
          color={TEXT_DARK}
          _placeholder={{ color: "#A8A29E" }}
          _focus={{ borderColor: erro ? ERRO : PRIMARY, boxShadow: `0 0 0 1px ${erro ? ERRO : PRIMARY}` }}
        />
      </InputGroup>
      {erro && <Text fontSize="xs" color={ERRO}>{erro}</Text>}
    </Stack>
  );
}

function Cartao(props) {
  return <Box bg="white" border="1px solid" borderColor={BORDER} borderRadius="16px" p={{ base: 5, md: 7 }} {...props} />;
}

function Botao(props) {
  return <Button bg={PRIMARY} color="white" borderRadius="10px" px={6} h="48px" _hover={{ bg: PRIMARY_DARK }} {...props} />;
}

export default function MeuCadastro() {
  const router = useRouter();

  const [perfil, setPerfil] = useState({}); // como está no servidor
  const [dados, setDados] = useState(null); // como está no formulário
  const [falhaCarregar, setFalhaCarregar] = useState(null);
  const [tentativa, setTentativa] = useState(0);
  const [senhas, setSenhas] = useState(SENHAS_VAZIAS);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false); // "Salvo ✓" por 2s

  useEffect(() => {
    let ativo = true;
    getPerfil().then((r) => {
      if (!ativo) return;
      if (!r?.sucesso) {
        if (r?.codigo === "NAO_AUTENTICADO") return router.replace("/login?next=/alterar_cadastro");
        return setFalhaCarregar(r?.mensagem || "Não foi possível carregar seu perfil.");
      }
      setFalhaCarregar(null);
      setPerfil(r.dados);
      setDados({ ...r.dados, telefone: mascaraTelefone(r.dados.telefone) });
    });
    return () => {
      ativo = false;
    };
  }, [router, tentativa]);

  const alterar = (campo) => (valor) =>
    setDados((d) => ({ ...d, [campo]: campo === "telefone" ? mascaraTelefone(valor) : valor }));
  const alterarSenha = (campo) => (valor) => setSenhas((s) => ({ ...s, [campo]: valor }));

  const erros = dados ? validarDados(dados) : {};
  const temErro = Object.keys(erros).length > 0;

  // O botão só aparece quando algo realmente mudou.
  const mudouDados =
    Boolean(dados) &&
    (dados.nome !== perfil?.nome ||
      dados.email !== perfil?.email ||
      (dados.telefone || "") !== mascaraTelefone(perfil?.telefone));

  function avisar(titulo, descricao, tipo = "error") {
    toaster.create({ title: titulo, description: descricao || undefined, type: tipo });
  }

  function desfazer() {
    setDados({ ...perfil, telefone: mascaraTelefone(perfil?.telefone) });
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
    if (!mudouDados || temErro) return;

    const payload = {};
    if (dados.nome !== perfil?.nome) payload.nome = dados.nome.trim();
    if (dados.email !== perfil?.email) payload.email = dados.email.trim();
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

  async function sair() {
    await logoutUsuario();
    router.push("/login");
  }

  // --- estados de carregamento / falha ---
  if (!dados) {
    return (
      <Flex minH="100vh" bg="#F5F2EE">
        <Sidebar />
        <Flex flex={1} align="center" justify="center" p={6}>
          {falhaCarregar ? (
            <Cartao maxW="420px" textAlign="center">
              <Stack gap={4} align="center">
                <Heading size="lg" color={PRIMARY} fontFamily="Georgia, serif">Não foi possível carregar seu perfil</Heading>
                <Text color={TEXT_LIGHT} fontSize="sm">{falhaCarregar}</Text>
                <Botao onClick={() => setTentativa((t) => t + 1)}><Icon as={FiRefreshCw} mr={2} /> Tentar de novo</Botao>
              </Stack>
            </Cartao>
          ) : (
            <Spinner size="xl" color={PRIMARY} />
          )}
        </Flex>
      </Flex>
    );
  }

  const inicial = (perfil?.nome || "?").trim()[0]?.toUpperCase();
  const forca = forcaSenha(senhas.senha);

  return (
    <Flex minH="100vh" bg="#F5F2EE">
      <Sidebar />

      <Box flex={1} p={{ base: 6, md: 10 }}>
        <Stack maxW="640px" mx="auto" gap={5}>
          {/* IDENTIDADE */}
          <Box>
            <Text fontSize="xs" fontWeight="semibold" letterSpacing="wider" textTransform="uppercase" color={TEXT_LIGHT} mb={3}>
              Meu cadastro
            </Text>
            <Flex align="center" gap={4}>
              <Flex
                w={{ base: "56px", md: "72px" }}
                h={{ base: "56px", md: "72px" }}
                borderRadius="full"
                bg={corDoNome(perfil?.nome)}
                color="white"
                align="center"
                justify="center"
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="semibold"
                flexShrink={0}
              >
                {inicial}
              </Flex>
              <Box minW={0}>
                <Heading fontSize={{ base: "2xl", md: "3xl" }} color={PRIMARY} fontFamily="Georgia, serif" lineClamp={1}>
                  {perfil?.nome}
                </Heading>
                <Text color={TEXT_LIGHT} lineClamp={1}>
                  {perfil?.email} · {perfil?.tipo === "admin" ? "Administrador" : "Leitor"}
                </Text>
              </Box>
            </Flex>
          </Box>

          {/* DADOS */}
          <Cartao as="form" onSubmit={salvarDados}>
            <Stack gap={5}>
              <Campo icone={FiUser} label="Nome completo" value={dados.nome} onChange={alterar("nome")} placeholder="Seu nome" erro={erros.nome} />
              <Campo icone={FiMail} label="E-mail" type="email" value={dados.email} onChange={alterar("email")} placeholder="voce@exemplo.com" erro={erros.email} />
              <Campo icone={FiPhone} label="Telefone" type="tel" value={dados.telefone} onChange={alterar("telefone")} placeholder="(00) 00000-0000" erro={erros.telefone} />

              {/* Ações só aparecem quando há algo a salvar */}
              {(mudouDados || salvo) && (
                <Flex justify="flex-end" align="center" gap={4}>
                  {salvo && (
                    <Text fontSize="sm" color="#388E3C" display="flex" alignItems="center" gap={1}>
                      <FiCheck /> Salvo
                    </Text>
                  )}
                  {mudouDados && (
                    <>
                      <Button type="button" variant="ghost" color={TEXT_LIGHT} h="48px" onClick={desfazer} disabled={salvando}>
                        Desfazer
                      </Button>
                      <Botao type="submit" disabled={temErro} loading={salvando}>Salvar</Botao>
                    </>
                  )}
                </Flex>
              )}
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
                <Campo senha icone={FiLock} label="Senha atual" value={senhas.senha_atual} onChange={alterarSenha("senha_atual")} placeholder="Sua senha atual" />

                <Stack gap={2}>
                  <Campo senha icone={FiLock} label="Nova senha" value={senhas.senha} onChange={alterarSenha("senha")} placeholder="Mínimo 6 caracteres" />
                  {senhas.senha && (
                    <Flex align="center" gap={3}>
                      <Flex gap={1} flex={1}>
                        {[1, 2, 3].map((n) => (
                          <Box key={n} flex={1} h="4px" borderRadius="full" bg={n <= forca ? FORCA[forca].cor : BORDER} transition="background .2s" />
                        ))}
                      </Flex>
                      <Text fontSize="xs" color={FORCA[forca].cor} minW="40px" textAlign="right">
                        {FORCA[forca].rotulo || "Curta"}
                      </Text>
                    </Flex>
                  )}
                </Stack>

                <Campo
                  senha
                  icone={FiLock}
                  label="Confirmar nova senha"
                  value={senhas.confirmar}
                  onChange={alterarSenha("confirmar")}
                  placeholder="Repita a nova senha"
                  erro={senhas.confirmar && senhas.confirmar !== senhas.senha ? "As senhas não coincidem." : undefined}
                />

                <Flex justify="flex-end">
                  <Button type="submit" variant="outline" borderColor={PRIMARY} color={PRIMARY} borderRadius="10px" px={6} h="48px" loading={salvando} _hover={{ bg: "#FAF5F6" }}>
                    Atualizar senha
                  </Button>
                </Flex>
              </Stack>
            )}
          </Cartao>

          {/* SESSÃO */}
          <Flex justify="space-between" align="center" px={1} pt={2} flexWrap="wrap" gap={3}>
            <Text fontSize="sm" color={TEXT_LIGHT}>Terminou por aqui?</Text>
            <Button variant="ghost" color={ERRO} _hover={{ bg: "#FCE8E6" }} onClick={sair}>
              <Icon as={FiLogOut} mr={2} /> Encerrar sessão
            </Button>
          </Flex>
        </Stack>
      </Box>
    </Flex>
  );
}
