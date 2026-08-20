"use client";
import SideBarADM from "@/components/sideBarADM/sideBarADM";
import { useState } from "react";

import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";

import {
  FiHome,
  FiBook,
  FiGrid,
  FiUsers,
  FiClock,
  FiRefreshCw,
  FiRepeat,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiSearch,
  FiBookOpen,
  FiCheckCircle,
  FiUser,
  FiLayers,
  FiChevronLeft,
  FiChevronRight,
  FiTrash2,
  FiPlus,
  FiEdit3,
  FiX,
  FiSave,
} from "react-icons/fi";


// =====================================================
// CORES
// =====================================================

const PRIMARY = "#4A0E17";
const PRIMARY_DARK = "#360A11";

const BACKGROUND = "#F5F2EE";
const WHITE = "#FFFFFF";

const BORDER = "#EFEBE3";

const TEXT = "#333333";
const TEXT_LIGHT = "#777777";


// =====================================================
// DADOS INICIAIS
// =====================================================

const LIVROS_INICIAIS = [
  {
    id: 1,
    titulo: "1984",
    autor: "George Orwell",
    categoria: "Ficção",
    ano: 1949,
    isbn: "9780451524935",
    disponivel: true,
    imagem:
      "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg",
  },

  {
    id: 2,
    titulo: "Dom Casmurro",
    autor: "Machado de Assis",
    categoria: "Romance",
    ano: 1899,
    isbn: "9788535902778",
    disponivel: true,
    imagem:
      "https://covers.openlibrary.org/b/isbn/9788535902778-L.jpg",
  },

  {
    id: 3,
    titulo: "O Pequeno Príncipe",
    autor: "Antoine de Saint-Exupéry",
    categoria: "Infantil",
    ano: 1943,
    isbn: "9780156012195",
    disponivel: true,
    imagem:
      "https://covers.openlibrary.org/b/isbn/9780156012195-L.jpg",
  },

  {
    id: 4,
    titulo: "A Menina que Roubava Livros",
    autor: "Markus Zusak",
    categoria: "Drama",
    ano: 2005,
    isbn: "9780375842207",
    disponivel: false,
    imagem:
      "https://covers.openlibrary.org/b/isbn/9780375842207-L.jpg",
  },

  {
    id: 5,
    titulo: "O Hobbit",
    autor: "J.R.R. Tolkien",
    categoria: "Fantasia",
    ano: 1937,
    isbn: "9780547928227",
    disponivel: true,
    imagem:
      "https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg",
  },

  {
    id: 6,
    titulo: "Orgulho e Preconceito",
    autor: "Jane Austen",
    categoria: "Romance",
    ano: 1813,
    isbn: "9780141439518",
    disponivel: true,
    imagem:
      "https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg",
  },

  {
    id: 7,
    titulo: "Harry Potter e a Pedra Filosofal",
    autor: "J.K. Rowling",
    categoria: "Fantasia",
    ano: 1997,
    isbn: "9780590353427",
    disponivel: true,
    imagem:
      "https://covers.openlibrary.org/b/isbn/9780590353427-L.jpg",
  },

  {
    id: 8,
    titulo: "O Alquimista",
    autor: "Paulo Coelho",
    categoria: "Ficção",
    ano: 1988,
    isbn: "9780062315007",
    disponivel: true,
    imagem:
      "https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg",
  },

  {
    id: 9,
    titulo: "Cem Anos de Solidão",
    autor: "Gabriel García Márquez",
    categoria: "Romance",
    ano: 1967,
    isbn: "9780060883287",
    disponivel: false,
    imagem:
      "https://covers.openlibrary.org/b/isbn/9780060883287-L.jpg",
  },

  {
    id: 10,
    titulo: "O Caçador de Pipas",
    autor: "Khaled Hosseini",
    categoria: "Drama",
    ano: 2003,
    isbn: "9781594631931",
    disponivel: false,
    imagem:
      "https://covers.openlibrary.org/b/isbn/9781594631931-L.jpg",
  },
];


// =====================================================
// MENU
// =====================================================

