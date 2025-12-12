// routes/skills.ts
import express, { Request, Response } from 'express';
import { db } from '../db';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

// GET toutes les catégories de compétences avec leurs skills
router.get('/', async (_req: Request, res: Response) => {
    try {
        const skillCategories = await db.query.skillCategories.findMany({
            with: {
                skills: true,
            },
            orderBy: (categories, { asc }) => [asc(categories.order)],
        });

        res.json(skillCategories);
    } catch (error) {
        console.error('Erreur lors de la récupération des compétences:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// GET une catégorie spécifique par slug
router.get('/:slug', async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;

        const category = await db.query.skillCategories.findFirst({
            where: eq(schema.skillCategories.slug, slug),
            with: {
                skills: true,
            },
        });

        if (!category) {
            return res.status(404).json({ error: 'Catégorie non trouvée' });
        }

        res.json(category);
    } catch (error) {
        console.error('Erreur lors de la récupération de la catégorie:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

export default router;