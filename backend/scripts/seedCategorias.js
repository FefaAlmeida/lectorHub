// Carrega a lista inicial de categorias de livro.
// Uso: npm run seed:categorias
//
// Idempotente: categoria já existente é preservada como está (inclusive as que
// a migration 010 criou a partir dos livros antigos, que nascem sem descrição —
// essas só ganham a descrição padrão, sem perder nada).
import 'dotenv/config';
import { categoriaModel } from '../models/CategoriaModel.js';

const CATEGORIAS = [
    ['Romance', 'Histórias centradas em relações e conflitos pessoais'],
    ['Ficção', 'Narrativas ficcionais em geral'],
    ['Ficção Científica', 'Futuro, tecnologia e especulação científica'],
    ['Fantasia', 'Mundos imaginários, magia e mitologia'],
    ['Distopia', 'Sociedades futuras opressoras e crítica social'],
    ['Suspense', 'Tensão e mistério até a última página'],
    ['Terror', 'Narrativas de medo e sobrenatural'],
    ['Policial', 'Crimes, investigação e mistério'],
    ['Aventura', 'Jornadas, exploração e ação'],
    ['Clássico', 'Obras consagradas da literatura'],
    ['Infantil', 'Leitura para crianças'],
    ['Juvenil', 'Leitura para adolescentes'],
    ['Quadrinhos', 'HQs, mangás e graphic novels'],
    ['Poesia', 'Obras em verso'],
    ['Teatro', 'Textos dramatúrgicos'],
    ['Biografia', 'Relatos de vida e memórias'],
    ['História', 'Fatos e períodos históricos'],
    ['Filosofia', 'Pensamento e reflexão filosófica'],
    ['Psicologia', 'Comportamento e saúde mental'],
    ['Autoajuda', 'Desenvolvimento pessoal'],
    ['Educação', 'Didáticos e material de estudo'],
    ['Ciências', 'Divulgação científica'],
    ['Tecnologia', 'Computação, engenharia e inovação'],
    ['Negócios', 'Gestão, economia e empreendedorismo'],
    ['Direito', 'Obras jurídicas'],
    ['Saúde', 'Medicina, nutrição e bem-estar'],
    ['Religião', 'Espiritualidade e textos religiosos'],
    ['Arte', 'Artes visuais, música e design'],
    ['Culinária', 'Receitas e gastronomia'],
    ['Geral', 'Sem categoria específica']
];

try {
    let criadas = 0;
    let descritas = 0;
    let mantidas = 0;

    for (const [nome, descricao] of CATEGORIAS) {
        const existente = await categoriaModel.buscarPorNome(nome);

        if (!existente) {
            await categoriaModel.criar({ nome, descricao });
            criadas++;
        } else if (!existente.descricao) {
            await categoriaModel.atualizar(existente.id, { descricao });
            descritas++;
        } else {
            mantidas++;
        }
    }

    console.log(
        `Categorias: ${criadas} criadas, ${descritas} com descrição preenchida, ${mantidas} já estavam completas.`
    );
    process.exit(0);
} catch (error) {
    console.error('Erro ao carregar categorias:', error.message);
    process.exit(1);
}
