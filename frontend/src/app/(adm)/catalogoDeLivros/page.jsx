"use client";

import { RAIO } from "@/components/tema";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AspectRatio, Badge, Box, Flex, HStack, Image, Input, Spinner, Stack, Switch, Text, Icon, SimpleGrid } from "@chakra-ui/react";
import { FiBookOpen, FiCheckCircle, FiEdit2, FiLayers, FiPlus, FiRefreshCcw, FiRotateCcw, FiSearch, FiTrash2, FiUser } from "react-icons/fi";

import Shell, { Cartao, VINHO, TEXTO_SUAVE } from "@/components/adm/Shell";
import { FUNDO, BORDA, RAIO_CAMPO, TEXTO_PEQUENO, ALTURA_CAMPO, HOVER_LINHA, TRANSICAO, ERRO_BG, ERRO_COR, ERRO_HOVER, TEXTO_APOIO, GAP_CARTAO, ALTURA_ACAO, BRANCO, REALCE, TEXTO, TITULO_SECAO, TEXTO_MIUDO, HOVER_CARTAO, OK_COR } from "@/components/adm/tema";
import Modal from "@/components/adm/Modal";
import { BotaoPrimario, BotaoSecundario, Campo, CampoArea, CampoSelect, CampoTexto, Paginacao, Vazio } from "@/components/adm/Campos";
import { getLivros, getCategorias, criarLivro, atualizarLivro, excluirLivro } from "../../../api";
import { toaster } from "@/components/ui/toaster";

const LIMITE = 10;
const LIVRO_VAZIO = { titulo: "", autor: "", categoria_id: "", ano_publicacao: "", sinopse: "", capa_url: "", disponivel: true };

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
  // O <select> trabalha com string; a API devolve categoria_id como número.
  const [form, setForm] = useState({
    ...LIVRO_VAZIO,
    ...inicial,
    categoria_id: inicial?.categoria_id ? String(inicial.categoria_id) : "",
  });
  const set = (campo) => (valor) => setForm((f) => ({ ...f, [campo]: valor }));

  function enviar(e) {
    e.preventDefault();
    onSalvar({
      titulo: form.titulo,
      autor: form.autor,
      categoria_id: Number(form.categoria_id),
      ano_publicacao: Number(form.ano_publicacao),
      sinopse: form.sinopse || null,
      capa_url: form.capa_url || null,
      disponivel: Boolean(form.disponivel),
    });
  }

  return (
    <form onSubmit={enviar} id="form-livro">
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={GAP_CARTAO}>
        <CampoTexto label="Título *" value={form.titulo} onChange={set("titulo")} required />
        <CampoTexto label="Autor *" value={form.autor} onChange={set("autor")} required />
        <CampoSelect
          label="Categoria *"
          value={form.categoria_id}
          onChange={set("categoria_id")}
          required
          opcoes={[
            { valor: "", label: "Selecione..." },
            ...categorias.map((c) => ({ valor: String(c.id), label: c.nome })),
          ]}
        />
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
          <Text fontSize={TEXTO_APOIO}>Disponível na estante</Text>
        </Flex>
      </SimpleGrid>
    </form>
  );
}

// Cartão de número no topo da tela. Estrutura vinda da branch `front`:
// ícone em círculo cheio de vinho, rótulo pequeno e valor em destaque.
function Indicador({ icon, titulo, valor }) {
  return (
    <Cartao>
      <HStack gap={3}>
        <Flex
          w="48px"
          h="48px"
          flexShrink={0}
          borderRadius="full"
          bg={VINHO}
          align="center"
          justify="center"
        >
          <Icon as={icon} color={BRANCO} boxSize={5} />
        </Flex>

        <Stack gap={0}>
          <Text fontSize={TEXTO_MIUDO} color={TEXTO_SUAVE}>{titulo}</Text>
          <Text fontSize={TITULO_SECAO} fontWeight="700" color={TEXTO}>{valor}</Text>
        </Stack>
      </HStack>
    </Cartao>
  );
}

