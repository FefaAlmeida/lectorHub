import TecnicoModel from '../models/TecnicoModel.js';

class TecnicoController {

    // CADASTRAR TÉCNICO
    static async criarTecnico(req, res) {
        try {
            const { nome, telefone, email } = req.body;

            if (!nome || !telefone || !email) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Os campos Nome, Telefone e E-mail são obrigatórios'
                });
            }

            // Validação de email duplicado
            const emailExiste = await TecnicoModel.buscarPorEmail(email);
            if (emailExiste) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Este e-mail já está cadastrado para outro técnico.'
                });
            }

            // Validação de telefone duplicado
            const telefoneExiste = await TecnicoModel.buscarPorTelefone(telefone);
            if (telefoneExiste) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Este telefone já está cadastrado para outro técnico.'
                });
            }

            const idTecnico = await TecnicoModel.criar({ nome, telefone, email });

            return res.status(201).json({
                sucesso: true,
                mensagem: 'Técnico cadastrado com sucesso',
                dados: {
                    id_tecnico: idTecnico
                }
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno'
            });
        }
    }

    // LISTAR TÉCNICOS (GERAL PAGINADO - VISÃO ADMIN)
    static async listarTecnicos(req, res) {
        try {
            const pagina = parseInt(req.query.pagina) || 1;
            const limite = parseInt(req.query.limite) || 10;

            const resultado = await TecnicoModel.listarTodos(pagina, limite);

            return res.status(200).json({
                sucesso: true,
                dados: resultado.tecnicos,
                paginacao: resultado
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno'
            });
        }
    }

    // BUSCAR TÉCNICO POR ID
    static async buscarTecnico(req, res) {
        try {
            const { id } = req.params;

            const tecnico = await TecnicoModel.buscarPorId(id);

            if (!tecnico) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Técnico não encontrado'
                });
            }

            return res.status(200).json({
                sucesso: true,
                dados: tecnico
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno'
            });
        }
    }

    // ATUALIZAR TÉCNICO
    static async atualizarTecnico(req, res) {
        try {
            const { id } = req.params;
            const { nome, telefone, email } = req.body;

            const tecnico = await TecnicoModel.buscarPorId(id);

            if (!tecnico) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Técnico não encontrado'
                });
            }

            // Se for atualizar o email, verifica se já pertence a outro ID
            if (email) {
                const emailExiste = await TecnicoModel.buscarPorEmail(email);
                if (emailExiste && emailExiste.id_tecnico !== parseInt(id)) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Este e-mail já está em uso por outro técnico.'
                    });
                }
            }

            // Se for atualizar o telefone, verifica se já pertence a outro ID
            if (telefone) {
                const telefoneExiste = await TecnicoModel.buscarPorTelefone(telefone);
                if (telefoneExiste && telefoneExiste.id_tecnico !== parseInt(id)) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Este telefone já está em uso por outro técnico.'
                    });
                }
            }

            await TecnicoModel.atualizar(id, req.body);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Dados do técnico atualizados com sucesso'
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno ao processar a atualização'
            });
        }
    }

    // DESATIVAR TÉCNICO (INATIVAR)
    static async deletarTecnico(req, res) {
        try {
            const { id } = req.params;

            const tecnico = await TecnicoModel.buscarPorId(id);

            if (!tecnico) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Técnico não encontrado'
                });
            }

            await TecnicoModel.desativar(id);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Técnico desativado com sucesso'
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno'
            });
        }
    }

    static async listarAtivos(req, res) {
        try {
            const tecnicos = await TecnicoModel.listarAtivos();
            return res.status(200).json({ sucesso: true, dados: tecnicos });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ sucesso: false, erro: 'Erro ao buscar técnicos ativos.' });
        }
    }
    
}

export default TecnicoController;