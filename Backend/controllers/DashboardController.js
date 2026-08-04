import DashboardModel from '../models/DashboardModel.js';
import UsuarioModel from '../models/UsuarioModel.js'

function formatarData(data) {
    if (!data) return null;
    return new Date(data).toLocaleDateString('pt-BR');
}

class DashboardController {

    static async resumo(req, res) {
        try {
            await DashboardModel.gerarLeiturasSimuladas(req.usuario.id);

            const resumo = await DashboardModel.buscarResumo(req.usuario.id);

            return res.status(200).json({
                sucesso: true,
                dados: resumo
            });

        } catch (error) {
            console.error('Erro ao buscar resumo do dashboard:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor'
            });
        }
    }

    static async graficoMonitoramento(req, res) {
        try {
            const linhas = await DashboardModel.buscarGraficoMonitoramento(req.usuario.id);

            return res.status(200).json({
                sucesso: true,
                dados: {
                    labels: linhas.map((item) => item.mes),
                    valores: linhas.map((item) => item.energiaGerada)
                }
            });

        } catch (error) {
            console.error('Erro ao buscar gráfico do dashboard:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor'
            });
        }
    }

    static async alertas(req, res) {
        try {
            const alertas = await DashboardModel.buscarAlertas(req.usuario.id);

            const dados = alertas.map((alerta) => {
                // Mapeador dinâmico de títulos por tipo do ENUM
                const titulos = {
                    'QUEDA_EFICIENCIA': 'Queda de Eficiência',
                    'TEMPERATURA_ALTA': 'Temperatura Elevada',
                    'FALHA_GERACAO': 'Falha Crítica na Geração',
                    'PLACA_INATIVA': 'Módulo Solar Inativo'
                };

                return {
                    id_placa: alerta.id_placa,
                    tipo: alerta.tipo_alerta, // repassa o enum puro (QUEDA_EFICIENCIA, etc)
                    nivel: alerta.nivel,       // BAIXO, MEDIO, ALTO, CRITICO
                    titulo: titulos[alerta.tipo_alerta] || 'Aviso no Sistema',
                    descricao: alerta.descricao,
                    data_hora: alerta.data_hora
                };
            });

            return res.status(200).json({
                sucesso: true,
                dados
            });

        } catch (error) {
            console.error('Erro ao buscar alertas do dashboard:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor'
            });
        }
    }

    static async financeiro(req, res) {
        try {
            const financeiro = await DashboardModel.buscarFinanceiro(req.usuario.id);
            const historico = await DashboardModel.buscarHistoricoFinanceiro(req.usuario.id);

            return res.status(200).json({
                sucesso: true,
                dados: {
                    ...financeiro,
                    ultimoPagamento: formatarData(financeiro.ultimoPagamento),
                    proximoVencimento: formatarData(financeiro.proximoVencimento),
                    historico: historico.map((item) => ({
                        numero_parcela: item.numero_parcela,
                        status_pagamento: item.status_pagamento,
                        forma_pagamento: item.forma_pagamento,
                        valor: Number(item.valor || 0),
                        data_vencimento: formatarData(item.data_vencimento),
                        data_pagamento: formatarData(item.data_pagamento)
                    }))
                }
            });

        } catch (error) {
            console.error('Erro ao buscar financeiro do dashboard:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor'
            });
        }
    }





    // Substitua o método antigo por este no seu DashboardController.js
    static async obterDadosGerais(req, res) {
        try {
            // Invoca o método que acabamos de criar no Model passando o ID do token do usuário
            const resultado = await DashboardModel.buscarDadosGeraisDoCliente(req.usuario.id);

            if (!resultado.instalado) {
                return res.status(200).json({ 
                    sucesso: true, 
                    instalado: false, 
                    mensagem: resultado.mensagem 
                });
            }

            return res.status(200).json({
                sucesso: true,
                instalado: true,
                dados: resultado.dados
            });

        } catch (error) {
            console.error('Erro ao obter dados gerais do dashboard:', error);
            return res.status(500).json({ 
                sucesso: false, 
                erro: 'Erro interno ao processar dashboard' 
            });
        }
    }

}

export default DashboardController;
