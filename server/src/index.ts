import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import guestRoutes from './routes/guest.routes.js';
import tableRoutes from './routes/table.routes.js';
import timelineRoutes from './routes/timeline.routes.js';
import financeRoutes from './routes/finance.routes.js';
import storyRoutes from './routes/story.routes.js';
import publicRoutes from './routes/public.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de CORS
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir requests sin origen (Postman, curl, server-to-server) o orígenes habilitados
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Bloqueado por CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Health Check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Boda Julián & Yanet API',
    weddingDate: '2027-10-09',
    timestamp: new Date().toISOString(),
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/finances', financeRoutes);
app.use('/api/story', storyRoutes);
app.use('/api/public', publicRoutes);

// Manejador global de errores 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador global de errores no capturados
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('💥 Error inesperado:', err);
  res.status(500).json({ error: 'Error interno del servidor', message: err?.message });
});

app.listen(PORT, () => {
  console.log(`✨ Servidor de Boda (Julián & Yanet) ejecutándose en http://localhost:${PORT}`);
  console.log(`📅 Fecha de boda fijada: 9 de Octubre de 2027`);
  console.log(`🗄️  Base de datos Neon PostgreSQL conectada vía Prisma`);
});

export default app;