// Livro como cartão com capa, no lugar da linha de tabela. É a diferença
// visual mais forte da branch `front`: o acervo vira vitrine, não planilha.
function LivroCard({ livro, onEditar, onExcluir, onAlternar }) {
  return (
    <Cartao p={2} overflow="hidden" transition={TRANSICAO} _hover={HOVER_CARTAO}>
      {/* Proporção 2/3, a mesma das capas na área do cliente. A altura fixa
          de 220px desalinhava as capas conforme a largura da coluna. */}
      <AspectRatio ratio={2 / 3} borderRadius={RAIO} overflow="hidden" bg={FUNDO}>
        {livro.capa_url ? (
          <Image src={livro.capa_url} alt={livro.titulo} fit="cover" />
        ) : (
          <Flex align="center" justify="center">
            <Icon as={FiBookOpen} boxSize={8} color={TEXTO_SUAVE} opacity={0.5} />
          </Flex>
        )}
      </AspectRatio>

      <Stack gap={0.5} px={1} pt={3}>
        <Text fontSize={TEXTO_APOIO} fontWeight="700" color={TEXTO} lineClamp={1}>
          {livro.titulo}
        </Text>
        <Text fontSize={TEXTO_MIUDO} color={TEXTO_SUAVE} lineClamp={1}>
          {livro.autor}
        </Text>

        <HStack gap={2} pt={1}>
          <Badge bg={REALCE} color={VINHO} borderRadius="full" px={2} fontSize={TEXTO_MIUDO}>
            {livro.categoria}
          </Badge>
          <Text
            fontSize={TEXTO_MIUDO}
            fontWeight="600"
            color={livro.disponivel ? OK_COR : ERRO_COR}
          >
            {livro.disponivel ? "Disponível" : "Emprestado"}
          </Text>
        </HStack>
      </Stack>

      {/* Altura reduzida: os botões herdavam os 48px de campo de formulário,
          que num cartão de ~200px de largura ficavam maiores que a ficha. */}
      <Flex gap={2} mt={3} px={1} pb={1}>
        <BotaoPrimario flex="1" h={ALTURA_ACAO} px={3} fontSize={TEXTO_MIUDO} onClick={() => onEditar(livro)}>
          <Icon as={FiEdit2} mr={1.5} /> Editar
        </BotaoPrimario>

        <BotaoSecundario
          h={ALTURA_ACAO}
          w={ALTURA_ACAO}
          px={0}
          aria-label={livro.disponivel ? "Marcar como emprestado" : "Devolver à estante"}
          title={livro.disponivel ? "Marcar como emprestado" : "Devolver à estante"}
          onClick={() => onAlternar(livro)}
        >
          <Icon as={livro.disponivel ? FiCheckCircle : FiRotateCcw} />
        </BotaoSecundario>

        <BotaoSecundario
          h={ALTURA_ACAO}
          w={ALTURA_ACAO}
          px={0}
          aria-label="Excluir"
          color={ERRO_COR}
          borderColor={ERRO_COR}
          _hover={{ bg: ERRO_BG }}
          onClick={() => onExcluir(livro)}
        >
          <Icon as={FiTrash2} />
        </BotaoSecundario>
      </Flex>
    </Cartao>
  );
}

function CatalogoConteudo() {
  const searchParams = useSearchParams();

  const [busca, setBusca] = useState("");
  const [termo, setTermo] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  // A branch `front` tinha cinco filtros; estes dois a API já suportava e a
  // tela não usava.
  const [disponivel, setDisponivel] = useState("");
  const [ordem, setOrdem] = useState("titulo_asc");
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
    const r = await getLivros({ busca, categoria_id: categoriaId, disponivel, ordem, pagina, limite: LIMITE });
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
  }, [busca, categoriaId, disponivel, ordem, pagina, versao]);
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
      <Cartao>
        <Flex gap={GAP_CARTAO} flexWrap="wrap" align="flex-end">
          <Box flex="2" minW="240px">
            <Campo label="Buscar">
              <Flex gap={2}>
                <Input value={termo} onChange={(e) => setTermo(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (setBusca(termo.trim()), setPagina(1))}
                  placeholder="Título, autor ou categoria" bg="white" border="1px solid" borderColor={BORDA} borderRadius={RAIO_CAMPO} h={ALTURA_CAMPO} fontSize={TEXTO_PEQUENO} />
                <BotaoSecundario onClick={() => { setBusca(termo.trim()); setPagina(1); }} h="42px"><FiSearch /></BotaoSecundario>
              </Flex>
            </Campo>
          </Box>
          <Box flex="1" minW="180px">
            <CampoSelect label="Categoria" value={categoriaId} onChange={(v) => { setCategoriaId(v); setPagina(1); }}
              opcoes={[{ valor: "", label: "Todas" }, ...categorias.map((c) => ({ valor: String(c.id), label: c.nome }))]} />
          </Box>

          <Box flex="1" minW="160px">
            <CampoSelect label="Disponibilidade" value={disponivel} onChange={(v) => { setDisponivel(v); setPagina(1); }}
              opcoes={[
                { valor: "", label: "Todos" },
                { valor: "true", label: "Disponíveis" },
                { valor: "false", label: "Emprestados" },
              ]} />
          </Box>

          <Box flex="1" minW="160px">
            <CampoSelect label="Ordenar por" value={ordem} onChange={(v) => { setOrdem(v); setPagina(1); }}
              opcoes={[
                { valor: "titulo_asc", label: "Título (A-Z)" },
                { valor: "titulo_desc", label: "Título (Z-A)" },
                { valor: "recentes", label: "Mais recentes" },
              ]} />
          </Box>

          <BotaoSecundario
            onClick={() => { setTermo(""); setBusca(""); setCategoriaId(""); setDisponivel(""); setOrdem("titulo_asc"); setPagina(1); }}
          >
            <Icon as={FiRefreshCcw} mr={2} /> Limpar
          </BotaoSecundario>
        </Flex>
      </Cartao>

      {/* LIVROS — grade de cartões com capa, no lugar da tabela */}
      {livros === null ? (
        <Flex justify="center" py={16}><Spinner color={VINHO} size="lg" /></Flex>
      ) : livros.length === 0 ? (
        <Cartao><Vazio>Nenhum livro encontrado.</Vazio></Cartao>
      ) : (
        <SimpleGrid columns={{ base: 2, md: 3, lg: 4, xl: 5 }} gap={GAP_CARTAO}>
          {livros.map((livro) => (
            <LivroCard
              key={livro.id}
              livro={livro}
              onEditar={(l) => setModal({ modo: "editar", livro: l })}
              onExcluir={(l) => setModal({ modo: "excluir", livro: l })}
              onAlternar={alternarDisponivel}
            />
          ))}
        </SimpleGrid>
      )}

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
            <BotaoPrimario bg={ERRO_COR} _hover={{ bg: ERRO_HOVER }} loading={salvando} onClick={excluir}>Excluir</BotaoPrimario>
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
