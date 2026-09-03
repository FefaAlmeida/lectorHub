"use client";

import { RAIO } from "@/components/tema";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AspectRatio, Badge, Box, Card, Flex, Heading, HStack, Icon, Image, SimpleGrid, Spinner, Stack, Switch, Text } from "@chakra-ui/react";
import { FiBookOpen, FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";

import Shell, { Cartao, VINHO, TEXTO_SUAVE } from "@/components/adm/Shell";
import { FUNDO, BORDA, RAIO_CAMPO, TEXTO_PEQUENO, ALTURA_CAMPO, TRANSICAO, ERRO_COR, ERRO_HOVER, TEXTO_APOIO, GAP_CARTAO, BRANCO, REALCE, TEXTO, TEXTO_MIUDO, HOVER_CARTAO, OK_COR, VINHO_HOVER, SOMBRA_MENU, GAP_ITEM, TITULO_CARTAO } from "@/components/adm/tema";
import Modal from "@/components/adm/Modal";
import { BarraBusca, BotaoLimpar, FiltroMenu } from "@/components/adm/Filtros";
import { BotaoIcone, BotaoPrimario, BotaoSecundario, Campo, CampoArea, CampoSelect, CampoTexto, GrupoCampos, Paginacao, Vazio } from "@/components/adm/Campos";
import { getLivros, getCategorias, criarLivro, atualizarLivro, excluirLivro } from "../../../api";
import { toaster } from "@/components/ui/toaster";

const LIMITE = 10;
const OPCOES_DISPONIBILIDADE = [
  { valor: "", label: "Todos" },
  { valor: "true", label: "Disponíveis" },
  { valor: "false", label: "Emprestados" },
];

const OPCOES_ORDEM = [
  { valor: "titulo_asc", label: "Título (A-Z)" },
  { valor: "titulo_desc", label: "Título (Z-A)" },
  { valor: "recentes", label: "Mais recentes" },
];

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
function FormLivro({ inicial, categorias, onSalvar }) {
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
      <Flex gap={GAP_CARTAO} direction={{ base: "column", md: "row" }} align="flex-start">
        {/* Coluna da capa: o que está sendo cadastrado aparece enquanto se
            digita, em vez de a URL ser um campo de texto às cegas. */}
        <Stack gap={GAP_ITEM} w={{ base: "100%", md: "200px" }} flexShrink={0}>
          <AspectRatio ratio={2 / 3} borderRadius={RAIO} overflow="hidden" bg={FUNDO}>
            {form.capa_url ? (
              <Image src={form.capa_url} alt="Prévia da capa" fit="cover" />
            ) : (
              <Flex align="center" justify="center" direction="column" gap={2} color={TEXTO_SUAVE}>
                <Icon as={FiBookOpen} boxSize={8} opacity={0.5} />
                <Text fontSize={TEXTO_MIUDO} textAlign="center" px={2}>
                  Prévia da capa
                </Text>
              </Flex>
            )}
          </AspectRatio>

          <CampoTexto
            label="URL da capa"
            value={form.capa_url}
            onChange={set("capa_url")}
            placeholder="https://..."
          />
        </Stack>

        <Stack gap={GAP_CARTAO} flex={1} minW={0} w="100%">
          <GrupoCampos titulo="Identificação">
            <CampoTexto label="Título *" value={form.titulo} onChange={set("titulo")} required />
            <CampoTexto label="Autor *" value={form.autor} onChange={set("autor")} required />
          </GrupoCampos>

          <GrupoCampos titulo="Classificação">
            <SimpleGrid columns={{ base: 1, sm: 2 }} gap={GAP_ITEM}>
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
              <CampoTexto
                label="Ano de publicação *"
                type="number"
                value={form.ano_publicacao}
                onChange={set("ano_publicacao")}
                required
                min={0}
                max={new Date().getFullYear() + 1}
              />
            </SimpleGrid>
          </GrupoCampos>

          <GrupoCampos titulo="Sinopse">
            <CampoArea
              value={form.sinopse}
              onChange={set("sinopse")}
              placeholder="Um resumo curto do livro (opcional)"
            />
          </GrupoCampos>

          <GrupoCampos titulo="Disponibilidade">
            {/* Linha inteira com explicação: o switch solto não dizia o que a
                posição desligada significava. */}
            <Flex
              align="center"
              justify="space-between"
              gap={3}
              p={3}
              bg={FUNDO}
              borderRadius={RAIO}
              border="1px solid"
              borderColor={BORDA}
            >
              <Box minW={0}>
                <Text fontSize={TEXTO_APOIO} fontWeight="600" color={TEXTO}>
                  Disponível na estante
                </Text>
                <Text fontSize={TEXTO_MIUDO} color={TEXTO_SUAVE}>
                  Desligue apenas para corrigir o cadastro. Empréstimos são
                  registrados na tela de Empréstimos.
                </Text>
              </Box>

              <Switch.Root
                checked={form.disponivel}
                onCheckedChange={(e) => set("disponivel")(e.checked)}
                colorPalette="green"
              >
                <Switch.HiddenInput />
                <Switch.Control />
              </Switch.Root>
            </Flex>
          </GrupoCampos>
        </Stack>
      </Flex>
    </form>
  );
}

