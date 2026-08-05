import PagamentoModel from '../models/PagamentoModel.js';

class PagamentoController {

    static async pagar(req, res) {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'ID do pagamento inválido'
                });
            }

            const resultado = await PagamentoModel.pagar(id, req.usuario.id);

            if (!resultado.sucesso) {
                return res.status(resultado.status).json({
                    sucesso: false,
                    erro: resultado.erro
                });
            }

            return res.status(200).json({
                sucesso: true,
                mensagem: 'Pagamento realizado com sucesso'
            });

        } catch (error) {
            console.error('Erro ao processar pagamento:', error);
            return res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor'
            });
        }
    }
}

export default PagamentoController;
