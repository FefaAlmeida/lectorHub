"use client";

import { useEffect, useState } from "react";
import { Badge, Box, Flex, Icon, Spinner, Table, Text, SimpleGrid } from "@chakra-ui/react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";

import Shell, { Cartao, VINHO, TEXTO_SUAVE } from "@/components/adm/Shell";
import { FUNDO, HOVER_LINHA, TRANSICAO, ERRO_COR, ERRO_HOVER, TEXTO_APOIO, GAP_CARTAO } from "@/components/adm/tema";
import Modal from "@/components/adm/Modal";
import { BotaoPrimario, BotaoSecundario, CampoTexto, CampoArea, Vazio } from "@/components/adm/Campos";
import { getCategorias, criarCategoria, atualizarCategoria, excluirCategoria } from "../../../api";
import { toaster } from "@/components/ui/toaster";

const CATEGORIA_VAZIA = { nome: "", descricao: "" };

function avisar(r, tituloOk) {
  toaster.create({
    title: r?.sucesso ? tituloOk : "Erro",
    description: r?.mensagem,
    type: r?.sucesso ? "success" : "error",
  });
  return Boolean(r?.sucesso);
}

// Recebe `key` do pai para reiniciar o estado a cada categoria editada.
function FormCategoria({ inicial, onSalvar }) {
  const [form, setForm] = useState({ ...CATEGORIA_VAZIA, ...inicial });
  const set = (campo) => (valor) => setForm((f) => ({ ...f, [campo]: valor }));

  function enviar(e) {
    e.preventDefault();
    onSalvar({ nome: form.nome.trim(), descricao: form.descricao?.trim() || null });
  }

  return (
    <form onSubmit={enviar} id="form-categoria">
      <SimpleGrid columns={1} gap={GAP_CARTAO}>
        <CampoTexto label="Nome *" value={form.nome} onChange={set("nome")} required maxLength={50} />
        <CampoArea label="Descrição" value={form.descricao ?? ""} onChange={set("descricao")} maxLength={255} />
      </SimpleGrid>
    </form>
  );
}

