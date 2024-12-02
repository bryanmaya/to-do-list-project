# To-Do List Project

Este proyecto es una aplicación de lista de tareas desarrollada con Ionic y Angular. Permite gestionar tareas y categorías con almacenamiento local usando IndexedDB e Ionic Storage.

## Características

- Gestión de tareas: añadir, editar y eliminar.
- Organización por categorías.
- Almacenamiento persistente con IndexedDB.
- Firebase Remote Config para personalización en tiempo real.
- Pruebas unitarias con Jasmine y Karma.

## Instalación y Configuración

1. **Clonar el repositorio e instalar dependencias**:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd to-do-list-project
   npm install
Configurar plataformas:

ionic cordova platform add android
Configurar Firebase:

Ve a la consola de Firebase y crea un proyecto nuevo.
Configura Firebase Remote Config:
Ve a la sección Remote Config.
Agrega una clave llamada enable_feature_task y asigna un valor booleano.
Descarga el archivo google-services.json desde Firebase Console y colócalo en platforms/android/app/.
Configurar permisos de Android: Verifica que tu archivo AndroidManifest.xml tenga los permisos necesarios:

<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />

Uso
Para iniciar el proyecto en el navegador o dispositivo móvil:

ionic serve
ionic cordova run android
Navega entre las pestañas de tareas y categorías y usa los botones para añadir, editar o eliminar elementos.

Scripts Disponibles
Ejecuta los siguientes comandos según sea necesario:

npm run ionic:serve            # Servir la aplicación en el navegador
npm run ionic:cordova-build    # Construir la aplicación
npm run ionic:cordova-run      # Ejecutar en dispositivo/emulador
npm run test                   # Ejecutar pruebas unitarias
npm run lint                   # Analizar errores de estilo
Estructura del Proyecto
src/app: Componentes, servicios y modelos de la aplicación.
src/assets: Recursos estáticos.
src/environments: Configuración del entorno.
Pruebas Unitarias
Este proyecto utiliza Jasmine y Karma para las pruebas. Asegúrate de que todas las dependencias estén instaladas correctamente antes de ejecutar las pruebas:

ng test
Cobertura de Código
Ejecuta el siguiente comando para generar un informe de cobertura:
ng test --code-coverage
Los resultados estarán disponibles en la carpeta coverage.

Dependencias Principales
@ionic/angular
@angular/core
@awesome-cordova-plugins/firebase-x
ionic-storage-angular
rxjs
Problemas Comunes y Soluciones
Firebase Remote Config no funciona
Verifica que google-services.json esté configurado correctamente.
Asegúrate de tener permisos para internet en AndroidManifest.xml.
IndexedDB no almacena datos
Verifica que el servicio Storage esté correctamente inicializado.
Problemas con las pruebas unitarias
Asegúrate de que los servicios estén correctamente configurados antes de ejecutar las pruebas.