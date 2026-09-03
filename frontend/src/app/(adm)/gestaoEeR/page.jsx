"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Badge, Flex, Tabs, Text } from "@chakra-ui/react";

import Shell, { VINHO, TEXTO_SUAVE, formatarData } from "@/components/adm/Shell";
import { Tabela, Linha, Celula, CelulaDupla } from "@/components/adm/Tabela";
import { BORDA, TEXTO_APOIO, TEXTO_MIUDO, ERRO_COR, ERRO_BG, ALERTA_BG, ALERTA_COR, OK_BG, OK_COR } from "@/components/adm/tema";
import Modal from "@/components/adm/Modal";
import { AcaoPrimaria, AcaoSecundaria, BotaoPrimario, BotaoSecundario, CampoTexto, Paginacao } from "@/components/adm/Campos";
import { getEmprestimosAdmin, atualizarStatusEmprestimo, estenderPrazo } from "../../../api";
import { toaster } from "@/components/ui/toaster";

const LIMITE = 10;

const ABAS = [
  { valor: "PENDENTE", label: "Pendentes" },
  { valor: "EMPRESTADO", label: "Emprestados" },
  { valor: "DEVOLVIDO", label: "Devolvidos" },
  { valor: "RECUSADO", label: "Recusados" },
  { valor: "CANCELADO", label: "Cancelados" },
];

const CORES = {
  PENDENTE: { bg: ALERTA_BG, cor: ALERTA_COR, texto: "Pendente" },
  EMPRESTADO: { bg: OK_BG, cor: OK_COR, texto: "Emprestado" },
  DEVOLVIDO: { bg: "#E3F2FD", cor: "#1976D2", texto: "Devolvido" },
  RECUSADO: { bg: "#F1F1F1", cor: TEXTO_SUAVE, texto: "Recusado" },
  CANCELADO: { bg: "#F1F1F1", cor: TEXTO_SUAVE, texto: "Cancelado" },
};

function Situacao({ e }) {
  if (e.status === "EMPRESTADO" && e.atrasado) {
    return <Badge bg={ERRO_BG} color={ERRO_COR} borderRadius="full" px={3} py={1} fontSize={TEXTO_MIUDO} fontWeight="600" whiteSpace="nowrap">Atrasado há {Math.abs(e.dias_restantes)}d</Badge>;
  }
  const c = CORES[e.status];
  return <Badge bg={c.bg} color={c.cor} borderRadius="full" px={3} py={1} fontSize={TEXTO_MIUDO} fontWeight="600" whiteSpace="nowrap">{c.texto}</Badge>;
}

function avisar(r, tituloOk) {
  toaster.create({ title: r?.sucesso ? tituloOk : "Erro", description: r?.mensagem, type: r?.sucesso ? "success" : "error" });
  return Boolean(r?.sucesso);
}

