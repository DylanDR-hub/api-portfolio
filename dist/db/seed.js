"use strict";
// db/seed.ts
// Script de seed corrigé pour Drizzle
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const schema = __importStar(require("./schema"));
const bcrypt_1 = __importDefault(require("bcrypt"));
async function main() {
    console.log('🌱 Début du seed...');
    try {
        // Test de connexion
        console.log('🔌 Test de connexion à la base de données...');
        const testResult = await index_1.db.execute('SELECT NOW()');
        console.log('✅ Connexion réussie');
        // ===== USER ADMIN =====
        console.log('👤 Création de l\'utilisateur admin...');
        const hashedPassword = await bcrypt_1.default.hash('Admin123!', 10);
        const [admin] = await index_1.db.insert(schema.users).values({
            email: 'admin@dr-digital.fr',
            password: hashedPassword,
            firstName: 'Dylan',
            lastName: 'DR',
            role: 'ADMIN',
        }).returning();
        console.log('✅ Utilisateur admin créé:', admin.email);
        console.log('📧 Email: admin@dr-digital.fr');
        console.log('🔑 Password: Admin123!');
        console.log('');
        // ===== ABOUT SECTION =====
        console.log('📝 Création de la section About...');
        const [aboutRecord] = await index_1.db.insert(schema.about).values({
            title: "À propos de moi",
            teaser: "Developpeur dévoué avec une approche créative.",
            hobbies: "En dehors du code, j'aime le sport, tester des nouvelles technologie, lire. J'aime également m'instruire sur le monde en général.",
        }).returning();
        console.log('✅ About créé');
        // Courses
        await index_1.db.insert(schema.aboutCourses).values([
            {
                aboutId: aboutRecord.id,
                content: "Cela fait plus de 4ans que je développe des projets web, qui m'ont permis de transposer une idée en une véritable compétence. Ces expériences m'ont enseignés la conception de solutions utiles et adaptées à des besoins réels.",
                order: 1
            },
            {
                aboutId: aboutRecord.id,
                content: "L'expérience utilisateur et la performance sont des éléments auxquels j'apporte une attention particulière, en cherchant toujours à allier créativité, rigueur et technique. Ma finalité étant de proposer des interfaces claires, efficaces et agréable à utiliser.",
                order: 2
            },
            {
                aboutId: aboutRecord.id,
                content: "Curieux et attentif aux évolutions du secteur, je me forme en continu aux nouvelles pratiques et technologie.C'est en maintenant une veille active que je peut apporter des idées actuelles et pertinentes aux projets sur lesquels je m'investis.",
                order: 3
            }
        ]);
        // Values
        await index_1.db.insert(schema.aboutValues).values([
            { aboutId: aboutRecord.id, value: "Code propre et maintenable", order: 1 },
            { aboutId: aboutRecord.id, value: "Expérience utilisateur optimale", order: 2 },
            { aboutId: aboutRecord.id, value: "Performance et accessibilité", order: 3 },
            { aboutId: aboutRecord.id, value: "Apprentissage continu", order: 4 }
        ]);
        // Approaches
        await index_1.db.insert(schema.aboutApproaches).values([
            { aboutId: aboutRecord.id, approach: "Clarification du contexte", order: 1 },
            { aboutId: aboutRecord.id, approach: "Maquettes et première version", order: 2 },
            { aboutId: aboutRecord.id, approach: "Vérifications et améliorations continue", order: 3 },
            { aboutId: aboutRecord.id, approach: "Organisation et partage.", order: 4 }
        ]);
        // Interests
        await index_1.db.insert(schema.aboutInterests).values([
            { aboutId: aboutRecord.id, interest: "Développement Web", order: 1 },
            { aboutId: aboutRecord.id, interest: "Intelligence Artificielle", order: 2 },
            { aboutId: aboutRecord.id, interest: "UX/UI Design", order: 3 }
        ]);
        console.log('✅ Section About complète créée');
        // ===== CATEGORIES =====
        console.log('📂 Création des catégories...');
        await index_1.db.insert(schema.categories).values([
            { slug: 'all', label: 'Tous les projets' },
            { slug: 'web', label: 'Applications Web' },
            { slug: 'mobile', label: 'Applications Mobile' },
            { slug: 'saas', label: 'SaaS' },
            { slug: 'ai', label: 'Intelligence Artificielle' }
        ]);
        console.log('✅ Catégories créées');
        // ===== SKILL CATEGORIES =====
        console.log('🛠️  Création des compétences...');
        const [frontendCat] = await index_1.db.insert(schema.skillCategories).values({
            slug: 'frontend',
            name: 'Frontend',
            icon: 'Code',
            description: 'Création d\'interfaces utilisateur modernes et réactives',
            color: 'bg-blue-500',
            order: 1,
        }).returning();
        await index_1.db.insert(schema.skills).values([
            { categoryId: frontendCat.id, name: 'React' },
            { categoryId: frontendCat.id, name: 'TypeScript' },
            { categoryId: frontendCat.id, name: 'Next.js' },
            { categoryId: frontendCat.id, name: 'Tailwind CSS' },
        ]);
        const [backendCat] = await index_1.db.insert(schema.skillCategories).values({
            slug: 'backend',
            name: 'Backend',
            icon: 'Database',
            description: 'Développement d\'APIs robustes et de bases de données',
            color: 'bg-green-500',
            order: 2,
        }).returning();
        await index_1.db.insert(schema.skills).values([
            { categoryId: backendCat.id, name: 'Node.js' },
            { categoryId: backendCat.id, name: 'PostgreSQL' },
            { categoryId: backendCat.id, name: 'Drizzle ORM' },
            { categoryId: backendCat.id, name: 'REST APIs' },
        ]);
        console.log('✅ Compétences créées');
        // ===== EXPERIENCES =====
        console.log('💼 Création des expériences...');
        const [exp1] = await index_1.db.insert(schema.experiences).values({
            slug: 'freelance-fullstack',
            type: 'work',
            title: 'Développeur Full Stack',
            company: 'Freelance',
            location: 'Malaunay, France',
            period: '2022 - Aujourd\'hui',
            description: 'Développement et maintenance d\'applications web pour des clients variés dans différents secteurs.',
            order: 1,
        }).returning();
        await index_1.db.insert(schema.experienceTechnologies).values([
            { experienceId: exp1.id, technology: 'React' },
            { experienceId: exp1.id, technology: 'Next.js' },
            { experienceId: exp1.id, technology: 'Drizzle' },
        ]);
        await index_1.db.insert(schema.experienceAchievements).values([
            { experienceId: exp1.id, achievement: 'Conception de maquettes graphiques pour les applications web', order: 1 },
            { experienceId: exp1.id, achievement: 'Conceptions de sites web modernes avec Next.js', order: 2 },
        ]);
        console.log('✅ Expériences créées');
        // ===== PROJECT EXEMPLE =====
        console.log('🚀 Création d\'un projet exemple...');
        const [project] = await index_1.db.insert(schema.projects).values({
            slug: 'massalikululum',
            title: 'Plateforme formation & E-commerce',
            description: 'Application e-commerce complète avec gestion des commandes, paiements et administration.',
            longDescription: 'Développement d\'une plateforme e-commerce complète incluant un front-end React avec Next.js, un backend Strapi, intégration Stripe pour les paiements, et un panel d\'administration complet.',
            category: 'web',
            status: 'completed',
            featured: true,
            image: '/images/massalikululum/home.png',
            demoUrl: 'https://www.massalikululum.com',
            githubUrl: null,
            year: 2025,
            duration: '6 mois',
            team: '1 dev + 1 designer',
        }).returning();
        await index_1.db.insert(schema.projectTechnologies).values([
            { projectId: project.id, technology: 'React' },
            { projectId: project.id, technology: 'Next.js' },
            { projectId: project.id, technology: 'Stripe' },
        ]);
        await index_1.db.insert(schema.projectChallenges).values([
            { projectId: project.id, challenge: 'Gestion des états complexes pour le panier', order: 1 },
            { projectId: project.id, challenge: 'Intégration sécurisée des paiements avec Stripe', order: 2 },
        ]);
        await index_1.db.insert(schema.projectFeatures).values([
            { projectId: project.id, feature: 'Catalogue de produits avec filtres', order: 1 },
            { projectId: project.id, feature: 'Système de panier persistant', order: 2 },
        ]);
        console.log('✅ Projet créé');
        console.log('');
        console.log('🎉 Seed terminé avec succès !');
        console.log('');
        console.log('📊 Résumé :');
        console.log('   - 1 utilisateur admin');
        console.log('   - 1 section About complète');
        console.log('   - 2 catégories de compétences');
        console.log('   - 1 expérience professionnelle');
        console.log('   - 1 projet portfolio');
        console.log('   - 5 catégories de projets');
        console.log('');
    }
    catch (error) {
        console.error('❌ Erreur lors du seed:', error);
        throw error;
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    console.log('🔌 Connexion fermée');
    await (0, index_1.closeDb)();
});