export default function GestaoCategorias() {
  const [categorias, setCategorias] = useState(null);
  const [modal, setModal] = useState(null); // { modo: nova | editar | excluir, categoria }
  const [salvando, setSalvando] = useState(false);

  // `versao` força uma nova busca depois de salvar/excluir.
  const [versao, setVersao] = useState(0);
  const recarregar = () => setVersao((v) => v + 1);

  useEffect(() => {
    let ativo = true;

    // contagem=1 traz total_livros: é o que decide se dá para excluir.
    getCategorias({ contagem: 1 }).then((r) => {
      if (!ativo) return;
      if (!r?.sucesso) {
        setCategorias([]);
        return toaster.create({ title: "Erro ao carregar", description: r?.mensagem, type: "error" });
      }
      setCategorias(r.dados);
    });

    return () => {
      ativo = false;
    };
  }, [versao]);

  async function salvar(dados) {
    setSalvando(true);
    const editando = modal?.modo === "editar";
    const r = editando
      ? await atualizarCategoria(modal.categoria.id, dados)
      : await criarCategoria(dados);
    setSalvando(false);

    if (avisar(r, editando ? "Categoria atualizada" : "Categoria criada")) {
      setModal(null);
      recarregar();
    }
  }

  async function excluir() {
    setSalvando(true);
    const r = await excluirCategoria(modal?.categoria?.id);
    setSalvando(false);

    if (avisar(r, "Categoria excluída")) {
      setModal(null);
      recarregar();
    }
  }

  const emUso = modal?.categoria?.total_livros > 0;

  return (
    <Shell
      titulo="Categorias"
      subtitulo={
        categorias === null
          ? "Carregando..."
          : `${categorias.length} ${categorias.length === 1 ? "categoria" : "categorias"} cadastradas`
      }
      acoes={
        <BotaoPrimario onClick={() => setModal({ modo: "nova" })}>
          <Icon as={FiPlus} mr={2} /> Nova categoria
        </BotaoPrimario>
      }
    >
      <Cartao p={0} overflow="hidden">
        {categorias === null ? (
          <Flex justify="center" py={16}><Spinner color={VINHO} size="lg" /></Flex>
        ) : categorias.length === 0 ? (
          <Vazio>Nenhuma categoria cadastrada.</Vazio>
        ) : (
          <Box overflowX="auto">
            <Table.Root size="md">
              <Table.Header>
                <Table.Row bg={FUNDO}>
                  <Table.ColumnHeader>Categoria</Table.ColumnHeader>
                  <Table.ColumnHeader>Descrição</Table.ColumnHeader>
                  <Table.ColumnHeader>Livros</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="end">Ações</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {categorias.map((categoria) => (
                  <Table.Row key={categoria.id} _hover={HOVER_LINHA} transition={TRANSICAO}>
                    <Table.Cell fontWeight="semibold">{categoria.nome}</Table.Cell>

                    <Table.Cell color={TEXTO_SUAVE} fontSize={TEXTO_APOIO} maxW="360px">
                      {categoria.descricao || "—"}
                    </Table.Cell>

                    <Table.Cell>
                      <Badge
                        bg={categoria.total_livros > 0 ? "#F5EDEE" : "#F1F1F1"}
                        color={categoria.total_livros > 0 ? VINHO : TEXTO_SUAVE}
                        borderRadius="full"
                        px={3}
                      >
                        {categoria.total_livros}
                      </Badge>
                    </Table.Cell>

                    <Table.Cell textAlign="end">
                      <Flex gap={2} justify="flex-end">
                        <BotaoSecundario size="sm" aria-label="Editar" onClick={() => setModal({ modo: "editar", categoria })}>
                          <FiEdit2 />
                        </BotaoSecundario>

                        {/* Categoria em uso é bloqueada pela FK; desabilitar aqui
                            evita um erro que o admin não teria como resolver dali. */}
                        <BotaoSecundario
                          size="sm"
                          aria-label="Excluir"
                          color={ERRO_COR}
                          disabled={categoria.total_livros > 0}
                          title={categoria.total_livros > 0 ? "Reclassifique os livros antes de excluir" : undefined}
                          onClick={() => setModal({ modo: "excluir", categoria })}
                        >
                          <FiTrash2 />
                        </BotaoSecundario>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        )}
      </Cartao>

      {/* Criar / editar */}
      <Modal
        aberto={modal?.modo === "nova" || modal?.modo === "editar"}
        titulo={modal?.modo === "editar" ? "Editar categoria" : "Nova categoria"}
        onFechar={() => setModal(null)}
        rodape={
          <>
            <BotaoSecundario onClick={() => setModal(null)} disabled={salvando}>Cancelar</BotaoSecundario>
            <BotaoPrimario type="submit" form="form-categoria" loading={salvando}>Salvar</BotaoPrimario>
          </>
        }
      >
        <FormCategoria
          key={modal?.categoria?.id ?? "nova"}
          inicial={modal?.categoria || {}}
          onSalvar={salvar}
        />
      </Modal>

      {/* Excluir */}
      <Modal
        aberto={modal?.modo === "excluir"}
        titulo="Excluir categoria"
        onFechar={() => setModal(null)}
        rodape={
          <>
            <BotaoSecundario onClick={() => setModal(null)} disabled={salvando}>Cancelar</BotaoSecundario>
            <BotaoPrimario bg={ERRO_COR} _hover={{ bg: ERRO_HOVER }} loading={salvando} disabled={emUso} onClick={excluir}>
              Excluir
            </BotaoPrimario>
          </>
        }
      >
        <Text>
          {emUso ? (
            <>
              <strong>{modal?.categoria?.nome}</strong> está em {modal?.categoria?.total_livros}{" "}
              {modal?.categoria?.total_livros === 1 ? "livro" : "livros"}. Reclassifique-os antes de excluí-la.
            </>
          ) : (
            <>
              Excluir <strong>{modal?.categoria?.nome}</strong>? Esta ação não pode ser desfeita.
            </>
          )}
        </Text>
      </Modal>
    </Shell>
  );
}
