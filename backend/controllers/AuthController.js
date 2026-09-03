import jwt from 'jsonwebtoken';
import UsuarioModel from '../models/UsuarioModel.js';
import { JWT_CONFIG } from '../config/jwt.js';
import { setAuthCookie, clearAuthCookie } from '../utils/authCookie.js';
import { enviarEmail } from '../utils/email.js';
import { erro, erroInterno } from '../utils/resposta.js';

const ehTexto = (v) => typeof v === 'string';

// O token de redefinição é assinado com o segredo + hash atual da senha.
// Assim ele vale uma única vez: ao trocar a senha, o hash muda e o token
// (ou qualquer outro emitido antes) deixa de verificar — sem precisar de
// coluna extra no banco.
function segredoRedefinicao(usuario) {
    return `${JWT_CONFIG.secret}:${usuario.senha}`;
}

const MENSAGEM_REDEFINICAO =
    'Se este e-mail estiver cadastrado, enviaremos um link de redefinição.';

class AuthController {

    // LOGIN
    static async login(req, res) {
        try {
            const { email, senha } = req.body;

            if (!ehTexto(email) || !ehTexto(senha) || !email.trim() || !senha) {
                return erro(res, 400, 'Email e senha são obrigatórios');
            }

            const usuario = await UsuarioModel.verificarCredenciais(
                email.trim().toLowerCase(),
                senha
            );

            if (!usuario) {
                return erro(res, 401, 'Credenciais inválidas');
            }

            // A checagem vem depois da senha de propósito: respondida antes,
            // ela diria a qualquer um se um e-mail existe e está banido.
            if (usuario.banido) {
                return erro(
                    res,
                    403,
                    usuario.motivo_banimento
                        ? `Sua conta foi bloqueada. Motivo: ${usuario.motivo_banimento}`
                        : 'Sua conta foi bloqueada. Procure a biblioteca.',
                    'CONTA_BANIDA'
                );
            }

            const token = jwt.sign(
                {
                    id: usuario.id,
                    email: usuario.email,
                    tipo: usuario.tipo
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
                        tipo: usuario.tipo
                    }
                }
            });

        } catch (error) {
            return erroInterno(res, 'Erro no login:', error);
        }
    }

    // LOGOUT — sempre limpa o cookie, independente do estado do token.
    static async logout(req, res) {
        try {
            clearAuthCookie(res);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Logout realizado com sucesso'
            });

        } catch (error) {
            return erroInterno(res, 'Erro no logout:', error);
        }
    }

    // SOLICITAR REDEFINIÇÃO DE SENHA
    // Responde sempre a mesma coisa para não revelar quais e-mails existem.
    static async solicitarRedefinicaoSenha(req, res) {
        try {
            const { email } = req.body;

            if (!ehTexto(email) || email.trim() === '') {
                return erro(res, 400, 'Email é obrigatório');
            }

            const emailNormalizado = email.trim().toLowerCase();
            const usuario = await UsuarioModel.buscarPorEmail(emailNormalizado);

            if (!usuario) {
                return res.status(200).json({
                    sucesso: true,
                    mensagem: MENSAGEM_REDEFINICAO
                });
            }

            const token = jwt.sign(
                {
                    id: usuario.id,
                    finalidade: 'redefinir-senha'
                },
                segredoRedefinicao(usuario),
                { expiresIn: '15m' }
            );

            const frontendUrl = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';
            const linkRedefinicao = `${frontendUrl}/redefinir-senha?token=${token}`;

            try {
                await enviarEmail({
                    para: usuario.email,
                    assunto: 'Redefinição de senha - LectorHub',
                    texto: `Olá ${usuario.nome},\n\nRecebemos uma solicitação para redefinir sua senha.\n\nAcesse o link abaixo para criar uma nova senha:\n${linkRedefinicao}\n\nEste link expira em 15 minutos e só pode ser usado uma vez.\n\nSe você não solicitou isso, ignore este e-mail.\n\nAtenciosamente,\nEquipe LectorHub`,
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
                            <p>Este link expira em 15 minutos e só pode ser usado uma vez.</p>
                            <p>Se você não solicitou isso, ignore este e-mail.</p>
                            <br>
                            <p>Atenciosamente,<br><strong>Equipe LectorHub</strong></p>
                        </div>
                    `,
                });
            } catch (erroEnvio) {
                // Loga, mas não muda a resposta: o cliente não precisa saber
                // se o e-mail existe ou se o SMTP falhou.
                console.error('Erro ao enviar e-mail de redefinição:', erroEnvio);
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: MENSAGEM_REDEFINICAO
            });

        } catch (error) {
            return erroInterno(res, 'Erro ao solicitar redefinição de senha:', error);
        }
    }

    // REDEFINIR SENHA COM TOKEN (uso único)
    static async redefinirSenha(req, res) {
        try {
            const { token, senha } = req.body;

            if (!ehTexto(token) || !ehTexto(senha) || !token || !senha) {
                return erro(res, 400, 'Token e nova senha são obrigatórios');
            }

            if (senha.length < 6) {
                return erro(res, 400, 'A senha deve ter pelo menos 6 caracteres');
            }

            // 1º passo: ler o id sem verificar, para saber qual hash usar no segredo.
            const naoVerificado = jwt.decode(token);

            if (!naoVerificado || naoVerificado.finalidade !== 'redefinir-senha') {
                return erro(res, 401, 'Token inválido');
            }

            const usuario = await UsuarioModel.buscarPorId(naoVerificado.id);

            if (!usuario) {
                return erro(res, 401, 'Token inválido');
            }

            // 2º passo: verificar de verdade. Se a senha já foi trocada com este
            // token, o segredo mudou e cai no JsonWebTokenError abaixo.
            jwt.verify(token, segredoRedefinicao(usuario));

            await UsuarioModel.atualizar(usuario.id, { senha });

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Senha redefinida com sucesso'
            });

        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return erro(res, 401, 'Solicite uma nova redefinição de senha.');
            }

            if (error.name === 'JsonWebTokenError') {
                return erro(res, 401, 'Este link já foi usado ou não é válido. Solicite uma nova redefinição.');
            }

            return erroInterno(res, 'Erro ao redefinir senha:', error);
        }
    }
}

export default AuthController;
