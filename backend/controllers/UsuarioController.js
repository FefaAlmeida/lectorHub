import UsuarioModel from '../models/UsuarioModel.js';
import { comparePassword } from '../config/database.js';
import { erro, erroInterno } from '../utils/resposta.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Campos vindos do body podem chegar com qualquer tipo (número, objeto...).
// Validar antes de chamar .trim()/.length evita 500 onde deveria ser 400.
const ehTexto = (v) => typeof v === 'string';

function erro400(res, mensagem) {
    return erro(res, 400, mensagem);
}

function lerId(valor) {
    const id = Number(valor);
    return Number.isInteger(id) && id > 0 ? id : null;
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
                return erro(res, 409, 'Esse e-mail já está em uso.');
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
            return erroInterno(res, 'Erro ao criar usuário:', error);
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

            const resultado = await UsuarioModel.listarTodos(pagina, limite, {
                busca: req.query.busca,
                tipo: req.query.tipo,
                ordem: req.query.ordem,
                situacao: req.query.situacao
            });

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
            return erroInterno(res, 'Erro ao listar usuários:', error);
        }
    }

    // BANIR / REATIVAR (ADMIN)
    //
    // Bloqueia o acesso sem apagar o cadastro — ver UsuarioModel.definirBanimento.
    static async definirBanimento(req, res) {
        try {
            const id = lerId(req.params.id);
            if (!id) return erro400(res, 'ID de usuário inválido.');

            const { banido, motivo } = req.body;

            if (typeof banido !== 'boolean') {
                return erro400(res, 'Informe `banido` como true ou false.');
            }

            // Banir a si mesmo tranca o admin para fora do próprio painel.
            if (String(req.usuario.id) === String(id)) {
                return erro(res, 400, 'Você não pode banir a própria conta.');
            }

            const usuario = await UsuarioModel.buscarPorId(id);
            if (!usuario) return erro(res, 404, 'Usuário não encontrado');

            // Sem isto, um admin poderia derrubar outro e a recuperação só
            // seria possível direto no banco.
            if (usuario.tipo === 'admin') {
                return erro(res, 403, 'Contas de administrador não podem ser banidas.');
            }

            if (motivo !== undefined && motivo !== null) {
                if (!ehTexto(motivo)) return erro400(res, 'Motivo inválido.');
                if (motivo.trim().length > 255) {
                    return erro400(res, 'O motivo deve ter no máximo 255 caracteres.');
                }
            }

            await UsuarioModel.definirBanimento(
                id,
                banido,
                motivo ? motivo.trim() : null
            );

            return res.status(200).json({
                sucesso: true,
                mensagem: banido ? 'Usuário banido.' : 'Acesso do usuário restaurado.'
            });

        } catch (error) {
            return erroInterno(res, 'Erro ao banir usuário:', error);
        }
    }

    // ATUALIZAR QUALQUER USUÁRIO (ADMIN)
    static async atualizarUsuario(req, res) {
        try {
            const id = lerId(req.params.id);
            if (!id) return erro400(res, 'ID de usuário inválido.');

            const usuario = await UsuarioModel.buscarPorId(id);

            if (!usuario) {
                return erro(res, 404, 'Usuário não encontrado');
            }

            const resultado = await validarCamposUsuario(req.body, usuario);

            if (resultado.erro) {
                return erro(res, resultado.status || 400, resultado.erro);
            }

            const dadosAtualizacao = resultado.dados;

            if (req.body.tipo !== undefined) {
                if (!ehTexto(req.body.tipo) || !['admin', 'cliente'].includes(req.body.tipo.toLowerCase())) {
                    return erro400(res, 'Tipo inválido (admin ou cliente).');
                }
                if (id === req.usuario.id && req.body.tipo.toLowerCase() !== 'admin') {
                    return erro400(res, 'Você não pode remover seu próprio acesso de administrador.');
                }
                dadosAtualizacao.tipo = req.body.tipo.toLowerCase();
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
            return erroInterno(res, 'Erro ao atualizar usuário:', error);
        }
    }

    // VER PRÓPRIO PERFIL
    static async me(req, res) {
        try {
            const usuario = await UsuarioModel.buscarPorId(req.usuario.id);

            if (!usuario) {
                return erro(res, 404, 'Usuário não encontrado');
            }

            delete usuario.senha;

            return res.status(200).json({
                sucesso: true,
                dados: usuario
            });

        } catch (error) {
            return erroInterno(res, 'Erro ao obter perfil:', error);
        }
    }

    // ATUALIZAR PRÓPRIO PERFIL (nome, e-mail, telefone e senha)
    static async atualizarMeuPerfil(req, res) {
        try {
            const usuarioAtual = await UsuarioModel.buscarPorId(req.usuario.id);

            if (!usuarioAtual) {
                return erro(res, 404, 'Usuário não encontrado');
            }

            const resultado = await validarCamposUsuario(req.body, usuarioAtual);

            if (resultado.erro) {
                return erro(res, resultado.status || 400, resultado.erro);
            }

            const dadosAtualizacao = resultado.dados;

            // Trocar senha ou e-mail exige provar que é o dono da conta.
            if (dadosAtualizacao.senha !== undefined || dadosAtualizacao.email !== undefined) {
                const senhaAtual = req.body.senha_atual;
                if (!ehTexto(senhaAtual) || !senhaAtual) {
                    return erro400(res, 'Informe a senha atual para alterar e-mail ou senha.');
                }
                const confere = await comparePassword(senhaAtual, usuarioAtual.senha);
                if (!confere) return erro(res, 401, 'Senha atual incorreta.');
            }

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
            return erroInterno(res, 'Erro ao atualizar perfil:', error);
        }
    }

}

export default UsuarioController;
