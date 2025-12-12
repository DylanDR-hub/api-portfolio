"use strict";
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
// routes/projects.ts (exemple avec annotations Swagger)
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const schema = __importStar(require("../db/schema"));
const drizzle_orm_1 = require("drizzle-orm");
const router = express_1.default.Router();
/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Récupère tous les projets
 *     tags: [Projects]
 *     description: Retourne la liste complète des projets avec leurs relations (technologies, challenges, features, gallery)
 *     responses:
 *       200:
 *         description: Liste des projets récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', async (_req, res) => {
    try {
        const projects = await db_1.db.query.projects.findMany({
            with: {
                technologies: true,
                challenges: { orderBy: (challenges, { asc }) => [asc(challenges.order)] },
                features: { orderBy: (features, { asc }) => [asc(features.order)] },
                gallery: { orderBy: (gallery, { asc }) => [asc(gallery.order)] },
            },
            orderBy: (projects, { desc }) => [desc(projects.year)],
        });
        res.json(projects);
    }
    catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
/**
 * @swagger
 * /api/projects/slug/{slug}:
 *   get:
 *     summary: Récupère un projet par son slug
 *     tags: [Projects]
 *     description: Retourne un projet complet avec toutes ses relations
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Le slug unique du projet
 *         example: massalikululum
 *     responses:
 *       200:
 *         description: Projet trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Projet non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/slug/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const project = await db_1.db.query.projects.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.projects.slug, slug),
            with: {
                technologies: true,
                challenges: { orderBy: (challenges, { asc }) => [asc(challenges.order)] },
                features: { orderBy: (features, { asc }) => [asc(features.order)] },
                gallery: { orderBy: (gallery, { asc }) => [asc(gallery.order)] },
            },
        });
        if (!project) {
            return res.status(404).json({ error: 'Projet non trouvé' });
        }
        res.json(project);
    }
    catch (error) {
        console.error('Erreur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Crée un nouveau projet
 *     tags: [Projects]
 *     description: Crée un projet avec ses relations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectInput'
 *     responses:
 *       201:
 *         description: Projet créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Données invalides
 *       409:
 *         description: Le slug existe déjà
 *       500:
 *         description: Erreur serveur
 */
router.post('/', async (req, res) => {
    // ... implémentation
});
/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Identifiant unique du projet
 *         slug:
 *           type: string
 *           description: Slug unique pour l'URL
 *           example: massalikululum
 *         title:
 *           type: string
 *           description: Titre du projet
 *           example: Plateforme formation & E-commerce
 *         description:
 *           type: string
 *           description: Description courte
 *         longDescription:
 *           type: string
 *           description: Description détaillée
 *         category:
 *           type: string
 *           description: Catégorie du projet
 *           example: web
 *         status:
 *           type: string
 *           enum: [completed, in_progress, planned]
 *           description: Statut du projet
 *         featured:
 *           type: boolean
 *           description: Projet mis en avant
 *         image:
 *           type: string
 *           description: URL de l'image principale
 *         demoUrl:
 *           type: string
 *           nullable: true
 *           description: URL de la démo
 *         githubUrl:
 *           type: string
 *           nullable: true
 *           description: URL du repo GitHub
 *         year:
 *           type: integer
 *           description: Année de réalisation
 *         duration:
 *           type: string
 *           nullable: true
 *           description: Durée du projet
 *         team:
 *           type: string
 *           nullable: true
 *           description: Composition de l'équipe
 *         technologies:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               technology:
 *                 type: string
 *         challenges:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               challenge:
 *                 type: string
 *               order:
 *                 type: integer
 *         features:
 *           type: array
 *           items:
 *             type: object
 *         gallery:
 *           type: array
 *           items:
 *             type: object
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     ProjectInput:
 *       type: object
 *       required:
 *         - slug
 *         - title
 *         - description
 *       properties:
 *         slug:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         longDescription:
 *           type: string
 *         category:
 *           type: string
 *         status:
 *           type: string
 *           enum: [completed, in_progress, planned]
 *         featured:
 *           type: boolean
 *         image:
 *           type: string
 *         demoUrl:
 *           type: string
 *         githubUrl:
 *           type: string
 *         year:
 *           type: integer
 *         duration:
 *           type: string
 *         team:
 *           type: string
 *         technologies:
 *           type: array
 *           items:
 *             type: string
 *         challenges:
 *           type: array
 *           items:
 *             type: string
 *         features:
 *           type: array
 *           items:
 *             type: string
 *         gallery:
 *           type: array
 *           items:
 *             type: string
 *
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Message d'erreur
 */
exports.default = router;
