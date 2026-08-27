"use client";

import { useEffect, useState } from "react";
import { Badge, Box, Flex, Spinner, Table, Text } from "@chakra-ui/react";
import { FiEdit2 } from "react-icons/fi";

import Shell, { Cartao, VINHO, TEXTO_SUAVE } from "@/components/adm/Shell";
import Modal from "@/components/adm/Modal";
import { BotaoPrimario, BotaoSecundario, CampoSelect, CampoTexto, Paginacao, Vazio } from "@/components/adm/Campos";
import { useUsuario } from "@/components/auth/RequireAuth";
import { getUsuarios, atualizarUsuario } from "../../../api";
import { toaster } from "@/components/ui/toaster";

const LIMITE = 10;

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
        {ehVoceMesmo && <Text fontSize="xs" color={TEXTO_SUAVE}>Você não pode alterar o próprio tipo de acesso.</Text>}
      </Flex>
    </form>
  );
}

export default function GestaoUsuarios() {
  const eu = useUsuario();

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
      <Cartao p={0} overflow="hidden">
        {lista === null ? (
          <Flex justify="center" py={16}><Spinner color={VINHO} size="lg" /></Flex>
        ) : lista.length === 0 ? (
          <Vazio>Nenhum usuário cadastrado.</Vazio>
        ) : (
          <Box overflowX="auto">
            <Table.Root size="md">
              <Table.Header>
                <Table.Row bg="#FAF7F2">
                  <Table.ColumnHeader>Nome</Table.ColumnHeader>
                  <Table.ColumnHeader>E-mail</Table.ColumnHeader>
                  <Table.ColumnHeader>Telefone</Table.ColumnHeader>
                  <Table.ColumnHeader>Tipo</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">Ações</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {lista.map((u) => (
                  <Table.Row key={u.id}>
                    <Table.Cell fontWeight="semibold">{u.nome}{eu?.id === u.id && <Text as="span" fontSize="xs" color={TEXTO_SUAVE}> (você)</Text>}</Table.Cell>
                    <Table.Cell>{u.email}</Table.Cell>
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
