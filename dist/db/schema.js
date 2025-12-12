"use strict";
// db/schema.ts
// Schéma Drizzle pour l'API Portfolio
Object.defineProperty(exports, "__esModule", { value: true });
exports.categories = exports.projectGalleryRelations = exports.projectFeaturesRelations = exports.projectChallengesRelations = exports.projectTechnologiesRelations = exports.projectsRelations = exports.projectGallery = exports.projectFeatures = exports.projectChallenges = exports.projectTechnologies = exports.projects = exports.experienceAchievementsRelations = exports.experienceTechnologiesRelations = exports.experiencesRelations = exports.experienceAchievements = exports.experienceTechnologies = exports.experiences = exports.skillsRelations = exports.skillCategoriesRelations = exports.skills = exports.skillCategories = exports.aboutInterestsRelations = exports.aboutApproachesRelations = exports.aboutValuesRelations = exports.aboutCoursesRelations = exports.aboutRelations = exports.aboutInterests = exports.aboutApproaches = exports.aboutValues = exports.aboutCourses = exports.about = exports.users = exports.projectStatusEnum = exports.experienceTypeEnum = exports.userRoleEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
// ===== ENUMS =====
exports.userRoleEnum = (0, pg_core_1.pgEnum)('user_role', ['ADMIN', 'USER']);
exports.experienceTypeEnum = (0, pg_core_1.pgEnum)('experience_type', ['work', 'education']);
exports.projectStatusEnum = (0, pg_core_1.pgEnum)('project_status', ['completed', 'in_progress', 'planned']);
// ===== USER =====
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    email: (0, pg_core_1.text)('email').notNull().unique(),
    password: (0, pg_core_1.text)('password').notNull(),
    firstName: (0, pg_core_1.text)('first_name'),
    lastName: (0, pg_core_1.text)('last_name'),
    role: (0, exports.userRoleEnum)('role').default('ADMIN').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
