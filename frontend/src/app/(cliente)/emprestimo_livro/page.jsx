'use client';
import Sidebar from "../../../components/sideBar/sideBar";
import { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Flex,
  Text,
  Heading,
  Image,
  Badge,
  Button,
  Spinner,
  Tabs,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  FiHome,
  FiSearch,
  FiBookOpen,
  FiClock,
  FiUser,
  FiLogOut,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
  FiVolume2,
} from 'react-icons/fi';

import {
  getMeusEmprestimos,
  cancelarEmprestimo,
  logoutUsuario,
} from '../../../api';

const PRIMARY = '#4A0E17';
const BORDA = '#E8DCC4';

const NAV_ITEMS = [
  { label: 'Meus Empréstimos', icon: FiBookOpen, href: '/emprestimo_livro', active: true },
  { label: 'Início', icon: FiHome, href: '/inicio' },
  { label: 'Buscar Livros', icon: FiSearch, href: '/buscar_livro' },
  { label: 'Histórico', icon: FiClock, href: '/emprestimo_livro?aba=historico' },
  { label: 'Meu Cadastro', icon: FiUser, href: '/alterar_cadastro' },
];

const EM_ANDAMENTO = ['PENDENTE', 'EMPRESTADO'];

function formatarData(valor) {
  if (!valor) return '—';

  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? '—' : data.toLocaleDateString('pt-BR');
}

// Traduz status + prazo na etiqueta e no texto que o usuário lê.
function descreverSituacao(emprestimo) {
  const dias = emprestimo.dias_restantes;

  if (emprestimo.status === 'PENDENTE') {
    return {
      rotulo: 'Aguardando aprovação',
      icone: FiClock,
      bg: '#FFF3E0',
      cor: '#B78103',
      detalhe: 'Sua solicitação está na fila da biblioteca.',
    };
  }

  if (emprestimo.status === 'DEVOLVIDO') {
    return {
      rotulo: 'Devolvido',
      icone: FiCheckCircle,
      bg: '#E8F5E9',
      cor: '#388E3C',
      detalhe: `Devolvido em ${formatarData(emprestimo.data_devolucao_real)}.`,
    };
  }

  if (emprestimo.status === 'RECUSADO' || emprestimo.status === 'CANCELADO') {
    return {
      rotulo: emprestimo.status === 'RECUSADO' ? 'Recusado' : 'Cancelado',
      icone: FiXCircle,
      bg: '#F1F1F1',
      cor: '#6B6B6B',
      detalhe:
        emprestimo.status === 'RECUSADO'
          ? 'A biblioteca não aprovou esta solicitação.'
          : 'Você cancelou esta solicitação.',
    };
  }

  // EMPRESTADO
  if (emprestimo.atrasado) {
    const atraso = Math.abs(dias);

    return {
      rotulo: 'Atrasado',
      icone: FiAlertCircle,
      bg: '#FCE8E6',
      cor: '#C5221F',
      detalhe: `Atrasado há ${atraso} ${atraso === 1 ? 'dia' : 'dias'}. Devolva para poder pegar outro livro.`,
    };
  }

  if (dias !== null && dias <= 2) {
    return {
      rotulo: 'Atenção',
      icone: FiAlertCircle,
      bg: '#FFF3E0',
      cor: '#B78103',
      detalhe:
        dias === 0
          ? 'Vence hoje. Não se esqueça de devolver!'
          : `Vence em ${dias} ${dias === 1 ? 'dia' : 'dias'}.`,
    };
  }

  return {
    rotulo: 'Em dia',
    icone: FiCheckCircle,
    bg: '#E8F5E9',
    cor: '#388E3C',
    detalhe: `Faltam ${dias} dias para a devolução.`,
  };
}

function NavItem({ item, onClick }) {
  const conteudo = (
    <>
      <item.icon size={22} style={{ marginRight: '14px' }} />
      <Text fontSize="md">{item.label}</Text>
    </>
  );

  return (
    <Flex
      as={onClick ? 'button' : 'a'}
      href={onClick ? undefined : item.href}
      onClick={onClick}
      align="center"
      p={3.5}
      borderRadius="xl"
      textAlign="left"
      bg={item.active ? PRIMARY : 'transparent'}
      color={item.active ? '#FFFFFF' : '#2D2D2D'}
      fontWeight={item.active ? 'bold' : 'normal'}
      _hover={item.active ? {} : { bg: BORDA }}
      cursor="pointer"
    >
      {conteudo}
    </Flex>
  );
}

