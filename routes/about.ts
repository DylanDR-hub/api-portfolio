// routes/about.ts
import express, { Request, Response } from 'express';
import { db } from '../db';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

// GET section about complète
router.get('/', async (_req: Request, res: Response) => {
    try {
        const aboutData = await db.query.about.findFirst({
            with: {
                courses: {
                    orderBy: (courses, { asc }) => [asc(courses.order)],
                },
                values: {
                    orderBy: (values, { asc }) => [asc(values.order)],
                },
                approaches: {
                    orderBy: (approaches, { asc }) => [asc(approaches.order)],
                },
                interests: {
                    orderBy: (interests, { asc }) => [asc(interests.order)],
                },
            },
        });

        if (!aboutData) {
            return res.status(404).json({ error: 'Section About non trouvée' });
        }

        res.json(aboutData);
    } catch (error) {
        console.error('Erreur lors de la récupération de About:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

export default router;