
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { logoutUsuario } from "../../../api";

import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  HStack,
  Icon,
  Input,
  Stack,
  Text,
  Separator,
  Switch,
} from "@chakra-ui/react";

import {
  FiHome,
  FiSearch,
  FiBookOpen,
  FiClock,
  FiUser,
  FiLogOut,
  FiLock,
  FiEdit3,
  FiBell,
  FiCalendar,
  FiCreditCard,
  FiCheckCircle,
  FiSave,
} from "react-icons/fi";


// =====================================================
// MESMA IDENTIDADE VISUAL DA PÁGINA "BUSCAR LIVROS"
// =====================================================

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

const PRIMARY_COLOR = "#4A0E17";
const PRIMARY_DARK = "#360A11";

const BG_COLOR = "#F5F2EE";
const CARD_BG = "#FFFFFF";
const BORDER_COLOR = "#EFEBE3";

const TEXT_DARK = "#333333";
const TEXT_LIGHT = "#777777";


// =====================================================
// NAVEGAÇÃO
// =====================================================

const NAV_ITEMS = [
  { label: "Início", icon: FiHome, href: "/inicio" },
  { label: "Buscar Livros", icon: FiSearch, href: "/buscar_livro" },
  { label: "Meus Empréstimos", icon: FiBookOpen, href: "/emprestimo_livro" },
  { label: "Histórico", icon: FiClock, href: "/emprestimo_livro?aba=historico" },
  {
    label: "Meu Cadastro",
    icon: FiUser,
    href: "/alterar_cadastro",
    active: true,
  },
];


// =====================================================
// SIDEBAR
// =====================================================

function NavItem({ item }) {
  return (
    <HStack
      as="a"
      href={item.href}
      spacing={3}
      p={3}
      pl={4}
      borderRadius="6px"
      color={item.active ? "white" : TEXT_DARK}
      bg={item.active ? PRIMARY_COLOR : "transparent"}
      _hover={
        !item.active
          ? {
              bg: "#FFFFFF",
              color: TEXT_DARK,
            }
          : {}
      }
      transition={`all 0.2s ${EASE}`}
      cursor="pointer"
      fontWeight={item.active ? "semibold" : "normal"}
    >
      <Icon
        as={item.icon}
        w={5}
        h={5}
        mr={3}
      />

      <Text fontSize="md">
        {item.label}
      </Text>
    </HStack>
  );
}


// =====================================================
// CAMPO
// =====================================================

function Campo({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
  placeholder,
}) {
  return (
    <Stack
      gap={1.5}
      flex="1"
    >
      <Text
        fontSize="xs"
        color={TEXT_DARK}
        fontWeight="semibold"
      >
        {label}
      </Text>

      <Input
        value={value || ""}
        onChange={onChange}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        bg={CARD_BG}
        border="1px solid"
        borderColor="#E7DED8"
        borderRadius="6px"
        h="38px"
        fontSize="sm"
        color={TEXT_DARK}
        _placeholder={{
          color: "#AAA",
        }}
        _hover={{
          borderColor: "#D5C8C0",
        }}
        _focus={{
          borderColor: PRIMARY_COLOR,
          boxShadow: `0 0 0 1px ${PRIMARY_COLOR}`,
        }}
      />
    </Stack>
  );
}


// =====================================================
// PÁGINA
// =====================================================

