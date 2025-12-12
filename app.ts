import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';

// Routes
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import projectsRouter from './routes/projects';
import aboutRouter from './routes/about';
import skillsRouter from './routes/skills';
import experiencesRouter from './routes/experiences';
import categoriesRouter from './routes/categories';

const app = express();

// CORS
app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    })
);

// Middlewares de base
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Fichiers statiques
const rootDir = process.cwd();
app.use(express.static(path.join(rootDir, 'public')));

// ===== HEALTH CHECK =====
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
    });
});

// ===== ROUTES =====
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/about', aboutRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/experiences', experiencesRouter);
app.use('/api/categories', categoriesRouter);

// ===== ERROR HANDLERS =====
app.use((req: Request, res: Response, _next: NextFunction) => {
    res.status(404).json({
        message: 'Not found',
        path: req.originalUrl,
    });
});

app.use(
    (err: any, req: Request, res: Response, _next: NextFunction) => {
        console.error('Unhandled error:', err);
        const status = err.status || 500;

        res.status(status).json({
            message: err.message || 'Internal server error',
            ...(req.app.get('env') === 'development' && { stack: err.stack }),
        });
    }
);

export default app;
