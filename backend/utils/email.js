import nodemailer from 'nodemailer';

// Interruptor geral do envio de e-mails.
// Enquanto as variáveis de SMTP não estiverem no .env, deixe EMAIL_ENABLED
// ausente (ou 'false'): a API sobe normalmente e as rotas continuam
// funcionando — o e-mail apenas não sai, é registrado no console.
export function emailHabilitado() {
    return process.env.EMAIL_ENABLED === 'true';
}

// Criado sob demanda: em ESM os imports rodam antes do dotenv.config() do
// app.js, então ler process.env no topo do módulo devolveria undefined.
let transporter = null;

function obterTransporter() {
    if (!transporter) {
        const porta = Number(process.env.EMAIL_PORT) || 587;

        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: porta,
            secure: porta === 465,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    return transporter;
}

/**
 * Envia um e-mail via SMTP.
 * Retorna { enviado: false } quando o envio está desabilitado pela flag —
 * nesse caso o conteúdo é impresso no console (útil para copiar links em dev).
 * Lança exceção se o SMTP falhar.
 */
export async function enviarEmail({ para, assunto, texto, html }) {
    if (!emailHabilitado()) {
        console.log('--- [E-MAIL DESABILITADO] EMAIL_ENABLED != true ---');
        console.log(`Para: ${para}`);
        console.log(`Assunto: ${assunto}`);
        console.log(texto);
        console.log('---------------------------------------------------');
        return { enviado: false };
    }

    await obterTransporter().sendMail({
        from: process.env.EMAIL_FROM || 'Luminar <nao-responda@luminar.com.br>',
        to: para,
        subject: assunto,
        text: texto,
        html
    });

    return { enviado: true };
}
