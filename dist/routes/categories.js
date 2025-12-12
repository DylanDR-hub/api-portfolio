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
// routes/categories.ts
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const schema = __importStar(require("../db/schema"));
const drizzle_orm_1 = require("drizzle-orm");
const router = express_1.default.Router();
// GET toutes les catégories
router.get('/', async (_req, res) => {
    try {
        const categories = await db_1.db.query.categories.findMany();
        res.json(categories);
    }
    catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
// GET une catégorie par slug
router.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const category = await db_1.db.query.categories.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.categories.slug, slug),
        });
        if (!category) {
            return res.status(404).json({ error: 'Catégorie non trouvée' });
        }
        res.json(category);
    }
    catch (error) {
        console.error('Erreur lors de la récupération de la catégorie:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
exports.default = router;
