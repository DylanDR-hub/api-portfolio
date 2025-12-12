// routes/categories.ts
import express, { Request, Response } from 'express';
import { db } from '../db';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

// GET toutes les catégories
router.get('/', async (_req: Request, res: Response) => {
    try {
        const categories = await db.query.categories.findMany();

        res.json(categories);
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// GET une catégorie par slug
router.get('/:slug', async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;

        const category = await db.query.categories.findFirst({
            where: eq(schema.categories.slug, slug),
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