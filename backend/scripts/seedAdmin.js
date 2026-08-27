// Cria (ou atualiza a senha de) o usuário administrador a partir do .env.
// Uso: npm run seed:admin
import 'dotenv/config';
import UsuarioModel from '../models/UsuarioModel.js';

const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const senha = process.env.ADMIN_PASSWORD || '';
const nome = process.env.ADMIN_NOME || 'Administrador';

if (!email || senha.length < 8) {
    console.error('Defina ADMIN_EMAIL e ADMIN_PASSWORD (mínimo 8 caracteres) no .env.');
    process.exit(1);
}

try {
    const existente = await UsuarioModel.buscarPorEmail(email);

    if (existente) {
        await UsuarioModel.atualizar(existente.id, { senha, tipo: 'admin' });
        console.log(`Admin ${email} já existia: senha atualizada e tipo garantido como admin.`);
    } else {
        const id = await UsuarioModel.criar({ nome, email, senha, telefone: null, tipo: 'admin' });
        console.log(`Admin ${email} criado (id ${id}).`);
    }
    process.exit(0);
} catch (error) {
    console.error('Erro ao criar admin:', error.message);
    process.exit(1);
}
