import FaleConoscoModel from '../models/FaleConoscoModel.js';
import { Resend } from 'resend'; 

// Inicializa o Resend com a chave cadastrada no seu arquivo .env
const resend = new Resend(process.env.RESEND_API_KEY);

class FaleConoscoController {

    static async responder(req, res) {
        try {
            const { id } = req.params;
            const { resposta } = req.body;

            if (!resposta || resposta.trim() === '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'A resposta não pode estar vazia.'
                });
            }

            // Buscar a mensagem original para pegar o e-mail do cliente
            const mensagemOriginal = await FaleConoscoModel.buscarPorId(id);

            if (!mensagemOriginal) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Mensagem não encontrada.'
                });
            }

            // Enviar o e-mail utilizando a API HTTP do Resend
            const { data, error } = await resend.emails.send({
                from: 'Luminar <onboarding@gustavo-paiva.dev.br>', // Remetente padrão do plano gratuito
                to: mensagemOriginal.email,             // E-mail do cliente vindo do banco
                subject: 'Resposta ao seu contato - Luminar',
                text: `Olá ${mensagemOriginal.nome_completo},\n\nRecebemos sua mensagem: "${mensagemOriginal.mensagem}"\n\nResposta da nossa equipe:\n${resposta}\n\nAtenciosamente,\nEquipe Luminar`,
                html: `
                    <div style="font-family: Arial, sans-serif; color: #221f20; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #febd17;">Olá ${mensagemOriginal.nome_completo},</h2>
                        <p>Recebemos sua mensagem:</p>
                        <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #febd17; margin: 15px 0;">
                            ${mensagemOriginal.mensagem}
                        </blockquote>
                        <p><strong>Resposta da nossa equipe:</strong></p>
                        <p>${resposta.replace(/\n/g, '<br>')}</p>
                        <br>
                        <p>Atenciosamente,<br><strong>Equipe Luminar</strong></p>
                    </div>
                `,
            });

            // Verifica se a API do Resend retornou algum erro de envio
            if (error) {
                console.error('Erro retornado pela API do Resend:', error);
                return res.status(500).json({
                    sucesso: false,
                    erro: 'Erro ao enviar o e-mail de resposta através da API.',
                    mensagem: error.message
                });
            }

            console.log('E-mail enviado com sucesso via Resend:', data);

            // Salvar a resposta no banco de dados após a confirmação de envio
            await FaleConoscoModel.responder(id, resposta);

            res.status(200).json({
                sucesso: true,
                mensagem: 'Resposta enviada com sucesso para o cliente e registrada no sistema.'
            });

        } catch (error) {
            console.error('Erro ao responder mensagem:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro ao processar a resposta.',
                mensagem: 'Ocorreu uma falha interna ao tentar se comunicar com o servidor.'
            });
        }
    }

    static async listarTodos(req, res) {
        try {
            let pagina = parseInt(req.query.pagina) || 1;
            let limite = parseInt(req.query.limite) || 10;

            if (pagina <= 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Página inválida',
                    mensagem: 'A página deve ser maior que zero'
                });
            }

            if (limite <= 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Limite inválido',
                    mensagem: 'O limite deve ser maior que zero'
                });
            }

            const offset = (pagina - 1) * limite;
            const resultado = await FaleConoscoModel.listarTodos(limite, offset);

            res.status(200).json({
                sucesso: true,
                dados: resultado.faleConosco,
                paginacao: {
                    pagina: resultado.pagina,
                    limite: resultado.limite,
                    total: resultado.total,
                    totalPaginas: resultado.totalPaginas
                }
            });
        } catch (error) {
            console.error('Erro crítico em FaleConoscoController.listarTodos:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível carregar a lista geral de mensagens.'
            });
        }
    }

    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;

            // CORREÇÃO: Removido o 'isNaN(id)' para permitir chaves do tipo UUID/String do Banco de Dados
            if (!id) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID inválido',
                    mensagem: 'O parâmetro ID deve ser fornecido.'
                });
            }

            const faleConosco = await FaleConoscoModel.buscarPorId(id);

            if (!faleConosco) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Mensagem não encontrada',
                    mensagem: `Não foi localizada nenhuma mensagem com o ID ${id}.`
                });
            }

            res.status(200).json({
                sucesso: true,
                dados: faleConosco
            });

        } catch (error) {
            console.error(`Erro crítico em FaleConoscoController.buscarPorId (ID: ${req.params.id}):`, error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Ocorreu um erro ao tentar buscar os detalhes desta mensagem.'
            });
        }
    }

    static async listarPendentes(req, res) {
        try {
            let pagina = parseInt(req.query.pagina) || 1;
            let limite = parseInt(req.query.limite) || 10;

            if (pagina <= 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Página inválida',
                    mensagem: 'A página deve ser maior que zero'
                });
            }

            if (limite <= 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Limite inválido',
                    mensagem: 'O limite deve ser maior que zero'
                });
            }

            const offset = (pagina - 1) * limite;
            const resultado = await FaleConoscoModel.listarPendentes(limite, offset);

            res.status(200).json({
                sucesso: true,
                dados: resultado.faleConosco,
                paginacao: {
                    pagina: resultado.pagina,
                    limite: resultado.limite,
                    total: resultado.total,
                    totalPaginas: resultado.totalPaginas
                }
            });
        } catch (error) {
            console.error('Erro crítico em FaleConoscoController.listarPendentes:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível carregar a lista de mensagens pendentes.'
            });
        }
    }

    static async listarRespondidos(req, res) {
        try {
            let pagina = parseInt(req.query.pagina) || 1;
            let limite = parseInt(req.query.limite) || 10;

            if (pagina <= 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Página inválida',
                    mensagem: 'A página deve ser maior que zero'
                });
            }

            if (limite <= 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Limite inválido',
                    mensagem: 'O limite deve ser maior que zero'
                });
            }

            const offset = (pagina - 1) * limite;
            const resultado = await FaleConoscoModel.listarRespondidos(limite, offset);

            res.status(200).json({
                sucesso: true,
                dados: resultado.faleConosco,
                paginacao: {
                    pagina: resultado.pagina,
                    limite: resultado.limite,
                    total: resultado.total,
                    totalPaginas: resultado.totalPaginas
                }
            });
        } catch (error) {
            console.error('Erro crítico em FaleConoscoController.listarRespondidos:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível carregar a lista de mensagens respondidas.'
            });
        }
    }

    static async listarPorData(req, res) {
        try {
            let pagina = parseInt(req.query.pagina) || 1;
            let limite = parseInt(req.query.limite) || 10;

            if (pagina <= 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Página inválida',
                    mensagem: 'A página deve ser maior que zero'
                });
            }

            if (limite <= 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Limite inválido',
                    mensagem: 'O limite deve ser maior que zero'
                });
            }

            const offset = (pagina - 1) * limite;
            const resultado = await FaleConoscoModel.listarPorData(limite, offset);

            res.status(200).json({
                sucesso: true,
                dados: resultado.faleConosco,
                paginacao: {
                    pagina: resultado.pagina,
                    limite: resultado.limite,
                    total: resultado.total,
                    totalPaginas: resultado.totalPaginas
                }
            });
        } catch (error) {
            console.error('Erro crítico em FaleConoscoController.listarPorData:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível carregar a ordem cronológica das mensagens.'
            });
        }
    }

    static async criar(req, res) {
        try {
            const {
                nome_completo,
                email, 
                telefone,
                mensagem,
            } = req.body;

            const erros = [];

            if (!nome_completo || nome_completo.trim() === '') {
                erros.push({
                    campo: 'nome_completo',
                    mensagem: 'Nome completo é obrigatório'
                });
            }

            if (!email || email.trim() === '') {
                erros.push({
                    campo: 'email',
                    mensagem: 'Email é obrigatório'
                });
            }

            if (telefone && telefone.trim() !== '') {
                if (telefone.length < 10 || telefone.length > 20) {
                    erros.push({
                        campo: 'telefone',
                        mensagem: 'O telefone deve ter entre 10 e 20 caracteres.'
                    });
                }
            }

            if (!mensagem || mensagem.trim() === ''){
                erros.push({
                    campo: 'mensagem',
                    mensagem: 'A mensagem é obrigatória!'
                });
            }

            if (erros.length > 0) {
                return res.status(400).json({
                    sucesso: false,
                    erro: erros[0].mensagem
                });
            }

            const dadosFaleConosco = {
                nome_completo: nome_completo.trim(),
                email: email.trim(),
                telefone: telefone ? telefone.trim() : null,
                mensagem: mensagem.trim()
            };

            const id = await FaleConoscoModel.criar(dadosFaleConosco);

            res.status(201).json({
                sucesso: true,
                mensagem: 'Mensagem enviada com sucesso',
                dados: {
                    id_contato: id, // ALINHAMENTO: Retorna id_contato de forma explícita
                    ...dadosFaleConosco,
                    status_contato: 'PENDENTE'
                }
            }); 

        } catch (error) {
            console.error('Erro crítico em FaleConoscoController.criar:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno no servidor',
                mensagem: 'Não foi possível registrar o seu contato no momento. Tente novamente mais tarde.'
            });
        }
    }
}

export default FaleConoscoController;