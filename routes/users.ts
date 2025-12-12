// routes/users.ts
import express, { Request, Response } from 'express';
import { db } from '../db';
import * as schema from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

const router = express.Router();

// GET tous les utilisateurs (sans les mots de passe)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const users = await db.query.users.findMany({
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
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
});

// GET un utilisateur par ID (sans le mot de passe)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, id),
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
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST créer un utilisateur
router.post('/', async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    // Validation basique
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const [newUser] = await db.insert(schema.users).values({
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
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT mettre à jour un utilisateur
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, firstName, lastName, role } = req.body;

    const updateData: any = {};
    if (email) updateData.email = email;
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (role) updateData.role = role;
    updateData.updatedAt = new Date();

    const [updatedUser] = await db.update(schema.users)
        .set(updateData)
        .where(eq(schema.users.id, id))
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
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE supprimer un utilisateur
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const [deletedUser] = await db.delete(schema.users)
        .where(eq(schema.users.id, id))
        .returning({ id: schema.users.id });

    if (!deletedUser) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json({ message: 'Utilisateur supprimé avec succès', id: deletedUser.id });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;