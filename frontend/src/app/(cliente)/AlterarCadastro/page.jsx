"use client";

import {
  Box,
  Flex,
  VStack,
  HStack,
  Heading,
  Text,
  Icon,
  Button,
  SimpleGrid,
  Container,
  Input,
  Badge,
  Switch,
  Menu,
  Avatar,
  NativeSelect,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  FiHome,
  FiSearch,
  FiBookOpen,
  FiClock,
  FiUser,
  FiLogOut,
  FiEdit,
  FiLock,
  FiBell,
  FiCalendar,
  FiShield,
  FiCheckCircle,
  FiCreditCard,
  FiSettings,
  FiUsers,
} from "react-icons/fi";
import FadeIn from "@/components/ui/fade-in";

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const ACCENT = "#7A3131";
const ACCENT_DARK = "#5C1421";
const ACCENT_LIGHT_BG = "rgba(92, 20, 33, 0.06)";
const ACCENT_HOVER_BG = "rgba(92, 20, 33, 0.04)";

const mockUserData = {
  name: "Natalia Marchiori",
  email: "natalia.marchiori@email.com",
  phone: "(11) 98765-4321",
  birthDate: "2008-06-15",
  address: "Rua das Flores, 123",
  city: "São Paulo",
  state: "SP",
  zipCode: "01234-567",
  registrationDate: "10/03/2024",
  userId: "MBI-2024-0357",
  status: "Ativa",
  notifications: {
    email: true,
    sms: false,
    newsletters: true,
  },
};

const NAV_ITEMS = [
  { label: "Início", icon: FiHome },
  { label: "Buscar Livros", icon: FiSearch },
  { label: "Meus Empréstimos", icon: FiBookOpen },
  { label: "Histórico", icon: FiClock },
  { label: "Meu Cadastro", icon: FiUser, active: true },
];

