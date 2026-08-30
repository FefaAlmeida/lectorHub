"use client";

import { useEffect, useState } from "react";
import { Badge, Box, Flex, Spinner, Table, Text } from "@chakra-ui/react";
import { FiEdit2 } from "react-icons/fi";

import Shell, { Cartao, VINHO, TEXTO_SUAVE } from "@/components/adm/Shell";
import { FUNDO, HOVER_LINHA, TRANSICAO, TEXTO_MIUDO, TEXTO_APOIO, GAP_CARTAO, REALCE, BRANCO } from "@/components/adm/tema";
import Modal from "@/components/adm/Modal";
import { BotaoPrimario, BotaoSecundario, CampoSelect, CampoTexto, Paginacao, Vazio } from "@/components/adm/Campos";
import { useUsuario } from "@/components/auth/RequireAuth";
import { getUsuarios, atualizarUsuario } from "../../../api";
import { toaster } from "@/components/ui/toaster";

const LIMITE = 10;

// A branch `front` mostrava avatar na listagem, mas com uma URL de imagem que
// a tabela `usuarios` não tem. Aqui é a inicial sobre o realce da paleta —
// mesmo recurso, sem inventar um campo que não existe no banco.
function Avatar({ nome, admin }) {
  return (
    <Flex
      w="40px"
      h="40px"
      borderRadius="full"
      bg={admin ? VINHO : REALCE}
      color={admin ? BRANCO : VINHO}
      align="center"
      justify="center"
      fontWeight="bold"
      flexShrink={0}
    >
      {(nome || "?").trim()[0]?.toUpperCase()}
    </Flex>
  );
}

function FormUsuario({ usuario, ehVoceMesmo, onSalvar }) {
  const [form, setForm] = useState({ nome: usuario.nome, email: usuario.email, telefone: usuario.telefone || "", tipo: usuario.tipo });
  const set = (campo) => (valor) => setForm((f) => ({ ...f, [campo]: valor }));

  return (
    <form id="form-usuario" onSubmit={(e) => { e.preventDefault(); onSalvar(form); }}>
      <Flex direction="column" gap={4}>
        <CampoTexto label="Nome" value={form.nome} onChange={set("nome")} required />
        <CampoTexto label="E-mail" type="email" value={form.email} onChange={set("email")} required />
        <CampoTexto label="Telefone" value={form.telefone} onChange={set("telefone")} />
        <CampoSelect label="Tipo" value={form.tipo} onChange={set("tipo")} disabled={ehVoceMesmo}
          opcoes={[{ valor: "cliente", label: "Cliente" }, { valor: "admin", label: "Administrador" }]} />
        {ehVoceMesmo && <Text fontSize={TEXTO_MIUDO} color={TEXTO_SUAVE}>Você não pode alterar o próprio tipo de acesso.</Text>}
      </Flex>
    </form>
  );
}

