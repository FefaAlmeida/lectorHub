import bcrypt from 'bcryptjs';
import UsuarioModel from '../models/UsuarioModel.js';

/**
 * Controller Educativo para Demonstração de Criptografia de Senhas
 * 
 * Este controller demonstra como implementar criptografia de senhas
 * de forma segura usando bcryptjs.
 */
class CriptografiaController {
    
    /**
     * POST /criptografia/cadastrar-usuario
     * 
     * Demonstra o processo completo de cadastro com criptografia:
     * 1. Validação dos dados
     * 2. Verificação se usuário já existe
     * 3. Criptografia da senha
     * 4. Salvamento no banco de dados
     */
    static async cadastrarUsuario(req, res) {
        try {
            const { nome, email, senha, tipo } = req.body;
            
            console.log('🔐 DEMONSTRAÇÃO DE CRIPTOGRAFIA DE SENHAS');
            console.log('==========================================');
            console.log('');
            
            // 1. VALIDAÇÕES BÁSICAS
            console.log('1️⃣ VALIDAÇÕES BÁSICAS');
            console.log('----------------------');
            
            if (!nome || nome.trim() === '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nome obrigatório',
                    mensagem: 'O nome é obrigatório',
                    exemplo: 'Como validar dados de entrada'
                });
            }

