import { erro } from '../utils/resposta.js';

// Último middleware: captura o que escapou dos controllers.
export const errorMiddleware = (error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return erro(res, 400, 'O JSON enviado está malformado.');
    }

    console.error('Erro não tratado:', {
        mensagem: error.message,
        stack: error.stack,
        url: req.originalUrl,
        method: req.method
    });

    return erro(res, 500, 'Erro interno do servidor');
};
