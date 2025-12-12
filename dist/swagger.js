"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = void 0;
// swagger.ts
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Portfolio API',
            version: '1.0.0',
            description: 'API REST pour le portfolio de Dylan DR',
            contact: {
                name: 'Dylan DR',
                email: 'admin@dr-digital.fr',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Serveur de développement',
            },
            {
                url: 'https://api.dr-digital.fr',
                description: 'Serveur de production',
            },
        ],
        tags: [
            { name: 'Projects', description: 'Gestion des projets du portfolio' },
            { name: 'About', description: 'Section À propos' },
            { name: 'Skills', description: 'Compétences techniques' },
            { name: 'Experiences', description: 'Expériences professionnelles et formations' },
            { name: 'Users', description: 'Gestion des utilisateurs' },
            { name: 'Categories', description: 'Catégories de projets' },
        ],
    },
    apis: ['./routes/*.ts'], // Chemin vers tes fichiers de routes
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
const setupSwagger = (app) => {
    // Documentation JSON
    app.get('/api-docs.json', (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
    // Interface Swagger UI
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Portfolio API - Documentation',
    }));
    console.log('📚 Documentation disponible sur http://localhost:3000/api-docs');
};
exports.setupSwagger = setupSwagger;
exports.default = swaggerSpec;
