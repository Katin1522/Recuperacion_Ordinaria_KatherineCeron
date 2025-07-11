import React, { createContext, useContext, useState } from 'react';

const StudentsContext = createContext();

export const useStudents = () => {
    const context = useContext(StudentsContext);
    if (context === undefined) {
        throw new Error('useStudents debe ser usado dentro de un StudentsProvider');
    }
    return context;
};

export const StudentsProvider = ({ children }) => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchEstudiantes = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:4000/api/estudiantes');
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            setEstudiantes(data);
            return { success: true, data };
        } catch (error) {
            console.error('Error fetching estudiantes:', error);
            setError(error.message);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const createEstudiante = async (estudianteData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:4000/api/estudiantes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(estudianteData)
            });

            const data = await response.json();

            if (response.ok) {
                await fetchEstudiantes(); 
                return { success: true, data };
            } else {
                setError(data.message || 'Error al crear estudiante');
                return { success: false, message: data.message || 'Error al crear estudiante' };
            }
        } catch (error) {
            console.error('Error creating estudiante:', error);
            setError(error.message);
            return { success: false, message: 'Error de conexión' };
        } finally {
            setLoading(false);
        }
    };

    const updateEstudiante = async (id, estudianteData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:4000/api/estudiantes/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(estudianteData)
            });

            const data = await response.json();

            if (response.ok) {
                await fetchEstudiantes(); 
                return { success: true, data };
            } else {
                setError(data.message || 'Error al actualizar estudiante');
                return { success: false, message: data.message || 'Error al actualizar estudiante' };
            }
        } catch (error) {
            console.error('Error updating estudiante:', error);
            setError(error.message);
            return { success: false, message: 'Error de conexión' };
        } finally {
            setLoading(false);
        }
    };

    const deleteEstudiante = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:4000/api/estudiantes/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                await fetchEstudiantes(); 
                return { success: true };
            } else {
                const data = await response.json();
                setError(data.message || 'Error al eliminar estudiante');
                return { success: false, message: data.message || 'Error al eliminar estudiante' };
            }
        } catch (error) {
            console.error('Error deleting estudiante:', error);
            setError(error.message);
            return { success: false, message: 'Error de conexión' };
        } finally {
            setLoading(false);
        }
    };

    const getEstudianteById = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:4000/api/estudiantes/${id}`);
            if (response.ok) {
                const data = await response.json();
                return { success: true, estudiante: data };
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Estudiante no encontrado');
                return { success: false, message: errorData.message || 'Estudiante no encontrado' };
            }
        } catch (error) {
            console.error('Error getting estudiante by ID:', error);
            setError(error.message);
            return { success: false, message: 'Error de conexión' };
        } finally {
            setLoading(false);
        }
    };

    const searchEstudiantes = (searchTerm) => {
        if (!searchTerm) return estudiantes;
        
        return estudiantes.filter(estudiante =>
            estudiante.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            estudiante.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
            estudiante.carnet.toLowerCase().includes(searchTerm.toLowerCase()) ||
            estudiante.grado.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const getEstudiantesStats = () => {
        const total = estudiantes.length;
        const activos = estudiantes.filter(e => e.estado === 'Activo').length;
        const inactivos = estudiantes.filter(e => e.estado === 'Inactivo').length;
        
        const gradosCount = estudiantes.reduce((acc, estudiante) => {
            acc[estudiante.grado] = (acc[estudiante.grado] || 0) + 1;
            return acc;
        }, {});

        return {
            total,
            activos,
            inactivos,
            porcentajeActivos: total > 0 ? Math.round((activos / total) * 100) : 0,
            gradosCount
        };
    };

    const clearError = () => {
        setError(null);
    };

    const contextValue = {
        estudiantes,
        loading,
        error,
        
        fetchEstudiantes,
        createEstudiante,
        updateEstudiante,
        deleteEstudiante,
        getEstudianteById,
        
        searchEstudiantes,
        getEstudiantesStats,
        clearError
    };

    return (
        <StudentsContext.Provider value={contextValue}>
            {children}
        </StudentsContext.Provider>
    );
};