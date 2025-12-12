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
// routes/users.ts
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const schema = __importStar(require("../db/schema"));
const drizzle_orm_1 = require("drizzle-orm");
const bcrypt_1 = __importDefault(require("bcrypt"));
const router = express_1.default.Router();
// GET tous les utilisateurs (sans les mots de passe)
router.get('/', async (_req, res) => {
    try {
        const users = await db_1.db.query.users.findMany({
            columns: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        res.json(users);
    }
    catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
});
// GET un utilisateur par ID (sans le mot de passe)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.users.id, id),
            columns: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.json(user);
    }
    catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
// POST créer un utilisateur
router.post('/', async (req, res) => {
    try {
        const { email, password, firstName, lastName, role } = req.body;
        // Validation basique
        if (!email || !password) {
            return res.status(400).json({ error: 'Email et mot de passe requis' });
        }
        // Vérifier si l'email existe déjà
        const existingUser = await db_1.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.users.email, email),
        });
        if (existingUser) {
            return res.status(409).json({ error: 'Cet email est déjà utilisé' });
        }
        // Hasher le mot de passe
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Créer l'utilisateur
        const [newUser] = await db_1.db.insert(schema.users).values({
            email,
            password: hashedPassword,
            firstName: firstName || null,
            lastName: lastName || null,
            role: role || 'USER',
        }).returning({
            id: schema.users.id,
            email: schema.users.email,
            firstName: schema.users.firstName,
            lastName: schema.users.lastName,
            role: schema.users.role,
            createdAt: schema.users.createdAt,
        });
        res.status(201).json(newUser);
    }
    catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
// PUT mettre à jour un utilisateur
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { email, firstName, lastName, role } = req.body;
        const updateData = {};
        if (email)
            updateData.email = email;
        if (firstName !== undefined)
            updateData.firstName = firstName;
        if (lastName !== undefined)
            updateData.lastName = lastName;
        if (role)
            updateData.role = role;
        updateData.updatedAt = new Date();
        const [updatedUser] = await db_1.db.update(schema.users)
            .set(updateData)
            .where((0, drizzle_orm_1.eq)(schema.users.id, id))
            .returning({
            id: schema.users.id,
            email: schema.users.email,
            firstName: schema.users.firstName,
            lastName: schema.users.lastName,
            role: schema.users.role,
            updatedAt: schema.users.updatedAt,
        });
        if (!updatedUser) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.json(updatedUser);
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
// DELETE supprimer un utilisateur
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [deletedUser] = await db_1.db.delete(schema.users)
            .where((0, drizzle_orm_1.eq)(schema.users.id, id))
            .returning({ id: schema.users.id });
        if (!deletedUser) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }
        res.json({ message: 'Utilisateur supprimé avec succès', id: deletedUser.id });
    }
    catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});
exports.default = router;