// `emBreve` marca os itens que ainda não têm página — ficam visíveis, porém
// inertes, em vez de virarem links quebrados.
const MENU = [
  {
    label: "Dashboard",
    icon: FiHome,
    emBreve: true,
  },

  {
    label: "Livros",
    icon: FiBook,
    href: "/catalogoDeLivros",
    active: true,
  },

  {
    label: "Categorias",
    icon: FiGrid,
    emBreve: true,
  },

  {
    label: "Usuários",
    icon: FiUsers,
    emBreve: true,
  },

  {
    label: "Empréstimos",
    icon: FiClock,
    href: "/gestaoEeR",
  },

  {
    label: "Devoluções",
    icon: FiRefreshCw,
    href: "/gestaoEeR",
  },

  {
    label: "Prazos",
    icon: FiRepeat,
    href: "/editarPrazo",
  },

  {
    label: "Relatórios",
    icon: FiFileText,
    emBreve: true,
  },

  {
    label: "Configurações",
    icon: FiSettings,
    emBreve: true,
  },
];


// =====================================================
// ITEM DO MENU
// =====================================================

function MenuItem({ item }) {
  return (
    <HStack
      as={item.emBreve ? "div" : "a"}
      href={item.emBreve ? undefined : item.href}
      title={item.emBreve ? "Em breve" : undefined}
      px={3}
      py={2.5}
      borderRadius="5px"
      bg={item.active ? PRIMARY_DARK : "transparent"}
      color={
        item.active
          ? WHITE
          : item.emBreve
          ? "rgba(255,255,255,.35)"
          : "rgba(255,255,255,.85)"
      }
      cursor={item.emBreve ? "default" : "pointer"}
      gap={3}
      transition="all .2s ease"
      _hover={{
        bg: item.active
          ? PRIMARY_DARK
          : item.emBreve
          ? "transparent"
          : "rgba(255,255,255,.08)",
      }}
    >
      <Icon
        as={item.icon}
        boxSize={3.5}
      />

      <Text
        fontSize="11px"
        fontWeight={item.active ? "600" : "400"}
      >
        {item.label}
      </Text>
    </HStack>
  );
}


// =====================================================
// INDICADOR
// =====================================================

function Indicador({
  icon,
  titulo,
  valor,
}) {
  return (
    <Card.Root
      bg={WHITE}
      border="1px solid"
      borderColor={BORDER}
      borderRadius="7px"
      boxShadow="none"
    >
      <Card.Body p={5}>

        <HStack gap={3}>

          <Box
            w="48px"
            h="48px"
            flexShrink={0}
            borderRadius="full"
            bg={PRIMARY}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon
              as={icon}
              color={WHITE}
              boxSize={5}
            />
          </Box>

          <Stack gap={0}>

            <Text
              fontSize="11px"
              color={TEXT_LIGHT}
            >
              {titulo}
            </Text>

            <Text
              fontSize="20px"
              fontWeight="700"
              color={TEXT}
            >
              {valor}
            </Text>

          </Stack>

        </HStack>

      </Card.Body>
    </Card.Root>
  );
}


// =====================================================
// FILTRO
// =====================================================

function FiltroSelect({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <Stack gap={1}>

      <Text
        fontSize="11px"
        color={TEXT_LIGHT}
      >
        {label}
      </Text>

      <Box
        as="select"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        h="42px"
        px={2}
        fontSize="12px"
        bg={WHITE}
        color={TEXT}
        border="1px solid"
        borderColor="#E5DED6"
        borderRadius="5px"
        outline="none"
        cursor="pointer"
        _focus={{
          borderColor: PRIMARY,
          boxShadow:
            `0 0 0 1px ${PRIMARY}`,
        }}
      >

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}

      </Box>

    </Stack>
  );
}


// =====================================================
// CARD DO LIVRO
// =====================================================

