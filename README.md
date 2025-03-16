# Ordon - Aplicación Angular

## Descripción

Task Manager es una aplicación web desarrollada en Angular 19, diseñada para gestionar tareas de manera eficiente. Incorpora un diseño moderno y minimalista gracias a Tailwind CSS y PrimeNG, además de usar Lucide Icons para una mejor experiencia visual. Las tareas se almacenan en LocalStorage, permitiendo persistencia de datos.

## Características Principales

- Creación, edición y eliminación de tareas.
- Estado de tareas: pendientes y completadas.
- Persistencia de datos en LocalStorage.
- UI moderna con Tailwind CSS y PrimeNG.
- Iconografía intuitiva con Lucide Icons.

## Tecnologías Utilizadas

- **Angular 19**: Framework frontend para construir aplicaciones web escalables.
- **Tailwind CSS**: Framework de estilos utilitario para diseño moderno y rápido.
- **PrimeNG**: Biblioteca de componentes para mejorar la UI.
- **Lucide Icons**: Conjunto de iconos minimalistas y personalizables.
- **LocalStorage**: Almacenamiento en el navegador para persistencia de datos sin backend.

## Estructura del Proyecto

La aplicación sigue una estructura modular y bien organizada para facilitar la mantenibilidad y escalabilidad del código:

- **core/**: Contiene servicios y configuraciones globales esenciales para la aplicación.
- **shared/**: Incluye módulos, directivas y componentes reutilizables en diferentes partes de la aplicación.
- **features/public/**: Almacena los módulos y componentes específicos de la funcionalidad pública, como la gestión de tareas.
- **components/**: Contiene los componentes individuales utilizados dentro de `features/public/`.

Esta estructura modular mejora la separación de responsabilidades, facilitando la comprensión del código y permitiendo una escalabilidad más sencilla a medida que el proyecto crece.

## Instalación y Ejecución Local

Para ejecutar la aplicación en tu entorno local, sigue estos pasos:

### Prerrequisitos

Asegúrate de tener instalados los siguientes requisitos:

- Node.js (versión 18 o superior)
- Angular CLI (instalable con `npm install -g @angular/cli`)

### Pasos de Instalación

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/task-manager.git
   cd task-manager

2. Instalar dependencias:
    ```bash
    npm install

3. Ejecutar la aplicación:
    ```bash
    ng serve

## Decisiones de Diseño y Arquitectura

- **Uso de Tailwind CSS**: Para optimizar la velocidad de desarrollo y mejorar la personalización de estilos.
- **PrimeNG**: Facilita la incorporación de componentes UI preconstruidos y altamente personalizables.
- **LocalStorage**: Se utiliza para persistencia, evitando dependencias en backend y mejorando el rendimiento en aplicaciones personales o pequeñas.
- **Estructura modular**: Mejora la separación de responsabilidades y facilita la escalabilidad del proyecto.

## Enlaces y Contacto

- **GitHub**: [Repositorio del proyecto](https://github.com/LuEsc/task-manager)
- **LinkedIn**: [Mi LinkedIn](https://www.linkedin.com/in/llunaes/)
- **Medium**: [Un poco más de lo que hago con Angular](https://medium.com/@llunaes)