export default function MeuCadastro({ cliente = null }) {

  const router = useRouter();

  async function sair() {
    try {
      await logoutUsuario();
    } finally {
      router.push("/login");
    }
  }

  const [editando, setEditando] = useState(false);

  const [dados, setDados] = useState({
    nome: "",
    email: "",
    telefone: "",
    nascimento: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",

    senha: "",

    emailNotificacao: true,
    smsNotificacao: false,
    novidades: true,

    dataCadastro: "",
    codigoUsuario: "",
    status: "",
  });


  // ===================================================
  // DADOS VINDOS DO BACKEND
  // ===================================================

  useEffect(() => {

    if (!cliente) return;

    setDados({
      nome: cliente.nome || "",
      email: cliente.email || "",
      telefone: cliente.telefone || "",
      nascimento: cliente.nascimento || "",
      endereco: cliente.endereco || "",
      cidade: cliente.cidade || "",
      estado: cliente.estado || "",
      cep: cliente.cep || "",

      senha: "",

      emailNotificacao:
        cliente.emailNotificacao ?? true,

      smsNotificacao:
        cliente.smsNotificacao ?? false,

      novidades:
        cliente.novidades ?? true,

      dataCadastro:
        cliente.dataCadastro || "",

      codigoUsuario:
        cliente.codigoUsuario || "",

      status:
        cliente.status || "",
    });

  }, [cliente]);


  function alterarCampo(campo, valor) {

    setDados((atual) => ({
      ...atual,
      [campo]: valor,
    }));

  }


  function salvarAlteracoes() {

    /*
      Aqui entrará seu PUT/PATCH:

      fetch(`/api/clientes/${dados.codigoUsuario}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dados),
      });
    */

    console.log("Dados enviados:", dados);

    setEditando(false);
  }


  return (

    <Flex
      minH="100vh"
      bg={BG_COLOR}
    >

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Box
        as="nav"
        w="260px"
        bg="#FFFFFF"
        borderRight="1px solid"
        borderColor={BORDER_COLOR}
        p={5}
        flexShrink={0}
        display={{ base: "none", md: "block" }}
      >

        <Stack
          spacing={3}
          align="stretch"
          gap={2}
        >

          {NAV_ITEMS.map((item, index) => (
            <NavItem
              key={index}
              item={item}
            />
          ))}

          <Separator
            borderColor={BORDER_COLOR}
            my={4}
          />

          <HStack
            as="button"
            p={3}
            pl={4}
            spacing={3}
            color={TEXT_DARK}
            borderRadius="6px"
            cursor="pointer"
            _hover={{
              bg: "#F5F1E9",
              color: PRIMARY_COLOR,
            }}
            transition={`all 0.2s ${EASE}`}
            onClick={sair}
          >

            <Icon
              as={FiLogOut}
              w={5}
              h={5}
              mr={3}
            />

            <Text fontSize="md">
              Sair
            </Text>

          </HStack>

        </Stack>

      </Box>


      {/* =================================================
          CONTEÚDO
      ================================================= */}

      <Box
        flex={1}
        p={{ base: 6, md: 8 }}
        pb={16}
        overflow="hidden"
      >

        <Stack
          gap={7}
          align="stretch"
          maxW="8xl"
          mx="auto"
        >


          {/* =================================================
              CABEÇALHO
          ================================================= */}

          <Flex
            justify="space-between"
            align="center"
          >

            <Stack gap={2}>

              <Heading
                as="h1"
                fontSize={{
                  base: "3xl",
                  md: "4xl",
                }}
                fontWeight="bold"
                color={PRIMARY_COLOR}
                fontFamily="Georgia, serif"
              >
                Meu Cadastro
              </Heading>

              <Text
                fontSize="md"
                color={TEXT_LIGHT}
              >
                Atualize seus dados cadastrais e mantenha suas informações sempre em dia.
              </Text>

            </Stack>


            {/* ILUSTRAÇÃO SIMPLES */}

            <Box
              display={{
                base: "none",
                lg: "block",
              }}
              w="180px"
              h="90px"
              position="relative"
            >

              <Box
                position="absolute"
                right="0"
                top="15px"
                w="145px"
                h="65px"
                bg="#F0E5D6"
                borderRadius="50px 50px 20px 20px"
              />

              <Box
                position="absolute"
                right="25px"
                top="27px"
                w="105px"
                h="52px"
                bg="white"
                border="1px solid #E7DED8"
                borderRadius="7px"
              >

                <Box
                  position="absolute"
                  left="12px"
                  top="11px"
                  w="22px"
                  h="22px"
                  borderRadius="full"
                  bg={PRIMARY_COLOR}
                />

                <Box
                  position="absolute"
                  left="47px"
                  top="13px"
                  w="40px"
                  h="4px"
                  bg="#D8C9B8"
                  borderRadius="full"
                />

                <Box
                  position="absolute"
                  left="47px"
                  top="22px"
                  w="30px"
                  h="4px"
                  bg="#E5DCD2"
                  borderRadius="full"
                />

              </Box>

            </Box>

          </Flex>


          {/* =================================================
              CONTEÚDO EM DUAS COLUNAS
          ================================================= */}

          <Flex
            gap={6}
            align="flex-start"
            direction={{
              base: "column",
              lg: "row",
            }}
          >


            {/* =================================================
                ESQUERDA
            ================================================= */}

            <Stack
              flex="1"
              w="full"
              gap={5}
            >


              {/* DADOS PESSOAIS */}

              <Card.Root
                bg={CARD_BG}
                borderRadius="8px"
                border="1px solid"
                borderColor={BORDER_COLOR}
              >

                <Card.Header
                  px={5}
                  pt={5}
                  pb={3}
                >

                  <HStack gap={2}>

                    <Icon
                      as={FiUser}
                      color={PRIMARY_COLOR}
                      boxSize={4}
                    />

                    <Heading
                      fontSize="sm"
                      fontWeight="bold"
                      color={PRIMARY_COLOR}
                    >
                      Dados Pessoais
                    </Heading>

                  </HStack>

                </Card.Header>


                <Card.Body
                  px={5}
                  pb={5}
                >

                  <Stack gap={4}>

                    <Campo
                      label="Nome Completo"
                      value={dados.nome}
                      disabled={!editando}
                      placeholder="Nome completo"
                      onChange={(e) =>
                        alterarCampo(
                          "nome",
                          e.target.value
                        )
                      }
                    />


                    <Campo
                      label="E-mail"
                      value={dados.email}
                      disabled={!editando}
                      type="email"
                      placeholder="E-mail"
                      onChange={(e) =>
                        alterarCampo(
                          "email",
                          e.target.value
                        )
                      }
                    />


                    <Flex
                      gap={4}
                      direction={{
                        base: "column",
                        md: "row",
                      }}
                    >

                      <Campo
                        label="Telefone"
                        value={dados.telefone}
                        disabled={!editando}
                        placeholder="Telefone"
                        onChange={(e) =>
                          alterarCampo(
                            "telefone",
                            e.target.value
                          )
                        }
                      />

                      <Campo
                        label="Data de Nascimento"
                        value={dados.nascimento}
                        disabled={!editando}
                        type="date"
                        onChange={(e) =>
                          alterarCampo(
                            "nascimento",
                            e.target.value
                          )
                        }
                      />

                    </Flex>


                    <Campo
                      label="Endereço"
                      value={dados.endereco}
                      disabled={!editando}
                      placeholder="Endereço"
                      onChange={(e) =>
                        alterarCampo(
                          "endereco",
                          e.target.value
                        )
                      }
                    />


                    <Flex
                      gap={4}
                      direction={{
                        base: "column",
                        md: "row",
                      }}
                    >

                      <Campo
                        label="Cidade"
                        value={dados.cidade}
                        disabled={!editando}
                        placeholder="Cidade"
                        onChange={(e) =>
                          alterarCampo(
                            "cidade",
                            e.target.value
                          )
                        }
                      />

                      <Campo
                        label="Estado"
                        value={dados.estado}
                        disabled={!editando}
                        placeholder="Estado"
                        onChange={(e) =>
                          alterarCampo(
                            "estado",
                            e.target.value
                          )
                        }
                      />

                      <Campo
                        label="CEP"
                        value={dados.cep}
                        disabled={!editando}
                        placeholder="CEP"
                        onChange={(e) =>
                          alterarCampo(
                            "cep",
                            e.target.value
                          )
                        }
                      />

                    </Flex>

                  </Stack>

                </Card.Body>

              </Card.Root>


              {/* INFORMAÇÕES DA CONTA */}

              <Card.Root
                bg={CARD_BG}
                borderRadius="8px"
                border="1px solid"
                borderColor={BORDER_COLOR}
              >

                <Card.Header
                  px={5}
                  pt={5}
                  pb={3}
                >

                  <HStack gap={2}>

                    <Icon
                      as={FiCheckCircle}
                      color={PRIMARY_COLOR}
                      boxSize={4}
                    />

                    <Heading
                      fontSize="sm"
                      fontWeight="bold"
                      color={PRIMARY_COLOR}
                    >
                      Informações da Conta
                    </Heading>

                  </HStack>

                </Card.Header>


                <Card.Body px={5} pb={5}>

                  <Flex
                    gap={8}
                    direction={{
                      base: "column",
                      md: "row",
                    }}
                  >

                    <HStack flex="1">

                      <Box
                        w="36px"
                        h="36px"
                        bg="#F8EEE9"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >

                        <Icon
                          as={FiCalendar}
                          color={PRIMARY_COLOR}
                          boxSize={4}
                        />

                      </Box>

                      <Stack gap={0}>

                        <Text
                          fontSize="xs"
                          color={TEXT_LIGHT}
                        >
                          Data de Cadastro
                        </Text>

                        <Text
                          fontSize="sm"
                          fontWeight="bold"
                          color={TEXT_DARK}
                        >
                          {dados.dataCadastro || "—"}
                        </Text>

                      </Stack>

                    </HStack>


                    <HStack flex="1">

                      <Box
                        w="36px"
                        h="36px"
                        bg="#F8EEE9"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >

                        <Icon
                          as={FiCreditCard}
                          color={PRIMARY_COLOR}
                          boxSize={4}
                        />

                      </Box>

                      <Stack gap={0}>

                        <Text
                          fontSize="xs"
                          color={TEXT_LIGHT}
                        >
                          Código do Usuário
                        </Text>

                        <Text
                          fontSize="sm"
                          fontWeight="bold"
                          color={TEXT_DARK}
                        >
                          {dados.codigoUsuario || "—"}
                        </Text>

                      </Stack>

                    </HStack>


                    <HStack flex="1">

                      <Box
                        w="36px"
                        h="36px"
                        bg="#EAF5EC"
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >

                        <Icon
                          as={FiCheckCircle}
                          color="#48BB78"
                          boxSize={4}
                        />

                      </Box>

                      <Stack gap={0}>

                        <Text
                          fontSize="xs"
                          color={TEXT_LIGHT}
                        >
                          Status da Conta
                        </Text>

                        <Text
                          fontSize="sm"
                          color="#48BB78"
                          fontWeight="bold"
                        >
                          {dados.status || "—"}
                        </Text>

                      </Stack>

                    </HStack>

                  </Flex>

                </Card.Body>

              </Card.Root>

            </Stack>


            {/* =================================================
                DIREITA
            ================================================= */}

            <Stack
              w={{
                base: "full",
                lg: "390px",
              }}
              gap={5}
            >


              {/* SEGURANÇA */}

              <Card.Root
                bg={CARD_BG}
                borderRadius="8px"
                border="1px solid"
                borderColor={BORDER_COLOR}
              >

                <Card.Header
                  px={5}
                  pt={5}
                  pb={3}
                >

                  <HStack gap={2}>

                    <Icon
                      as={FiLock}
                      color={PRIMARY_COLOR}
                      boxSize={4}
                    />

                    <Heading
                      fontSize="sm"
                      fontWeight="bold"
                      color={PRIMARY_COLOR}
                    >
                      Segurança da Conta
                    </Heading>

                  </HStack>

                </Card.Header>


                <Card.Body px={5} pb={5}>

                  <Flex
                    gap={3}
                    align="end"
                  >

                    <Campo
                      label="Senha"
                      value={dados.senha}
                      disabled={!editando}
                      type="password"
                      placeholder="••••••••"
                      onChange={(e) =>
                        alterarCampo(
                          "senha",
                          e.target.value
                        )
                      }
                    />

                    <Button
                      size="sm"
                      variant="outline"
                      color={PRIMARY_COLOR}
                      borderColor={PRIMARY_COLOR}
                      borderRadius="6px"
                      disabled={!editando}
                      _hover={{
                        bg: "#F2E6E8",
                      }}
                    >
                      Alterar Senha
                    </Button>

                  </Flex>

                </Card.Body>

              </Card.Root>


              {/* PREFERÊNCIAS */}

              <Card.Root
                bg={CARD_BG}
                borderRadius="8px"
                border="1px solid"
                borderColor={BORDER_COLOR}
              >

                <Card.Header
                  px={5}
                  pt={5}
                  pb={3}
                >

                  <HStack gap={2}>

                    <Icon
                      as={FiBell}
                      color={PRIMARY_COLOR}
                      boxSize={4}
                    />

                    <Heading
                      fontSize="sm"
                      fontWeight="bold"
                      color={PRIMARY_COLOR}
                    >
                      Preferências de Notificação
                    </Heading>

                  </HStack>

                </Card.Header>


                <Card.Body px={5} pb={5}>


                  {/* EMAIL */}

                  <Flex
                    justify="space-between"
                    align="center"
                    mb={5}
                  >

                    <Stack gap={0} pr={4}>

                      <Text
                        fontSize="xs"
                        fontWeight="semibold"
                        color={TEXT_DARK}
                      >
                        E-mail
                      </Text>

                      <Text
                        fontSize="10px"
                        color={TEXT_LIGHT}
                      >
                        Receber notificações sobre empréstimos, devoluções e novidades.
                      </Text>

                    </Stack>

                    <Switch.Root
                      checked={dados.emailNotificacao}
                      onCheckedChange={(e) =>
                        alterarCampo(
                          "emailNotificacao",
                          e.checked
                        )
                      }
                    >
                      <Switch.HiddenInput />
                      <Switch.Control />
                    </Switch.Root>

                  </Flex>


                  {/* SMS */}

                  <Flex
                    justify="space-between"
                    align="center"
                    mb={5}
                  >

                    <Stack gap={0} pr={4}>

                      <Text
                        fontSize="xs"
                        fontWeight="semibold"
                        color={TEXT_DARK}
                      >
                        SMS
                      </Text>

                      <Text
                        fontSize="10px"
                        color={TEXT_LIGHT}
                      >
                        Receber lembretes sobre devoluções por mensagem.
                      </Text>

                    </Stack>

                    <Switch.Root
                      checked={dados.smsNotificacao}
                      onCheckedChange={(e) =>
                        alterarCampo(
                          "smsNotificacao",
                          e.checked
                        )
                      }
                    >
                      <Switch.HiddenInput />
                      <Switch.Control />
                    </Switch.Root>

                  </Flex>


                  {/* NOVIDADES */}

                  <Flex
                    justify="space-between"
                    align="center"
                  >

                    <Stack gap={0} pr={4}>

                      <Text
                        fontSize="xs"
                        fontWeight="semibold"
                        color={TEXT_DARK}
                      >
                        Novidades da Biblioteca
                      </Text>

                      <Text
                        fontSize="10px"
                        color={TEXT_LIGHT}
                      >
                        Receber novidades sobre novos livros e eventos.
                      </Text>

                    </Stack>

                    <Switch.Root
                      checked={dados.novidades}
                      onCheckedChange={(e) =>
                        alterarCampo(
                          "novidades",
                          e.checked
                        )
                      }
                    >
                      <Switch.HiddenInput />
                      <Switch.Control />
                    </Switch.Root>

                  </Flex>

                </Card.Body>

              </Card.Root>

            </Stack>

          </Flex>


          {/* =================================================
              BOTÕES
          ================================================= */}

          <Flex
            justify="flex-end"
            gap={3}
            mt={1}
          >

            {editando && (

              <Button
                variant="outline"
                color={PRIMARY_COLOR}
                borderColor={PRIMARY_COLOR}
                borderRadius="14px"
                size="md"
                onClick={() =>
                  setEditando(false)
                }
              >
                Cancelar
              </Button>

            )}


            {!editando ? (

              <Button
                bg={PRIMARY_COLOR}
                color="white"
                borderRadius="14px"
                size="md"
                px={6}
                boxShadow="0 4px 12px rgba(74,14,23,.15)"
                onClick={() =>
                  setEditando(true)
                }
                _hover={{
                  bg: PRIMARY_DARK,
                  transform: "translateY(-2px)",
                }}
                transition={`all .3s ${EASE}`}
              >

                <Icon
                  as={FiEdit3}
                  mr={2}
                />

                Editar Dados

              </Button>

            ) : (

              <Button
                bg={PRIMARY_COLOR}
                color="white"
                borderRadius="14px"
                size="md"
                px={6}
                boxShadow="0 4px 12px rgba(74,14,23,.15)"
                onClick={salvarAlteracoes}
                _hover={{
                  bg: PRIMARY_DARK,
                  transform: "translateY(-2px)",
                }}
                transition={`all .3s ${EASE}`}
              >

                <Icon
                  as={FiSave}
                  mr={2}
                />

                Salvar Alterações

              </Button>

            )}

          </Flex>

        </Stack>

      </Box>

    </Flex>
  );
}