function LivroCard({
  livro,
  onEditar,
  onExcluir,
  onInformacoes,
}) {
  return (
    <Card.Root
      bg={WHITE}
      border="1px solid"
      borderColor={BORDER}
      borderRadius="7px"
      overflow="hidden"
      boxShadow="none"
      transition="all .2s ease"
      _hover={{
        transform: "translateY(-2px)",
        boxShadow:
          "0 5px 15px rgba(74,14,23,.08)",
      }}
    >

      <Card.Body p={2}>

        {/* CAPA */}

        <Box
          h="220px"
          bg="#F1EDE7"
          borderRadius="5px"
          overflow="hidden"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >

          {livro.imagem ? (
            <Box
              as="img"
              src={livro.imagem}
              alt={livro.titulo}
              w="100%"
              h="100%"
              objectFit="cover"
            />
          ) : (
            <Icon
              as={FiBookOpen}
              boxSize={10}
              color="#B7AAA0"
            />
          )}

        </Box>


        {/* INFORMAÇÕES */}

        <Stack
          gap={0.5}
          px={1}
          pt={2}
        >

          <Text
            fontSize="12px"
            fontWeight="700"
            color={TEXT}
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {livro.titulo}
          </Text>

          <Text
            fontSize="7px"
            color={TEXT_LIGHT}
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
          >
            {livro.autor}
          </Text>

          <Text
            fontSize="7px"
            color={
              livro.disponivel
                ? "#347A45"
                : "#9A3434"
            }
            fontWeight="600"
          >
            {livro.disponivel
              ? "Disponível"
              : "Emprestado"}
          </Text>

        </Stack>


        {/* AÇÕES */}

        <Flex
          gap={1}
          mt={2}
        >

          {/* INFORMAÇÕES */}

          <Button
            flex="1"
            h="25px"
            fontSize="11px"
            bg={PRIMARY}
            color={WHITE}
            borderRadius="4px"
            onClick={() =>
              onInformacoes(livro)
            }
            _hover={{
              bg: PRIMARY_DARK,
            }}
          >
            Informações
          </Button>


          {/* EDITAR */}

          <Button
            minW="36px"
            h="36px"
            p={0}
            bg="#F4E8E8"
            color={PRIMARY}
            borderRadius="4px"
            onClick={() =>
              onEditar(livro)
            }
            _hover={{
              bg: "#EAD7D7",
            }}
            title="Editar livro"
          >
            <Icon
              as={FiEdit3}
              boxSize={3}
            />
          </Button>


          {/* EXCLUIR */}

          <Button
            minW="25px"
            h="25px"
            p={0}
            bg="#F9EAEA"
            color="#9A3434"
            borderRadius="4px"
            onClick={() =>
              onExcluir(livro.id)
            }
            _hover={{
              bg: "#F1D2D2",
            }}
            title="Excluir livro"
          >
            <Icon
              as={FiTrash2}
              boxSize={3}
            />
          </Button>

        </Flex>

      </Card.Body>

    </Card.Root>
  );
}


// =====================================================
// MODAL DE LIVRO
// =====================================================

