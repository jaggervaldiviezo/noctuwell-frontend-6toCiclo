# Noctuwell - Plataforma de Bienestar para Horarios Nocturnos

Aplicación web desarrollada en Angular para asistencia integral a estudiantes y trabajadores con horarios nocturnos.

---

## Descripción del Proyecto

**Noctuwell** es una plataforma web iseñada para brindar asistencia integral a estudiantes y trabajadores nocturnos. El sistema ofrece herramientas y recursos especializados para mejorar el bienestar, rendimiento y calidad de vida de personas con horarios de actividad nocturna.

> **Nota:** Este repositorio contiene únicamente el frontend de la aplicación. El backend/API se encuentra en un repositorio separado.

---

## Contexto y Problemática

Los estudiantes y trabajadores nocturnos enfrentan desafíos específicos derivados de sus horarios atípicos:

**Problemas de Salud Física**
- Dificultades para mantener un sueño reparador y de calidad
- Complicaciones para seguir una dieta adecuada y balanceada
- Desajustes en el ritmo circadiano natural del organismo

**Problemas de Salud Mental**
- Estrés acumulado por falta de estructura y gestión del tiempo
- Impacto psicológico por aislamiento social durante horarios convencionales
- Dificultades en el manejo de la ansiedad relacionada con el rendimiento

**Solución Propuesta:**  
Noctuwell responde a estas necesidades mediante una plataforma web accesible desde cualquier ubicación con conexión a internet, ofreciendo:
- Asesoramiento especializado sobre el bienestar del sueño
- Planificación nutricional adaptada a horarios nocturnos
- Soporte psicológico para manejo del estrés
- Herramientas para optimización de la gestión del tiempo

---

## Funcionalidades del Sistema

### Sistema de Citas con Especialistas
- Programación de citas con profesionales especializados (psicología, nutrición, medicina del sueño)
- Visualización de calendario y disponibilidad en tiempo real
- Reagendamiento flexible adaptado a horarios nocturnos
- Seguimiento de estados de consultas 

### Sistema de Mensajería Integrado
- Chat directo con especialistas para consultas inmediatas
- Comunicación asíncrona adaptada a disponibilidad nocturna
- Historial completo de conversaciones vinculado a citas
- Soporte continuo entre sesiones programadas

### Gestión de Diagnósticos y Seguimiento
- Registro de evaluaciones médicas especializadas
- Actualización de diagnósticos según evolución del paciente
- Vinculación con planes de tratamiento activos
- Monitoreo de mejoras en calidad de sueño, alimentación y bienestar mental

### Historias Clínicas Digitales
- Registro completo del historial de salud del paciente
- Seguimiento longitudinal de mejoras en calidad de vida
- Acceso centralizado a toda la información médica
- Trazabilidad de tratamientos y resultados

---

## Reportes Estadísticos

El sistema genera reportes visuales mediante gráficos y tablas interactivas:

### Reportes de Personal
- **Experiencia del staff**: Distribución de especialistas por años de experiencia
- **Top especialistas**: Ranking de profesionales mejor calificados
- **Especialistas sin reseñas**: Identificación de profesionales nuevos o con baja interacción

### Reportes de Calidad
- **Comentarios por especialidad**: Análisis de feedback por área
- **Promedios de calificación**: Evaluación de calidad por especialidad
- **Satisfacción del servicio**: Métricas generales de experiencia del usuario

### Reportes de Utilización
- **Popularidad de planes**: Plan más utilizado y tendencias
- **Pacientes con mayor actividad**: Usuarios con más diagnósticos registrados
- **Especialistas más activos**: Profesionales con mayor número de diagnósticos

### Reportes Operativos
- **Pacientes sin citas**: Identificación de usuarios inactivos
- **Citas por estado**: Distribución de citas (pendientes, completadas, canceladas)
- **Ocupación de especialistas**: Carga de trabajo por profesional

---

## Aplicaciones Generales

Este tipo de plataforma tiene aplicaciones en diversos sectores:

**Sector Salud**  
Telemedicina especializada en medicina del sueño, nutrición y psicología para poblaciones con horarios atípicos.

**Sector Educativo**  
Apoyo a estudiantes universitarios con horarios nocturnos de estudio, ofreciendo recursos de bienestar y gestión del tiempo.

**Sector Corporativo**  
Programas de bienestar para empresas con personal en turnos nocturnos (call centers, hospitales, seguridad, logística).

**Salud Ocupacional**  
Prevención de enfermedades relacionadas con trabajo nocturno mediante seguimiento médico especializado.

**Investigación**  
Recopilación de datos sobre impacto de horarios nocturnos en salud física y mental para estudios epidemiológicos.

---

## Requisitos Técnicos

### Software Necesario
- **Git** - Control de versiones
- **Node.js** - Entorno de ejecución (versión LTS recomendada)
- **npm** - Gestor de paquetes
- **Angular CLI** - Herramienta de línea de comandos https://twitter.com/home

## Instalación

### Instalar Dependencias
```bash
# Instalar dependencias del proyecto
npm install --force

# Instalar bibliotecas adicionales
npm install @swimlane/ngx-charts --save --legacy-peer-deps
npm install @angular/animations --save --legacy-peer-deps
```

---

## Ejecución

### Modo Desarrollo

**Opción A: Angular CLI**
```bash
ng serve
```

**Opción B: npm script**
```bash
npm run start
```

La aplicación estará disponible en: `http://localhost:4200`

### Build de Producción
```bash
# Generar build optimizado
ng build

# Alternativa con npm
npm run build
```

---

## Tecnologías Utilizadas

- **Angular** - Framework principal para SPA
- **TypeScript** - Lenguaje de programación
- **RxJS** - Programación reactiva
- **@swimlane/ngx-charts** - Visualización de datos y gráficos
- **Angular Animations** - Animaciones de interfaz
- **HTML5/CSS3** - Estructura y estilos
- **Bootstrap/Material** - Framework de diseño (según implementación)

---

## Licencia

Proyecto desarrollado con fines académicos.

---

**Curso:** Arquitectura de Aplicaciones Web                  
**Grupo:** 4                   
**Ciclo:** 2025-2                
**Desarrollado durante:** Ago 2025 - Dic 2025
