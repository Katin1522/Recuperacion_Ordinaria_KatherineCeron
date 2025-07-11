import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Bienvenida = () => {
    const [isAnimating, setIsAnimating] = useState(false);
    const navigate = useNavigate();

    const handleContinue = () => {
        setIsAnimating(true);
        setTimeout(() => {
            navigate('/dashboard');
        }, 300);
    };

    return (
        <>
       
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center font-roboto overflow-hidden">
            {/* Efectos de luz de fondo */}
            <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-600/20 blur-2xl animate-pulse delay-500"></div>
                <div className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-green-500/15 blur-2xl animate-pulse delay-700"></div>
            </div>


            <div className={`relative z-10 text-center max-w-4xl mx-auto px-6 transition-all duration-300 ${isAnimating ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
                {/* Logo principal */}
                 <br/>
                  <br/>
                <div className="mb-12 animate-fade-in">
                    <div className="w-32 h-32 mx-auto mb-8 relative">
                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-green-400 flex items-center justify-center transform transition-transform hover:scale-110 duration-500">
                            <div className="w-28 h-28 bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-green-300 flex items-center justify-center">
                                    <div className="w-16 h-16 border-4 border-white/50"></div>
                                </div>
                            </div>
                        </div>
                        {/* Efecto de brillo */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-green-400/30 blur-xl animate-pulse"></div>
                    </div>
                </div>

                {/* Título principal */}
                <div className="mb-16 animate-fade-in delay-200">
                    <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-wide">
                        Escuelita 
                        <span className="bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent"> Marvel</span>
                    </h1>
                    <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-green-400 mx-auto mb-8"></div>
                    <p className="text-2xl md:text-3xl text-purple-200 font-light mb-4">
                        Sistema de Gestión Estudiantil
                    </p>
                    <p className="text-lg text-purple-300 max-w-2xl mx-auto leading-relaxed">
                        Bienvenido al sistema moderno de gestión estudiantil. 
                        Aquí podrás administrar de manera eficiente toda la información 
                        de los estudiantes registrados en nuestra institución.
                    </p>
                </div>

                {/* Características */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 animate-fade-in delay-400">
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 transform transition-all duration-300 hover:scale-105 hover:bg-white/15">
                        <div className="w-16 h-16 bg-purple-500/30 mx-auto mb-4 flex items-center justify-center">
                            <div className="w-12 h-12 bg-purple-400"></div>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3">Gestión Completa</h3>
                        <p className="text-purple-200 text-sm leading-relaxed">
                            Administra toda la información de estudiantes con un sistema completo de CRUD
                        </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 transform transition-all duration-300 hover:scale-105 hover:bg-white/15">
                        <div className="w-16 h-16 bg-green-500/30 mx-auto mb-4 flex items-center justify-center">
                            <div className="w-12 h-12 bg-green-400"></div>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3">Interface Moderna</h3>
                        <p className="text-purple-200 text-sm leading-relaxed">
                            Diseño intuitivo y moderno que facilita la navegación y el uso diario
                        </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 transform transition-all duration-300 hover:scale-105 hover:bg-white/15">
                        <div className="w-16 h-16 bg-purple-600/30 mx-auto mb-4 flex items-center justify-center">
                            <div className="w-12 h-12 bg-purple-500"></div>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3">Estadísticas</h3>
                        <p className="text-purple-200 text-sm leading-relaxed">
                            Visualiza estadísticas en tiempo real sobre el estado de los estudiantes
                        </p>
                    </div>
                </div>

                {/* Botón de continuar */}
                <div className="animate-fade-in delay-600">
                    <button
                        onClick={handleContinue}
                        className="group relative bg-gradient-to-r from-purple-600 to-green-500 text-white px-12 py-4 text-xl font-semibold hover:from-purple-700 hover:to-green-600 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transform transition-all duration-300 hover:scale-110 active:scale-95"
                    >
                        <span className="relative z-10">Acceder al Sistema</span>
                        
                        {/* Efecto de brillo en hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/50 to-green-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                        
                        {/* Borde animado */}
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/30 transition-all duration-300"></div>
                    </button>
                    
                    <p className="text-purple-300 text-sm mt-6">
                        Presiona el botón para comenzar a gestionar estudiantes
                    </p>
                </div>

                {/* Información adicional */}
                <div className="mt-16 text-center text-purple-400 text-sm animate-fade-in delay-800">
                    <div className="flex items-center justify-center space-x-6">
                        <span>Versión 1.0</span>
                        <div className="w-1 h-1 bg-purple-400"></div>
                        <span>Escuelita Marvel System</span>
                        <div className="w-1 h-1 bg-purple-400"></div>
                        <span>2025</span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
                .font-roboto {
                    font-family: 'Roboto', sans-serif;
                }
                
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.8s ease-out forwards;
                    opacity: 0;
                }
                
                .delay-200 {
                    animation-delay: 0.2s;
                }
                
                .delay-400 {
                    animation-delay: 0.4s;
                }
                
                .delay-500 {
                    animation-delay: 0.5s;
                }
                
                .delay-600 {
                    animation-delay: 0.6s;
                }
                
                .delay-700 {
                    animation-delay: 0.7s;
                }
                
                .delay-800 {
                    animation-delay: 0.8s;
                }
                
                .delay-1000 {
                    animation-delay: 1s;
                }
            `}</style>
        </div>
        </>
    );
};

export default Bienvenida;