// Mesmo cartão da busca do cliente — capa 2/3, título, autor, selos de
// categoria e ano, ponto colorido de disponibilidade — só que a ação do rodapé
// é editar, não emprestar.
//
// Emprestar/devolver NÃO fica aqui: quem empresta é o leitor (pedido), e quem
// aprova ou registra devolução é a Gestão de Empréstimos, onde estão o prazo,
// o leitor e as regras. Um botão de "emprestar" solto no catálogo mudava a
// disponibilidade sem empréstimo nenhum por trás, deixando o número da tela
// diferente do que a tabela `emprestimos` diz.
function LivroCard({ livro, onEditar, onExcluir }) {
  return (
    <Card.Root
      variant="outline"
      bg={BRANCO}
      borderRadius={RAIO}
      border="1px solid"
      borderColor={BORDA}
      overflow="hidden"
      transition={TRANSICAO}
      _hover={HOVER_CARTAO}
      css={{
        // As ações só aparecem com o cursor sobre o cartão. `focus-within`
        // entra junto porque, escondidas por opacidade, elas continuam
        // alcançáveis pelo Tab — e ficariam invisíveis ao receber o foco.
        "&:hover .acoes-livro, &:focus-within .acoes-livro": {
          opacity: 1,
          pointerEvents: "auto",
        },
      }}
    >
      <Box p={3} pb={0} position="relative">
        <AspectRatio ratio={2 / 3} borderRadius={RAIO} overflow="hidden" bg={FUNDO}>
          {livro.capa_url ? (
            <Image src={livro.capa_url} alt={livro.titulo} fit="cover" />
          ) : (
            <Flex align="center" justify="center">
              <Icon as={FiBookOpen} boxSize={8} color={TEXTO_SUAVE} opacity={0.5} />
            </Flex>
          )}
        </AspectRatio>

        <Flex
          className="acoes-livro"
          position="absolute"
          top={5}
          right={5}
          gap={2}
          opacity={0}
          pointerEvents="none"
          transition={TRANSICAO}
        >
          <BotaoIcone icone={FiEdit2} rotulo="Editar livro" onClick={() => onEditar(livro)} />
          <BotaoIcone icone={FiTrash2} rotulo="Excluir livro" cor={ERRO_COR} onClick={() => onExcluir(livro)} />
        </Flex>
      </Box>

      <Card.Body pt={3} pb={3} px={3} gap={1}>
        <Heading fontSize={TEXTO_APOIO} color={TEXTO} lineClamp={1}>
          {livro.titulo}
        </Heading>

        <Text color={TEXTO_SUAVE} fontSize={TEXTO_MIUDO} mb={1} lineClamp={1}>
          {livro.autor}
        </Text>

        <HStack flexWrap="wrap" gap={1} mb={2}>
          <Badge bg={REALCE} color={VINHO} fontWeight="600" borderRadius="full" px={3}>
            {livro.categoria}
          </Badge>
          {livro.ano_publicacao && (
            <Badge bg={REALCE} color={VINHO} fontWeight="600" borderRadius="full" px={3}>
              {livro.ano_publicacao}
            </Badge>
          )}
        </HStack>

        <HStack align="center" gap={1.5}>
          <Box w={2} h={2} borderRadius="full" bg={livro.disponivel ? OK_COR : ERRO_COR} />
          <Text fontSize={TEXTO_MIUDO} color={TEXTO} fontWeight="medium">
            {livro.disponivel ? "Disponível" : "Emprestado"}
          </Text>
        </HStack>
      </Card.Body>

    </Card.Root>
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

  function buscar() {
    setBusca(termo.trim());
    setPagina(1);
  }

  function limparFiltros() {
    setTermo("");
    setBusca("");
    setCategoriaId("");
    setDisponivel("");
    setOrdem("titulo_asc");
    setPagina(1);
  }

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


  return (
    <Shell
      titulo="Livros"
      subtitulo="Cadastre, edite e classifique os livros do acervo."
      acoes={
        <BotaoPrimario onClick={() => setModal({ modo: "novo" })}>
          <Icon as={FiPlus} mr={2} /> Adicionar livro
        </BotaoPrimario>
      }
    >
      <BarraBusca
        valor={termo}
        onChange={setTermo}
        onBuscar={buscar}
        placeholder="Digite título, autor ou assunto..."
      />

      {/* FILTROS */}
      <Flex gap={4} wrap="wrap" align="flex-start">
        <FiltroMenu
          label="Categoria"
          opcoes={[{ valor: "", label: "Todas" }, ...categorias.map((c) => ({ valor: String(c.id), label: c.nome }))]}
          valor={categoriaId}
          onChange={(v) => { setCategoriaId(v); setPagina(1); }}
        />
        <FiltroMenu
          label="Disponibilidade"
          opcoes={OPCOES_DISPONIBILIDADE}
          valor={disponivel}
          onChange={(v) => { setDisponivel(v); setPagina(1); }}
        />
        <FiltroMenu
          label="Ordenar por"
          opcoes={OPCOES_ORDEM}
          valor={ordem}
          onChange={(v) => { setOrdem(v); setPagina(1); }}
        />

        <BotaoLimpar onClick={limparFiltros} />
      </Flex>

      {/* Contagem saiu do subtítulo, que agora descreve a página. Fica aqui,
          no mesmo lugar em que a busca do cliente mostra o total. */}
      <Flex align="center" gap={2} color={VINHO} borderBottom="1px solid" borderColor={BORDA} pb={3}>
        <Icon as={FiBookOpen} boxSize={5} />
        <Text fontWeight="bold" fontSize={TITULO_CARTAO}>
          {paginacao.total} {paginacao.total === 1 ? "livro" : "livros"}
        </Text>
      </Flex>

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
            />
          ))}
        </SimpleGrid>
      )}

      <Paginacao pagina={pagina} totalPaginas={paginacao.totalPaginas} onChange={setPagina} />

      {/* Criar / editar */}
      <Modal
        aberto={modal?.modo === "novo" || modal?.modo === "editar"}
        titulo={modal?.modo === "editar" ? "Editar livro" : "Novo livro"}
        icone={FiBookOpen}
        descricao={
          modal?.modo === "editar"
            ? "Altere a ficha deste título no acervo."
            : "Cadastre um novo título no acervo da biblioteca."
        }
        onFechar={() => setModal(null)}
        largura="820px"
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
        icone={FiTrash2}
        descricao="Esta ação não pode ser desfeita."
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
