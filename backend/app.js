import express from 'express';
import cookieParser from 'cookie-parser';
import cors from "cors";
import estudiantesRoutes from "./src/routes/Estudiantes.js";
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);
app.use(express.json());
app.use(cookieParser());

// Middleware para crear la carpeta data si no existe
const ensureDataDirectory = async () => {
    const dataDir = path.join(__dirname, 'data');
    try {
        await fs.access(dataDir);
    } catch {
        await fs.mkdir(dataDir, { recursive: true });
        console.log('Data directory created');
    }
};

// Inicializar la carpeta data al arrancar
ensureDataDirectory().catch(console.error);

app.use("/api/estudiantes", estudiantesRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ 
        message: 'API de Estudiantes funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

export default app;