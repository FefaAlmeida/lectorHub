"use client";

import { useEffect, useState } from "react";
import { Badge, Box, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { FiEdit2, FiSlash, FiUserCheck, FiUsers } from "react-icons/fi";

import Shell, { VINHO, TEXTO_SUAVE } from "@/components/adm/Shell";
import { Tabela, Linha, Celula, CelulaDupla } from "@/components/adm/Tabela";
import { BORDA, TEXTO_MIUDO, TEXTO_APOIO, REALCE, TITULO_CARTAO, GAP_CARTAO, ERRO_BG, ERRO_COR, ERRO_HOVER, OK_BG, OK_COR } from "@/components/adm/tema";
import Modal from "@/components/adm/Modal";
import { BarraBusca, BotaoLimpar, FiltroMenu } from "@/components/adm/Filtros";
import { BotaoIcone, BotaoPrimario, BotaoSecundario, CampoSelect, CampoTexto, GrupoCampos, Paginacao } from "@/components/adm/Campos";
import { useUsuario } from "@/components/auth/RequireAuth";
import { getUsuarios, atualizarUsuario, definirBanimento } from "../../../api";
import { toaster } from "@/components/ui/toaster";

const LIMITE = 10;

// A branch `front` mostrava avatar na listagem, mas com uma URL de imagem que
// a tabela `usuarios` não tem. Aqui é a inicial sobre o realce da paleta —
// mesmo recurso, sem inventar um campo que não existe no banco.
function Avatar({ nome }) {
  return (
    <Flex
      w="40px"
      h="40px"
      borderRadius="full"
      bg={REALCE}
      color={VINHO}
      align="center"
      justify="center"
      fontWeight="bold"
      flexShrink={0}
    >
      {(nome || "?").trim()[0]?.toUpperCase()}
    </Flex>
  );
}

function FormUsuario({ usuario, ehVoceMesmo, onSalvar }) {
  const [form, setForm] = useState({ nome: usuario.nome, email: usuario.email, telefone: usuario.telefone || "", tipo: usuario.tipo });
  const set = (campo) => (valor) => setForm((f) => ({ ...f, [campo]: valor }));

  return (
    <form id="form-usuario" onSubmit={(e) => { e.preventDefault(); onSalvar(form); }}>
      <Flex direction="column" gap={4}>
        <CampoTexto label="Nome" value={form.nome} onChange={set("nome")} required />
        <CampoTexto label="E-mail" type="email" value={form.email} onChange={set("email")} required />
        <CampoTexto label="Telefone" value={form.telefone} onChange={set("telefone")} />
        <CampoSelect label="Tipo" value={form.tipo} onChange={set("tipo")} disabled={ehVoceMesmo}
          opcoes={[{ valor: "cliente", label: "Cliente" }, { valor: "admin", label: "Administrador" }]} />
        {ehVoceMesmo && <Text fontSize={TEXTO_MIUDO} color={TEXTO_SUAVE}>Você não pode alterar o próprio tipo de acesso.</Text>}
      </Flex>
    </form>
  );
}

const OPCOES_SITUACAO = [
  { valor: "", label: "Todos" },
  { valor: "ativos", label: "Com acesso" },
  { valor: "banidos", label: "Banidos" },
];

const OPCOES_ORDEM = [
  { valor: "nome_asc", label: "Nome (A-Z)" },
  { valor: "nome_desc", label: "Nome (Z-A)" },
  { valor: "recentes", label: "Cadastro mais recente" },
  { valor: "antigos", label: "Cadastro mais antigo" },
];

export default function GestaoUsuarios() {
  const eu = useUsuario();

  const [termo, setTermo] = useState("");
  const [busca, setBusca] = useState("");
  const [situacao, setSituacao] = useState("");
  const [ordem, setOrdem] = useState("nome_asc");
  const [pagina, setPagina] = useState(1);
  const [lista, setLista] = useState(null);
  const [paginacao, setPaginacao] = useState({ total: 0, totalPaginas: 1 });
  const [editando, setEditando] = useState(null);
  // { usuario, banir } — banir=false é reativação, e aí não há motivo a pedir.
  const [banimento, setBanimento] = useState(null);
  const [motivo, setMotivo] = useState("");
  const [salvando, setSalvando] = useState(false);

  // `versao` força uma nova busca depois de salvar/excluir.
  const [versao, setVersao] = useState(0);
  const carregar = () => setVersao((v) => v + 1);

  useEffect(() => {
    let ativo = true;

    (async () => {
      // tipo=cliente: a listagem é dos leitores. Contas de administrador não
      // entram, e por isso o filtro de perfil deixou de existir.
      const r = await getUsuarios({ pagina, limite: LIMITE, tipo: "cliente", busca, situacao, ordem });
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
  }, [pagina, busca, situacao, ordem, versao]);

  function buscar() {
    setBusca(termo.trim());
    setPagina(1);
  }

  function limparFiltros() {
    setTermo("");
    setBusca("");
    setSituacao("");
    setOrdem("nome_asc");
    setPagina(1);
  }

  async function salvar(form) {
    setSalvando(true);
    const r = await atualizarUsuario(editando?.id, { ...form, telefone: form.telefone || null });
    setSalvando(false);

    toaster.create({ title: r?.sucesso ? "Usuário atualizado" : "Erro", description: r?.mensagem, type: r?.sucesso ? "success" : "error" });
    if (r?.sucesso) {
      setEditando(null);
      carregar();
    }
  }

  // `banindo` existe porque o React Compiler, ao memoizar o objeto passado em
  // `_hover`, gera a chave de cache lendo `banimento.banir` — descartando o
  // `?.` que estava escrito aqui. Com o modal fechado, `banimento` é null e a
  // leitura estoura durante a renderização. Um booleano local não tem esse
  // problema: a dependência memoizada passa a ser a própria variável.
  const banindo = banimento?.banir === true;

  function abrirBanimento(usuario, banir) {
    setMotivo("");
    setBanimento({ usuario, banir });
  }

  async function confirmarBanimento() {
    const { usuario, banir } = banimento;
    setSalvando(true);
    const r = await definirBanimento(usuario.id, banir, banir ? motivo.trim() || null : null);
    setSalvando(false);

    toaster.create({
      title: r?.sucesso ? (banir ? "Usuário banido" : "Acesso restaurado") : "Erro",
      description: r?.mensagem,
      type: r?.sucesso ? "success" : "error",
    });

    if (r?.sucesso) {
      setBanimento(null);
      carregar();
    }
  }

  return (
    <Shell titulo="Usuários" subtitulo="Consulte os leitores e defina quem tem acesso de administrador.">
      <BarraBusca
        valor={termo}
        onChange={setTermo}
        onBuscar={buscar}
        placeholder="Digite nome ou e-mail..."
      />

      <Flex gap={4} wrap="wrap" align="flex-start">
        <FiltroMenu
          label="Situação"
          opcoes={OPCOES_SITUACAO}
          valor={situacao}
          onChange={(v) => { setSituacao(v); setPagina(1); }}
        />
        <FiltroMenu
          label="Ordenar por"
          opcoes={OPCOES_ORDEM}
          valor={ordem}
          onChange={(v) => { setOrdem(v); setPagina(1); }}
        />
        <BotaoLimpar onClick={limparFiltros} />
      </Flex>

      {/* A contagem saiu do subtítulo, que agora descreve a página. */}
      <Flex align="center" gap={2} color={VINHO} borderBottom="1px solid" borderColor={BORDA} pb={3}>
        <Icon as={FiUsers} boxSize={5} />
        <Text fontWeight="bold" fontSize={TITULO_CARTAO}>
          {paginacao.total} {paginacao.total === 1 ? "leitor" : "leitores"}
        </Text>
      </Flex>

      <Tabela
        colunas={[
          { label: "Usuário" },
          { label: "Contato" },
          { label: "Situação", largura: "1%" },
          { label: "Ações", alinhar: "right", largura: "1%" },
        ]}
        carregando={lista === null}
        vazio={lista?.length === 0 ? (busca ? "Nenhum leitor nesta busca." : "Nenhum leitor cadastrado.") : null}
      >
        {(lista || []).map((u) => (
          <Linha key={u.id}>
            <Celula>
              <Flex align="center" gap={3}>
                <Avatar nome={u.nome} />
                <Box minW={0}>
                  <Text fontWeight="semibold" lineClamp={1}>{u.nome}</Text>
                  <Text fontSize={TEXTO_MIUDO} color={TEXTO_SUAVE}>
                    #{u.id}
                  </Text>
                </Box>
              </Flex>
            </Celula>

            {/* E-mail e telefone numa coluna só: separados, a de telefone
                ficava quase toda com travessão. */}
            <Celula>
              <CelulaDupla
                topo={u.email}
                base={u.banido && u.motivo_banimento ? "Motivo: " + u.motivo_banimento : u.telefone || "Sem telefone"}
              />
            </Celula>

            <Celula>
              <Badge
                bg={u.banido ? ERRO_BG : OK_BG}
                color={u.banido ? ERRO_COR : OK_COR}
                borderRadius="full"
                px={3}
                py={1}
                fontSize={TEXTO_MIUDO}
                fontWeight="600"
                whiteSpace="nowrap"
              >
                {u.banido ? "Banido" : "Com acesso"}
              </Badge>
            </Celula>

            <Celula textAlign="right">
              <Flex justify="flex-end" gap={2}>
                <BotaoIcone icone={FiEdit2} rotulo="Editar usuário" onClick={() => setEditando(u)} />
                {u.banido ? (
                  <BotaoIcone icone={FiUserCheck} rotulo="Restaurar acesso" onClick={() => abrirBanimento(u, false)} />
                ) : (
                  <BotaoIcone icone={FiSlash} cor={ERRO_COR} rotulo="Banir usuário" onClick={() => abrirBanimento(u, true)} />
                )}
              </Flex>
            </Celula>
          </Linha>
        ))}
      </Tabela>

      <Paginacao pagina={pagina} totalPaginas={paginacao.totalPaginas} onChange={setPagina} />

      <Modal
        aberto={Boolean(editando)}
        titulo="Editar usuário"
        onFechar={() => setEditando(null)}
        rodape={
          <>
            <BotaoSecundario onClick={() => setEditando(null)} disabled={salvando}>Cancelar</BotaoSecundario>
            <BotaoPrimario type="submit" form="form-usuario" loading={salvando}>Salvar</BotaoPrimario>
          </>
        }
      >
        {editando && <FormUsuario key={editando.id} usuario={editando} ehVoceMesmo={eu?.id === editando.id} onSalvar={salvar} />}
      </Modal>

      {/* Banir / reativar */}
      <Modal
        aberto={Boolean(banimento)}
        titulo={banindo ? "Banir usuário" : "Restaurar acesso"}
        icone={banindo ? FiSlash : FiUserCheck}
        descricao={
          banindo
            ? "O cadastro e o histórico de empréstimos são mantidos."
            : "O leitor volta a conseguir entrar no sistema."
        }
        onFechar={() => setBanimento(null)}
        rodape={
          <>
            <BotaoSecundario onClick={() => setBanimento(null)} disabled={salvando}>Cancelar</BotaoSecundario>
            <BotaoPrimario
              bg={banindo ? ERRO_COR : undefined}
              _hover={banindo ? { bg: ERRO_HOVER } : undefined}
              loading={salvando}
              onClick={confirmarBanimento}
            >
              {banindo ? "Banir" : "Restaurar acesso"}
            </BotaoPrimario>
          </>
        }
      >
        {banimento && (
          <Stack gap={GAP_CARTAO}>
            <Text>
              <strong>{banimento.usuario.nome}</strong> — {banimento.usuario.email}
            </Text>

            {banindo ? (
              <>
                <Text fontSize={TEXTO_APOIO} color={TEXTO_SUAVE}>
                  Ele perde o acesso na hora, mesmo com a sessão aberta, e não
                  consegue mais entrar nem pedir empréstimos. Empréstimos em
                  andamento continuam registrados e podem ser devolvidos por
                  aqui.
                </Text>

                <GrupoCampos titulo="Motivo">
                  <CampoTexto
                    label="Aparece para o leitor na tela de login (opcional)"
                    value={motivo}
                    onChange={setMotivo}
                    maxLength={255}
                    placeholder="Ex.: livro não devolvido após três cobranças"
                  />
                </GrupoCampos>
              </>
            ) : (
              <Text fontSize={TEXTO_APOIO} color={TEXTO_SUAVE}>
                O motivo registrado no banimento é apagado.
              </Text>
            )}
          </Stack>
        )}
      </Modal>
    </Shell>
  );
}