function ModalLivro({
  aberto,
  livro,
  onFechar,
  onSalvar,
}) {
  const [form, setForm] = useState(
    livro || {
      titulo: "",
      autor: "",
      categoria: "Ficção",
      ano: "",
      isbn: "",
      imagem: "",
      disponivel: true,
    }
  );

  if (!aberto) {
    return null;
  }

  function alterar(campo, valor) {
    setForm((atual) => ({
      ...atual,
      [campo]: valor,
    }));
  }

  return (
    <Box
      position="fixed"
      inset={0}
      bg="rgba(0,0,0,.45)"
      zIndex={1000}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >

      <Card.Root
        w="100%"
        maxW="550px"
        bg={WHITE}
        borderRadius="12px"
        boxShadow="0 15px 40px rgba(0,0,0,.2)"
      >

        <Card.Header
          px={6}
          pt={6}
          pb={3}
        >

          <Flex
            justify="space-between"
            align="center"
          >

            <Stack gap={0}>

              <Heading
                fontFamily="Georgia, serif"
                fontSize="22px"
                color={PRIMARY}
              >
                {livro
                  ? "Editar livro"
                  : "Adicionar livro"}
              </Heading>

              <Text
                fontSize="10px"
                color={TEXT_LIGHT}
              >
                Preencha os dados do livro.
              </Text>

            </Stack>

            <Button
              variant="ghost"
              p={0}
              minW="30px"
              h="30px"
              onClick={onFechar}
            >
              <Icon
                as={FiX}
                boxSize={5}
              />
            </Button>

          </Flex>

        </Card.Header>


        <Card.Body px={6} pb={6}>

          <Stack gap={4}>

            {/* TÍTULO */}

            <Stack gap={1}>

              <Text
                fontSize="12px"
                fontWeight="600"
                color={TEXT}
              >
                Título
              </Text>

              <Input
                value={form.titulo}
                onChange={(e) =>
                  alterar(
                    "titulo",
                    e.target.value
                  )
                }
                placeholder="Digite o título"
                h="38px"
                fontSize="11px"
              />

            </Stack>


            {/* AUTOR */}

            <Stack gap={1}>

              <Text
                fontSize="12px"
                fontWeight="600"
                color={TEXT}
              >
                Autor
              </Text>

              <Input
                value={form.autor}
                onChange={(e) =>
                  alterar(
                    "autor",
                    e.target.value
                  )
                }
                placeholder="Digite o autor"
                h="38px"
                fontSize="11px"
              />

            </Stack>


            {/* CATEGORIA + ANO */}

            <Flex gap={3}>

              <Box flex="1">

                <FiltroSelect
                  label="Categoria"
                  value={form.categoria}
                  onChange={(valor) =>
                    alterar(
                      "categoria",
                      valor
                    )
                  }
                  options={[
                    "Ficção",
                    "Romance",
                    "Fantasia",
                    "Drama",
                    "Infantil",
                  ]}
                />

              </Box>

              <Stack
                gap={1}
                flex="1"
              >

                <Text
                  fontSize="11px"
                  color={TEXT_LIGHT}
                >
                  Ano
                </Text>

                <Input
                  type="number"
                  value={form.ano}
                  onChange={(e) =>
                    alterar(
                      "ano",
                      e.target.value
                    )
                  }
                  h="42px"
                  fontSize="12px"
                  placeholder="Ex: 2026"
                />

              </Stack>

            </Flex>


            {/* ISBN */}

            <Stack gap={1}>

              <Text
                fontSize="12px"
                fontWeight="600"
                color={TEXT}
              >
                ISBN
              </Text>

              <Input
                value={form.isbn}
                onChange={(e) =>
                  alterar(
                    "isbn",
                    e.target.value
                  )
                }
                placeholder="Digite o ISBN"
                h="38px"
                fontSize="11px"
              />

            </Stack>


            {/* IMAGEM */}

            <Stack gap={1}>

              <Text
                fontSize="12px"
                fontWeight="600"
                color={TEXT}
              >
                URL da capa
              </Text>

              <Input
                value={form.imagem}
                onChange={(e) =>
                  alterar(
                    "imagem",
                    e.target.value
                  )
                }
                placeholder="https://..."
                h="38px"
                fontSize="11px"
              />

            </Stack>


            {/* DISPONIBILIDADE */}

            <Flex
              justify="space-between"
              align="center"
              p={3}
              bg="#F8F5F1"
              borderRadius="7px"
            >

              <Stack gap={0}>

                <Text
                  fontSize="10px"
                  fontWeight="600"
                  color={TEXT}
                >
                  Livro disponível
                </Text>

                <Text
                  fontSize="11px"
                  color={TEXT_LIGHT}
                >
                  Indica se o livro está disponível para empréstimo.
                </Text>

              </Stack>

              <input
                type="checkbox"
                checked={form.disponivel}
                onChange={(e) =>
                  alterar(
                    "disponivel",
                    e.target.checked
                  )
                }
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: PRIMARY,
                }}
              />

            </Flex>


            {/* BOTÕES */}

            <Flex
              justify="flex-end"
              gap={2}
              pt={2}
            >

              <Button
                variant="outline"
                borderColor={BORDER}
                color={TEXT}
                h="36px"
                fontSize="10px"
                onClick={onFechar}
              >
                Cancelar
              </Button>

              <Button
                bg={PRIMARY}
                color={WHITE}
                h="36px"
                fontSize="10px"
                onClick={() =>
                  onSalvar(form)
                }
                _hover={{
                  bg: PRIMARY_DARK,
                }}
              >

                <Icon
                  as={FiSave}
                  mr={2}
                  boxSize={3}
                />

                {livro
                  ? "Salvar alterações"
                  : "Adicionar livro"}

              </Button>

            </Flex>

          </Stack>

        </Card.Body>

      </Card.Root>

    </Box>
  );
}


// =====================================================
// MODAL DE INFORMAÇÕES
// =====================================================