export default function MeuCadastroPage({ initialData = mockUserData }) {
  const [formData, setFormData] = useState(initialData);
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (key, checked) => {
    setFormData((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: checked },
    }));
  };

  return (
    <Flex minH="100vh" bg="#FDFBF7">
      {/* BARRA LATERAL */}
      <Box
        as="aside"
        w="280px"
        bg="#FAF9F6"
        borderRight="1px solid"
        borderColor="#EFEBE3"
        p={6}
        flexShrink={0}
        display={{ base: "none", md: "block" }}
      >
        <VStack spacing={8} align="stretch" h="full">
          <HStack spacing={3} px={2}>
            <Flex
              w={10}
              h={10}
              bg={ACCENT}
              color="white"
              borderRadius="lg"
              align="center"
              justify="center"
            >
              <Icon as={FiBookOpen} w={5} h={5} />
            </Flex>
            <Box>
              <Heading fontSize="md" color={ACCENT} fontFamily="serif">
                Minha Biblioteca
              </Heading>
              <Text fontSize="xs" color="gray.500">
                Sistema de Biblioteca
              </Text>
            </Box>
          </HStack>

          <VStack as="nav" spacing={1} align="stretch">
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                justifyContent="flex-start"
                startIcon={<Icon as={item.icon} w={5} h={5} />}
                fontWeight={item.active ? "semibold" : "normal"}
                color={item.active ? ACCENT : "gray.600"}
                bg={item.active ? ACCENT_LIGHT_BG : "transparent"}
                borderLeft={
                  item.active ? `3px solid ${ACCENT}` : "3px solid transparent"
                }
                borderRadius="6px"
                _hover={{ bg: ACCENT_HOVER_BG, color: ACCENT }}
                transition={`all 0.3s ${EASE}`}
                pl={4}
                h={12}
                fontSize="md"
              >
                {item.label}
              </Button>
            ))}
          </VStack>

          <Box flex={1} />

          <Menu.Root positioning={{ placement: "right-end" }}>
            <Menu.Trigger asChild>
              <Button
                variant="ghost"
                w="full"
                justifyContent="flex-start"
                startIcon={
                  <Avatar.Root size="sm">
                    <Avatar.Image src="https://i.pravatar.cc/150?img=5" />
                    <Avatar.Fallback name={formData.name} />
                  </Avatar.Root>
                }
                fontWeight="medium"
                color="gray.700"
                _hover={{ bg: ACCENT_HOVER_BG }}
                borderRadius="6px"
                h={12}
                pl={2}
              >
                {formData.name.split(" ")[0]}
              </Button>
            </Menu.Trigger>
            <Menu.Content
              bg="#FAF9F6"
              borderColor="#EFEBE3"
              borderRadius="12px"
              p={2}
            >
              <Menu.Item value="settings" borderRadius="6px">
                <Icon as={FiSettings} mr={2} /> Configurações
              </Menu.Item>
              <Menu.Item value="profile" borderRadius="6px">
                <Icon as={FiUsers} mr={2} /> Perfil
              </Menu.Item>
              <Menu.Separator borderColor="#EFEBE3" />
              <Menu.Item value="logout" color="red.500" borderRadius="6px">
                <Icon as={FiLogOut} mr={2} /> Sair
              </Menu.Item>
            </Menu.Content>
          </Menu.Root>
        </VStack>
      </Box>

      {/* CONTEÚDO PRINCIPAL */}
      <Box flex={1} p={{ base: 4, md: 8 }} overflowY="auto">
        <Container maxW="6xl" px={0}>
          <FadeIn>
            {/* CABEÇALHO DA PÁGINA */}
            <Box mb={8}>
              <Heading
                fontSize="3xl"
                fontFamily="Georgia, serif"
                color={ACCENT}
                mb={1}
              >
                Meu Cadastro
              </Heading>
              <Text fontSize="sm" color="gray.600">
                Atualize seus dados cadastrais e mantenha suas informações
                sempre em dia.
              </Text>
            </Box>

            <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
              {/* DADOS PESSOAIS */}
              <Box
                gridColumn={{ lg: "span 2" }}
                bg="#FAF9F6"
                p={6}
                borderRadius="16px"
                border="1px solid"
                borderColor="#EFEBE3"
              >
                <VStack spacing={6} align="stretch">
                  <HStack spacing={3}>
                    <Icon as={FiUser} color={ACCENT} w={5} h={5} />
                    <Heading
                      fontSize="lg"
                      fontFamily="Georgia, serif"
                      color={ACCENT}
                    >
                      Dados Pessoais
                    </Heading>
                  </HStack>

                  <VStack spacing={4} align="stretch">
                    <Box>
                      <Text
                        fontSize="xs"
                        fontWeight="semibold"
                        color="gray.600"
                        mb={1.5}
                      >
                        Nome Completo
                      </Text>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        readOnly={!isEditing}
                        bg="white"
                        borderColor="#E4DED2"
                        _focus={{
                          borderColor: ACCENT,
                          boxShadow: `0 0 0 1px ${ACCENT}`,
                        }}
                      />
                    </Box>

                    <Box>
                      <Text
                        fontSize="xs"
                        fontWeight="semibold"
                        color="gray.600"
                        mb={1.5}
                      >
                        E-mail
                      </Text>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        readOnly={!isEditing}
                        bg="white"
                        borderColor="#E4DED2"
                        _focus={{
                          borderColor: ACCENT,
                          boxShadow: `0 0 0 1px ${ACCENT}`,
                        }}
                      />
                    </Box>

                    <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                      <Box>
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color="gray.600"
                          mb={1.5}
                        >
                          Telefone
                        </Text>
                        <Input
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          readOnly={!isEditing}
                          bg="white"
                          borderColor="#E4DED2"
                          _focus={{
                            borderColor: ACCENT,
                            boxShadow: `0 0 0 1px ${ACCENT}`,
                          }}
                        />
                      </Box>
                      <Box>
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color="gray.600"
                          mb={1.5}
                        >
                          Data de Nascimento
                        </Text>
                        <Input
                          type="date"
                          value={formData.birthDate}
                          onChange={(e) =>
                            handleInputChange("birthDate", e.target.value)
                          }
                          readOnly={!isEditing}
                          bg="white"
                          borderColor="#E4DED2"
                          _focus={{
                            borderColor: ACCENT,
                            boxShadow: `0 0 0 1px ${ACCENT}`,
                          }}
                        />
                      </Box>
                    </SimpleGrid>

                    <Box>
                      <Text
                        fontSize="xs"
                        fontWeight="semibold"
                        color="gray.600"
                        mb={1.5}
                      >
                        Endereço
                      </Text>
                      <Input
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        readOnly={!isEditing}
                        bg="white"
                        borderColor="#E4DED2"
                        _focus={{
                          borderColor: ACCENT,
                          boxShadow: `0 0 0 1px ${ACCENT}`,
                        }}
                      />
                    </Box>

                    <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4}>
                      <Box gridColumn={{ sm: "span 1" }}>
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color="gray.600"
                          mb={1.5}
                        >
                          Cidade
                        </Text>
                        <Input
                          value={formData.city}
                          onChange={(e) =>
                            handleInputChange("city", e.target.value)
                          }
                          readOnly={!isEditing}
                          bg="white"
                          borderColor="#E4DED2"
                          _focus={{
                            borderColor: ACCENT,
                            boxShadow: `0 0 0 1px ${ACCENT}`,
                          }}
                        />
                      </Box>

                      <Box gridColumn={{ sm: "span 1" }}>
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color="gray.600"
                          mb={1.5}
                        >
                          Estado
                        </Text>
                        <NativeSelect.Root disabled={!isEditing}>
                          <NativeSelect.Field
                            value={formData.state}
                            onChange={(e) =>
                              handleInputChange("state", e.target.value)
                            }
                            bg="white"
                            borderColor="#E4DED2"
                          >
                            <option value="SP">SP</option>
                            <option value="RJ">RJ</option>
                            <option value="MG">MG</option>
                            <option value="PR">PR</option>
                          </NativeSelect.Field>
                        </NativeSelect.Root>
                      </Box>

                      <Box gridColumn={{ sm: "span 1" }}>
                        <Text
                          fontSize="xs"
                          fontWeight="semibold"
                          color="gray.600"
                          mb={1.5}
                        >
                          CEP
                        </Text>
                        <Input
                          value={formData.zipCode}
                          onChange={(e) =>
                            handleInputChange("zipCode", e.target.value)
                          }
                          readOnly={!isEditing}
                          bg="white"
                          borderColor="#E4DED2"
                          _focus={{
                            borderColor: ACCENT,
                            boxShadow: `0 0 0 1px ${ACCENT}`,
                          }}
                        />
                      </Box>
                    </SimpleGrid>
                  </VStack>

                  <Flex justify="flex-end" pt={2}>
                    <Button
                      bg={ACCENT}
                      color="white"
                      _hover={{ bg: ACCENT_DARK }}
                      startIcon={<Icon as={FiEdit} />}
                      onClick={() => setIsEditing(!isEditing)}
                      borderRadius="8px"
                      px={6}
                    >
                      {isEditing ? "Salvar Alterações" : "Editar Dados"}
                    </Button>
                  </Flex>
                </VStack>
              </Box>

              {/* SEGURANÇA E PREFERÊNCIAS */}
              <VStack spacing={6} align="stretch">
                <Box
                  bg="#FAF9F6"
                  p={6}
                  borderRadius="16px"
                  border="1px solid"
                  borderColor="#EFEBE3"
                >
                  <HStack spacing={3} mb={4}>
                    <Icon as={FiLock} color={ACCENT} w={5} h={5} />
                    <Heading
                      fontSize="lg"
                      fontFamily="Georgia, serif"
                      color={ACCENT}
                    >
                      Segurança da Conta
                    </Heading>
                  </HStack>

                  <VStack spacing={3} align="stretch">
                    <Text
                      fontSize="xs"
                      fontWeight="semibold"
                      color="gray.600"
                    >
                      Senha
                    </Text>
                    <Flex gap={3}>
                      <Input
                        type="password"
                        value="••••••••••••"
                        readOnly
                        bg="white"
                        borderColor="#E4DED2"
                      />
                      <Button
                        variant="outline"
                        borderColor="#E4DED2"
                        color={ACCENT}
                        _hover={{ bg: ACCENT_LIGHT_BG }}
                        startIcon={<Icon as={FiLock} />}
                        borderRadius="8px"
                        flexShrink={0}
                      >
                        Alterar Senha
                      </Button>
                    </Flex>
                  </VStack>
                </Box>

                <Box
                  bg="#FAF9F6"
                  p={6}
                  borderRadius="16px"
                  border="1px solid"
                  borderColor="#EFEBE3"
                >
                  <HStack spacing={3} mb={4}>
                    <Icon as={FiBell} color={ACCENT} w={5} h={5} />
                    <Heading
                      fontSize="lg"
                      fontFamily="Georgia, serif"
                      color={ACCENT}
                    >
                      Preferências de Notificação
                    </Heading>
                  </HStack>

                  <VStack spacing={5} align="stretch">
                    <Flex justify="space-between" align="center">
                      <Box>
                        <Text
                          fontSize="sm"
                          fontWeight="semibold"
                          color="gray.800"
                        >
                          E-mail
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          Receber notificações sobre empréstimos e devoluções.
                        </Text>
                      </Box>
                      <Switch.Root
                        checked={formData.notifications.email}
                        onCheckedChange={(details) =>
                          handleNotificationChange("email", details.checked)
                        }
                        colorPalette="red"
                      >
                        <Switch.HiddenInput />
                        <Switch.Control>
                          <Switch.Thumb />
                        </Switch.Control>
                      </Switch.Root>
                    </Flex>

                    <Flex justify="space-between" align="center">
                      <Box>
                        <Text
                          fontSize="sm"
                          fontWeight="semibold"
                          color="gray.800"
                        >
                          SMS
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          Receber lembretes por mensagem.
                        </Text>
                      </Box>
                      <Switch.Root
                        checked={formData.notifications.sms}
                        onCheckedChange={(details) =>
                          handleNotificationChange("sms", details.checked)
                        }
                        colorPalette="red"
                      >
                        <Switch.HiddenInput />
                        <Switch.Control>
                          <Switch.Thumb />
                        </Switch.Control>
                      </Switch.Root>
                    </Flex>

                    <Flex justify="space-between" align="center">
                      <Box>
                        <Text
                          fontSize="sm"
                          fontWeight="semibold"
                          color="gray.800"
                        >
                          Novidades
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          Receber novidades sobre acervo e eventos.
                        </Text>
                      </Box>
                      <Switch.Root
                        checked={formData.notifications.newsletters}
                        onCheckedChange={(details) =>
                          handleNotificationChange(
                            "newsletters",
                            details.checked
                          )
                        }
                        colorPalette="red"
                      >
                        <Switch.HiddenInput />
                        <Switch.Control>
                          <Switch.Thumb />
                        </Switch.Control>
                      </Switch.Root>
                    </Flex>
                  </VStack>
                </Box>
              </VStack>
            </SimpleGrid>

            {/* INFORMAÇÕES DA CONTA */}
            <Box
              mt={6}
              bg="#FAF9F6"
              p={6}
              borderRadius="16px"
              border="1px solid"
              borderColor="#EFEBE3"
            >
              <HStack spacing={3} mb={4}>
                <Icon as={FiShield} color={ACCENT} w={5} h={5} />
                <Heading
                  fontSize="lg"
                  fontFamily="Georgia, serif"
                  color={ACCENT}
                >
                  Informações da Conta
                </Heading>
              </HStack>

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <Flex
                  align="center"
                  gap={3}
                  p={3}
                  bg="white"
                  borderRadius="10px"
                  border="1px solid"
                  borderColor="#EFEBE3"
                >
                  <Flex
                    w={10}
                    h={10}
                    bg="#F7F3EC"
                    borderRadius="8px"
                    align="center"
                    justify="center"
                    color={ACCENT}
                  >
                    <Icon as={FiCalendar} w={5} h={5} />
                  </Flex>
                  <Box>
                    <Text fontSize="xs" color="gray.500">
                      Data de Cadastro
                    </Text>
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color="gray.800"
                    >
                      {formData.registrationDate}
                    </Text>
                  </Box>
                </Flex>

                <Flex
                  align="center"
                  gap={3}
                  p={3}
                  bg="white"
                  borderRadius="10px"
                  border="1px solid"
                  borderColor="#EFEBE3"
                >
                  <Flex
                    w={10}
                    h={10}
                    bg="#F7F3EC"
                    borderRadius="8px"
                    align="center"
                    justify="center"
                    color={ACCENT}
                  >
                    <Icon as={FiCreditCard} w={5} h={5} />
                  </Flex>
                  <Box>
                    <Text fontSize="xs" color="gray.500">
                      Código do Usuário
                    </Text>
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      color="gray.800"
                    >
                      {formData.userId}
                    </Text>
                  </Box>
                </Flex>

                <Flex
                  align="center"
                  gap={3}
                  p={3}
                  bg="white"
                  borderRadius="10px"
                  border="1px solid"
                  borderColor="#EFEBE3"
                >
                  <Flex
                    w={10}
                    h={10}
                    bg="green.50"
                    borderRadius="8px"
                    align="center"
                    justify="center"
                    color="green.600"
                  >
                    <Icon as={FiCheckCircle} w={5} h={5} />
                  </Flex>
                  <Box>
                    <Text fontSize="xs" color="gray.500">
                      Status da Conta
                    </Text>
                    <Badge
                      bg="green.100"
                      color="green.800"
                      borderRadius="md"
                      px={2}
                      py={0.5}
                      fontSize="xs"
                    >
                      {formData.status}
                    </Badge>
                  </Box>
                </Flex>
              </SimpleGrid>
            </Box>
          </FadeIn>
        </Container>
      </Box>
    </Flex>
  );
}