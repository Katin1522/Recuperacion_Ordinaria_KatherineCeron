import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [estudiantes, setEstudiantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        carnet: '',
        nombre: '',
        apellido: '',
        grado: '',
        estado: 'Activo'
    });

    // Estadísticas calculadas - Con validación segura
    const totalEstudiantes = estudiantes.length;
    const estudiantesActivos = estudiantes.filter(e => e.estado === 'Activo').length;
    const estudiantesInactivos = estudiantes.filter(e => e.estado === 'Inactivo').length;

    // Filtrar estudiantes - Con validación segura
    const filteredEstudiantes = estudiantes.filter(estudiante => {
        const searchLower = searchTerm.toLowerCase();
        const nombre = estudiante.nombre ? estudiante.nombre.toLowerCase() : '';
        const apellido = estudiante.apellido ? estudiante.apellido.toLowerCase() : '';
        const carnet = estudiante.carnet ? estudiante.carnet.toLowerCase() : '';
        
        return nombre.includes(searchLower) ||
               apellido.includes(searchLower) ||
               carnet.includes(searchLower);
    });

    useEffect(() => {
        fetchEstudiantes();
    }, []);

    const fetchEstudiantes = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/estudiantes');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Estudiantes recibidos:', data);
            setEstudiantes(data);
        } catch (error) {
            console.error('Error fetching estudiantes:', error);
            alert('Error al cargar los estudiantes. Verifica que el servidor esté funcionando.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            // Validación básica
            if (!formData.carnet || !formData.nombre || !formData.apellido || !formData.grado) {
                alert('Por favor completa todos los campos obligatorios');
                return;
            }

            const response = await fetch('http://localhost:4000/api/estudiantes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear estudiante');
            }

            await fetchEstudiantes();
            resetForm();
            setShowModal(false);
            alert('Estudiante creado exitosamente');
        } catch (error) {
            console.error('Error creating estudiante:', error);
            alert(`Error al crear estudiante: ${error.message}`);
        }
    };

    const handleUpdate = async () => {
        try {
            // CORREGIDO: Usar 'id' en lugar de '_id'
            if (!editingStudent || !editingStudent.id) {
                alert('Error: No hay estudiante seleccionado para editar');
                return;
            }

            // Validación básica de campos
            if (!formData.carnet || !formData.nombre || !formData.apellido || !formData.grado) {
                alert('Por favor completa todos los campos obligatorios');
                return;
            }

            console.log('Actualizando estudiante con ID:', editingStudent.id);
            console.log('Datos a enviar:', formData);

            const response = await fetch(`http://localhost:4000/api/estudiantes/${editingStudent.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error HTTP: ${response.status}`);
            }

            const updatedStudent = await response.json();
            console.log('Estudiante actualizado:', updatedStudent);

            await fetchEstudiantes();
            resetForm();
            setShowModal(false);
            setEditingStudent(null);
            alert('Estudiante actualizado exitosamente');
        } catch (error) {
            console.error('Error updating estudiante:', error);
            alert(`Error al actualizar estudiante: ${error.message}`);
        }
    };

    const handleDelete = async (id) => {
        if (!id) {
            alert('Error: ID de estudiante no válido');
            return;
        }

        if (window.confirm('¿Estás seguro de eliminar este estudiante?')) {
            try {
                const response = await fetch(`http://localhost:4000/api/estudiantes/${id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Error HTTP: ${response.status}`);
                }

                await fetchEstudiantes();
                alert('Estudiante eliminado exitosamente');
            } catch (error) {
                console.error('Error deleting estudiante:', error);
                alert(`Error al eliminar estudiante: ${error.message}`);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            carnet: '',
            nombre: '',
            apellido: '',
            grado: '',
            estado: 'Activo'
        });
    };

    const openEditModal = (estudiante) => {
        console.log('Abriendo modal para editar:', estudiante);
        
        // CORREGIDO: Verificar 'id' en lugar de '_id'
        if (!estudiante.id) {
            alert('Error: El estudiante no tiene un ID válido');
            return;
        }

        setEditingStudent(estudiante);
        setFormData({
            carnet: estudiante.carnet || '',
            nombre: estudiante.nombre || '',
            apellido: estudiante.apellido || '',
            grado: estudiante.grado || '',
            estado: estudiante.estado || 'Activo'
        });
        setShowModal(true);
    };

    const openCreateModal = () => {
        setEditingStudent(null);
        resetForm();
        setShowModal(true);
    };

    const handleGoBack = () => {
        navigate('/bienvenida');
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditingStudent(null);
        resetForm();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center">
                <div className="text-white text-xl">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 font-roboto">
            {/* Efectos de luz de fondo */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-green-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10">
                {/* Header - RESPONSIVE MEJORADO */}
                <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-4">
                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-4">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-green-400 flex items-center justify-center rounded-lg">
                                <div className="w-8 h-8 bg-white/20 rounded"></div>
                            </div>
                            <div className="text-center lg:text-left">
                                <h1 className="text-xl lg:text-2xl font-bold text-white">Escuelita Marvel</h1>
                                <p className="text-purple-200 text-sm">Dashboard Administrativo</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="text-center lg:text-right">
                                <p className="text-white font-medium text-sm lg:text-base">Administrador</p>
                                <p className="text-purple-200 text-xs lg:text-sm">Sistema Escuelita Marvel</p>
                            </div>
                            <button
                                onClick={handleGoBack}
                                className="bg-purple-600/80 hover:bg-purple-700 text-white px-3 lg:px-4 py-2 transition-colors duration-200 rounded-lg text-sm lg:text-base"
                            >
                                Volver al Inicio
                            </button>
                        </div>
                    </div>
                </header>

                {/* Estadísticas - RESPONSIVE MEJORADO */}
                <div className="max-w-7xl mx-auto p-4 lg:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
                        <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-4 lg:p-6 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-200 text-xs lg:text-sm">Total Estudiantes</p>
                                    <p className="text-2xl lg:text-3xl font-bold text-white">{totalEstudiantes}</p>
                                </div>
                                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-500/30 flex items-center justify-center rounded-lg">
                                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-purple-400 rounded"></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-4 lg:p-6 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-200 text-xs lg:text-sm">Estudiantes Activos</p>
                                    <p className="text-2xl lg:text-3xl font-bold text-white">{estudiantesActivos}</p>
                                </div>
                                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-500/30 flex items-center justify-center rounded-lg">
                                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-green-400 rounded"></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-4 lg:p-6 rounded-lg sm:col-span-2 lg:col-span-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-200 text-xs lg:text-sm">Estudiantes Inactivos</p>
                                    <p className="text-2xl lg:text-3xl font-bold text-white">{estudiantesInactivos}</p>
                                </div>
                                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-500/30 flex items-center justify-center rounded-lg">
                                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gray-400 rounded"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controles - RESPONSIVE MEJORADO */}
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-4 lg:p-6 mb-6 rounded-lg">
                        <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
                            <h2 className="text-xl lg:text-2xl font-bold text-white text-center lg:text-left">Gestión de Estudiantes</h2>
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
                                <input
                                    type="text"
                                    placeholder="Buscar estudiantes..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full sm:w-auto px-4 py-2 bg-white/10 border border-white/30 text-white placeholder-purple-200 focus:outline-none focus:border-green-400 rounded-lg"
                                />
                                <button
                                    onClick={openCreateModal}
                                    className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-4 lg:px-6 py-2 font-medium transform transition-all duration-200 hover:scale-105 active:scale-95 rounded-lg"
                                >
                                    Nuevo Estudiante
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tabla de estudiantes - RESPONSIVE MEJORADO */}
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 overflow-hidden rounded-lg">
                        {/* Vista móvil - Cards */}
                        <div className="block lg:hidden">
                            {filteredEstudiantes.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-purple-200 text-lg">No se encontraron estudiantes</p>
                                </div>
                            ) : (
                                <div className="p-4 space-y-4">
                                    {filteredEstudiantes.map((estudiante, index) => (
                                        <div key={estudiante.id || index} className="bg-white/5 p-4 rounded-lg border border-white/10">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="text-white font-semibold text-lg">
                                                        {estudiante.nombre || 'N/A'} {estudiante.apellido || 'N/A'}
                                                    </h3>
                                                    <p className="text-purple-200 font-mono text-sm">{estudiante.carnet || 'N/A'}</p>
                                                </div>
                                                <span className={`px-2 py-1 text-xs font-medium rounded ${
                                                    estudiante.estado === 'Activo' 
                                                        ? 'bg-green-500/30 text-green-200 border border-green-400/50' 
                                                        : 'bg-gray-500/30 text-gray-200 border border-gray-400/50'
                                                }`}>
                                                    {estudiante.estado || 'N/A'}
                                                </span>
                                            </div>
                                            <div className="mb-3">
                                                <p className="text-purple-200 text-sm">
                                                    <span className="font-medium">Grado:</span> {estudiante.grado || 'N/A'}
                                                </p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => openEditModal(estudiante)}
                                                    className="flex-1 bg-blue-600/80 hover:bg-blue-700 text-white px-3 py-2 text-sm transition-colors duration-200 rounded"
                                                    disabled={!estudiante.id}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(estudiante.id)}
                                                    className="flex-1 bg-red-600/80 hover:bg-red-700 text-white px-3 py-2 text-sm transition-colors duration-200 rounded"
                                                    disabled={!estudiante.id}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Vista desktop - Tabla */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-white font-semibold">Carnet</th>
                                        <th className="px-6 py-4 text-left text-white font-semibold">Nombre</th>
                                        <th className="px-6 py-4 text-left text-white font-semibold">Apellido</th>
                                        <th className="px-6 py-4 text-left text-white font-semibold">Grado</th>
                                        <th className="px-6 py-4 text-left text-white font-semibold">Estado</th>
                                        <th className="px-6 py-4 text-left text-white font-semibold">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEstudiantes.map((estudiante, index) => (
                                        <tr key={estudiante.id || index} className="border-t border-white/10 hover:bg-white/5 transition-colors duration-200">
                                            <td className="px-6 py-4 text-purple-200 font-mono">{estudiante.carnet || 'N/A'}</td>
                                            <td className="px-6 py-4 text-white">{estudiante.nombre || 'N/A'}</td>
                                            <td className="px-6 py-4 text-white">{estudiante.apellido || 'N/A'}</td>
                                            <td className="px-6 py-4 text-purple-200">{estudiante.grado || 'N/A'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 text-xs font-medium rounded ${
                                                    estudiante.estado === 'Activo' 
                                                        ? 'bg-green-500/30 text-green-200 border border-green-400/50' 
                                                        : 'bg-gray-500/30 text-gray-200 border border-gray-400/50'
                                                }`}>
                                                    {estudiante.estado || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => openEditModal(estudiante)}
                                                        className="bg-blue-600/80 hover:bg-blue-700 text-white px-3 py-1 text-sm transition-colors duration-200 rounded"
                                                        disabled={!estudiante.id}
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(estudiante.id)}
                                                        className="bg-red-600/80 hover:bg-red-700 text-white px-3 py-1 text-sm transition-colors duration-200 rounded"
                                                        disabled={!estudiante.id}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            {filteredEstudiantes.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-purple-200 text-lg">No se encontraron estudiantes</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para crear/editar estudiante - RESPONSIVE MEJORADO */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 lg:p-8 w-full max-w-md rounded-lg">
                        <h3 className="text-xl lg:text-2xl font-bold text-white mb-6">
                            {editingStudent ? 'Editar Estudiante' : 'Nuevo Estudiante'}
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Carnet <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.carnet}
                                    onChange={(e) => setFormData({...formData, carnet: e.target.value})}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/30 text-white placeholder-purple-200 focus:outline-none focus:border-green-400 rounded-lg"
                                    placeholder="Ej: EST001"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Nombre <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/30 text-white placeholder-purple-200 focus:outline-none focus:border-green-400 rounded-lg"
                                    placeholder="Nombre del estudiante"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Apellido <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.apellido}
                                    onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/30 text-white placeholder-purple-200 focus:outline-none focus:border-green-400 rounded-lg"
                                    placeholder="Apellido del estudiante"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-white text-sm font-medium mb-2">
                                    Grado <span className="text-red-400">*</span>
                                </label>
                                <select
                                    value={formData.grado}
                                    onChange={(e) => setFormData({...formData, grado: e.target.value})}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/30 text-white focus:outline-none focus:border-green-400 rounded-lg"
                                    required
                                >
                                    <option value="" className="bg-purple-900">Seleccionar grado</option>
                                    <option value="1° Grado" className="bg-purple-900">1° Grado</option>
                                    <option value="2° Grado" className="bg-purple-900">2° Grado</option>
                                    <option value="3° Grado" className="bg-purple-900">3° Grado</option>
                                    <option value="4° Grado" className="bg-purple-900">4° Grado</option>
                                    <option value="5° Grado" className="bg-purple-900">5° Grado</option>
                                    <option value="6° Grado" className="bg-purple-900">6° Grado</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-white text-sm font-medium mb-2">Estado</label>
                                <select
                                    value={formData.estado}
                                    onChange={(e) => setFormData({...formData, estado: e.target.value})}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/30 text-white focus:outline-none focus:border-green-400 rounded-lg"
                                >
                                    <option value="Activo" className="bg-purple-900">Activo</option>
                                    <option value="Inactivo" className="bg-purple-900">Inactivo</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-8">
                            <button
                                onClick={handleModalClose}
                                className="flex-1 bg-gray-600/80 hover:bg-gray-700 text-white py-3 font-medium transition-colors duration-200 rounded-lg"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={editingStudent ? handleUpdate : handleCreate}
                                className="flex-1 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white py-3 font-medium transform transition-all duration-200 hover:scale-105 active:scale-95 rounded-lg"
                            >
                                {editingStudent ? 'Actualizar' : 'Crear'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;