function ModalInformacoes({
  livro,
  onFechar,
}) {
  if (!livro) {
    return null;
  }

  return (
    <Box
      position="fixed"
      inset={0}
      bg="rgba(0,0,0,.45)"
      zIndex={1000}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >

      <Card.Root
        w="100%"
        maxW="500px"
        bg={WHITE}
        borderRadius="12px"
        boxShadow="0 15px 40px rgba(0,0,0,.2)"
      >

        <Card.Header px={6} pt={6}>

          <Flex
            justify="space-between"
            align="center"
          >

            <Heading
              fontFamily="Georgia, serif"
              fontSize="22px"
              color={PRIMARY}
            >
              Informações do Livro
            </Heading>

            <Button
              variant="ghost"
              p={0}
              minW="30px"
              h="30px"
              onClick={onFechar}
            >
              <Icon
                as={FiX}
              />
            </Button>

          </Flex>

        </Card.Header>


        <Card.Body px={6} pb={6}>

          <Flex gap={5}>

            <Box
              w="130px"
              h="180px"
              bg="#F1EDE7"
              borderRadius="7px"
              overflow="hidden"
              flexShrink={0}
            >

              {livro.imagem ? (
                <Box
                  as="img"
                  src={livro.imagem}
                  alt={livro.titulo}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                />
              ) : (
                <Flex
                  w="100%"
                  h="100%"
                  align="center"
                  justify="center"
                >
                  <Icon
                    as={FiBookOpen}
                    boxSize={8}
                    color="#B7AAA0"
                  />
                </Flex>
              )}

            </Box>


            <Stack gap={2}>

              <Text
                fontSize="18px"
                fontWeight="700"
                color={TEXT}
              >
                {livro.titulo}
              </Text>

              <Text
                fontSize="11px"
                color={TEXT_LIGHT}
              >
                {livro.autor}
              </Text>

              <Text
                fontSize="10px"
                color={TEXT}
              >
                Categoria:{" "}
                <strong>
                  {livro.categoria}
                </strong>
              </Text>

              <Text
                fontSize="10px"
                color={TEXT}
              >
                Ano:{" "}
                <strong>
                  {livro.ano}
                </strong>
              </Text>

              <Text
                fontSize="10px"
                color={TEXT}
              >
                ISBN:{" "}
                <strong>
                  {livro.isbn || "—"}
                </strong>
              </Text>

              <Text
                fontSize="10px"
                fontWeight="600"
                color={
                  livro.disponivel
                    ? "#347A45"
                    : "#9A3434"
                }
              >
                {livro.disponivel
                  ? "Disponível"
                  : "Emprestado"}
              </Text>

            </Stack>

          </Flex>

        </Card.Body>

      </Card.Root>

    </Box>
  );
}


// =====================================================
// PÁGINA PRINCIPAL
// =====================================================

