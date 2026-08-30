'use client';
import { Suspense, useEffect, useState } from 'react';
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
import { FiBookOpen, FiClock, FiCalendar, FiCheckCircle, FiAlertCircle, FiXCircle, FiVolume2 } from 'react-icons/fi';

import Shell, { Cartao, CartaoAviso, Carregando, Vazio, TelaCarregando, TituloSecao } from '@/components/cliente/Shell';
import { getMeusEmprestimos, cancelarEmprestimo } from '../../../api';
import { toaster } from '@/components/ui/toaster';

import {
  PRIMARY_COLOR,
  PRIMARY_HOVER,
  CARD_BG,
  BORDER_COLOR,
  TEXT_DARK,
  TEXT_LIGHT,
  PLACEHOLDER_BG,
  SUAVE_BG,
  OK_BG,
  OK_COR,
  ALERTA_BG,
  ALERTA_COR,
  ERRO_BG,
  ERRO_COR,
  FONTE_TITULO,
  RAIO_CARTAO,
  RAIO_MEDIO,
  RAIO_PEQUENO,
  TITULO_CARTAO,
  GAP_CARTAO,
} from "@/components/cliente/tema";

// Nomes curtos usados no corpo desta página.
const PRIMARY = PRIMARY_COLOR;
const BORDA = BORDER_COLOR;

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
      bg: ALERTA_BG,
      cor: ALERTA_COR,
      detalhe: 'Sua solicitação está na fila da biblioteca.',
    };
  }

  if (emprestimo.status === 'DEVOLVIDO') {
    return {
      rotulo: 'Devolvido',
      icone: FiCheckCircle,
      bg: OK_BG,
      cor: OK_COR,
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
      bg: ERRO_BG,
      cor: ERRO_COR,
      detalhe: `Atrasado há ${atraso} ${atraso === 1 ? 'dia' : 'dias'}. Devolva para poder pegar outro livro.`,
    };
  }

  if (dias !== null && dias <= 2) {
    return {
      rotulo: 'Atenção',
      icone: FiAlertCircle,
      bg: ALERTA_BG,
      cor: ALERTA_COR,
      detalhe:
        dias === 0
          ? 'Vence hoje. Não se esqueça de devolver!'
          : `Vence em ${dias} ${dias === 1 ? 'dia' : 'dias'}.`,
    };
  }

  return {
    rotulo: 'Em dia',
    icone: FiCheckCircle,
    bg: OK_BG,
    cor: OK_COR,
    detalhe: dias === null ? 'Empréstimo em andamento.' : `Faltam ${dias} dias para a devolução.`,
  };
}

