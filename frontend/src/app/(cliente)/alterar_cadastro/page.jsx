"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge, Box, Button, Flex, Heading, Icon, IconButton, Input, InputGroup, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { FiUser, FiMail, FiPhone, FiLock, FiCheck, FiChevronDown, FiChevronUp, FiEye, FiEyeOff, FiLogOut, FiRefreshCw } from "react-icons/fi";

import Shell, { Cartao, Carregando } from "@/components/cliente/Shell";
import { getPerfil, atualizarPerfil, logoutUsuario } from "../../../api";
import { toaster } from "@/components/ui/toaster";

import {
  PRIMARY_COLOR,
  PRIMARY_HOVER,
  BORDER_COLOR,
  TEXT_DARK,
  TEXT_LIGHT,
  SUAVE_BG,
  OK_COR,
  FONTE_TITULO,
  RAIO_CAMPO,
  TEXTO_APOIO,
  LARGURA_FORMULARIO,
  ERRO_BG,
  GAP_CARTAO,
  GAP_ITEM,
  TITULO_SECAO,
  ALTURA_CAMPO,
  TITULO_CARTAO,
  TEXTO_MIUDO,
} from "@/components/cliente/tema";

const PRIMARY = PRIMARY_COLOR;
const PRIMARY_DARK = PRIMARY_HOVER;
const BORDER = BORDER_COLOR;
const ERRO = "#C5221F";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SENHAS_VAZIAS = { senha_atual: "", senha: "", confirmar: "" };

const CORES_AVATAR = ["#4A0E17", "#6B2D3A", "#8C4A2F", "#5C3A21", "#7A3131"];
function corDoNome(nome = "") {
  let h = 0;
  for (const c of nome) h = (h * 31 + c.charCodeAt(0)) % 997;
  return CORES_AVATAR[h % CORES_AVATAR.length];
}