// ===== ABOUT =====
exports.about = (0, pg_core_1.pgTable)('about', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    title: (0, pg_core_1.text)('title').notNull(),
    teaser: (0, pg_core_1.text)('teaser').notNull(),
    hobbies: (0, pg_core_1.text)('hobbies').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
exports.aboutCourses = (0, pg_core_1.pgTable)('about_courses', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    content: (0, pg_core_1.text)('content').notNull(),
    order: (0, pg_core_1.integer)('order').notNull(),
    aboutId: (0, pg_core_1.uuid)('about_id').notNull().references(() => exports.about.id, { onDelete: 'cascade' }),
});
exports.aboutValues = (0, pg_core_1.pgTable)('about_values', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    value: (0, pg_core_1.text)('value').notNull(),
    order: (0, pg_core_1.integer)('order').notNull(),
    aboutId: (0, pg_core_1.uuid)('about_id').notNull().references(() => exports.about.id, { onDelete: 'cascade' }),
});
exports.aboutApproaches = (0, pg_core_1.pgTable)('about_approaches', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    approach: (0, pg_core_1.text)('approach').notNull(),
    order: (0, pg_core_1.integer)('order').notNull(),
    aboutId: (0, pg_core_1.uuid)('about_id').notNull().references(() => exports.about.id, { onDelete: 'cascade' }),
});
exports.aboutInterests = (0, pg_core_1.pgTable)('about_interests', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    interest: (0, pg_core_1.text)('interest').notNull(),
    order: (0, pg_core_1.integer)('order').notNull(),
    aboutId: (0, pg_core_1.uuid)('about_id').notNull().references(() => exports.about.id, { onDelete: 'cascade' }),
});
// Relations About
exports.aboutRelations = (0, drizzle_orm_1.relations)(exports.about, ({ many }) => ({
    courses: many(exports.aboutCourses),
    values: many(exports.aboutValues),
    approaches: many(exports.aboutApproaches),
    interests: many(exports.aboutInterests),
}));
exports.aboutCoursesRelations = (0, drizzle_orm_1.relations)(exports.aboutCourses, ({ one }) => ({
    about: one(exports.about, { fields: [exports.aboutCourses.aboutId], references: [exports.about.id] }),
}));
exports.aboutValuesRelations = (0, drizzle_orm_1.relations)(exports.aboutValues, ({ one }) => ({
    about: one(exports.about, { fields: [exports.aboutValues.aboutId], references: [exports.about.id] }),
}));
exports.aboutApproachesRelations = (0, drizzle_orm_1.relations)(exports.aboutApproaches, ({ one }) => ({
    about: one(exports.about, { fields: [exports.aboutApproaches.aboutId], references: [exports.about.id] }),
}));
exports.aboutInterestsRelations = (0, drizzle_orm_1.relations)(exports.aboutInterests, ({ one }) => ({
    about: one(exports.about, { fields: [exports.aboutInterests.aboutId], references: [exports.about.id] }),
}));
// ===== SKILLS =====
exports.skillCategories = (0, pg_core_1.pgTable)('skill_categories', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    slug: (0, pg_core_1.text)('slug').notNull().unique(),
    name: (0, pg_core_1.text)('name').notNull(),
    icon: (0, pg_core_1.text)('icon').notNull(),
    description: (0, pg_core_1.text)('description').notNull(),
    color: (0, pg_core_1.text)('color').notNull(),
    order: (0, pg_core_1.integer)('order').notNull(),
});
exports.skills = (0, pg_core_1.pgTable)('skills', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    name: (0, pg_core_1.text)('name').notNull(),
    categoryId: (0, pg_core_1.uuid)('category_id').notNull().references(() => exports.skillCategories.id, { onDelete: 'cascade' }),
});
// Relations Skills
exports.skillCategoriesRelations = (0, drizzle_orm_1.relations)(exports.skillCategories, ({ many }) => ({
    skills: many(exports.skills),
}));
exports.skillsRelations = (0, drizzle_orm_1.relations)(exports.skills, ({ one }) => ({
    category: one(exports.skillCategories, { fields: [exports.skills.categoryId], references: [exports.skillCategories.id] }),
}));
// ===== EXPERIENCES =====
exports.experiences = (0, pg_core_1.pgTable)('experiences', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    slug: (0, pg_core_1.text)('slug').notNull().unique(),
    type: (0, exports.experienceTypeEnum)('type').notNull(),
    title: (0, pg_core_1.text)('title').notNull(),
    company: (0, pg_core_1.text)('company').notNull(),
    location: (0, pg_core_1.text)('location').notNull(),
    period: (0, pg_core_1.text)('period').notNull(),
    description: (0, pg_core_1.text)('description').notNull(),
    order: (0, pg_core_1.integer)('order').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
exports.experienceTechnologies = (0, pg_core_1.pgTable)('experience_technologies', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    technology: (0, pg_core_1.text)('technology').notNull(),
    experienceId: (0, pg_core_1.uuid)('experience_id').notNull().references(() => exports.experiences.id, { onDelete: 'cascade' }),
});
exports.experienceAchievements = (0, pg_core_1.pgTable)('experience_achievements', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    achievement: (0, pg_core_1.text)('achievement').notNull(),
    order: (0, pg_core_1.integer)('order').notNull(),
    experienceId: (0, pg_core_1.uuid)('experience_id').notNull().references(() => exports.experiences.id, { onDelete: 'cascade' }),
});
// Relations Experiences
exports.experiencesRelations = (0, drizzle_orm_1.relations)(exports.experiences, ({ many }) => ({
    technologies: many(exports.experienceTechnologies),
    achievements: many(exports.experienceAchievements),
}));
exports.experienceTechnologiesRelations = (0, drizzle_orm_1.relations)(exports.experienceTechnologies, ({ one }) => ({
    experience: one(exports.experiences, { fields: [exports.experienceTechnologies.experienceId], references: [exports.experiences.id] }),
}));
exports.experienceAchievementsRelations = (0, drizzle_orm_1.relations)(exports.experienceAchievements, ({ one }) => ({
    experience: one(exports.experiences, { fields: [exports.experienceAchievements.experienceId], references: [exports.experiences.id] }),
}));
// ===== PROJECTS =====
exports.projects = (0, pg_core_1.pgTable)('projects', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    slug: (0, pg_core_1.text)('slug').notNull().unique(),
    title: (0, pg_core_1.text)('title').notNull(),
    description: (0, pg_core_1.text)('description').notNull(),
    longDescription: (0, pg_core_1.text)('long_description').notNull(),
    category: (0, pg_core_1.text)('category').notNull(),
    status: (0, exports.projectStatusEnum)('status').notNull(),
    featured: (0, pg_core_1.boolean)('featured').default(false).notNull(),
    image: (0, pg_core_1.text)('image').notNull(),
    demoUrl: (0, pg_core_1.text)('demo_url'),
    githubUrl: (0, pg_core_1.text)('github_url'),
    year: (0, pg_core_1.integer)('year').notNull(),
    duration: (0, pg_core_1.text)('duration'),
    team: (0, pg_core_1.text)('team'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().notNull(),
});
exports.projectTechnologies = (0, pg_core_1.pgTable)('project_technologies', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    technology: (0, pg_core_1.text)('technology').notNull(),
    projectId: (0, pg_core_1.uuid)('project_id').notNull().references(() => exports.projects.id, { onDelete: 'cascade' }),
});
exports.projectChallenges = (0, pg_core_1.pgTable)('project_challenges', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    challenge: (0, pg_core_1.text)('challenge').notNull(),
    order: (0, pg_core_1.integer)('order').notNull(),
    projectId: (0, pg_core_1.uuid)('project_id').notNull().references(() => exports.projects.id, { onDelete: 'cascade' }),
});
exports.projectFeatures = (0, pg_core_1.pgTable)('project_features', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    feature: (0, pg_core_1.text)('feature').notNull(),
    order: (0, pg_core_1.integer)('order').notNull(),
    projectId: (0, pg_core_1.uuid)('project_id').notNull().references(() => exports.projects.id, { onDelete: 'cascade' }),
});
exports.projectGallery = (0, pg_core_1.pgTable)('project_gallery', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    image: (0, pg_core_1.text)('image').notNull(),
    order: (0, pg_core_1.integer)('order').notNull(),
    projectId: (0, pg_core_1.uuid)('project_id').notNull().references(() => exports.projects.id, { onDelete: 'cascade' }),
});
// Relations Projects
exports.projectsRelations = (0, drizzle_orm_1.relations)(exports.projects, ({ many }) => ({
    technologies: many(exports.projectTechnologies),
    challenges: many(exports.projectChallenges),
    features: many(exports.projectFeatures),
    gallery: many(exports.projectGallery),
}));
exports.projectTechnologiesRelations = (0, drizzle_orm_1.relations)(exports.projectTechnologies, ({ one }) => ({
    project: one(exports.projects, { fields: [exports.projectTechnologies.projectId], references: [exports.projects.id] }),
}));
exports.projectChallengesRelations = (0, drizzle_orm_1.relations)(exports.projectChallenges, ({ one }) => ({
    project: one(exports.projects, { fields: [exports.projectChallenges.projectId], references: [exports.projects.id] }),
}));
exports.projectFeaturesRelations = (0, drizzle_orm_1.relations)(exports.projectFeatures, ({ one }) => ({
    project: one(exports.projects, { fields: [exports.projectFeatures.projectId], references: [exports.projects.id] }),
}));
exports.projectGalleryRelations = (0, drizzle_orm_1.relations)(exports.projectGallery, ({ one }) => ({
    project: one(exports.projects, { fields: [exports.projectGallery.projectId], references: [exports.projects.id] }),
}));
// ===== CATEGORIES =====
exports.categories = (0, pg_core_1.pgTable)('categories', {
    id: (0, pg_core_1.uuid)('id').primaryKey().defaultRandom(),
    slug: (0, pg_core_1.text)('slug').notNull().unique(),
    label: (0, pg_core_1.text)('label').notNull(),
});