function CardEmprestimo({ emprestimo, onVerDetalhes, onCancelar, cancelando }) {
  const situacao = descreverSituacao(emprestimo);
  const Icone = situacao.icone;

  return (
    <Box
      bg={CARD_BG}
      border="1px solid"
      borderColor={emprestimo.atrasado ? ERRO_COR : BORDA}
      borderRadius={RAIO_CARTAO}
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
              h="150px"
              fit="cover"
              borderRadius={RAIO_MEDIO}
              boxShadow="md"
              flexShrink={0}
            />
          ) : (
            <Flex
              w="100px"
              h="150px"
              borderRadius={RAIO_MEDIO}
              bg={PLACEHOLDER_BG}
              align="center"
              justify="center"
              color={PRIMARY}
              flexShrink={0}
            >
              <FiBookOpen size={28} opacity={0.4} />
            </Flex>
          )}

          <Flex direction="column" gap={1.5}>
            <Heading fontSize={TITULO_CARTAO} color={TEXT_DARK} fontFamily={FONTE_TITULO}>
              {emprestimo.titulo}
            </Heading>
            <Text fontSize="sm" color={TEXT_LIGHT} pb={3}>
              {emprestimo.autor}
            </Text>

            <Flex align="center" gap={2} fontSize="sm" color={TEXT_LIGHT}>
              <Box color={PRIMARY}><FiCalendar size={16} /></Box>
              <Text>
                {emprestimo.data_emprestimo ? 'Emprestado em: ' : 'Solicitado em: '}
                <strong>
                  {formatarData(emprestimo.data_emprestimo || emprestimo.data_solicitacao)}
                </strong>
              </Text>
            </Flex>

            {emprestimo.data_devolucao_prevista && (
              <Flex align="center" gap={2} fontSize="sm" color={TEXT_LIGHT}>
                <Box color={PRIMARY}><FiCalendar size={16} /></Box>
                <Text>
                  Devolução até:{' '}
                  <strong>{formatarData(emprestimo.data_devolucao_prevista)}</strong>
                </Text>
              </Flex>
            )}
          </Flex>
        </Flex>

        {/* Sem minW fixo: os 285px espremiam o título do livro em telas
            médias antes de o card quebrar para coluna. */}
        <Flex direction="column" gap={2} minW={{ base: "auto", lg: "220px" }} align="flex-start">
          <Badge
            px={4}
            py={1.5}
            borderRadius={RAIO_PEQUENO}
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
          <Text fontSize="sm" color={TEXT_LIGHT} textAlign="left">
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
              fontWeight="normal"
              color={TEXT_LIGHT}
              loading={cancelando}
              onClick={() => onCancelar(emprestimo.id_emprestimo)}
              _hover={{ bg: ERRO_BG, color: ERRO_COR }}
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

  // `versao` força uma nova busca depois de cancelar.
  const [versao, setVersao] = useState(0);
  const carregar = () => setVersao((v) => v + 1);

  useEffect(() => {
    let ativo = true;

    getMeusEmprestimos().then((resposta) => {
      if (!ativo) return;

      if (!resposta?.sucesso) {
        // Sessão expirada: o RequireAuth do layout cuida do redirecionamento
        // na próxima navegação; aqui só mostramos o motivo.
        setErro(resposta?.mensagem || 'Não foi possível carregar seus empréstimos.');
      } else {
        setEmprestimos(resposta.dados.emprestimos);
        setElegibilidade(resposta.dados.elegibilidade);
        setPrazoDias(resposta.dados.prazo_dias);
        setErro(null);
      }

      setCarregando(false);
    });

    return () => {
      ativo = false;
    };
  }, [versao]);

  async function cancelar(idEmprestimo) {
    setCancelandoId(idEmprestimo);

    const resposta = await cancelarEmprestimo(idEmprestimo);

    if (resposta?.sucesso) {
      toaster.create({ title: 'Solicitação cancelada', type: 'success' });
      carregar();
    } else {
      toaster.create({
        title: 'Não foi possível cancelar',
        description: resposta?.mensagem || 'Tente novamente.',
        type: 'error',
      });
    }

    setCancelandoId(null);
  }

  const emAndamento = emprestimos.filter((item) =>
    EM_ANDAMENTO.includes(item.status)
  );
  const historico = emprestimos.filter(
    (item) => !EM_ANDAMENTO.includes(item.status)
  );

  return (
    <Shell titulo="Meus Empréstimos" subtitulo="Acompanhe os livros que estão com você.">

        {/* Situação perante as regras */}
        {elegibilidade && (
          <Cartao
            bg={elegibilidade.podeEmprestar ? SUAVE_BG : ERRO_BG}
            borderColor={elegibilidade.podeEmprestar ? BORDA : ERRO_COR}
            display="flex"
            gap={4}
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
          >
            <Flex gap={4} align="center">
              <Box color={elegibilidade.podeEmprestar ? PRIMARY : ERRO_COR}>
                {elegibilidade.podeEmprestar ? (
                  <FiCheckCircle size={22} />
                ) : (
                  <FiAlertCircle size={22} />
                )}
              </Box>
              <Box>
                <Text fontWeight="bold" color={TEXT_DARK}>
                  {elegibilidade.ativos} de {elegibilidade.limite} empréstimos em uso
                </Text>
                <Text fontSize="sm" color={elegibilidade.podeEmprestar ? '#6B6B6B' : ERRO_COR}>
                  {elegibilidade.motivo ||
                    `Você ainda pode solicitar ${elegibilidade.vagas} ${elegibilidade.vagas === 1 ? 'livro' : 'livros'}.`}
                </Text>
              </Box>
            </Flex>

            {elegibilidade.podeEmprestar && emAndamento.length > 0 && (
              <Button
                bg={PRIMARY}
                color={CARD_BG}
                _hover={{ bg: PRIMARY_HOVER }}
                onClick={() => router.push('/buscar_livro')}
              >
                Buscar livros
              </Button>
            )}
          </Cartao>
        )}

        {carregando ? (
          <Flex justify="center" align="center" py={20} direction="column" gap={4}>
            <Spinner color={PRIMARY} size="xl" borderWidth="3px" />
            <Text color={TEXT_LIGHT} fontSize="sm">Carregando seus empréstimos...</Text>
          </Flex>
        ) : erro ? (
          <Text color={ERRO_COR} fontSize="sm">{erro}</Text>
        ) : (
          <Tabs.Root key={abaInicial} defaultValue={abaInicial} variant="plain" w="100%">
            <Tabs.List borderBottom="1px solid" borderColor={BORDA} mb={8} w="100%">
              <Tabs.Trigger
                value="em-andamento"
                _selected={{ color: PRIMARY, borderBottom: `3px solid ${PRIMARY}`, fontWeight: 'bold' }}
                color={TEXT_LIGHT}
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
                color={TEXT_LIGHT}
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
                  <TituloSecao>Livros emprestados</TituloSecao>
                </Flex>

                {emAndamento.length === 0 ? (
                  <Cartao>
                    <Vazio
                      icone={FiBookOpen}
                      titulo="Nenhum empréstimo em andamento"
                      acao={
                        <Button
                          size="sm"
                          bg={PRIMARY}
                          color={CARD_BG}
                          _hover={{ bg: PRIMARY_HOVER }}
                          onClick={() => router.push('/buscar_livro')}
                        >
                          Buscar livros
                        </Button>
                      }
                    >
                      Quando você pedir um livro, ele aparece aqui.
                    </Vazio>
                  </Cartao>
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
                  <TituloSecao>Informações importantes</TituloSecao>
                </Flex>

                <SimpleGrid columns={{ base: 1, md: 3 }} gap={GAP_CARTAO} w="100%">
                  <CartaoAviso icone={FiClock} titulo="Prazo de Devolução">
                    {`O prazo padrão de empréstimo é de ${prazoDias} dias corridos, contados a partir da aprovação.`}
                  </CartaoAviso>

                  <CartaoAviso icone={FiBookOpen} titulo={`Limite de ${elegibilidade?.limite ?? 2} Livros`}>
                    {`Você pode ter no máximo ${elegibilidade?.limite ?? 2} empréstimos ao mesmo tempo, contando as solicitações pendentes.`}
                  </CartaoAviso>

                  <CartaoAviso icone={FiAlertCircle} titulo="Atrasos">
                    Enquanto houver um livro atrasado com você, novos empréstimos ficam bloqueados até a devolução.
                  </CartaoAviso>
                </SimpleGrid>
              </Flex>
            </Tabs.Content>

            <Tabs.Content value="historico" p={0} w="100%">
              {historico.length === 0 ? (
                <Text color={TEXT_LIGHT} fontSize="md">
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
    </Shell>
  );
}

// useSearchParams exige Suspense para o Next conseguir pré-renderizar a rota.
export default function MeusEmprestimosPage() {
  return (
    <Suspense
      fallback={<TelaCarregando />}
    >
      <MeusEmprestimosConteudo />
    </Suspense>
  );
}