function mascaraTelefone(valor) {
  const d = (valor || "").replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

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
          h={ALTURA_CAMPO}
          bg="white"
          border="1px solid"
          borderColor={erro ? ERRO : BORDER}
          borderRadius={RAIO_CAMPO}
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

function Botao(props) {
  return <Button bg={PRIMARY} color="white" borderRadius={RAIO_CAMPO} px={6} h={ALTURA_CAMPO} _hover={{ bg: PRIMARY_DARK }} {...props} />;
}

function Secao({ titulo, icone, acao, children, ...props }) {
  return (
    <Cartao bg="white" {...props}>
      <Stack gap={GAP_CARTAO}>
        <Flex align="center" justify="space-between" gap={3}>
          <Flex align="center" gap={2} color={PRIMARY}>
            {icone && <Icon as={icone} boxSize={4} />}
            <Heading fontSize={TITULO_CARTAO} fontFamily={FONTE_TITULO}>
              {titulo}
            </Heading>
          </Flex>
          {acao}
        </Flex>
        {children}
      </Stack>
    </Cartao>
  );
}

export default function MeuCadastro() {
  const router = useRouter();

  const [perfil, setPerfil] = useState({});
  const [dados, setDados] = useState(null);
  const [falhaCarregar, setFalhaCarregar] = useState(null);
  const [tentativa, setTentativa] = useState(0);
  const [senhas, setSenhas] = useState(SENHAS_VAZIAS);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);

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

  if (!dados) {
    return (
      <Shell titulo="Meu cadastro" largura={LARGURA_FORMULARIO}>
        {falhaCarregar ? (
          <Cartao textAlign="center">
            <Stack gap={GAP_CARTAO} align="center">
              <Heading size="lg" color={PRIMARY} fontFamily={FONTE_TITULO}>Não foi possível carregar seu perfil</Heading>
              <Text color={TEXT_LIGHT} fontSize={TEXTO_APOIO}>{falhaCarregar}</Text>
              <Botao onClick={() => setTentativa((t) => t + 1)}><Icon as={FiRefreshCw} mr={2} /> Tentar de novo</Botao>
            </Stack>
          </Cartao>
        ) : (
          <Carregando texto="Carregando seu perfil..." />
        )}
      </Shell>
    );
  }

  const inicial = (perfil?.nome || "?").trim()[0]?.toUpperCase();
  const forca = forcaSenha(senhas.senha);

  return (
    <Shell
      titulo="Meu cadastro"
      subtitulo="Atualize seus dados de acesso e contato."
      largura={{ base: LARGURA_FORMULARIO, lg: "1300px" }}
    >
      {/* PAINEL AGRUPADOR COM FUNDO E BORDA */}
      <Box
        bg={SUAVE_BG}
        p={{ base: 4, md: 6 }}
        borderRadius="2xl"
        border="1px solid"
        borderColor={BORDER}
        w="100%"
      >
        <Stack gap={GAP_CARTAO} w="100%">
          {/* IDENTIDADE */}
          <Cartao bg="white">
            <Flex align="center" gap={GAP_CARTAO}>
              <Flex
                w={{ base: "56px", md: "64px" }}
                h={{ base: "56px", md: "64px" }}
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

              <Stack gap={1} minW={0} flex={1}>
                <Flex align="center" gap={3} flexWrap="wrap">
                  <Heading fontSize={TITULO_SECAO} color={PRIMARY} fontFamily={FONTE_TITULO} lineClamp={1}>
                    {perfil?.nome}
                  </Heading>
                  <Badge
                    bg={SUAVE_BG}
                    color={PRIMARY}
                    border="1px solid"
                    borderColor={BORDER}
                    borderRadius="full"
                    px={3}
                    fontSize={TEXTO_MIUDO}
                    textTransform="none"
                  >
                    {perfil?.tipo === "admin" ? "Administrador" : "Leitor"}
                  </Badge>
                </Flex>
                <Text fontSize={TEXTO_APOIO} color={TEXT_LIGHT} lineClamp={1}>
                  {perfil?.email}
                </Text>
              </Stack>
            </Flex>
          </Cartao>

          {/* ESTRUTURA PRINCIPAL (ROW NO DESKTOP, COLUMN NO MOBILE) */}
          <Flex
            direction={{ base: "column", lg: "row" }}
            gap={GAP_CARTAO}
            align="start"
            w="100%"
          >
            {/* COLUNA ESQUERDA: DADOS PESSOAIS */}
            <Box flex="1" w="100%">
              <Secao as="form" onSubmit={salvarDados} titulo="Dados pessoais" icone={FiUser}>
                <Campo icone={FiUser} label="Nome completo" value={dados.nome} onChange={alterar("nome")} placeholder="Seu nome" erro={erros.nome} />

                <SimpleGrid columns={{ base: 1, md: 2 }} gap={GAP_CARTAO}>
                  <Campo icone={FiMail} label="E-mail" type="email" value={dados.email} onChange={alterar("email")} placeholder="voce@exemplo.com" erro={erros.email} />
                  <Campo icone={FiPhone} label="Telefone" type="tel" value={dados.telefone} onChange={alterar("telefone")} placeholder="(00) 00000-0000" erro={erros.telefone} />
                </SimpleGrid>

                <Flex justify="flex-end" align="center" gap={3} borderTop="1px solid" borderColor={BORDER} pt={GAP_CARTAO}>
                  {salvo && (
                    <Text fontSize={TEXTO_APOIO} color={OK_COR} display="flex" alignItems="center" gap={1} mr="auto">
                      <FiCheck /> Alterações salvas
                    </Text>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    color={TEXT_LIGHT}
                    borderRadius={RAIO_CAMPO}
                    h={ALTURA_CAMPO}
                    onClick={desfazer}
                    disabled={!mudouDados || salvando}
                  >
                    Desfazer
                  </Button>
                  <Botao type="submit" disabled={!mudouDados || temErro} loading={salvando}>
                    Salvar
                  </Botao>
                </Flex>
              </Secao>
            </Box>

            {/* COLUNA DIREITA: SEGURANÇA E SESSÃO */}
            <Flex direction="column" gap={GAP_CARTAO} flex="1" w="100%">
              <Secao
                as="form"
                onSubmit={salvarSenha}
                titulo="Segurança"
                icone={FiLock}
                acao={
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    color={PRIMARY}
                    borderRadius={RAIO_CAMPO}
                    _hover={{ bg: SUAVE_BG }}
                    onClick={() => setMostrarSenha((v) => !v)}
                  >
                    {mostrarSenha ? "Cancelar" : "Alterar senha"}
                    <Icon as={mostrarSenha ? FiChevronUp : FiChevronDown} ml={2} />
                  </Button>
                }
              >
                {!mostrarSenha ? (
                  <Text fontSize={TEXTO_APOIO} color={TEXT_LIGHT}>
                    Sua senha foi definida no cadastro. Troque quando quiser.
                  </Text>
                ) : (
                  <Stack gap={GAP_CARTAO} borderTop="1px solid" borderColor={BORDER} pt={GAP_CARTAO}>
                    <Campo senha icone={FiLock} label="Senha atual" value={senhas.senha_atual} onChange={alterarSenha("senha_atual")} placeholder="Sua senha atual" />

                    <SimpleGrid columns={{ base: 1, md: 2 }} gap={GAP_CARTAO}>
                      <Stack gap={2}>
                        <Campo senha icone={FiLock} label="Nova senha" value={senhas.senha} onChange={alterarSenha("senha")} placeholder="Mínimo 6 caracteres" />
                        {senhas.senha && (
                          <Flex align="center" gap={3}>
                            <Flex gap={1} flex={1}>
                              {[1, 2, 3].map((n) => (
                                <Box key={n} flex={1} h="4px" borderRadius="full" bg={n <= forca ? FORCA[forca].cor : BORDER} transition="background .2s" />
                              ))}
                            </Flex>
                            <Text fontSize={TEXTO_MIUDO} color={FORCA[forca].cor} minW="40px" textAlign="right">
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
                    </SimpleGrid>

                    <Flex justify="flex-end">
                      <Botao type="submit" loading={salvando}>Atualizar senha</Botao>
                    </Flex>
                  </Stack>
                )}
              </Secao>

              <Secao titulo="Sessão" icone={FiLogOut}>
                <Flex justify="space-between" align="center" flexWrap="wrap" gap={GAP_ITEM}>
                  <Text fontSize={TEXTO_APOIO} color={TEXT_LIGHT}>
                    Encerre a sessão ao usar um computador compartilhado.
                  </Text>
                  <Button
                    variant="outline"
                    color={ERRO}
                    borderColor={BORDER}
                    borderRadius={RAIO_CAMPO}
                    h={ALTURA_CAMPO}
                    onClick={sair}
                    _hover={{ bg: ERRO_BG }}
                  >
                    <Icon as={FiLogOut} mr={2} /> Encerrar sessão
                  </Button>
                </Flex>
              </Secao>
            </Flex>
          </Flex>
        </Stack>
      </Box>
    </Shell>
  );
}