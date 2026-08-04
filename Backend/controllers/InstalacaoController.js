import { getConnection } from '../config/database.js';
import UsuarioModel from '../models/UsuarioModel.js';
import EnderecoModel from '../models/EnderecoModel.js';
import InstalacaoModel from '../models/InstalacaoModel.js';

class InstalacaoController {

    // SOLICITAR INSTALAÇÃO (Cria Endereço e Instalação na mesma ação)
    static async solicitarInstalacao(req, res) {
        const connection = await getConnection();
        try {
            const { logradouro, numero, bairro, cidade, estado, cep, complemento } = req.body;

            if (!logradouro || !cidade || !estado) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Os campos Logradouro, Cidade e Estado são obrigatórios'
                });
            }

            const usuario = await UsuarioModel.buscarPorId(req.usuario.id);

            if (!usuario) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuário não encontrado'
                });
            }

            if (!usuario.id_empresa) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'O usuário precisa possuir uma empresa vinculada para solicitar instalações.'
                });
            }

            const idEmpresa = usuario.id_empresa;

            await connection.beginTransaction();

            const idEndereco = await EnderecoModel.criar({
                id_empresa: idEmpresa,
                logradouro: logradouro.trim(),
                numero: numero ? numero.trim() : null,
                bairro: bairro ? bairro.trim() : null,
                cidade: cidade.trim(),
                estado: estado.trim().toUpperCase(),
                cep: cep ? cep.replace(/\D/g, '') : null,
                complemento: complemento ? complemento.trim() : null
            }, connection);

            const idInstalacao = await InstalacaoModel.criar({
                id_empresa: idEmpresa,
                id_endereco: idEndereco
            }, connection);

            await connection.commit();

            return res.status(201).json({
                sucesso: true,
                mensagem: 'Solicitação de instalação registered com sucesso',
                dados: { id_instalacao: idInstalacao }
            });

        } catch (error) {
            await connection.rollback();
            console.error(error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' });
        } finally {
            connection.release();
        }
    }

    // LISTAR INSTALAÇÕES (GERAL PAGINADO - VISÃO ADMIN)
    static async listarInstalacoes(req, res) {
        try {
            const pagina = parseInt(req.query.pagina) || 1;
            const limite = parseInt(req.query.limite) || 10;

            const resultado = await InstalacaoModel.listarTodas(pagina, limite);

            return res.status(200).json({
                sucesso: true,
                dados: resultado.instalacoes,
                paginacao: resultado
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' });
        }
    }

// LISTAR MINHAS INSTALAÇÕES (VISÃO CLIENTE LOGADO)
    static async minhasInstalacoes(req, res) {
        const connection = await getConnection();
        try {
            const usuario = await UsuarioModel.buscarPorId(req.usuario.id);

            if (!usuario) {
                return res.status(404).json({ sucesso: false, erro: 'Usuário não encontrado' });
            }

            if (!usuario.id_empresa) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Nenhuma empresa vinculada para buscar histórico'
                });
            }

            // 1. Busca as instalações normais através do seu Model original
            const instalacoes = await InstalacaoModel.listarPorEmpresa(usuario.id_empresa);

            // 2. Percorre o array para injetar as strings corretas de nome
            if (instalacoes && instalacoes.length > 0) {
                for (let inst of instalacoes) {
                    
                    // BUSCA O NOME DO TÉCNICO (Baseado em image_d7031f.png)
                    if (inst.tecnico) {
                        const [tecResult] = await connection.execute(
                            `SELECT nome FROM tecnicos WHERE id_tecnico = ? LIMIT 1`, 
                            [inst.tecnico]
                        );
                        if (tecResult.length > 0) {
                            inst.nome_tecnico = tecResult[0].nome;
                        }
                    }

                    // BUSCA O NOME DA EMPRESA (Baseado em image_d70360.png)
                    if (inst.id_empresa) {
                        const [empResult] = await connection.execute(
                            `SELECT nome_empresa FROM empresa_clientes WHERE id_empresa = ? LIMIT 1`,
                            [inst.id_empresa]
                        );
                        if (empResult.length > 0) {
                            inst.nome_empresa = empResult[0].nome_empresa;
                        }
                    }
                }
            }

            return res.status(200).json({ sucesso: true, dados: instalacoes });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' });
        } finally {
            connection.release();
        }
    }

    // BUSCAR INSTALAÇÃO POR ID
    static async buscarInstalacao(req, res) {
        const connection = await getConnection();
        try {
            const { id } = req.params;
            const instalacao = await InstalacaoModel.buscarPorId(id);

            if (!instalacao) {
                return res.status(404).json({ sucesso: false, erro: 'Instalação não encontrada' });
            }

            // BUSCA O NOME DO TÉCNICO (Baseado em image_d7031f.png)
            if (instalacao.tecnico) {
                const [tecResult] = await connection.execute(
                    `SELECT nome FROM tecnicos WHERE id_tecnico = ? LIMIT 1`,
                    [instalacao.tecnico]
                );
                if (tecResult.length > 0) {
                    instalacao.nome_tecnico = tecResult[0].nome;
                }
            }

            // BUSCA O NOME DA EMPRESA (Baseado em image_d70360.png)
            if (instalacao.id_empresa) {
                const [empResult] = await connection.execute(
                    `SELECT nome_empresa FROM empresa_clientes WHERE id_empresa = ? LIMIT 1`,
                    [instalacao.id_empresa]
                );
                if (empResult.length > 0) {
                    instalacao.nome_empresa = empResult[0].nome_empresa;
                }
            }

            return res.status(200).json({ sucesso: true, dados: instalacao });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' });
        } finally {
            connection.release();
        }
    }

    // ATUALIZAR INSTALAÇÃO E ENDEREÇO (FORMULÁRIO UNIFICADO)
    static async atualizarInstalacao(req, res) {
        const connection = await getConnection(); // Movido para o escopo principal do método para uso seguro de transações
        try {
            const { id } = req.params;
            const { tecnico, status } = req.body;

            const instalacao = await InstalacaoModel.buscarPorId(id);

            if (!instalacao) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Instalação não encontrada'
                });
            }

            if (tecnico !== undefined && tecnico !== null && tecnico !== "") {
                const [checaTecnico] = await connection.execute(
                    `SELECT status_tecnico FROM tecnicos WHERE id_tecnico = ? LIMIT 1`,
                    [tecnico]
                );

                if (checaTecnico.length === 0) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'O técnico selecionado não existe no sistema.'
                    });
                }

                if (checaTecnico[0].status_tecnico?.toUpperCase() !== 'ATIVO') {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Não é possível atribuir este técnico. O profissional está INATIVO.'
                    });
                }

                // AJUSTADO: Alinhado estritamente com os termos ENUM ('PENDENTE' e 'EM_ANDAMENTO')
                const statusAtual = (instalacao.status || "").toUpperCase();
                if (statusAtual === 'PENDENTE' && !status) {
                    req.body.status = 'EM_ANDAMENTO'; 
                }
            }

            // --- INÍCIO DA LÓGICA DE GERAÇÃO DE PLACAS EM LOTE ---
            // Iniciamos uma transação para garantir que se a criação das placas falhar, a instalação não mude de status erroneamente
            await connection.beginTransaction();

            // Executa a atualização padrão que você já tinha mapeada no Model
            await InstalacaoModel.atualizar(id, req.body);

            // Verificamos se o Admin está mudando o status para FINALIZADA
            if (status && status.toUpperCase() === 'FINALIZADA') {
                
                // 1. Buscamos se já existem placas geradas para esta instalação para evitar duplicidade (caso o admin salve como FINALIZADA duas vezes)
                const [placasExistentes] = await connection.execute(
                    `SELECT id_placa FROM placas_solares WHERE id_instalacao = ? LIMIT 1`,
                    [id]
                );

                if (placasExistentes.length === 0) {
                    // 2. Buscamos a quantidade e o modelo no último orçamento aceito daquela empresa
                    const [orcamento] = await connection.execute(
                        `SELECT quantidade_placas, modelo_placa 
                         FROM solicitacoes_orcamentos 
                         WHERE email_contato = (
                             SELECT email_principal FROM empresa_clientes WHERE id_empresa = ?
                         ) OR nome_empresa = (
                             SELECT nome_empresa FROM empresa_clientes WHERE id_empresa = ?
                         )
                         ORDER BY id_solicitacao DESC LIMIT 1`,
                        [instalacao.id_empresa, instalacao.id_empresa]
                    );

                    // Se encontrou o orçamento correspondente, faz a mágica acontecer
                    if (orcamento.length > 0) {
                        const { quantidade_placas, modelo_placa } = orcamento[0];
                        
                        // Mapeia a potência com base no ENUM escolhido no seu banco
                        let potenciaWatts = 550.00;
                        if (modelo_placa === 'JINKO_600W') potenciaWatts = 600.00;
                        if (modelo_placa === 'TRINA_575W') potenciaWatts = 575.00;
                        if (modelo_placa === 'LONGI_650W') potenciaWatts = 650.00;

                        // Loop automatizado: Cria as N placas diretamente no banco de uma vez só
                        for (let i = 1; i <= quantidade_placas; i++) {
                            await connection.execute(
                                `INSERT INTO placas_solares (id_empresa, id_instalacao, modelo, potencia_watts, status_placa, data_instalacao) 
                                 VALUES (?, ?, ?, ?, 'ATIVA', CURDATE())`,
                                [instalacao.id_empresa, id, modelo_placa, potenciaWatts]
                            );
                        }
                    }
                }
            }
            // --- FIM DA LÓGICA DE GERAÇÃO DE PLACAS ---

            const { logradouro, numero, bairro, cidade, estado, cep, complemento } = req.body;
            const idEnderecoSeguro = instalacao.id_endereco;

            if (
                idEnderecoSeguro && (
                    logradouro !== undefined ||
                    numero !== undefined ||
                    bairro !== undefined ||
                    cidade !== undefined ||
                    estado !== undefined ||
                    cep !== undefined ||
                    complemento !== undefined
                )
            ) {
                if (EnderecoModel && typeof EnderecoModel.atualizar === 'function') {
                    await EnderecoModel.atualizar(idEnderecoSeguro, {
                        logradouro, numero, bairro, cidade, estado, cep, complemento
                    });
                }
            }

            // Confirma todas as alterações no banco de dados com segurança
            await connection.commit();

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Instalação atualizada com sucesso'
            });

        } catch (error) {
            // Se qualquer coisa der errado no loop ou na query, desfaz as alterações evitando dados corrompidos
            await connection.rollback();
            console.error("Erro detectado no Controller:", error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno ao processar a atualização'
            });
        } finally {
            connection.release(); // Garante a liberação da conexão em qualquer cenário
        }
    }

    // CANCELAR SOLICITAÇÃO DE INSTALAÇÃO
    static async cancelarInstalacao(req, res) {
        try {
            const { id } = req.params;
            const instalacao = await InstalacaoModel.buscarPorId(id);

            if (!instalacao) {
                return res.status(404).json({ sucesso: false, erro: 'Instalação não encontrada' });
            }

            await InstalacaoModel.cancelar(id);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Solicitação de instalação cancelada'
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ sucesso: false, erro: 'Erro interno' });
        }
    }
}

export default InstalacaoController;