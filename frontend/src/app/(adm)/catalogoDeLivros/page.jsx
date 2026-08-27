"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Badge, Box, Flex, Image, Input, Spinner, Switch, Table, Text, Icon, SimpleGrid } from "@chakra-ui/react";
import { FiBookOpen, FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";

import Shell, { Cartao, VINHO, TEXTO_SUAVE } from "@/components/adm/Shell";
import Modal from "@/components/adm/Modal";
import { BotaoPrimario, BotaoSecundario, Campo, CampoArea, CampoSelect, CampoTexto, Paginacao, Vazio } from "@/components/adm/Campos";
import { getLivros, getCategorias, criarLivro, atualizarLivro, excluirLivro } from "../../../api";
import { toaster } from "@/components/ui/toaster";

const LIMITE = 10;
const LIVRO_VAZIO = { titulo: "", autor: "", categoria: "", ano_publicacao: "", sinopse: "", capa_url: "", disponivel: true };

function avisar(r, tituloOk) {
  toaster.create({
    title: r?.sucesso ? tituloOk : "Erro",
    description: r?.mensagem,
    type: r?.sucesso ? "success" : "error",
  });
  return Boolean(r?.sucesso);
}

// Formulário de criar/editar. Recebe `key` do pai para reiniciar o estado por livro.
function FormLivro({ inicial, categorias, onSalvar, onFechar, salvando }) {
  const [form, setForm] = useState({ ...LIVRO_VAZIO, ...inicial });
  const set = (campo) => (valor) => setForm((f) => ({ ...f, [campo]: valor }));

  function enviar(e) {
    e.preventDefault();
    onSalvar({
      titulo: form.titulo,
      autor: form.autor,
      categoria: form.categoria,
      ano_publicacao: Number(form.ano_publicacao),
      sinopse: form.sinopse || null,
      capa_url: form.capa_url || null,
      disponivel: Boolean(form.disponivel),
    });
  }

  return (
    <form onSubmit={enviar} id="form-livro">
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        <CampoTexto label="Título *" value={form.titulo} onChange={set("titulo")} required />
        <CampoTexto label="Autor *" value={form.autor} onChange={set("autor")} required />
        <Campo label="Categoria *">
          <Input value={form.categoria} onChange={(e) => set("categoria")(e.target.value)} list="categorias" required
            bg="white" border="1px solid #E8DCC4" borderRadius="10px" h="42px" />
          <datalist id="categorias">
            {categorias.map((c) => <option key={c} value={c} />)}
          </datalist>
        </Campo>
        <CampoTexto label="Ano de publicação *" type="number" value={form.ano_publicacao} onChange={set("ano_publicacao")} required min={0} max={new Date().getFullYear() + 1} />
        <Box gridColumn={{ md: "span 2" }}>
          <CampoTexto label="URL da capa" value={form.capa_url} onChange={set("capa_url")} placeholder="https://..." />
        </Box>
        <Box gridColumn={{ md: "span 2" }}>
          <CampoArea label="Sinopse" value={form.sinopse} onChange={set("sinopse")} />
        </Box>
        <Flex align="center" gap={3}>
          <Switch.Root checked={form.disponivel} onCheckedChange={(e) => set("disponivel")(e.checked)} colorPalette="green">
            <Switch.HiddenInput />
            <Switch.Control />
          </Switch.Root>
          <Text fontSize="sm">Disponível na estante</Text>
        </Flex>
      </SimpleGrid>
    </form>
  );
}

function CatalogoConteudo() {
  const searchParams = useSearchParams();

  const [busca, setBusca] = useState("");
  const [termo, setTermo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [pagina, setPagina] = useState(1);
  const [livros, setLivros] = useState(null);
  const [paginacao, setPaginacao] = useState({ total: 0, totalPaginas: 1 });
  const [categorias, setCategorias] = useState([]);

  const [modal, setModal] = useState(searchParams.get("novo") ? { modo: "novo" } : null); // { modo: 'novo' | 'editar' | 'excluir', livro }
  const [salvando, setSalvando] = useState(false);

  // `versao` força uma nova busca depois de salvar/excluir.
  const [versao, setVersao] = useState(0);
  const carregar = () => setVersao((v) => v + 1);

  useEffect(() => {
    let ativo = true;

    (async () => {
    const r = await getLivros({ busca, categoria, pagina, limite: LIMITE });
    if (!r?.sucesso) {
      setLivros([]);
      return ativo && toaster.create({ title: "Erro ao carregar", description: r?.mensagem, type: "error" });
    }
    if (!ativo) return;
    setLivros(r.dados);
    setPaginacao(r.paginacao);
    })();

    return () => {
      ativo = false;
    };
  }, [busca, categoria, pagina, versao]);
  useEffect(() => {
    getCategorias().then((r) => r?.sucesso && setCategorias(r.dados));
  }, [versao]);

  async function salvar(dados) {
    setSalvando(true);
    const editando = modal?.modo === "editar";
    const r = editando ? await atualizarLivro(modal?.livro?.id, dados) : await criarLivro(dados);
    setSalvando(false);
    if (avisar(r, editando ? "Livro atualizado" : "Livro cadastrado")) {
      setModal(null);
      carregar();
    }
  }

  async function excluir() {
    setSalvando(true);
    const r = await excluirLivro(modal?.livro?.id);
    setSalvando(false);
    if (avisar(r, "Livro excluído")) {
      setModal(null);
      carregar();
    }
  }

  async function alternarDisponivel(livro) {
    const r = await atualizarLivro(livro.id, { disponivel: !livro.disponivel });
    if (avisar(r, "Disponibilidade atualizada")) carregar();
  }

  return (
    <Shell
      titulo="Catálogo de Livros"
      subtitulo={`${paginacao.total} ${paginacao.total === 1 ? "livro" : "livros"} no acervo`}
      acoes={
        <BotaoPrimario onClick={() => setModal({ modo: "novo" })}>
          <Icon as={FiPlus} mr={2} /> Adicionar livro
        </BotaoPrimario>
      }
    >
      <Cartao mb={6}>
        <Flex gap={4} flexWrap="wrap" align="flex-end">
          <Box flex="2" minW="240px">
            <Campo label="Buscar">
              <Flex gap={2}>
                <Input value={termo} onChange={(e) => setTermo(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (setBusca(termo.trim()), setPagina(1))}
                  placeholder="Título, autor ou categoria" bg="white" border="1px solid #E8DCC4" borderRadius="10px" h="42px" />
                <BotaoSecundario onClick={() => { setBusca(termo.trim()); setPagina(1); }} h="42px"><FiSearch /></BotaoSecundario>
              </Flex>
            </Campo>
          </Box>
          <Box flex="1" minW="200px">
            <CampoSelect label="Categoria" value={categoria} onChange={(v) => { setCategoria(v); setPagina(1); }}
              opcoes={[{ valor: "", label: "Todas" }, ...categorias.map((c) => ({ valor: c, label: c }))]} />
          </Box>
        </Flex>
      </Cartao>

      <Cartao p={0} overflow="hidden">
        {livros === null ? (
          <Flex justify="center" py={16}><Spinner color={VINHO} size="lg" /></Flex>
        ) : livros.length === 0 ? (
          <Vazio>Nenhum livro encontrado.</Vazio>
        ) : (
          <Box overflowX="auto">
            <Table.Root size="md">
              <Table.Header>
                <Table.Row bg="#FAF7F2">
                  <Table.ColumnHeader>Livro</Table.ColumnHeader>
                  <Table.ColumnHeader>Categoria</Table.ColumnHeader>
                  <Table.ColumnHeader>Ano</Table.ColumnHeader>
                  <Table.ColumnHeader>Disponível</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="right">Ações</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {livros.map((livro) => (
                  <Table.Row key={livro.id}>
                    <Table.Cell>
                      <Flex align="center" gap={3}>
                        {livro.capa_url ? (
                          <Image src={livro.capa_url} alt={livro.titulo} w="40px" h="58px" objectFit="cover" borderRadius="md" />
                        ) : (
                          <Flex w="40px" h="58px" bg="#F2EFE9" borderRadius="md" align="center" justify="center"><Icon as={FiBookOpen} color={VINHO} opacity={0.4} /></Flex>
                        )}
                        <Box>
                          <Text fontWeight="semibold">{livro.titulo}</Text>
                          <Text fontSize="sm" color={TEXTO_SUAVE}>{livro.autor}</Text>
                        </Box>
                      </Flex>
                    </Table.Cell>
                    <Table.Cell><Badge bg="#F5EDEE" color={VINHO} borderRadius="full" px={3}>{livro.categoria}</Badge></Table.Cell>
                    <Table.Cell>{livro.ano_publicacao}</Table.Cell>
                    <Table.Cell>
                      <Switch.Root checked={livro.disponivel} onCheckedChange={() => alternarDisponivel(livro)} colorPalette="green">
                        <Switch.HiddenInput />
                        <Switch.Control />
                      </Switch.Root>
                    </Table.Cell>
                    <Table.Cell textAlign="right">
                      <Flex justify="flex-end" gap={2}>
                        <BotaoSecundario size="sm" onClick={() => setModal({ modo: "editar", livro })}><FiEdit2 /></BotaoSecundario>
                        <BotaoSecundario size="sm" color="#C5221F" borderColor="#C5221F" _hover={{ bg: "#FCE8E6" }} onClick={() => setModal({ modo: "excluir", livro })}><FiTrash2 /></BotaoSecundario>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        )}
      </Cartao>

      <Paginacao pagina={pagina} totalPaginas={paginacao.totalPaginas} onChange={setPagina} />

      {/* Criar / editar */}
      <Modal
        aberto={modal?.modo === "novo" || modal?.modo === "editar"}
        titulo={modal?.modo === "editar" ? "Editar livro" : "Novo livro"}
        onFechar={() => setModal(null)}
        largura="720px"
        rodape={
          <>
            <BotaoSecundario onClick={() => setModal(null)} disabled={salvando}>Cancelar</BotaoSecundario>
            <BotaoPrimario type="submit" form="form-livro" loading={salvando}>Salvar</BotaoPrimario>
          </>
        }
      >
        {/* key garante formulário zerado por livro */}
        <FormLivro key={modal?.livro?.id ?? "novo"} inicial={modal?.livro || {}} categorias={categorias} onSalvar={salvar} salvando={salvando} />
      </Modal>

      {/* Excluir */}
      <Modal
        aberto={modal?.modo === "excluir"}
        titulo="Excluir livro"
        onFechar={() => setModal(null)}
        rodape={
          <>
            <BotaoSecundario onClick={() => setModal(null)} disabled={salvando}>Cancelar</BotaoSecundario>
            <BotaoPrimario bg="#C5221F" _hover={{ bg: "#A11B19" }} loading={salvando} onClick={excluir}>Excluir</BotaoPrimario>
          </>
        }
      >
        <Text>Excluir <strong>{modal?.livro?.titulo}</strong>? Esta ação não pode ser desfeita. Livros com empréstimos em andamento não podem ser excluídos.</Text>
      </Modal>
    </Shell>
  );
}

export default function CatalogoDeLivros() {
  return (
    <Suspense fallback={null}>
      <CatalogoConteudo />
    </Suspense>
  );
}