export default function GestaoUsuarios() {
  const eu = useUsuario();

  const [termo, setTermo] = useState("");
  const [perfil, setPerfil] = useState("");
  const [pagina, setPagina] = useState(1);
  const [lista, setLista] = useState(null);
  const [paginacao, setPaginacao] = useState({ total: 0, totalPaginas: 1 });
  const [editando, setEditando] = useState(null);
  const [salvando, setSalvando] = useState(false);

  // `versao` força uma nova busca depois de salvar/excluir.
  const [versao, setVersao] = useState(0);
  const carregar = () => setVersao((v) => v + 1);

  useEffect(() => {
    let ativo = true;

    (async () => {
    const r = await getUsuarios(pagina, LIMITE);
    if (!r?.sucesso) {
      setLista([]);
      return ativo && toaster.create({ title: "Erro ao carregar", description: r?.mensagem, type: "error" });
    }
    if (!ativo) return;
    setLista(r.dados);
    setPaginacao(r.paginacao);
    })();

    return () => {
      ativo = false;
    };
  }, [pagina, versao]);

  // O endpoint de usuários ainda não aceita filtro; então o recorte é sobre a
  // página já carregada. Se a base crescer, isso vira parâmetro na API.
  const visiveis = (lista || []).filter((u) => {
    const alvo = `${u.nome} ${u.email}`.toLowerCase();
    const casaTermo = !termo.trim() || alvo.includes(termo.trim().toLowerCase());
    const casaPerfil = !perfil || u.tipo === perfil;
    return casaTermo && casaPerfil;
  });

  async function salvar(form) {
    setSalvando(true);
    const r = await atualizarUsuario(editando?.id, { ...form, telefone: form.telefone || null });
    setSalvando(false);

    toaster.create({ title: r?.sucesso ? "Usuário atualizado" : "Erro", description: r?.mensagem, type: r?.sucesso ? "success" : "error" });
    if (r?.sucesso) {
      setEditando(null);
      carregar();
    }
  }

  return (
    <Shell titulo="Usuários" subtitulo={`${paginacao.total} ${paginacao.total === 1 ? "usuário cadastrado" : "usuários cadastrados"}`}>
      <Cartao>
        <Flex gap={GAP_CARTAO} flexWrap="wrap" align="flex-end">
          <Box flex="2" minW="240px">
            <CampoTexto label="Buscar" value={termo} onChange={setTermo} placeholder="Nome ou e-mail" />
          </Box>
          <Box flex="1" minW="180px">
            <CampoSelect label="Perfil" value={perfil} onChange={setPerfil}
              opcoes={[
                { valor: "", label: "Todos" },
                { valor: "cliente", label: "Clientes" },
                { valor: "admin", label: "Administradores" },
              ]} />
          </Box>
        </Flex>
      </Cartao>

      <Cartao p={0} overflow="hidden">
        {lista === null ? (
          <Flex justify="center" py={16}><Spinner color={VINHO} size="lg" /></Flex>
        ) : lista.length === 0 ? (
          <Vazio>Nenhum usuário cadastrado.</Vazio>
        ) : visiveis.length === 0 ? (
          <Vazio>Nenhum usuário nesta busca.</Vazio>
        ) : (
          <Box overflowX="auto">
            <Table.Root size="md">
              <Table.Header>
                <Table.Row bg={FUNDO}>
                  <Table.ColumnHeader>Usuário</Table.ColumnHeader>
                  <Table.ColumnHeader>Telefone</Table.ColumnHeader>
                  <Table.ColumnHeader>Tipo</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">Ações</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {visiveis.map((u) => (
                  <Table.Row key={u.id} _hover={HOVER_LINHA} transition={TRANSICAO}>
                    <Table.Cell>
                      <Flex align="center" gap={3}>
                        <Avatar nome={u.nome} admin={u.tipo === "admin"} />
                        <Box minW={0}>
                          <Text fontWeight="semibold" lineClamp={1}>
                            {u.nome}
                            {eu?.id === u.id && (
                              <Text as="span" fontSize={TEXTO_MIUDO} color={TEXTO_SUAVE}> (você)</Text>
                            )}
                          </Text>
                          <Text fontSize={TEXTO_APOIO} color={TEXTO_SUAVE} lineClamp={1}>{u.email}</Text>
                        </Box>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell>{u.telefone || "—"}</Table.Cell>
                    <Table.Cell>
                      <Badge bg={u.tipo === "admin" ? VINHO : "#F5EDEE"} color={u.tipo === "admin" ? "white" : VINHO} borderRadius="full" px={3}>
                        {u.tipo === "admin" ? "Administrador" : "Cliente"}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell textAlign="right">
                      <BotaoSecundario size="sm" onClick={() => setEditando(u)}><FiEdit2 /></BotaoSecundario>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        )}
      </Cartao>

      <Paginacao pagina={pagina} totalPaginas={paginacao.totalPaginas} onChange={setPagina} />

      <Modal
        aberto={Boolean(editando)}
        titulo="Editar usuário"
        onFechar={() => setEditando(null)}
        rodape={
          <>
            <BotaoSecundario onClick={() => setEditando(null)} disabled={salvando}>Cancelar</BotaoSecundario>
            <BotaoPrimario type="submit" form="form-usuario" loading={salvando}>Salvar</BotaoPrimario>
          </>
        }
      >
        {editando && <FormUsuario key={editando.id} usuario={editando} ehVoceMesmo={eu?.id === editando.id} onSalvar={salvar} />}
      </Modal>
    </Shell>
  );
}
