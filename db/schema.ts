// db/schema.ts
// Schéma Drizzle pour l'API Portfolio

import { pgTable, text, timestamp, integer, boolean, pgEnum, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ===== ENUMS =====
export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'USER']);
export const experienceTypeEnum = pgEnum('experience_type', ['work', 'education']);
export const projectStatusEnum = pgEnum('project_status', ['completed', 'in_progress', 'planned']);

// ===== USER =====
export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    firstName: text('first_name'),
    lastName: text('last_name'),
    role: userRoleEnum('role').default('ADMIN').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ===== ABOUT =====
export const about = pgTable('about', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: text('title').notNull(),
    teaser: text('teaser').notNull(),
    hobbies: text('hobbies').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const aboutCourses = pgTable('about_courses', {
    id: uuid('id').primaryKey().defaultRandom(),
    content: text('content').notNull(),
    order: integer('order').notNull(),
    aboutId: uuid('about_id').notNull().references(() => about.id, { onDelete: 'cascade' }),
});

export const aboutValues = pgTable('about_values', {
    id: uuid('id').primaryKey().defaultRandom(),
    value: text('value').notNull(),
    order: integer('order').notNull(),
    aboutId: uuid('about_id').notNull().references(() => about.id, { onDelete: 'cascade' }),
});

export const aboutApproaches = pgTable('about_approaches', {
    id: uuid('id').primaryKey().defaultRandom(),
    approach: text('approach').notNull(),
    order: integer('order').notNull(),
    aboutId: uuid('about_id').notNull().references(() => about.id, { onDelete: 'cascade' }),
});

export const aboutInterests = pgTable('about_interests', {
    id: uuid('id').primaryKey().defaultRandom(),
    interest: text('interest').notNull(),
    order: integer('order').notNull(),
    aboutId: uuid('about_id').notNull().references(() => about.id, { onDelete: 'cascade' }),
});

// Relations About
export const aboutRelations = relations(about, ({ many }) => ({
    courses: many(aboutCourses),
    values: many(aboutValues),
    approaches: many(aboutApproaches),
    interests: many(aboutInterests),
}));

export const aboutCoursesRelations = relations(aboutCourses, ({ one }) => ({
    about: one(about, { fields: [aboutCourses.aboutId], references: [about.id] }),
}));

export const aboutValuesRelations = relations(aboutValues, ({ one }) => ({
    about: one(about, { fields: [aboutValues.aboutId], references: [about.id] }),
}));

export const aboutApproachesRelations = relations(aboutApproaches, ({ one }) => ({
    about: one(about, { fields: [aboutApproaches.aboutId], references: [about.id] }),
}));

export const aboutInterestsRelations = relations(aboutInterests, ({ one }) => ({
    about: one(about, { fields: [aboutInterests.aboutId], references: [about.id] }),
}));

// ===== SKILLS =====
export const skillCategories = pgTable('skill_categories', {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull().unique(),
    name: text('name').notNull(),
    icon: text('icon').notNull(),
    description: text('description').notNull(),
    color: text('color').notNull(),
    order: integer('order').notNull(),
});

export const skills = pgTable('skills', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    categoryId: uuid('category_id').notNull().references(() => skillCategories.id, { onDelete: 'cascade' }),
});

// Relations Skills
export const skillCategoriesRelations = relations(skillCategories, ({ many }) => ({
    skills: many(skills),
}));

export const skillsRelations = relations(skills, ({ one }) => ({
    category: one(skillCategories, { fields: [skills.categoryId], references: [skillCategories.id] }),
}));

// ===== EXPERIENCES =====
export const experiences = pgTable('experiences', {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull().unique(),
    type: experienceTypeEnum('type').notNull(),
    title: text('title').notNull(),
    company: text('company').notNull(),
    location: text('location').notNull(),
    period: text('period').notNull(),
    description: text('description').notNull(),
    order: integer('order').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const experienceTechnologies = pgTable('experience_technologies', {
    id: uuid('id').primaryKey().defaultRandom(),
    technology: text('technology').notNull(),
    experienceId: uuid('experience_id').notNull().references(() => experiences.id, { onDelete: 'cascade' }),
});

export const experienceAchievements = pgTable('experience_achievements', {
    id: uuid('id').primaryKey().defaultRandom(),
    achievement: text('achievement').notNull(),
    order: integer('order').notNull(),
    experienceId: uuid('experience_id').notNull().references(() => experiences.id, { onDelete: 'cascade' }),
});

// Relations Experiences
export const experiencesRelations = relations(experiences, ({ many }) => ({
    technologies: many(experienceTechnologies),
    achievements: many(experienceAchievements),
}));

export const experienceTechnologiesRelations = relations(experienceTechnologies, ({ one }) => ({
    experience: one(experiences, { fields: [experienceTechnologies.experienceId], references: [experiences.id] }),
}));

export const experienceAchievementsRelations = relations(experienceAchievements, ({ one }) => ({
    experience: one(experiences, { fields: [experienceAchievements.experienceId], references: [experiences.id] }),
}));

// ===== PROJECTS =====
export const projects = pgTable('projects', {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    longDescription: text('long_description').notNull(),
    category: text('category').notNull(),
    status: projectStatusEnum('status').notNull(),
    featured: boolean('featured').default(false).notNull(),
    image: text('image').notNull(),
    demoUrl: text('demo_url'),
    githubUrl: text('github_url'),
    year: integer('year').notNull(),
    duration: text('duration'),
    team: text('team'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const projectTechnologies = pgTable('project_technologies', {
    id: uuid('id').primaryKey().defaultRandom(),
    technology: text('technology').notNull(),
    projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
});

export const projectChallenges = pgTable('project_challenges', {
    id: uuid('id').primaryKey().defaultRandom(),
    challenge: text('challenge').notNull(),
    order: integer('order').notNull(),
    projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
});

export const projectFeatures = pgTable('project_features', {
    id: uuid('id').primaryKey().defaultRandom(),
    feature: text('feature').notNull(),
    order: integer('order').notNull(),
    projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
});

export const projectGallery = pgTable('project_gallery', {
    id: uuid('id').primaryKey().defaultRandom(),
    image: text('image').notNull(),
    order: integer('order').notNull(),
    projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
});

// Relations Projects
export const projectsRelations = relations(projects, ({ many }) => ({
    technologies: many(projectTechnologies),
    challenges: many(projectChallenges),
    features: many(projectFeatures),
    gallery: many(projectGallery),
}));

export const projectTechnologiesRelations = relations(projectTechnologies, ({ one }) => ({
    project: one(projects, { fields: [projectTechnologies.projectId], references: [projects.id] }),
}));

export const projectChallengesRelations = relations(projectChallenges, ({ one }) => ({
    project: one(projects, { fields: [projectChallenges.projectId], references: [projects.id] }),
}));

export const projectFeaturesRelations = relations(projectFeatures, ({ one }) => ({
    project: one(projects, { fields: [projectFeatures.projectId], references: [projects.id] }),
}));

export const projectGalleryRelations = relations(projectGallery, ({ one }) => ({
    project: one(projects, { fields: [projectGallery.projectId], references: [projects.id] }),
}));

// ===== CATEGORIES =====
export const categories = pgTable('categories', {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: text('slug').notNull().unique(),
    label: text('label').notNull(),
});