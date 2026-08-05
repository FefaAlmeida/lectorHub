import EmpresaModel from '../models/EmpresaModel.js';
import UsuarioModel from '../models/UsuarioModel.js';
import EnderecoModel from '../models/EnderecoModel.js';

class EmpresaController {

    // CRIAR EMPRESA
    static async criarEmpresa(req, res) {
        try {

            const {
                nome_empresa,
                cnpj,
                telefone_principal,
                email_principal
            } = req.body;

            if (
                !nome_empresa ||
                !cnpj ||
                !telefone_principal ||
                !email_principal
            ) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Todos os campos são obrigatórios'
                });
            }

            const usuario = await UsuarioModel.buscarPorId(req.usuario.id);

            if (!usuario) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuário não encontrado'
                });
            }

            if (usuario.id_empresa) {
                return res.status(409).json({
                    sucesso: false,
                    erro: 'Você já possui uma empresa cadastrada'
                });
            }

            const empresaExistente = await EmpresaModel.buscarPorCnpj(cnpj);

            if (empresaExistente) {
                return res.status(409).json({
                    sucesso: false,
                    erro: 'Já existe uma empresa cadastrada com esse CNPJ.'
                });
            }

            const telefoneExistente = await EmpresaModel.buscarPorTelefone(telefone_principal); 
            if (telefoneExistente) {
                return res.status(409).json({
                    sucesso: false,
                    erro: 'Já existe uma empresa cadastrada com este telefone principal.'
                });
            }

            const emailExistente = await EmpresaModel.buscarPorEmail(email_principal.trim().toLowerCase());
            if (emailExistente) {
                return res.status(409).json({
                    sucesso: false,
                    erro: 'Este e-mail principal já está em uso por outra empresa.'
                });
            }

            const idEmpresa = await EmpresaModel.criar({
                nome_empresa: nome_empresa.trim(),
                cnpj,
                telefone_principal,
                email_principal: email_principal.trim().toLowerCase()
            });

            await UsuarioModel.atualizar(req.usuario.id, {
                id_empresa: idEmpresa
            });

            return res.status(201).json({
                sucesso: true,
                mensagem: 'Empresa cadastrada com sucesso',
                dados: {
                    id_empresa: idEmpresa
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

    // LISTAR EMPRESAS
    static async listarEmpresas(req, res) {
        try {

            const pagina = parseInt(req.query.pagina) || 1;
            const limite = parseInt(req.query.limite) || 10;

            const resultado = await EmpresaModel.listarTodas(
                pagina,
                limite
            );

            return res.status(200).json({
                sucesso: true,
                dados: resultado.empresas,
                paginacao: resultado
            });

        } catch (error) {

            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno'
            });
        }
    }

    // BUSCAR EMPRESA POR ID
    static async buscarEmpresa(req, res) {
        try {

            const { id } = req.params;

            const empresa = await EmpresaModel.buscarPorId(id);

            if (!empresa) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Empresa não encontrada'
                });
            }

            return res.status(200).json({
                sucesso: true,
                dados: empresa
            });

        } catch (error) {

            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno'
            });
        }
    }

    // BUSCAR MINHA EMPRESA
    static async minhaEmpresa(req, res) {
        try {

            const usuario = await UsuarioModel.buscarPorId(req.usuario.id);

            if (!usuario) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuário não encontrado'
                });
            }

            if (!usuario.id_empresa) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Nenhuma empresa vinculada'
                });
            }

            const empresa = await EmpresaModel.buscarPorId(
                usuario.id_empresa
            );

            return res.status(200).json({
                sucesso: true,
                dados: empresa
            });

        } catch (error) {

            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno'
            });
        }
    }

    // LISTAR ENDEREÇOS DA EMPRESA DO USUÁRIO LOGADO
    static async meusEnderecos(req, res) {
        try {
            const usuario = await UsuarioModel.buscarPorId(req.usuario.id);

            if (!usuario) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuário não encontrado'
                });
            }

            if (!usuario.id_empresa) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Nenhuma empresa vinculada'
                });
            }

            const enderecos = await EnderecoModel.listarPorEmpresa(usuario.id_empresa);

            return res.status(200).json({
                sucesso: true,
                dados: enderecos
            });

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno'
            });
        }
    }

    // CADASTRAR ENDEREÇO DA EMPRESA DO USUÁRIO LOGADO
    static async cadastrarEndereco(req, res) {
        try {
            const {
                logradouro,
                numero,
                bairro,
                cidade,
                estado,
                cep,
                complemento
            } = req.body;

            if (
                !logradouro ||
                !numero ||
                !bairro ||
                !cidade ||
                !estado ||
                !cep
            ) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Preencha todos os campos obrigatórios'
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
                    erro: 'Cadastre uma empresa antes de cadastrar endereços'
                });
            }

            const cepNormalizado = cep.replace(/\D/g, '');
            const estadoNormalizado = estado.trim().toUpperCase();

            if (cepNormalizado.length !== 8) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'CEP deve conter 8 números'
                });
            }

            if (estadoNormalizado.length !== 2) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Estado deve conter 2 letras'
                });
            }

            const idEndereco = await EnderecoModel.criar({
                id_empresa: usuario.id_empresa,
                logradouro: logradouro.trim(),
                numero: numero.trim(),
                bairro: bairro.trim(),
                cidade: cidade.trim(),
                estado: estadoNormalizado,
                cep: cepNormalizado,
                complemento: complemento ? complemento.trim() : null
            });

            return res.status(201).json({
                sucesso: true,
                mensagem: 'Endereço cadastrado com sucesso',
                dados: {
                    id_endereco: idEndereco
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

    // ATUALIZAR ENDEREÇO DA EMPRESA DO USUÁRIO LOGADO
    static async atualizarEndereco(req, res) {
        try {
            const { id } = req.params;
            const {
                logradouro,
                numero,
                bairro,
                cidade,
                estado,
                cep,
                complemento
            } = req.body;

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
                    erro: 'Nenhuma empresa vinculada'
                });
            }

            const endereco = await EnderecoModel.buscarPorId(id);

            if (!endereco) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Endereço não encontrado'
                });
            }

            // Garante que o endereço pertence à empresa do usuário logado
            if (endereco.id_empresa !== usuario.id_empresa) {
                return res.status(403).json({
                    sucesso: false,
                    erro: 'Você não tem permissão para editar este endereço'
                });
            }

            if (
                !logradouro ||
                !numero ||
                !bairro ||
                !cidade ||
                !estado ||
                !cep
            ) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Preencha todos os campos obrigatórios'
                });
            }

            const cepNormalizado = cep.replace(/\D/g, '');
            const estadoNormalizado = estado.trim().toUpperCase();

            if (cepNormalizado.length !== 8) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'CEP deve conter 8 números'
                });
            }

            if (estadoNormalizado.length !== 2) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Estado deve conter 2 letras'
                });
            }

            await EnderecoModel.atualizar(id, {
                logradouro: logradouro.trim(),
                numero: numero.trim(),
                bairro: bairro.trim(),
                cidade: cidade.trim(),
                estado: estadoNormalizado,
                cep: cepNormalizado,
                complemento: complemento ? complemento.trim() : null
            });

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Endereço atualizado com sucesso'
            });

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno'
            });
        }
    }

    // ATUALIZAR EMPRESA
    static async atualizarEmpresa(req, res) {
        try {

            const { id } = req.params;
            const {
                nome_empresa,
                telefone_principal
            } = req.body;

            const empresa = await EmpresaModel.buscarPorId(id);

            if (!empresa) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Empresa não encontrada'
                });
            }

            const usuario = await UsuarioModel.buscarPorId(req.usuario.id);

            if (!usuario) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Usuário não encontrado'
                });
            }

            if (
                req.usuario.tipo_usuario !== 'ADMIN' &&
                usuario.id_empresa !== Number(id)
            ) {
                return res.status(403).json({
                    sucesso: false,
                    erro: 'Você não tem permissão para atualizar esta empresa'
                });
            }

            const dadosAtualizacao = {};

            if (nome_empresa !== undefined) {
                if (!nome_empresa.trim()) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Nome da empresa é obrigatório'
                    });
                }

                const nomeEmpresaNormalizado = nome_empresa.trim();

                if (nomeEmpresaNormalizado !== empresa.nome_empresa) {
                    dadosAtualizacao.nome_empresa = nomeEmpresaNormalizado;
                }
            }

            if (telefone_principal !== undefined) {
                const telefone = telefone_principal.replace(/\D/g, '');

                if (telefone.length < 10 || telefone.length > 11) {
                    return res.status(400).json({
                        sucesso: false,
                        erro: 'Telefone principal deve conter 10 ou 11 números'
                    });
                }

                const telefoneAtual = String(empresa.telefone_principal || '').replace(/\D/g, '');

                if (telefone !== telefoneAtual) {
                    dadosAtualizacao.telefone_principal = telefone;
                }
            }

            if (Object.keys(dadosAtualizacao).length === 0) {
                return res.status(200).json({
                    sucesso: true,
                    mensagem: 'Nenhuma alteração necessária'
                });
            }

            await EmpresaModel.atualizarDadosEditaveis(
                id,
                dadosAtualizacao
            );

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Empresa atualizada'
            });

        } catch (error) {

            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno'
            });
        }
    }

    // INATIVAR EMPRESA
    static async inativarEmpresa(req, res) {
        try {

            const { id } = req.params;

            const empresa = await EmpresaModel.buscarPorId(id);

            if (!empresa) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Empresa não encontrada'
                });
            }

            await EmpresaModel.inativar(id);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Empresa inativada'
            });

        } catch (error) {

            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno'
            });
        }
    }

    // REATIVAR EMPRESA
    static async reativarEmpresa(req, res) {
        try {

            const { id } = req.params;

            const empresa = await EmpresaModel.buscarPorId(id);

            if (!empresa) {
                return res.status(404).json({
                    sucesso: false,
                    erro: 'Empresa não encontrada'
                });
            }

            if (empresa.status_empresa === 'ATIVA') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Esta empresa já está ativa'
                });
            }

            await EmpresaModel.reativar(id);

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Empresa reativada com sucesso'
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno'
            });
        }
    }

}

export default EmpresaController;