export default function CatalogoLivros() {

  const [livros, setLivros] = useState(
    LIVROS_INICIAIS
  );

  const [busca, setBusca] =
    useState("");

  const [categoria, setCategoria] =
    useState("Todas");

  const [disponibilidade, setDisponibilidade] =
    useState("Todas");

  const [ano, setAno] =
    useState("Todos");

  const [ordenacao, setOrdenacao] =
    useState("Mais recentes");


  // ===================================================
  // MODAIS
  // ===================================================

  const [modalLivro, setModalLivro] =
    useState(false);

  const [livroEditando, setLivroEditando] =
    useState(null);

  const [livroInformacoes, setLivroInformacoes] =
    useState(null);


  // ===================================================
  // ADICIONAR
  // ===================================================

  function adicionarLivro() {

    setLivroEditando(null);
    setModalLivro(true);

  }


  // ===================================================
  // EDITAR
  // ===================================================

  function editarLivro(livro) {

    setLivroEditando(livro);
    setModalLivro(true);

  }


  // ===================================================
  // EXCLUIR
  // ===================================================

  function excluirLivro(id) {

    const livro =
      livros.find(
        (item) => item.id === id
      );

    if (!livro) {
      return;
    }

    const confirmar =
      window.confirm(
        `Tem certeza que deseja excluir "${livro.titulo}"?`
      );

    if (!confirmar) {
      return;
    }

    setLivros(
      (listaAtual) =>
        listaAtual.filter(
          (item) => item.id !== id
        )
    );

    /*
      FUTURO BACKEND:

      await fetch(`/api/livros/${id}`, {
        method: "DELETE"
      });
    */
  }


  // ===================================================
  // SALVAR LIVRO
  // ===================================================

  function salvarLivro(form) {

    if (
      !form.titulo.trim() ||
      !form.autor.trim()
    ) {
      alert(
        "Preencha pelo menos o título e o autor."
      );

      return;
    }


    // EDITAR

    if (livroEditando) {

      setLivros(
        (listaAtual) =>
          listaAtual.map(
            (livro) =>
              livro.id ===
              livroEditando.id
                ? {
                    ...livro,
                    ...form,
                    id: livro.id,
                  }
                : livro
          )
      );

      /*
        FUTURO BACKEND:

        await fetch(
          `/api/livros/${livroEditando.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify(form),
          }
        );
      */

    } else {

      // ADICIONAR

      const novoLivro = {
        ...form,
        id:
          Date.now(),
        ano:
          Number(form.ano) || "",
      };

      setLivros(
        (listaAtual) => [
          novoLivro,
          ...listaAtual,
        ]
      );

      /*
        FUTURO BACKEND:

        await fetch("/api/livros", {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body:
            JSON.stringify(form),
        });
      */
    }


    setModalLivro(false);
    setLivroEditando(null);
  }


  // ===================================================
  // FILTROS
  // ===================================================

  let livrosFiltrados =
    livros.filter(
      (livro) => {

        const texto =
          `${livro.titulo} ${livro.autor} ${
            livro.isbn || ""
          }`.toLowerCase();


        const correspondeBusca =
          texto.includes(
            busca.toLowerCase()
          );


        const correspondeCategoria =
          categoria === "Todas" ||
          livro.categoria ===
            categoria;


        const correspondeDisponibilidade =
          disponibilidade === "Todas" ||
          (
            disponibilidade ===
              "Disponíveis" &&
            livro.disponivel
          ) ||
          (
            disponibilidade ===
              "Indisponíveis" &&
            !livro.disponivel
          );


        const correspondeAno =
          ano === "Todos" ||
          String(livro.ano) ===
            ano;


        return (
          correspondeBusca &&
          correspondeCategoria &&
          correspondeDisponibilidade &&
          correspondeAno
        );
      }
    );


  // ===================================================
  // ORDENAÇÃO
  // ===================================================

  if (
    ordenacao === "A-Z"
  ) {

    livrosFiltrados.sort(
      (a, b) =>
        a.titulo.localeCompare(
          b.titulo
        )
    );

  }


  if (
    ordenacao === "Z-A"
  ) {

    livrosFiltrados.sort(
      (a, b) =>
        b.titulo.localeCompare(
          a.titulo
        )
    );

  }


  if (
    ordenacao === "Mais recentes"
  ) {

    livrosFiltrados.sort(
      (a, b) =>
        Number(b.ano || 0) -
        Number(a.ano || 0)
    );

  }


  // ===================================================
  // LIMPAR FILTROS
  // ===================================================

  function limparFiltros() {

    setBusca("");
    setCategoria("Todas");
    setDisponibilidade("Todas");
    setAno("Todos");
    setOrdenacao(
      "Mais recentes"
    );

  }


  // ===================================================
  // CONTADORES
  // ===================================================

  const totalLivros =
    livros.length;

  const disponiveis =
    livros.filter(
      (livro) =>
        livro.disponivel
    ).length;

  const emprestados =
    livros.filter(
      (livro) =>
        !livro.disponivel
    ).length;

  const categorias =
    new Set(
      livros.map(
        (livro) =>
          livro.categoria
      )
    ).size;


  return (

    <Flex
      minH="100vh"
      bg={BACKGROUND}
    >
      <SideBarADM />


     


      {/* =================================================
          CONTEÚDO
      ================================================= */}

      <Box
        flex="1"
        minW={0}
        p={{
          base: 5,
          md: 7,
        }}
      >

        <Stack
          maxW="1200px"
          mx="auto"
          gap={5}
        >


          {/* =================================================
              CABEÇALHO
          ================================================= */}

          <Flex
            justify="space-between"
            align="center"
            gap={4}
            flexWrap="wrap"
          >

            <Stack gap={1}>

              

              <Heading
                fontFamily="Georgia, serif"
                fontSize={{
                  base: "36px",
                  md: "42px",
                }}
                color={PRIMARY}
                lineHeight="1"
              >
                Catálogo de Livros
              </Heading>

              <Text
                fontSize="13px"
                color={TEXT_LIGHT}
              >
                Gerencie os livros cadastrados no
                acervo da biblioteca.
              </Text>

            </Stack>


            {/* BOTÃO ADICIONAR */}

            <Button
              bg={PRIMARY}
              color={WHITE}
              borderRadius="8px"
              px={5}
              h="40px"
              fontSize="12px"
              fontWeight="600"
              boxShadow="0 4px 12px rgba(74,14,23,.15)"
              onClick={
                adicionarLivro
              }
              _hover={{
                bg: PRIMARY_DARK,
                transform:
                  "translateY(-1px)",
              }}
              transition="all .2s ease"
            >

              <Icon
                as={FiPlus}
                mr={2}
                boxSize={5}
              />

              Adicionar livro

            </Button>

          </Flex>


          {/* =================================================
              INDICADORES
          ================================================= */}

          <Grid
            templateColumns={{
              base: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={4}
          >

            <Indicador
              icon={FiBookOpen}
              titulo="Total de livros"
              valor={totalLivros}
            />

            <Indicador
              icon={FiCheckCircle}
              titulo="Disponíveis"
              valor={disponiveis}
            />

            <Indicador
              icon={FiUser}
              titulo="Emprestados"
              valor={emprestados}
            />

            <Indicador
              icon={FiLayers}
              titulo="Categorias"
              valor={categorias}
            />

          </Grid>


          {/* =================================================
              FILTROS
          ================================================= */}

          <Card.Root
            bg={WHITE}
            border="1px solid"
            borderColor={BORDER}
            borderRadius="7px"
          >

            <Card.Body p={5}>

              <Grid
                templateColumns={{
                  base: "1fr",
                  md:
                    "2fr 1fr 1fr 1fr 1fr auto",
                }}
                gap={2}
                alignItems="end"
              >


                {/* BUSCA */}

                <Stack gap={1}>

                  <Text
                    fontSize="11px"
                    color={TEXT_LIGHT}
                  >
                    Buscar
                  </Text>

                  <Box position="relative">

                    <Icon
                      as={FiSearch}
                      position="absolute"
                      left="12px"
                      top="50%"
                      transform="translateY(-50%)"
                      color="#999"
                      boxSize={4}
                      zIndex={1}
                    />

                    <Input
                      pl="38px"
                      h="42px"
                      fontSize="12px"
                      placeholder="Buscar por título, autor ou ISBN..."
                      value={busca}
                      onChange={(e) =>
                        setBusca(
                          e.target.value
                        )
                      }
                      borderColor="#E5DED6"
                      borderRadius="5px"
                    />

                  </Box>

                </Stack>


                <FiltroSelect
                  label="Categoria"
                  value={categoria}
                  onChange={
                    setCategoria
                  }
                  options={[
                    "Todas",
                    "Ficção",
                    "Romance",
                    "Fantasia",
                    "Drama",
                    "Infantil",
                  ]}
                />


                <FiltroSelect
                  label="Disponibilidade"
                  value={
                    disponibilidade
                  }
                  onChange={
                    setDisponibilidade
                  }
                  options={[
                    "Todas",
                    "Disponíveis",
                    "Indisponíveis",
                  ]}
                />


                <FiltroSelect
                  label="Ano"
                  value={ano}
                  onChange={setAno}
                  options={[
                    "Todos",
                    "2026",
                    "2025",
                    "2024",
                    "2005",
                    "2003",
                    "1997",
                    "1988",
                    "1967",
                    "1949",
                    "1943",
                    "1937",
                    "1899",
                    "1813",
                  ]}
                />


                <FiltroSelect
                  label="Ordenar por"
                  value={ordenacao}
                  onChange={
                    setOrdenacao
                  }
                  options={[
                    "Mais recentes",
                    "A-Z",
                    "Z-A",
                  ]}
                />


                <Button
                  h="42px"
                  size="sm"
                  variant="outline"
                  borderColor="#E5DED6"
                  color={PRIMARY}
                  fontSize="12px"
                  borderRadius="5px"
                  onClick={
                    limparFiltros
                  }
                  _hover={{
                    bg: "#F7EEEE",
                  }}
                >

                  <Icon
                    as={FiTrash2}
                    mr={1}
                    boxSize={3}
                  />

                  Limpar

                </Button>

              </Grid>

            </Card.Body>

          </Card.Root>


          {/* =================================================
              LIVROS
          ================================================= */}

          <Card.Root
            bg={WHITE}
            border="1px solid"
            borderColor={BORDER}
            borderRadius="7px"
          >

            <Card.Body p={5}>

              <Grid
                templateColumns={{
                  base:
                    "repeat(2, 1fr)",
                  sm:
                    "repeat(3, 1fr)",
                  md:
                    "repeat(4, 1fr)",
                  lg:
                    "repeat(5, 1fr)",
                }}
                gap={3}
              >

                {livrosFiltrados.map(
                  (livro) => (

                    <LivroCard
                      key={livro.id}
                      livro={livro}
                      onEditar={
                        editarLivro
                      }
                      onExcluir={
                        excluirLivro
                      }
                      onInformacoes={
                        setLivroInformacoes
                      }
                    />

                  )
                )}

              </Grid>


              {/* NENHUM RESULTADO */}

              {livrosFiltrados.length ===
                0 && (

                <Stack
                  align="center"
                  py={12}
                  gap={2}
                >

                  <Icon
                    as={FiBook}
                    boxSize={8}
                    color="#B5AAA2"
                  />

                  <Text
                    fontSize="13px"
                    fontWeight="600"
                    color={TEXT}
                  >
                    Nenhum livro encontrado
                  </Text>

                  <Text
                    fontSize="10px"
                    color={TEXT_LIGHT}
                  >
                    Tente alterar os filtros.
                  </Text>

                </Stack>

              )}

            </Card.Body>


            {/* =================================================
                PAGINAÇÃO
            ================================================= */}

            <Box
              borderTop="1px solid"
              borderColor={BORDER}
              px={4}
              py={3}
            >

              <Flex
                justify="space-between"
                align="center"
              >

                <Text
                  fontSize="11px"
                  color={TEXT_LIGHT}
                >
                  Mostrando{" "}
                  {livrosFiltrados.length} de{" "}
                  {livros.length} livros
                </Text>


                <HStack gap={1}>

                  <Button
                    size="xs"
                    variant="outline"
                    borderColor={BORDER}
                  >
                    <Icon
                      as={FiChevronLeft}
                    />
                  </Button>

                  <Button
                    size="xs"
                    bg={PRIMARY}
                    color={WHITE}
                    borderRadius="4px"
                  >
                    1
                  </Button>

                  <Button
                    size="xs"
                    variant="outline"
                    borderColor={BORDER}
                  >
                    2
                  </Button>

                  <Button
                    size="xs"
                    variant="outline"
                    borderColor={BORDER}
                  >
                    3
                  </Button>

                  <Text
                    px={1}
                    fontSize="12px"
                    color={TEXT_LIGHT}
                  >
                    ...
                  </Text>

                  <Button
                    size="xs"
                    variant="outline"
                    borderColor={BORDER}
                  >
                    156
                  </Button>

                  <Button
                    size="xs"
                    variant="outline"
                    borderColor={BORDER}
                  >
                    <Icon
                      as={FiChevronRight}
                    />
                  </Button>

                </HStack>

              </Flex>

            </Box>

          </Card.Root>

        </Stack>

      </Box>


      {/* =================================================
          MODAL ADICIONAR / EDITAR
      ================================================= */}

      <ModalLivro
        aberto={modalLivro}
        livro={livroEditando}
        onFechar={() => {
          setModalLivro(false);
          setLivroEditando(null);
        }}
        onSalvar={salvarLivro}
      />


      {/* =================================================
          MODAL INFORMAÇÕES
      ================================================= */}

      <ModalInformacoes
        livro={livroInformacoes}
        onFechar={() =>
          setLivroInformacoes(
            null
          )
        }
      />

    </Flex>
  );
}