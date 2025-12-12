// routes/experiences.ts
import express, { Request, Response } from 'express';
import { db } from '../db';
import * as schema from '../db/schema';
import { eq, and } from 'drizzle-orm';

const router = express.Router();

// GET toutes les expériences (work + education)
router.get('/', async (_req: Request, res: Response) => {
    try {
        const experiences = await db.query.experiences.findMany({
            with: {
                technologies: true,
                achievements: {
                    orderBy: (achievements, { asc }) => [asc(achievements.order)],
                },
            },
            orderBy: (experiences, { asc }) => [asc(experiences.order)],
        });

        res.json(experiences);
    } catch (error) {
        console.error('Erreur lors de la récupération des expériences:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// GET expériences professionnelles uniquement
router.get('/work', async (_req: Request, res: Response) => {
    try {
        const experiences = await db.query.experiences.findMany({
            where: eq(schema.experiences.type, 'work'),
            with: {
                technologies: true,
                achievements: {
                    orderBy: (achievements, { asc }) => [asc(achievements.order)],
                },
            },
            orderBy: (experiences, { asc }) => [asc(experiences.order)],
        });

        res.json(experiences);
    } catch (error) {
        console.error('Erreur lors de la récupération des expériences:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// GET formations uniquement
router.get('/education', async (_req: Request, res: Response) => {
    try {
        const experiences = await db.query.experiences.findMany({
            where: eq(schema.experiences.type, 'education'),
            with: {
                technologies: true,
                achievements: {
                    orderBy: (achievements, { asc }) => [asc(achievements.order)],
                },
            },
            orderBy: (experiences, { asc }) => [asc(experiences.order)],
        });

        res.json(experiences);
    } catch (error) {
        console.error('Erreur lors de la récupération des formations:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// GET une expérience par slug
router.get('/:slug', async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;

        const experience = await db.query.experiences.findFirst({
            where: eq(schema.experiences.slug, slug),
            with: {
                technologies: true,
                achievements: {
                    orderBy: (achievements, { asc }) => [asc(achievements.order)],
                },
            },
        });

        if (!experience) {
            return res.status(404).json({ error: 'Expérience non trouvée' });
        }

        res.json(experience);
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'expérience:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

export default router;