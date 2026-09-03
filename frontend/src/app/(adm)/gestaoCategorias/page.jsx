"use client";

import { useEffect, useState } from "react";
import { Badge, Box, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { FiEdit2, FiPlus, FiTag, FiTrash2 } from "react-icons/fi";

import Shell, { VINHO, TEXTO_SUAVE } from "@/components/adm/Shell";
import { Tabela, Linha, Celula } from "@/components/adm/Tabela";
import { FUNDO, BORDA, BRANCO, REALCE, ERRO_COR, ERRO_HOVER, TEXTO_APOIO, TEXTO_MIUDO, GAP_CARTAO, RAIO, TITULO_CARTAO } from "@/components/adm/tema";
import Modal from "@/components/adm/Modal";
import { BotaoIcone, BotaoPrimario, BotaoSecundario, CampoTexto, CampoArea, GrupoCampos } from "@/components/adm/Campos";
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

  const restantes = 255 - (form.descricao?.length || 0);

  return (
    <form onSubmit={enviar} id="form-categoria">
      <Stack gap={GAP_CARTAO}>
        {/* Prévia: a categoria aparece como selo nos cartões de livro e como
            opção nos filtros. Mostrar isso enquanto se digita evita nome longo
            demais, que depois estoura o selo na grade. */}
        <Flex
          align="center"
          gap={3}
          p={4}
          bg={FUNDO}
          borderRadius={RAIO}
          border="1px solid"
          borderColor={BORDA}
        >
          <Flex
            w="40px"
            h="40px"
            borderRadius="full"
            bg={REALCE}
            color={VINHO}
            align="center"
            justify="center"
            flexShrink={0}
          >
            <Icon as={FiTag} boxSize={4} />
          </Flex>

          <Box minW={0}>
            <Text fontSize={TEXTO_MIUDO} color={TEXTO_SUAVE} mb={1}>
              Aparece assim nos livros
            </Text>
            <Badge bg={REALCE} color={VINHO} fontWeight="600" borderRadius="full" px={3}>
              {form.nome.trim() || "Nome da categoria"}
            </Badge>
          </Box>
        </Flex>

        <GrupoCampos titulo="Identificação">
          <CampoTexto
            label="Nome *"
            value={form.nome}
            onChange={set("nome")}
            required
            maxLength={50}
            placeholder="Ex.: Ficção Científica"
          />
        </GrupoCampos>

        <GrupoCampos titulo="Descrição">
          <Stack gap={1.5}>
            <CampoArea
              label="O que esta categoria reúne"
              value={form.descricao ?? ""}
              onChange={set("descricao")}
              maxLength={255}
              placeholder="Para que serve esta categoria (opcional)"
            />
            <Text fontSize={TEXTO_MIUDO} color={TEXTO_SUAVE} textAlign="right">
              {restantes} {restantes === 1 ? "caractere restante" : "caracteres restantes"}
            </Text>
          </Stack>
        </GrupoCampos>
      </Stack>
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
      subtitulo="Monitore as categorias do acervo e quantos livros cada uma reúne."
      acoes={
        <BotaoPrimario onClick={() => setModal({ modo: "nova" })}>
          <Icon as={FiPlus} mr={2} /> Nova categoria
        </BotaoPrimario>
      }
    >
      {categorias !== null && categorias.length > 0 && (
        <Flex align="center" gap={2} color={VINHO} borderBottom="1px solid" borderColor={BORDA} pb={3}>
          <Icon as={FiTag} boxSize={5} />
          <Text fontWeight="bold" fontSize={TITULO_CARTAO}>
            {categorias.length} {categorias.length === 1 ? "categoria" : "categorias"}
          </Text>
        </Flex>
      )}

      {/* Volta a ser tabela: as três listagens do painel agora usam a mesma
          moldura. Em cartões, nome e contagem ficavam num bloco de 300px com
          a descrição cortada em duas linhas — a tabela lê melhor. */}
      <Tabela
        colunas={[
          { label: "Categoria" },
          { label: "Descrição" },
          { label: "Livros", alinhar: "center", largura: "1%" },
          { label: "Ações", alinhar: "right", largura: "1%" },
        ]}
        carregando={categorias === null}
        vazio={categorias?.length === 0 ? "Nenhuma categoria cadastrada." : null}
      >
        {(categorias || []).map((categoria) => {
          const usada = categoria.total_livros > 0;

          return (
            <Linha key={categoria.id}>
              <Celula>
                <Flex align="center" gap={3}>
                  <Flex
                    w="36px"
                    h="36px"
                    borderRadius="full"
                    bg={REALCE}
                    color={VINHO}
                    align="center"
                    justify="center"
                    flexShrink={0}
                  >
                    <Icon as={FiTag} boxSize={4} />
                  </Flex>
                  <Text fontWeight="semibold" lineClamp={1}>{categoria.nome}</Text>
                </Flex>
              </Celula>

              <Celula>
                <Text fontSize={TEXTO_APOIO} color={TEXTO_SUAVE} lineClamp={2}>
                  {categoria.descricao || "Sem descrição."}
                </Text>
              </Celula>

              <Celula textAlign="center">
                <Badge
                  bg={usada ? REALCE : FUNDO}
                  color={usada ? VINHO : TEXTO_SUAVE}
                  borderRadius="full"
                  px={3}
                  py={1}
                  fontSize={TEXTO_MIUDO}
                  fontWeight="600"
                  whiteSpace="nowrap"
                >
                  {categoria.total_livros}
                </Badge>
              </Celula>

              <Celula textAlign="right">
                <Flex justify="flex-end" gap={2}>
                  <BotaoIcone icone={FiEdit2} rotulo="Editar categoria" onClick={() => setModal({ modo: "editar", categoria })} />

                  {/* Categoria em uso é bloqueada pela FK; desabilitar aqui
                      evita um erro que o admin não teria como resolver dali. */}
                  <BotaoIcone
                    icone={FiTrash2}
                    cor={ERRO_COR}
                    disabled={usada}
                    rotulo={usada ? "Reclassifique os livros antes de excluir" : "Excluir categoria"}
                    onClick={() => setModal({ modo: "excluir", categoria })}
                  />
                </Flex>
              </Celula>
            </Linha>
          );
        })}
      </Tabela>

      {/* Criar / editar */}
      <Modal
        aberto={modal?.modo === "nova" || modal?.modo === "editar"}
        titulo={modal?.modo === "editar" ? "Editar categoria" : "Nova categoria"}
        icone={FiTag}
        descricao={
          modal?.modo === "editar"
            ? "Renomeie a categoria ou ajuste sua descrição."
            : "Crie uma categoria para organizar os livros do acervo."
        }
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
        icone={FiTrash2}
        descricao="Só é possível excluir categorias sem livros."
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
