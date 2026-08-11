import UsuarioModel from '../models/UsuarioModel.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

class UsuarioController {

    // CADASTRO PÚBLICO
    static async criarUsuario(req, res) {
        try {
            const { nome, email, senha, telefone } = req.body;

            if (!nome || !nome.trim()) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nome é obrigatório'
                });
            }

            if (!email || !email.trim()) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'E-mail é obrigatório'
                });
            }

            const emailNormalizado = email.trim().toLowerCase();

            if (!EMAIL_REGEX.test(emailNormalizado)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'E-mail inválido'
                });
            }

            if (!senha || senha.length < 6) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'A senha deve ter pelo menos 6 caracteres'
                });
            }

            const existe = await UsuarioModel.buscarPorEmail(emailNormalizado);

            if (existe) {
                return res.status(409).json({
                    sucesso: false,
                    erro: 'Esse e-mail já está em uso.'
                });
            }

            // O tipo nunca vem do client: todo cadastro público nasce como 'cliente'.
            const id = await UsuarioModel.criar({
                nome: nome.trim(),
                email: emailNormalizado,
                senha,
                telefone: telefone ? telefone.trim() : null,
                tipo: 'cliente'
            });

            return res.status(201).json({
                sucesso: true,
                mensagem: 'Usuário criado com sucesso',
                dados: {
                    id,
                    nome: nome.trim(),
                    email: emailNormalizado,
                    tipo: 'cliente'
                }
            });

        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor'
            });
        }
    }

    // LISTAR USUÁRIOS (ADMIN)
    static async listarUsuarios(req, res) {
        try {
            const pagina = parseInt(req.query.pagina) || 1;
            const limite = parseInt(req.query.limite) || 10;

            if (pagina <= 0 || limite <= 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Página e limite devem ser maiores que zero'
                });
            }

            const resultado = await UsuarioModel.listarTodos(pagina, limite);

            return res.status(200).json({
                sucesso: true,
                dados: resultado.usuarios,
                paginacao: {
                    pagina: resultado.pagina,
                    limite: resultado.limite,
                    total: resultado.total,
                    totalPaginas: resultado.totalPaginas
                }
            });

        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor'
            });
        }
    }

    // ATUALIZAR QUALQUER USUÁRIO (ADMIN)
    static async atualizarUsuario(req, res) {
        try {
            const { id } = req.params;

            const usuario = await UsuarioModel.buscarPorId(id);

            if (!usuario) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuário não encontrado'
                });
            }

            const { nome, email, senha, telefone, tipo } = req.body;
            const dadosAtualizacao = {};

            if (nome !== undefined) {
                if (!nome.trim()) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Nome é obrigatório'
                    });
                }

                dadosAtualizacao.nome = nome.trim();
            }

            if (email !== undefined) {
                const emailNormalizado = email.trim().toLowerCase();

                if (!EMAIL_REGEX.test(emailNormalizado)) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'E-mail inválido'
                    });
                }

                const emailEmUso = await UsuarioModel.buscarPorEmail(emailNormalizado);

                if (emailEmUso && String(emailEmUso.id) !== String(usuario.id)) {
                    return res.status(409).json({
                        sucesso: false,
                        erro: 'Esse e-mail já está em uso.'
                    });
                }

                dadosAtualizacao.email = emailNormalizado;
            }

            if (senha !== undefined) {
                if (senha.length < 6) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'A senha deve ter pelo menos 6 caracteres'
                    });
                }

                dadosAtualizacao.senha = senha;
            }

            if (telefone !== undefined) {
                dadosAtualizacao.telefone = telefone ? telefone.trim() : null;
            }

            if (tipo !== undefined) {
                dadosAtualizacao.tipo = tipo;
            }

            if (Object.keys(dadosAtualizacao).length === 0) {
                return res.status(200).json({
                    sucesso: true,
                    mensagem: 'Nenhuma alteração necessária'
                });
            }

            await UsuarioModel.atualizar(id, dadosAtualizacao);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Usuário atualizado'
            });

        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor'
            });
        }
    }

    // VER PRÓPRIO PERFIL
    static async me(req, res) {
        try {
            const usuario = await UsuarioModel.buscarPorId(req.usuario.id);

            if (!usuario) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuário não encontrado'
                });
            }

            delete usuario.senha;

            return res.status(200).json({
                sucesso: true,
                dados: usuario
            });

        } catch (error) {
            console.error('Erro ao obter perfil:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor'
            });
        }
    }

    // ATUALIZAR PRÓPRIO PERFIL
    static async atualizarMeuPerfil(req, res) {
        try {
            const id = req.usuario.id;
            const { nome, senha, telefone } = req.body;

            const dadosAtualizacao = {};

            if (nome !== undefined) {
                if (!nome.trim()) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Nome é obrigatório'
                    });
                }

                dadosAtualizacao.nome = nome.trim();
            }

            if (telefone !== undefined) {
                dadosAtualizacao.telefone = telefone ? telefone.trim() : null;
            }

            if (senha !== undefined) {
                if (senha.length < 6) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'A senha deve ter pelo menos 6 caracteres'
                    });
                }

                dadosAtualizacao.senha = senha;
            }

            if (Object.keys(dadosAtualizacao).length === 0) {
                return res.status(200).json({
                    sucesso: true,
                    mensagem: 'Nenhuma alteração necessária'
                });
            }

            await UsuarioModel.atualizarPerfil(id, dadosAtualizacao);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Perfil atualizado com sucesso'
            });

        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor'
            });
        }
    }

}

export default UsuarioController;