function CardEmprestimo({ emprestimo, onVerDetalhes, onCancelar, cancelando }) {
  const situacao = descreverSituacao(emprestimo);
  const Icone = situacao.icone;

  return (
    <Box
      bg="#FFFFFF"
      border="1px solid"
      borderColor={emprestimo.atrasado ? '#C5221F' : BORDA}
      borderRadius="2xl"
      p={6}
      boxShadow="sm"
      w="100%"
    >
      <Flex
        direction={{ base: 'column', md: 'row' }}
        align={{ base: 'start', md: 'center' }}
        justify="space-between"
        gap={6}
        w="100%"
      >
        <Flex gap={5} align="top" flex="1">
          {emprestimo.capa_url ? (
            <Image
              src={emprestimo.capa_url}
              alt={emprestimo.titulo}
              w="100px"
              h="145px"
              fit="cover"
              borderRadius="lg"
              boxShadow="md"
              flexShrink={0}
            />
          ) : (
            <Flex
              w="100px"
              h="145px"
              borderRadius="lg"
              bg="#F2EFE9"
              align="center"
              justify="center"
              color={PRIMARY}
              flexShrink={0}
            >
              <FiBookOpen size={28} opacity={0.4} />
            </Flex>
          )}

          <Flex direction="column" gap={1.5}>
            <Heading size="md" color="#2D2D2D" fontFamily="serif">
              {emprestimo.titulo}
            </Heading>
            <Text fontSize="sm" color="#6B6B6B" pb={3}>
              {emprestimo.autor}
            </Text>

            <Flex align="center" gap={2} fontSize="sm" color="#6B6B6B">
              <Box color={PRIMARY}><FiCalendar size={16} /></Box>
              <Text>
                {emprestimo.status === 'PENDENTE' ? 'Solicitado em: ' : 'Emprestado em: '}
                <strong>
                  {formatarData(
                    emprestimo.status === 'PENDENTE'
                      ? emprestimo.data_solicitacao
                      : emprestimo.data_emprestimo
                  )}
                </strong>
              </Text>
            </Flex>

            {emprestimo.data_devolucao_prevista && (
              <Flex align="center" gap={2} fontSize="sm" color="#6B6B6B">
                <Box color={PRIMARY}><FiCalendar size={16} /></Box>
                <Text>
                  Devolução até:{' '}
                  <strong>{formatarData(emprestimo.data_devolucao_prevista)}</strong>
                </Text>
              </Flex>
            )}
          </Flex>
        </Flex>

        <Flex direction="column" gap={2} minW="285px" align="flex-start">
          <Badge
            px={4}
            py={1.5}
            borderRadius="md"
            textTransform="none"
            fontSize="sm"
            bg={situacao.bg}
            color={situacao.cor}
            display="inline-flex"
            alignItems="center"
            gap={2}
          >
            <Icone size={16} />
            {situacao.rotulo}
          </Badge>
          <Text fontSize="sm" color="#6B6B6B" textAlign="left">
            {situacao.detalhe}
          </Text>
        </Flex>

        <Flex direction="column" gap={2}>
          <Button
            variant="outline"
            borderColor={PRIMARY}
            color={PRIMARY}
            size="md"
            px={6}
            _hover={{ bg: PRIMARY, color: '#FFFFFF' }}
            onClick={() => onVerDetalhes(emprestimo.id_livro)}
          >
            Ver detalhes
          </Button>

          {emprestimo.status === 'PENDENTE' && (
            <Button
              variant="ghost"
              size="sm"
              color="#C5221F"
              loading={cancelando}
              onClick={() => onCancelar(emprestimo.id_emprestimo)}
              _hover={{ bg: '#FCE8E6' }}
            >
              Cancelar solicitação
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}

function MeusEmprestimosConteudo() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [emprestimos, setEmprestimos] = useState([]);
  const [elegibilidade, setElegibilidade] = useState(null);
  const [prazoDias, setPrazoDias] = useState(14);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [cancelandoId, setCancelandoId] = useState(null);

  const abaInicial =
    searchParams.get('aba') === 'historico' ? 'historico' : 'em-andamento';

  const carregar = useCallback(async () => {
    try {
      const resposta = await getMeusEmprestimos();

      // A rota exige login; sem sessão, manda para o login.
      if (!resposta?.sucesso) {
        router.push('/login');
        return;
      }

      setEmprestimos(resposta.dados.emprestimos);
      setElegibilidade(resposta.dados.elegibilidade);
      setPrazoDias(resposta.dados.prazo_dias);
      setErro(null);
    } catch {
      setErro(
        'Não foi possível falar com o servidor. Verifique se a API está rodando em http://localhost:3001.'
      );
    } finally {
      setCarregando(false);
    }
  }, [router]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function cancelar(idEmprestimo) {
    setCancelandoId(idEmprestimo);

    try {
      await cancelarEmprestimo(idEmprestimo);
      await carregar();
    } finally {
      setCancelandoId(null);
    }
  }

  async function sair() {
    try {
      await logoutUsuario();
    } finally {
      router.push('/login');
    }
  }

  const emAndamento = emprestimos.filter((item) =>
    EM_ANDAMENTO.includes(item.status)
  );
  const historico = emprestimos.filter(
    (item) => !EM_ANDAMENTO.includes(item.status)
  );

  return (
    <Flex minH="100vh" bg="#FAF7F2" color="#2D2D2D" w="100%">
      {/* Sidebar Lateral */}
      <Sidebar/>

      {/* Conteúdo Principal */}
      <Box flex="1" p={{ base: 6, md: 10 }} w="100%">
        <Box mb={8}>
          <Heading size="3xl" color={PRIMARY} fontFamily="serif" mb={2}>
            Meus Empréstimos
          </Heading>
          <Text color="#6B6B6B" fontSize="md">
            Acompanhe os livros que estão com você.
          </Text>
        </Box>

        {/* Situação perante as regras */}
        {elegibilidade && (
          <Flex
            bg={elegibilidade.podeEmprestar ? '#FAF3EA' : '#FCE8E6'}
            border="1px solid"
            borderColor={elegibilidade.podeEmprestar ? BORDA : '#C5221F'}
            borderRadius="2xl"
            p={5}
            mb={8}
            gap={4}
            align="center"
            justify="space-between"
            flexWrap="wrap"
          >
            <Flex gap={4} align="center">
              <Box color={elegibilidade.podeEmprestar ? PRIMARY : '#C5221F'}>
                {elegibilidade.podeEmprestar ? (
                  <FiCheckCircle size={22} />
                ) : (
                  <FiAlertCircle size={22} />
                )}
              </Box>
              <Box>
                <Text fontWeight="bold" color="#2D2D2D">
                  {elegibilidade.ativos} de {elegibilidade.limite} empréstimos em uso
                </Text>
                <Text fontSize="sm" color={elegibilidade.podeEmprestar ? '#6B6B6B' : '#C5221F'}>
                  {elegibilidade.motivo ||
                    `Você ainda pode solicitar ${elegibilidade.vagas} ${elegibilidade.vagas === 1 ? 'livro' : 'livros'}.`}
                </Text>
              </Box>
            </Flex>

            {elegibilidade.podeEmprestar && (
              <Button
                bg={PRIMARY}
                color="#FFFFFF"
                _hover={{ bg: '#360A11' }}
                onClick={() => router.push('/buscar_livro')}
              >
                Buscar livros
              </Button>
            )}
          </Flex>
        )}

        {carregando ? (
          <Flex justify="center" align="center" py={20} direction="column" gap={4}>
            <Spinner color={PRIMARY} size="xl" borderWidth="3px" />
            <Text color="#6B6B6B" fontSize="sm">Carregando seus empréstimos...</Text>
          </Flex>
        ) : erro ? (
          <Text color="#C5221F" fontSize="sm">{erro}</Text>
        ) : (
          <Tabs.Root defaultValue={abaInicial} variant="plain" w="100%">
            <Tabs.List borderBottom="1px solid" borderColor={BORDA} mb={8} w="100%">
              <Tabs.Trigger
                value="em-andamento"
                _selected={{ color: PRIMARY, borderBottom: `3px solid ${PRIMARY}`, fontWeight: 'bold' }}
                color="#6B6B6B"
                px={5}
                py={3}
                fontSize="md"
                cursor="pointer"
              >
                Em andamento ({emAndamento.length})
              </Tabs.Trigger>

              <Tabs.Trigger
                value="historico"
                _selected={{ color: PRIMARY, borderBottom: `3px solid ${PRIMARY}`, fontWeight: 'bold' }}
                color="#6B6B6B"
                px={5}
                py={3}
                fontSize="md"
                cursor="pointer"
              >
                Histórico ({historico.length})
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="em-andamento" p={0} w="100%">
              <Flex direction="column" gap={8} w="100%">
                <Flex align="center" color={PRIMARY} gap={3}>
                  <FiBookOpen size={24} />
                  <Heading size="md" fontFamily="serif">
                    Livros emprestados
                  </Heading>
                </Flex>

                {emAndamento.length === 0 ? (
                  <Text color="#6B6B6B" fontSize="md">
                    Você não tem empréstimos em andamento.{' '}
                    <Text
                      as="a"
                      href="/buscar_livro"
                      color={PRIMARY}
                      fontWeight="semibold"
                      textDecoration="underline"
                    >
                      Buscar livros
                    </Text>
                  </Text>
                ) : (
                  emAndamento.map((emprestimo) => (
                    <CardEmprestimo
                      key={emprestimo.id_emprestimo}
                      emprestimo={emprestimo}
                      cancelando={cancelandoId === emprestimo.id_emprestimo}
                      onVerDetalhes={(idLivro) => router.push(`/detalhe_livro/${idLivro}`)}
                      onCancelar={cancelar}
                    />
                  ))
                )}

                {/* Informações importantes — as regras que a API aplica */}
                <Flex align="center" color={PRIMARY} gap={3} pt={4}>
                  <FiVolume2 size={24} />
                  <Heading size="md" fontFamily="serif">
                    Informações importantes
                  </Heading>
                </Flex>

                <SimpleGrid columns={{ base: 1, md: 3 }} gap={5} w="100%">
                  <Box bg="#FAF3EA" p={5} borderRadius="2xl" border="1px solid" borderColor={BORDA} w="100%">
                    <Flex gap={4} align="start">
                      <Flex align="center" justify="center" w="44px" h="44px" borderRadius="full" border="2px solid" borderColor={PRIMARY} color={PRIMARY} flexShrink={0}>
                        <FiClock size={20} />
                      </Flex>
                      <Box>
                        <Text fontWeight="bold" fontSize="md" color="#2D2D2D" mb={1}>
                          Prazo de Devolução
                        </Text>
                        <Text fontSize="sm" color="#6B6B6B" lineHeight="relaxed">
                          O prazo padrão de empréstimo é de {prazoDias} dias corridos,
                          contados a partir da aprovação.
                        </Text>
                      </Box>
                    </Flex>
                  </Box>

                  <Box bg="#FAF3EA" p={5} borderRadius="2xl" border="1px solid" borderColor={BORDA} w="100%">
                    <Flex gap={4} align="start">
                      <Flex align="center" justify="center" w="44px" h="44px" borderRadius="full" border="2px solid" borderColor={PRIMARY} color={PRIMARY} flexShrink={0}>
                        <FiBookOpen size={20} />
                      </Flex>
                      <Box>
                        <Text fontWeight="bold" fontSize="md" color="#2D2D2D" mb={1}>
                          Limite de {elegibilidade?.limite ?? 2} Livros
                        </Text>
                        <Text fontSize="sm" color="#6B6B6B" lineHeight="relaxed">
                          Você pode ter no máximo {elegibilidade?.limite ?? 2} empréstimos
                          ao mesmo tempo, contando as solicitações pendentes.
                        </Text>
                      </Box>
                    </Flex>
                  </Box>

                  <Box bg="#FAF3EA" p={5} borderRadius="2xl" border="1px solid" borderColor={BORDA} w="100%">
                    <Flex gap={4} align="start">
                      <Flex align="center" justify="center" w="44px" h="44px" borderRadius="full" border="2px solid" borderColor={PRIMARY} color={PRIMARY} flexShrink={0}>
                        <FiAlertCircle size={20} />
                      </Flex>
                      <Box>
                        <Text fontWeight="bold" fontSize="md" color="#2D2D2D" mb={1}>
                          Atrasos
                        </Text>
                        <Text fontSize="sm" color="#6B6B6B" lineHeight="relaxed">
                          Enquanto houver um livro atrasado com você, novos empréstimos
                          ficam bloqueados até a devolução.
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                </SimpleGrid>
              </Flex>
            </Tabs.Content>

            <Tabs.Content value="historico" p={0} w="100%">
              {historico.length === 0 ? (
                <Text color="#6B6B6B" fontSize="md">
                  Nenhum empréstimo encerrado para exibir no momento.
                </Text>
              ) : (
                <Flex direction="column" gap={6} w="100%">
                  {historico.map((emprestimo) => (
                    <CardEmprestimo
                      key={emprestimo.id_emprestimo}
                      emprestimo={emprestimo}
                      onVerDetalhes={(idLivro) => router.push(`/detalhe_livro/${idLivro}`)}
                      onCancelar={cancelar}
                    />
                  ))}
                </Flex>
              )}
            </Tabs.Content>
          </Tabs.Root>
        )}
      </Box>
    </Flex>
  );
}

// useSearchParams exige Suspense para o Next conseguir pré-renderizar a rota.
export default function MeusEmprestimosPage() {
  return (
    <Suspense
      fallback={
        <Flex minH="100vh" bg="#FAF7F2" align="center" justify="center">
          <Spinner color={PRIMARY} size="xl" borderWidth="3px" />
        </Flex>
      }
    >
      <MeusEmprestimosConteudo />
    </Suspense>
  );
}
