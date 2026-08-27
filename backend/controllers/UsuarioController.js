import UsuarioModel from '../models/UsuarioModel.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Campos vindos do body podem chegar com qualquer tipo (número, objeto...).
// Validar antes de chamar .trim()/.length evita 500 onde deveria ser 400.
const ehTexto = (v) => typeof v === 'string';

function erro400(res, mensagem) {
    return res.status(400).json({ sucesso: false, erro: mensagem });
}

// Valida e normaliza os campos editáveis. Retorna { dados } ou { erro }.
// `usuarioAtual` é usado para checar se o e-mail novo já pertence a outro.
async function validarCamposUsuario(body, usuarioAtual) {
    const { nome, email, senha, telefone } = body;
    const dados = {};

    if (nome !== undefined) {
        if (!ehTexto(nome) || !nome.trim()) return { erro: 'Nome é obrigatório' };
        dados.nome = nome.trim();
    }

    if (email !== undefined) {
        if (!ehTexto(email)) return { erro: 'E-mail inválido' };

        const emailNormalizado = email.trim().toLowerCase();

        if (!EMAIL_REGEX.test(emailNormalizado)) return { erro: 'E-mail inválido' };

        if (emailNormalizado !== usuarioAtual.email) {
            const emailEmUso = await UsuarioModel.buscarPorEmail(emailNormalizado);

            if (emailEmUso && String(emailEmUso.id) !== String(usuarioAtual.id)) {
                return { erro: 'Esse e-mail já está em uso.', status: 409 };
            }

            dados.email = emailNormalizado;
        }
    }

    if (senha !== undefined) {
        if (!ehTexto(senha) || senha.length < 6) {
            return { erro: 'A senha deve ter pelo menos 6 caracteres' };
        }
        dados.senha = senha;
    }

    if (telefone !== undefined) {
        if (telefone !== null && !ehTexto(telefone)) return { erro: 'Telefone inválido' };
        dados.telefone = telefone ? telefone.trim() : null;
    }

    return { dados };
}

class UsuarioController {

    // CADASTRO PÚBLICO
    static async criarUsuario(req, res) {
        try {
            const { nome, email, senha, telefone } = req.body;

            if (!ehTexto(nome) || !nome.trim()) {
                return erro400(res, 'Nome é obrigatório');
            }

            if (!ehTexto(email) || !email.trim()) {
                return erro400(res, 'E-mail é obrigatório');
            }

            const emailNormalizado = email.trim().toLowerCase();

            if (!EMAIL_REGEX.test(emailNormalizado)) {
                return erro400(res, 'E-mail inválido');
            }

            if (!ehTexto(senha) || senha.length < 6) {
                return erro400(res, 'A senha deve ter pelo menos 6 caracteres');
            }

            if (telefone !== undefined && telefone !== null && !ehTexto(telefone)) {
                return erro400(res, 'Telefone inválido');
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
                return erro400(res, 'Página e limite devem ser maiores que zero');
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

            const resultado = await validarCamposUsuario(req.body, usuario);

            if (resultado.erro) {
                return res.status(resultado.status || 400).json({
                    sucesso: false,
                    erro: resultado.erro
                });
            }

            const dadosAtualizacao = resultado.dados;

            if (req.body.tipo !== undefined) {
                if (!ehTexto(req.body.tipo)) return erro400(res, 'Tipo inválido');
                dadosAtualizacao.tipo = req.body.tipo;
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

    // ATUALIZAR PRÓPRIO PERFIL (nome, e-mail, telefone e senha)
    static async atualizarMeuPerfil(req, res) {
        try {
            const usuarioAtual = await UsuarioModel.buscarPorId(req.usuario.id);

            if (!usuarioAtual) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuário não encontrado'
                });
            }

            const resultado = await validarCamposUsuario(req.body, usuarioAtual);

            if (resultado.erro) {
                return res.status(resultado.status || 400).json({
                    sucesso: false,
                    erro: resultado.erro
                });
            }

            const dadosAtualizacao = resultado.dados;

            if (Object.keys(dadosAtualizacao).length === 0) {
                return res.status(200).json({
                    sucesso: true,
                    mensagem: 'Nenhuma alteração necessária'
                });
            }

            await UsuarioModel.atualizarPerfil(usuarioAtual.id, dadosAtualizacao);

            const atualizado = await UsuarioModel.buscarPorId(usuarioAtual.id);
            delete atualizado.senha;

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Perfil atualizado com sucesso',
                dados: atualizado
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