function GestaoConteudo() {
  const searchParams = useSearchParams();
  const abaInicial = ABAS.some((a) => a.valor === searchParams.get("status")) ? searchParams.get("status") : "PENDENTE";

  const [status, setStatus] = useState(abaInicial);
  const [pagina, setPagina] = useState(1);
  const [lista, setLista] = useState(null);
  const [paginacao, setPaginacao] = useState({ total: 0, totalPaginas: 1 });

  const [modal, setModal] = useState(null); // { acao: 'aprovar' | 'recusar' | 'devolver' | 'estender', e }
  const [dias, setDias] = useState("14");
  const [enviando, setEnviando] = useState(false);

  // `versao` força uma nova busca depois de salvar/excluir.
  const [versao, setVersao] = useState(0);
  const carregar = () => setVersao((v) => v + 1);

  useEffect(() => {
    let ativo = true;

    (async () => {
    const r = await getEmprestimosAdmin({ status, pagina, limite: LIMITE });
    if (!r?.sucesso) {
      setLista([]);
      return ativo && toaster.create({ title: "Erro ao carregar", description: r?.mensagem, type: "error" });
    }
    if (!ativo) return;
    setLista(r.dados);
    setPaginacao(r.paginacao);
    })();

    return () => {
      ativo = false;
    };
  }, [status, pagina, versao]);

  function abrir(acao, e) {
    setDias(acao === "estender" ? "7" : "14");
    setModal({ acao, e });
  }

  async function confirmar() {
    const acao = modal?.acao;
    const id = modal?.e?.id_emprestimo;
    setEnviando(true);

    let r;
    if (acao === "aprovar") r = await atualizarStatusEmprestimo(id, "EMPRESTADO", Number(dias));
    else if (acao === "recusar") r = await atualizarStatusEmprestimo(id, "RECUSADO");
    else if (acao === "devolver") r = await atualizarStatusEmprestimo(id, "DEVOLVIDO");
    else r = await estenderPrazo(id, Number(dias));

    setEnviando(false);

    if (avisar(r, "Empréstimo atualizado")) {
      setModal(null);
      carregar();
    }
  }

  const TITULOS = { aprovar: "Aprovar empréstimo", recusar: "Recusar pedido", devolver: "Registrar devolução", estender: "Estender prazo" };

  return (
    <Shell titulo="Empréstimos" subtitulo="Aprove pedidos, registre devoluções e ajuste prazos.">
      <Tabs.Root value={status} onValueChange={(d) => { setStatus(d.value); setPagina(1); }} variant="plain" mb={6}>
        <Tabs.List borderBottom="1px solid" borderColor={BORDA} gap={2}>
          {ABAS.map((a) => (
            <Tabs.Trigger key={a.valor} value={a.valor} px={5} py={3} color={TEXTO_SUAVE} cursor="pointer"
              _selected={{ color: VINHO, borderBottom: `3px solid ${VINHO}`, fontWeight: "bold" }}>
              {a.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>

      <Tabela
        colunas={[
          { label: "Livro" },
          { label: "Leitor" },
          { label: "Datas", largura: "1%" },
          { label: "Devolução prevista", largura: "1%" },
          { label: "Situação", largura: "1%" },
          { label: "Ações", alinhar: "right", largura: "1%" },
        ]}
        carregando={lista === null}
        vazio={lista?.length === 0 ? "Nenhum empréstimo nesta situação." : null}
      >
        {(lista || []).map((e) => (
          <Linha key={e.id_emprestimo}>
            <Celula><CelulaDupla topo={e.titulo} base={e.autor} /></Celula>
            <Celula><CelulaDupla topo={e.usuario_nome} base={e.usuario_email} /></Celula>

            {/* Solicitação e empréstimo ocupavam uma coluna cada, e a segunda
                ficava vazia em toda linha pendente. Juntas, cabem numa só. */}
            <Celula whiteSpace="nowrap">
              <Text fontSize={TEXTO_APOIO}>Pedido {formatarData(e.data_solicitacao)}</Text>
              <Text fontSize={TEXTO_MIUDO} color={TEXTO_SUAVE}>
                {e.data_emprestimo ? `Retirado ${formatarData(e.data_emprestimo)}` : "Aguardando aprovação"}
              </Text>
            </Celula>

            <Celula whiteSpace="nowrap">
              <Text fontSize={TEXTO_APOIO}>{formatarData(e.data_devolucao_prevista)}</Text>
              {e.status === "EMPRESTADO" && !e.atrasado && e.dias_restantes !== null && (
                <Text fontSize={TEXTO_MIUDO} color={TEXTO_SUAVE}>
                  {e.dias_restantes === 0 ? "vence hoje" : `${e.dias_restantes}d restantes`}
                </Text>
              )}
            </Celula>

            <Celula><Situacao e={e} /></Celula>

            <Celula textAlign="right">
              <Flex justify="flex-end" gap={2}>
                {e.status === "PENDENTE" && (
                  <>
                    <AcaoPrimaria onClick={() => abrir("aprovar", e)}>Aprovar</AcaoPrimaria>
                    <AcaoSecundaria onClick={() => abrir("recusar", e)}>Recusar</AcaoSecundaria>
                  </>
                )}
                {e.status === "EMPRESTADO" && (
                  <>
                    <AcaoPrimaria onClick={() => abrir("devolver", e)}>Devolver</AcaoPrimaria>
                    <AcaoSecundaria onClick={() => abrir("estender", e)}>Estender</AcaoSecundaria>
                  </>
                )}
              </Flex>
            </Celula>
          </Linha>
        ))}
      </Tabela>

      <Paginacao pagina={pagina} totalPaginas={paginacao.totalPaginas} onChange={setPagina} />

      <Modal
        aberto={Boolean(modal)}
        titulo={modal ? TITULOS[modal.acao] : ""}
        onFechar={() => setModal(null)}
        rodape={
          <>
            <BotaoSecundario onClick={() => setModal(null)} disabled={enviando}>Cancelar</BotaoSecundario>
            <BotaoPrimario onClick={confirmar} loading={enviando}>Confirmar</BotaoPrimario>
          </>
        }
      >
        {modal && (
          <Flex direction="column" gap={4}>
            <Text>
              <strong>{modal.e.titulo}</strong> — {modal.e.usuario_nome}
            </Text>
            {modal.acao === "aprovar" && <CampoTexto label="Prazo (dias, 1 a 90)" type="number" min={1} max={90} value={dias} onChange={setDias} />}
            {modal.acao === "estender" && <CampoTexto label="Dias a acrescentar (1 a 90)" type="number" min={1} max={90} value={dias} onChange={setDias} />}
            {modal.acao === "recusar" && <Text color={TEXTO_SUAVE} fontSize={TEXTO_APOIO}>O leitor será informado de que o pedido não foi aprovado.</Text>}
            {modal.acao === "devolver" && <Text color={TEXTO_SUAVE} fontSize={TEXTO_APOIO}>O livro volta para a estante e fica disponível para novos pedidos.</Text>}
          </Flex>
        )}
      </Modal>
    </Shell>
  );
}

export default function GestaoEeR() {
  return (
    <Suspense fallback={null}>
      <GestaoConteudo />
    </Suspense>
  );
}
