import jwt from 'jsonwebtoken';
import { Resend } from 'resend';
import UsuarioModel from '../models/UsuarioModel.js';
import { JWT_CONFIG } from '../config/jwt.js';
import { comparePassword } from '../config/database.js';
import { setAuthCookie, clearAuthCookie } from '../utils/authCookie.js';

const resend = new Resend(process.env.RESEND_API_KEY);

class AuthController {

    // LOGIN
    static async login(req, res) {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Email e senha são obrigatórios'
                });
            }

            const usuario = await UsuarioModel.verificarCredenciais(
                email.trim().toLowerCase(),
                senha
            );

            if (!usuario) {
                return res.status(401).json({
                    sucesso: false,
                    erro: 'Credenciais inválidas'
                });
            }

            const token = jwt.sign(
                {
                    id: usuario.id,
                    email: usuario.email,
                    tipo_usuario: usuario.tipo_usuario
                },
                JWT_CONFIG.secret,
                { expiresIn: JWT_CONFIG.expiresIn }
            );

            setAuthCookie(res, token);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Login realizado com sucesso',
                dados: {
                    usuario: {
                        id: usuario.id,
                        nome: usuario.nome,
                        email: usuario.email,
                        tipo_usuario: usuario.tipo_usuario
                    }
                }
            });

        } catch (error) {
            console.error('Erro no login:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno no servidor'
            });
        }
    }

    // LOGOUT
    static async logout(req, res) {
        try {
            clearAuthCookie(res);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Logout realizado com sucesso'
            });

        } catch (error) {
            console.error('Erro no logout:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno no servidor'
            });
        }
    }

    // SOLICITAR REDEFINIÇÃO DE SENHA
    static async solicitarRedefinicaoSenha(req, res) {
        try {
            const { email } = req.body;

            if (!email || email.trim() === '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Email é obrigatório'
                });
            }

            const emailNormalizado = email.trim().toLowerCase();
            const usuario = await UsuarioModel.buscarPorEmail(emailNormalizado);

            if (!usuario || usuario.status_usuario !== 'ATIVO') {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuário não encontrado'
                });
            }

            const token = jwt.sign(
                {
                    id: usuario.id,
                    email: usuario.email,
                    finalidade: 'redefinir-senha'
                },
                JWT_CONFIG.secret,
                { expiresIn: '15m' }
            );

            const frontendUrl = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
            const linkRedefinicao = `${frontendUrl}/redefinir-senha?token=${token}`;

            // CORREÇÃO: Bloco do Nodemailer removido. Disparo feito 100% via Resend com o e-mail solicitado
            const { data, error } = await resend.emails.send({
                from: 'Luminar <onboarding@gustavo-paiva.dev.br>',
                to: usuario.email,
                subject: 'Redefinição de senha - Luminar',
                text: `Olá ${usuario.nome},\n\nRecebemos uma solicitação para redefinir sua senha.\n\nAcesse o link abaixo para criar uma nova senha:\n${linkRedefinicao}\n\nEste link expira em 15 minutos.\n\nSe você não solicitou isso, ignore este e-mail.\n\nAtenciosamente,\nEquipe Luminar`,
                html: `
                    <div style="font-family: Arial, sans-serif; color: #221f20;">
                        <h2 style="color: #febd17;">Olá ${usuario.nome},</h2>
                        <p>Recebemos uma solicitação para redefinir sua senha.</p>
                        <p>Clique no botão abaixo para criar uma nova senha:</p>
                        <p>
                            <a href="${linkRedefinicao}" style="display: inline-block; background: #febd17; color: #221f20; padding: 14px 22px; border-radius: 10px; text-decoration: none; font-weight: bold;">
                                Redefinir senha
                            </a>
                        </p>
                        <p>Este link expira em 15 minutos.</p>
                        <p>Se você não solicitou isso, ignore este e-mail.</p>
                        <br>
                        <p>Atenciosamente,<br><strong>Equipe Luminar</strong></p>
                    </div>
                `,
            });

            if (error) {
                console.error('Erro retornado pela API do Resend:', error);
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Erro ao enviar e-mail de redefinição',
                    mensagem: error.message
                });
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Enviamos um link de redefinição para o seu e-mail.'
            });

        } catch (error) {
            console.error('Erro ao solicitar redefinição de senha:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno no servidor',
                mensagem: 'Não foi possível processar o envio.'
            });
        }
    }

    // REDEFINIR SENHA COM TOKEN
    static async redefinirSenha(req, res) {
        try {
            const { token, senha } = req.body;

            if (!token || !senha) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Token e nova senha são obrigatórios'
                });
            }

            if (senha.length < 6) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'A senha deve ter pelo menos 6 caracteres'
                });
            }

            const decoded = jwt.verify(token, JWT_CONFIG.secret);

            if (decoded.finalidade !== 'redefinir-senha') {
                return res.status(401).json({
                    sucesso: false,
                    erro: 'Token inválido'
                });
            }

            const usuario = await UsuarioModel.buscarPorId(decoded.id);

            if (!usuario || usuario.email !== decoded.email) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuário não encontrado'
                });
            }

            await UsuarioModel.atualizar(usuario.id, { senha });

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Senha redefinida com sucesso'
            });

        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    sucesso: false,
                    erro: 'Link expirado',
                    mensagem: 'Solicite uma nova redefinição de senha.'
                });
            }

            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    sucesso: false,
                    erro: 'Token inválido'
                });
            }

            console.error('Erro ao redefinir senha:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno no servidor'
            });
        }
    }

    // OBTER PERFIL (usuário logado)
    static async obterPerfil(req, res) {
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
                erro: 'Erro interno no servidor'
            });
        }
    }

    // ATUALIZAR PERFIL (usuário logado)
    static async atualizarPerfil(req, res) {
        try {
            const id = req.usuario.id;

            const {
                nome,
                senha
            } = req.body;

            const usuarioAtual = await UsuarioModel.buscarPorId(id);

            if (!usuarioAtual) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuário não encontrado'
                });
            }

            const dadosAtualizacao = {};

            if (nome !== undefined) {
                if (!nome.trim()) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Nome é obrigatório'
                    });
                }

                const nomeNormalizado = nome.trim();

                if (nomeNormalizado !== usuarioAtual.nome) {
                    dadosAtualizacao.nome = nomeNormalizado;
                }
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
                    mensagem: 'Nenhuma alteração necessária',
                    dados: {
                        id: usuarioAtual.id,
                        nome: usuarioAtual.nome,
                        email: usuarioAtual.email,
                        tipo_usuario: usuarioAtual.tipo_usuario,
                        status_usuario: usuarioAtual.status_usuario,
                        id_solicitacao: usuarioAtual.id_solicitacao,
                        id_empresa: usuarioAtual.id_empresa
                    }
                });
            }

            // Se estiver alterando senha, já deixa pronto pro model hashear
            const resultado = await UsuarioModel.atualizarPerfil(id, dadosAtualizacao);

            if (resultado === 0) {
                return res.status(200).json({
                    sucesso: true,
                    mensagem: 'Nenhuma alteração necessária'
                });
            }

            const atualizado = await UsuarioModel.buscarPorId(id);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Perfil atualizado com sucesso',
                dados: {
                    id: atualizado.id,
                    nome: atualizado.nome,
                    email: atualizado.email,
                    tipo_usuario: atualizado.tipo_usuario,
                    status_usuario: atualizado.status_usuario,
                    id_solicitacao: atualizado.id_solicitacao,
                    id_empresa: atualizado.id_empresa
                }
            });

        } catch (error) {
            console.error('Erro ao atualizar perfil:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno no servidor'
            });
        }
    }
}

export default AuthController;