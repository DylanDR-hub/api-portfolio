"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/about.ts
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const router = express_1.default.Router();
// GET section about complète
router.get('/', async (_req, res) => {
    try {
        const aboutData = await db_1.db.query.about.findFirst({
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
    }
    catch (error) {
        console.error('Erreur lors de la récupération de About:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
exports.default = router;