            if (!email || email.trim() === '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Email obrigatório',
                    mensagem: 'O email é obrigatório',
                    exemplo: 'Sempre validar campos obrigatórios'
                });
            }

            if (!senha || senha.trim() === '') {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Senha obrigatória',
                    mensagem: 'A senha é obrigatória',
                    exemplo: 'Senhas são críticas para segurança'
                });
            }

            // Validações de formato
            if (nome.length < 2) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Nome muito curto',
                    mensagem: 'O nome deve ter pelo menos 2 caracteres',
                    exemplo: 'Validação de tamanho mínimo'
                });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Email inválido',
                    mensagem: 'Formato de email inválido',
                    exemplo: 'Validação de formato com regex'
                });
            }

            if (senha.length < 6) {
                return res.status(400).json({
                    sucesso: false,
                    erro: 'Senha muito curta',
                    mensagem: 'A senha deve ter pelo menos 6 caracteres',
                    exemplo: 'Senhas devem ter tamanho mínimo para segurança'
                });
            }

            console.log('✅ Validações passaram!');
            console.log('');

            // 2. VERIFICAR SE USUÁRIO JÁ EXISTE
            console.log('2️⃣ VERIFICAÇÃO DE USUÁRIO EXISTENTE');
            console.log('-----------------------------------');
            
            const usuarioExistente = await UsuarioModel.buscarPorEmail(email);
            if (usuarioExistente) {
                console.log('❌ Usuário já existe no banco de dados');
                return res.status(409).json({
                    sucesso: false,
                    erro: 'Email já cadastrado',
                    mensagem: 'Este email já está sendo usado por outro usuário',
                    exemplo: 'Sempre verificar duplicatas antes de criar'
                });
            }

            console.log('✅ Email disponível!');
            console.log('');

            // 3. DEMONSTRAÇÃO DA CRIPTOGRAFIA
            console.log('3️⃣ DEMONSTRAÇÃO DA CRIPTOGRAFIA');
            console.log('-------------------------------');
            
            console.log('🔍 Senha original:', senha);
            console.log('⚠️  NUNCA armazene senhas em texto puro!');
            console.log('');

            // Gerar salt e hash da senha
            console.log('🔐 Gerando hash da senha com bcrypt...');
            const saltRounds = 10; // Número de rounds para o salt
            console.log(`📊 Salt rounds: ${saltRounds} (recomendado: 10-12)`);
            
            const senhaHash = await bcrypt.hash(senha, saltRounds);
            console.log('✅ Hash gerado com sucesso!');
            console.log('');
            
            console.log('📋 COMPARAÇÃO:');
            console.log(`   Senha original: ${senha}`);
            console.log(`   Senha hash:     ${senhaHash}`);
            console.log(`   Tamanho hash:   ${senhaHash.length} caracteres`);
            console.log('');

            // 4. PREPARAR DADOS PARA SALVAMENTO
            console.log('4️⃣ PREPARAÇÃO DOS DADOS');
            console.log('------------------------');
            
            const dadosUsuario = {
                nome: nome.trim(),
                email: email.trim().toLowerCase(),
                senha: senhaHash, // ← SENHA CRIPTOGRAFADA
                tipo_usuario: UsuarioModel.normalizarTipoUsuario(tipo)
            };

            console.log('📦 Dados preparados para o banco:');
            console.log('   Nome:', dadosUsuario.nome);
            console.log('   Email:', dadosUsuario.email);
            console.log('   Tipo:', dadosUsuario.tipo_usuario);
            console.log('   Senha: [CRIPTOGRAFADA - não visível]');
            console.log('');

            // 5. SALVAR NO BANCO DE DADOS
            console.log('5️⃣ SALVAMENTO NO BANCO DE DADOS');
            console.log('-------------------------------');
            
            const usuarioId = await UsuarioModel.criar(dadosUsuario);
            console.log('✅ Usuário salvo com sucesso!');
            console.log(`🆔 ID gerado: ${usuarioId}`);
            console.log('');

            // 6. DEMONSTRAÇÃO DE VERIFICAÇÃO
            console.log('6️⃣ DEMONSTRAÇÃO DE VERIFICAÇÃO');
            console.log('------------------------------');
            
            // Simular verificação de login
            const senhaCorreta = await bcrypt.compare(senha, senhaHash);
            const senhaIncorreta = await bcrypt.compare('senhaerrada', senhaHash);
            
            console.log('🔍 Testando verificação de senha:');
            console.log(`   Senha correta: ${senhaCorreta ? '✅' : '❌'}`);
            console.log(`   Senha incorreta: ${senhaIncorreta ? '✅' : '❌'}`);
            console.log('');

            // Resposta de sucesso
            res.status(201).json({
                sucesso: true,
                mensagem: 'Usuário cadastrado com sucesso!',
                dados: {
                    id: usuarioId,
                    nome: dadosUsuario.nome,
                    email: dadosUsuario.email,
                    tipo_usuario: dadosUsuario.tipo_usuario
                },
                demonstracao: {
                    criptografia: {
                        algoritmo: 'bcrypt',
                        saltRounds: saltRounds,
                        tamanhoHash: senhaHash.length,
                        exemplo: 'Senha criptografada com segurança'
                    },
                    seguranca: {
                        senhaOriginal: 'NUNCA armazenada',
                        senhaHash: 'Armazenada com segurança',
                        verificacao: 'Usando bcrypt.compare()'
                    }
                }
            });

        } catch (error) {
            console.error('❌ Erro ao cadastrar usuário:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível processar o cadastro',
                exemplo: 'Sempre tratar erros adequadamente'
            });
        }
    }

    /**
     * GET /criptografia/info
     * 
     * Retorna informações sobre criptografia de senhas
     */
    static async obterInfoCriptografia(req, res) {
        try {
            res.status(200).json({
                sucesso: true,
                dados: {
                    titulo: 'Informações sobre Criptografia de Senhas',
                    algoritmo: 'bcrypt',
                    descricao: 'Algoritmo de hash unidirecional baseado em Blowfish',
                    caracteristicas: [
                        'Hash unidirecional (não pode ser revertido)',
                        'Salt automático para prevenir ataques de dicionário',
                        'Configurável (salt rounds)',
                        'Resistente a ataques de força bruta',
                        'Amplamente testado e confiável'
                    ],
                    recomendacoes: {
                        saltRounds: '10-12 (balance entre segurança e performance)',
                        tamanhoMinimoSenha: '6-8 caracteres',
                        complexidadeSenha: 'Letras, números e símbolos',
                        nuncaArmazenar: 'Senhas em texto puro',
                        sempreUsar: 'bcrypt.compare() para verificação'
                    },
                    exemploUso: {
                        hash: 'const hash = await bcrypt.hash(senha, 10)',
                        compare: 'const valido = await bcrypt.compare(senha, hash)'
                    }
                }
            });
        } catch (error) {
            console.error('Erro ao obter informações:', error);
            res.status(500).json({
                sucesso: false,
                erro: 'Erro interno do servidor',
                mensagem: 'Não foi possível obter as informações'
            });
        }
    }
}

export default CriptografiaController;

