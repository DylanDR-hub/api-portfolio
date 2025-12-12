"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
// Routes
const index_1 = __importDefault(require("./routes/index"));
const users_1 = __importDefault(require("./routes/users"));
const projects_1 = __importDefault(require("./routes/projects"));
const about_1 = __importDefault(require("./routes/about"));
const skills_1 = __importDefault(require("./routes/skills"));
const experiences_1 = __importDefault(require("./routes/experiences"));
const categories_1 = __importDefault(require("./routes/categories"));
const app = (0, express_1.default)();
// CORS
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
// Middlewares de base
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
// Fichiers statiques
const rootDir = process.cwd();
app.use(express_1.default.static(path_1.default.join(rootDir, 'public')));
// ===== HEALTH CHECK =====
app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
    });
});
// ===== ROUTES =====
app.use('/', index_1.default);
app.use('/api/users', users_1.default);
app.use('/api/projects', projects_1.default);
app.use('/api/about', about_1.default);
app.use('/api/skills', skills_1.default);
app.use('/api/experiences', experiences_1.default);
app.use('/api/categories', categories_1.default);
// ===== ERROR HANDLERS =====
app.use((req, res, _next) => {
    res.status(404).json({
        message: 'Not found',
        path: req.originalUrl,
    });
});
app.use((err, req, res, _next) => {
    console.error('Unhandled error:', err);
    const status = err.status || 500;
    res.status(status).json({
        message: err.message || 'Internal server error',
        ...(req.app.get('env') === 'development' && { stack: err.stack }),
    });
});
exports.default = app;
