import ChamadoModel from '../models/ChamadoModel.js';
import UsuarioModel from '../models/UsuarioModel.js';
import TecnicoModel from '../models/TecnicoModel.js'; 

class ChamadoController {

    // POST /chamados (Visão: CLIENTE)
    static async abrirChamado(req, res) {
        try {
            const { tipo_chamado, titulo, descricao } = req.body;
            
            // 1. Descobre o id_empresa buscando diretamente do usuário logado
            let id_empresa = null;
            if (req.usuario?.id) {
                const usuarioCompleto = await UsuarioModel.buscarPorId(req.usuario.id);
                id_empresa = usuarioCompleto?.id_empresa;
            }

            // Fallback caso venha do body (mecanismo que você já tinha)
            if (!id_empresa) id_empresa = req.body.id_empresa;

            const erros = [];
            if (!id_empresa) {
                erros.push({ campo: 'id_empresa', mensagem: 'Empresa solicitante não identificada.' });
            }
            if (!tipo_chamado || tipo_chamado.trim() === '') {
                erros.push({ campo: 'tipo_chamado', mensagem: 'O tipo do chamado é obrigatório.' });
            }
            if (!titulo || titulo.trim() === '') {
                erros.push({ campo: 'titulo', mensagem: 'O título do chamado é obrigatório.' });
            }

            if (erros.length > 0) {
                return res.status(400).json({ sucesso: false, erro: 'Dados inválidos', detalhes: erros });
            }

            const dadosChamado = {
                id_empresa,
                tipo_chamado: tipo_chamado.trim(),
                titulo: titulo.trim(),
                descricao: descricao ? descricao.trim() : null
            };

            const id = await ChamadoModel.criar(dadosChamado);

            return res.status(201).json({
                sucesso: true,
                mensagem: 'Chamado aberto com sucesso! Aguardando avaliação de prioridade pelo Admin.',
                dados: { id, ...dadosChamado, status_chamado: 'ABERTO' }
            });
        } catch (error) {
            console.error('Erro no controller ao abrir chamado:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    // GET /chamados/meus-chamados (Visão: CLIENTE)
    static async listarMeusChamados(req, res) {
        try {
            // 2. Descobre o id_empresa buscando direto do usuário logado para a listagem
            let id_empresa = null;
            if (req.usuario?.id) {
                const usuarioCompleto = await UsuarioModel.buscarPorId(req.usuario.id);
                id_empresa = usuarioCompleto?.id_empresa;
            }

            // Fallback caso venha da query string
            if (!id_empresa) id_empresa = req.query.id_empresa;

            let pagina = parseInt(req.query.pagina) || 1;
            let limite = parseInt(req.query.limite) || 10;

            if (!id_empresa) {
                return res.status(400).json({ sucesso: false, erro: 'Empresa não fornecida.' });
            }
            if (pagina <= 0 || limite <= 0) {
                return res.status(400).json({ sucesso: false, erro: 'Paginação inválida.' });
            }

            const offset = (pagina - 1) * limite;
            const resultado = await ChamadoModel.listarPorEmpresa(id_empresa, limite, offset);

            return res.status(200).json({
                sucesso: true,
                dados: resultado.chamados,
                paginacao: {
                    pagina: resultado.pagina,
                    limite: resultado.limite,
                    total: resultado.total,
                    totalPaginas: resultado.totalPaginas
                }
            });
        } catch (error) {
            console.error('Erro ao listar chamados do cliente:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    // GET /admin/chamados (Visão: ADMINISTRADOR)
    static async listarTodosChamadosSistema(req, res) {
        try {
            let pagina = parseInt(req.query.pagina) || 1;
            let limite = parseInt(req.query.limite) || 10;

            if (pagina <= 0 || limite <= 0) {
                return res.status(400).json({ sucesso: false, erro: 'Parâmetros de paginação inválidos.' });
            }

            const offset = (pagina - 1) * limite;
            const resultado = await ChamadoModel.listarTodosGerais(limite, offset);

            return res.status(200).json({
                sucesso: true,
                dados: resultado.chamados,
                paginacao: {
                    pagina: resultado.pagina,
                    limite: resultado.limite,
                    total: resultado.total,
                    totalPaginas: resultado.totalPaginas
                }
            });
        } catch (error) {
            console.error('Erro ao listar chamados globais no Admin:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    // GET /chamados/:id (Visão: AMBOS - Permite ao cliente ler a resposta do Admin)
// GET /chamados/:id (Visão: AMBOS - Buscando o nome através do TecnicoModel)
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({ sucesso: false, erro: 'ID do chamado inválido.' });
            }

            const chamado = await ChamadoModel.buscarPorId(id);

            if (!chamado) {
                return res.status(404).json({ sucesso: false, erro: 'Chamado não localizado.' });
            }

            // Validação de segurança: Evita que um cliente xerete chamados de outra empresa
            const id_empresa_token = req.usuario?.id_empresa;
            const ehAdmin = req.usuario?.regra === 'ADMIN'; 
            
            if (id_empresa_token && chamado.id_empresa !== id_empresa_token && !ehAdmin) {
                return res.status(403).json({ sucesso: false, erro: 'Acesso negado a este chamado.' });
            }

            // ==========================================
            // NOVA LOGICA ATUALIZADA: Busca no TecnicoModel
            // ==========================================
            let nome_tecnico = null;
            if (chamado.id_tecnico) {
                try {
                    // Busca o técnico diretamente na tabela de técnicos pelo Model correto
                    const tecnicoCompleto = await TecnicoModel.buscarPorId(chamado.id_tecnico);
                    if (tecnicoCompleto && tecnicoCompleto.nome) {
                        nome_tecnico = tecnicoCompleto.nome;
                    }
                } catch (techError) {
                    // Fail-silent: Evita derrubar a rota se houver qualquer problema na consulta do técnico
                    console.error(`Aviso: Erro ao anexar o nome do técnico id ${chamado.id_tecnico}:`, techError);
                }
            }

            // Injeta a propriedade nome_tecnico na raiz dos dados enviados para o front
            const dadosResposta = {
                ...chamado,
                nome_tecnico: nome_tecnico 
            };

            return res.status(200).json({ 
                sucesso: true, 
                dados: dadosResposta 
            });

        } catch (error) {
            console.error('Erro ao detalhar chamado:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    // PUT /admin/chamados/:id/responder (Visão: ADMINISTRADOR)
    static async responderChamadoAdmin(req, res) {
        try {
            const { id } = req.params;
            const { id_tecnico, status_chamado, resposta_admin, prioridade } = req.body;

            if (!id || isNaN(id)) {
                return res.status(400).json({ sucesso: false, erro: 'ID inválido.' });
            }

            const chamado = await ChamadoModel.buscarPorId(id);
            if (!chamado) {
                return res.status(404).json({ sucesso: false, erro: 'Chamado não encontrado.' });
            }

            const erros = [];
            if (!status_chamado) {
                erros.push({ campo: 'status_chamado', message: 'O novo status do chamado é obrigatório.' });
            }
            if (!prioridade) {
                erros.push({ campo: 'prioridade', message: 'Definir a prioridade (BAIXA, MEDIA, ALTA) é obrigatório para o Admin.' });
            }

            const prioridadesValidas = ['BAIXA', 'MEDIA', 'ALTA'];
            if (prioridade && !prioridadesValidas.includes(prioridade.toUpperCase())) {
                erros.push({ campo: 'prioridade', message: 'Prioridade inválida. Use BAIXA, MEDIA ou ALTA.' });
            }

            if (erros.length > 0) {
                return res.status(400).json({ sucesso: false, erro: 'Dados de atualização inválidos', detalhes: erros });
            }

            await ChamadoModel.atualizarPorAdmin(id, {
                id_tecnico,
                status_chamado: status_chamado.toUpperCase(),
                resposta_admin: resposta_admin ? resposta_admin.trim() : null,
                prioridade: prioridade.toUpperCase()
            });

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Chamado respondido, atualizado e classificado pelo Admin com sucesso!'
            });
        } catch (error) {
            console.error('Erro ao salvar resposta do Admin:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    // PUT /chamados/:id/cancelar (Visão: CLIENTE)
    static async cancelarChamadoCliente(req, res) {
        try {
            const { id } = req.params;
            
            // CORREÇÃO: Busca o id_empresa usando o mesmo padrão inteligente dos outros métodos
            let id_empresa = null;
            if (req.usuario?.id) {
                const usuarioCompleto = await UsuarioModel.buscarPorId(req.usuario.id);
                id_empresa = usuarioCompleto?.id_empresa;
            }

            // Fallback caso venha do token direto ou do body
            if (!id_empresa) id_empresa = req.usuario?.id_empresa || req.body.id_empresa;

            if (!id_empresa) {
                return res.status(400).json({ sucesso: false, erro: 'Identificação da empresa ausente.' });
            }

            const chamado = await ChamadoModel.buscarPorId(id);
            if (!chamado) {
                return res.status(404).json({ sucesso: false, erro: 'Chamado não localizado.' });
            }

            if (chamado.status_chamado !== 'ABERTO') {
                return res.status(400).json({ 
                    sucesso: false, 
                    erro: 'Operação inválida', 
                    mensagem: `Não é possível cancelar um chamado com status: ${chamado.status_chamado}.` 
                });
            }

            await ChamadoModel.cancelarPorCliente(id, id_empresa);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Chamado cancelado com sucesso pelo cliente solicitante.'
            });
        } catch (error) {
            console.error('Erro ao cancelar chamado:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }

    // DELETE /admin/chamados/:id (Visão: ADMINISTRADOR - Exclusão Física do registro)
    static async excluirRegistroFisico(req, res) {
        try {
            const { id } = req.params;

            const chamado = await ChamadoModel.buscarPorId(id);
            if (!chamado) {
                return res.status(404).json({ sucesso: false, erro: 'Registro não existe no banco.' });
            }

            await ChamadoModel.excluirRegistro(id);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Registro do chamado removido permanentemente do histórico físico.'
            });
        } catch (error) {
            console.error('Erro ao excluir fisicamente o registro:', error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno do servidor' });
        }
    }
}

export default ChamadoController;