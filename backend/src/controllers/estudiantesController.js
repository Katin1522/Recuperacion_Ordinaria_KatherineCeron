import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al archivo JSON
const JSON_FILE_PATH = path.join(__dirname, '../../data/estudiantes.json');

const estudiantesController = {};

// Función helper para leer el archivo JSON
const readEstudiantesFromFile = async () => {
    try {
        const data = await fs.readFile(JSON_FILE_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading JSON file:', error);
        // Si el archivo no existe, crear uno con estructura vacía
        const initialData = { estudiantes: [] };
        await writeEstudiantesToFile(initialData);
        return initialData;
    }
};

// Función helper para escribir al archivo JSON
const writeEstudiantesToFile = async (data) => {
    try {
        await fs.writeFile(JSON_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing JSON file:', error);
        throw error;
    }
};

// Función para generar un nuevo ID único
const generateId = (estudiantes) => {
    if (estudiantes.length === 0) return '1';
    const maxId = Math.max(...estudiantes.map(est => parseInt(est.id) || 0));
    return (maxId + 1).toString();
};

estudiantesController.getEstudiantes = async (req, res) => {
    try {
        const data = await readEstudiantesFromFile();
        res.json(data.estudiantes);
    } catch (error) {
        console.error('Error getting estudiantes:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor',
            error: error.message 
        });
    }
};

estudiantesController.createEstudiantes = async (req, res) => {
    try {
        const { carnet, nombre, apellido, grado, estado } = req.body;
        
        // Validación básica
        if (!carnet || !nombre || !apellido || !grado) {
            return res.status(400).json({ 
                message: "Todos los campos son obligatorios" 
            });
        }

        const data = await readEstudiantesFromFile();
        
        // Verificar si el carnet ya existe
        const existingStudent = data.estudiantes.find(est => est.carnet === carnet);
        if (existingStudent) {
            return res.status(400).json({ 
                message: "Ya existe un estudiante con ese carnet" 
            });
        }

        // Crear nuevo estudiante
        const newEstudiante = {
            id: generateId(data.estudiantes),
            carnet, 
            nombre, 
            apellido, 
            grado, 
            estado: estado || 'Activo',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Agregar al array
        data.estudiantes.push(newEstudiante);
        
        // Guardar en archivo
        await writeEstudiantesToFile(data);
        
        res.status(201).json({ 
            message: "Estudiante creado exitosamente",
            estudiante: newEstudiante
        });
    } catch (error) {
        console.error('Error creating estudiante:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor',
            error: error.message 
        });
    }
};

estudiantesController.deleteEstudiantes = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await readEstudiantesFromFile();
        
        // Buscar el índice del estudiante
        const studentIndex = data.estudiantes.findIndex(est => est.id === id);
        
        if (studentIndex === -1) {
            return res.status(404).json({ 
                message: "Estudiante no encontrado" 
            });
        }
        
        // Remover estudiante del array
        const deletedEstudiante = data.estudiantes.splice(studentIndex, 1)[0];
        
        // Guardar cambios
        await writeEstudiantesToFile(data);
        
        res.json({ 
            message: "Estudiante eliminado exitosamente",
            estudiante: deletedEstudiante
        });
    } catch (error) {
        console.error('Error deleting estudiante:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor',
            error: error.message 
        });
    }
};

estudiantesController.updateEstudiantes = async (req, res) => {
    try {
        const { id } = req.params;
        const { carnet, nombre, apellido, grado, estado } = req.body;
        
        // Validación básica
        if (!carnet || !nombre || !apellido || !grado) {
            return res.status(400).json({ 
                message: "Todos los campos son obligatorios" 
            });
        }

        const data = await readEstudiantesFromFile();
        
        // Buscar el estudiante
        const studentIndex = data.estudiantes.findIndex(est => est.id === id);
        
        if (studentIndex === -1) {
            return res.status(404).json({ 
                message: "Estudiante no encontrado" 
            });
        }
        
        // Verificar si el carnet ya existe en otro estudiante
        const existingStudent = data.estudiantes.find(est => 
            est.carnet === carnet && est.id !== id
        );
        if (existingStudent) {
            return res.status(400).json({ 
                message: "Ya existe otro estudiante con ese carnet" 
            });
        }

        // Actualizar estudiante
        const updatedEstudiante = {
            ...data.estudiantes[studentIndex],
            carnet, 
            nombre, 
            apellido, 
            grado, 
            estado,
            updatedAt: new Date().toISOString()
        };
        
        data.estudiantes[studentIndex] = updatedEstudiante;
        
        // Guardar cambios
        await writeEstudiantesToFile(data);
        
        res.json({ 
            message: "Estudiante actualizado exitosamente",
            estudiante: updatedEstudiante
        });
    } catch (error) {
        console.error('Error updating estudiante:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor',
            error: error.message 
        });
    }
};

estudiantesController.getEstudiantesById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await readEstudiantesFromFile();

        const estudiante = data.estudiantes.find(est => est.id === id);

        if (!estudiante) {
            return res.status(404).json({
                message: 'Estudiante no encontrado'
            });
        }

        res.status(200).json(estudiante);

    } catch (error) {
        console.error('Error getting estudiante by ID:', error);
        res.status(500).json({
            message: 'Error interno del servidor',
            error: error.message 
        });
    }
};

export default estudiantesController;