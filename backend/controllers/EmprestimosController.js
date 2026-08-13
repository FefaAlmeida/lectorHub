import EmprestimoModel from "../models/EmprestimoModel.js";

class EmprestimoController {

    // 1. Registrar um novo empréstimo
    static async registrarEmprestimo(req, res) {
        try {
            const dadosEmprestimo = req.body;

            const resultado =
                await EmprestimoModel.registrarEmprestimo(dadosEmprestimo);

            return res.status(201).json({
                sucesso: true,
                mensagem: "Empréstimo registrado com sucesso.",
                dados: resultado
            });

        } catch (error) {
            console.error(
                "Erro ao registrar empréstimo:",
                error
            );

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao registrar empréstimo."
            });
        }
    }


    // 2. Buscar total de livros emprestados
    static async totalEmprestados(req, res) {
        try {
            const total =
                await EmprestimoModel.totalEmprestados();

            return res.status(200).json({
                sucesso: true,
                total: total
            });

        } catch (error) {
            console.error(
                "Erro ao buscar total de empréstimos:",
                error
            );

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao buscar total de empréstimos."
            });
        }
    }
    


    // 3. Buscar último empréstimo de um usuário
    static async buscarUltimoEmprestimo(req, res) {
        try {
            const { id_usuario } = req.params;

            const emprestimo =
                await EmprestimoModel.buscarUltimoEmprestimo(
                    id_usuario
                );

            if (!emprestimo) {
                return res.status(404).json({
                    sucesso: false,
                    mensagem: "Nenhum empréstimo encontrado para este usuário."
                });
            }

            return res.status(200).json({
                sucesso: true,
                dados: emprestimo
            });

        } catch (error) {
            console.error(
                "Erro ao buscar último empréstimo:",
                error
            );

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao buscar último empréstimo."
            });
        }
    }


    // 4. Verificar se um empréstimo específico está atrasado
    static async livroEmAtraso(req, res) {
        try {
            const { id_emprestimo } = req.params;

            const emprestimo =
                await EmprestimoModel.livroEmAtraso(
                    id_emprestimo
                );

            if (!emprestimo) {
                return res.status(200).json({
                    sucesso: true,
                    emAtraso: false,
                    dados: null
                });
            }

            return res.status(200).json({
                sucesso: true,
                emAtraso: true,
                dados: emprestimo
            });

        } catch (error) {
            console.error(
                "Erro ao verificar atraso do empréstimo:",
                error
            );

            return res.status(500).json({
                sucesso: false,
                mensagem: "Erro ao verificar atraso do empréstimo."
            });
        }
    }
}

export default EmprestimoController;