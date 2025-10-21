# 🎤 Somnia - App para Grabar y Analizar Sueños

> **Monorepo** con React Native (Expo) + Fastify + TypeScript para capturar, almacenar y analizar sueños con IA.

## 📱 ¿Qué es Somnia?

Somnia es una aplicación móvil que te permite:
- 🎤 **Grabar sueños** por voz en formato .m4a de alta calidad
- ✍️ **Escribir sueños** como texto
- 📱 **Almacenar localmente** todas tus entradas
- 🔄 **Reproducir audios** y gestionar entradas
- 🤖 **Análisis con IA** (próximamente)

## 🚀 Instalación y Uso

### 📥 Clonar en Otro Ordenador (Guía Completa)

**Requisitos previos:**
- Node.js v18+ 
- pnpm (`npm install -g pnpm`)
- Docker Desktop
- Git

```bash
# 1. Clonar el repositorio
git clone https://github.com/Jairogelpi/somnia.git
cd somnia

# 2. Instalar dependencias del monorepo
pnpm install

# 3. Levantar backend con Docker (Fase 2)
docker compose up -d --build

# 4. Verificar que el backend esté funcionando
curl http://localhost:8000/health

# 5. Ejecutar la app móvil
pnpm -F app-mobile dev
```

**URLs de Acceso:**
- 📱 **App Móvil**: http://localhost:8081
- 🔗 **API Backend**: http://localhost:8000  
- 📦 **MinIO Console**: http://localhost:9001 (usuario: `Gusano2001@`, contraseña: `Gusano2001@`)

### 🐳 Comandos Docker Útiles

```bash
# Ver estado de los servicios
docker compose ps

# Ver logs del backend
docker compose logs api

# Ver logs de MinIO
docker compose logs minio

# Parar servicios
docker compose down

# Reiniciar servicios
docker compose restart

# Reconstruir si hay cambios
docker compose up -d --build
```

### 🐳 Backend con Docker (Fase 2)

El backend ahora incluye un sistema completo con FastAPI + MinIO:

```bash
# Levantar servicios
docker compose up -d --build

# Verificar estado
docker compose ps

# Ver logs
docker compose logs api
docker compose logs minio

# Parar servicios
docker compose down
```

**URLs de Acceso:**
- **API Backend**: http://localhost:8000
- **MinIO Console**: http://localhost:9001
- **App Móvil**: http://localhost:8081

### Opción 2: Descargar ZIP desde GitHub

1. **Descargar el proyecto:**
   - Ve a [https://github.com/Jairogelpi/somnia](https://github.com/Jairogelpi/somnia)
   - Haz clic en el botón verde **"Code"**
   - Selecciona **"Download ZIP"**
   - Extrae el archivo ZIP en tu carpeta de proyectos

2. **Configurar el entorno:**
   ```bash
   # Navegar al directorio extraído
   cd somnia-main
   
   # Instalar pnpm (si no lo tienes)
   npm install -g pnpm
   
   # Instalar dependencias del proyecto
   pnpm install
   ```

3. **Ejecutar la aplicación:**
   ```bash
   # Iniciar la app móvil
   pnpm -F app-mobile dev
   ```

4. **Probar en dispositivo:**
   - **Web**: Abre http://localhost:8081 en tu navegador
   - **Móvil**: Instala Expo Go y escanea el código QR
   - **Emulador**: Usa Android Studio o Xcode

## 💻 Cómo Llevar el Proyecto a tu PC para Modificarlo

### Paso 1: Preparar tu PC

**Instalar herramientas necesarias:**
```bash
# 1. Instalar Node.js (v18+)
# Descarga desde: https://nodejs.org/

# 2. Instalar pnpm (gestor de paquetes)
npm install -g pnpm

# 3. Instalar Git (para control de versiones)
# Descarga desde: https://git-scm.com/

# 4. Editor de código (recomendado)
# VS Code: https://code.visualstudio.com/
```

### Paso 2: Obtener el Código

**Opción A: Clonar (Recomendado para desarrollo)**
```bash
# Crear carpeta para proyectos
mkdir C:\Users\TuUsuario\Proyectos
cd C:\Users\TuUsuario\Proyectos

# Clonar el repositorio
git clone https://github.com/Jairogelpi/somnia.git
cd somnia
```

**Opción B: Descargar ZIP**
```bash
# 1. Ve a https://github.com/Jairogelpi/somnia
# 2. Clic en "Code" > "Download ZIP"
# 3. Extrae en C:\Users\TuUsuario\Proyectos\somnia
# 4. Abre terminal en esa carpeta
```

### Paso 3: Configurar el Proyecto

```bash
# Instalar todas las dependencias
pnpm install

# Verificar que todo funciona
pnpm build
pnpm test
```

### Paso 4: Iniciar el Desarrollo

```bash
# Iniciar la app móvil
pnpm -F app-mobile dev

# En otra terminal, iniciar el backend (opcional)
pnpm -F backend dev
```

### Paso 5: Modificar el Código

**Estructura de archivos importantes:**
```
somnia/
├── app-mobile/
│   ├── App.tsx                    # Componente principal
│   ├── app/(tabs)/capture.tsx     # Pantalla de grabación
│   ├── src/storage/localEntries.ts # Almacenamiento local
│   └── package.json               # Dependencias móvil
├── backend/
│   ├── src/server.ts              # Servidor Fastify
│   └── package.json               # Dependencias backend
└── package.json                   # Configuración del monorepo
```

**Comandos útiles para desarrollo:**
```bash
# Ver cambios en tiempo real
pnpm -F app-mobile dev

# Linting (verificar código)
pnpm lint

# Tests
pnpm test

# Compilar
pnpm build
```

### Paso 6: Hacer Cambios y Subirlos

```bash
# 1. Hacer cambios en el código
# 2. Verificar que funciona
pnpm build
pnpm test

# 3. Agregar cambios a Git
git add .

# 4. Hacer commit
git commit -m "feat: descripción de tus cambios"

# 5. Subir a GitHub
git push origin main
```

### Paso 7: Herramientas de Desarrollo Recomendadas

**VS Code Extensions:**
- **ES7+ React/Redux/React-Native snippets**
- **TypeScript Importer**
- **Prettier - Code formatter**
- **ESLint**
- **Expo Tools**

**Configuración VS Code (.vscode/settings.json):**
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

### Paso 8: Flujo de Trabajo Típico

```bash
# 1. Actualizar código desde GitHub
git pull origin main

# 2. Crear rama para nueva funcionalidad
git checkout -b feature/mi-nueva-funcionalidad

# 3. Hacer cambios y probar
pnpm -F app-mobile dev
# ... hacer cambios ...
pnpm build
pnpm test

# 4. Commit y push
git add .
git commit -m "feat: añadir nueva funcionalidad"
git push origin feature/mi-nueva-funcionalidad

# 5. Crear Pull Request en GitHub
```

### Paso 9: Solución de Problemas Comunes

**Error: "pnpm no encontrado"**
```bash
npm install -g pnpm
```

**Error: "Metro bundler no inicia"**
```bash
# Limpiar caché
pnpm -F app-mobile start --clear
# O reiniciar completamente
rm -rf node_modules
pnpm install
```

**Error: "Puerto ocupado"**
```bash
# Usar puerto diferente
pnpm -F app-mobile dev --port 8082
```

**Error: "Git no configurado"**
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

### Paso 10: Testing en Dispositivos

**Android:**
```bash
# Instalar Android Studio
# Configurar emulador
# Ejecutar: pnpm -F app-mobile android
```

**iOS (solo macOS):**
```bash
# Instalar Xcode
# Configurar simulador
# Ejecutar: pnpm -F app-mobile ios
```

**Dispositivo Real:**
```bash
# Instalar Expo Go en tu teléfono
# Ejecutar: pnpm -F app-mobile dev
# Escanear QR con Expo Go
```

## 📦 Estructura del Proyecto

```
somnia/
├── app-mobile/          # App React Native (Expo)
│   ├── app/            # Pantallas de la app
│   ├── src/            # Código fuente
│   │   └── storage/    # Almacenamiento local
│   └── assets/         # Imágenes e iconos
├── backend/            # API Fastify (TypeScript)
│   └── src/            # Código del servidor
├── .github/            # Templates de issues
└── docs/               # Documentación
```

## 🎯 Funcionalidades Actuales (Fase 2)

### ✅ Implementado
- **Selector Voz/Texto**: Alterna entre grabación y escritura
- **Grabación de audio**: Formato .m4a de alta calidad
- **Entradas de texto**: Hasta 4000 caracteres
- **Almacenamiento unificado**: AsyncStorage para persistencia
- **Listado unificado**: Audio + texto ordenados por fecha
- **Reproducción**: Controles de audio integrados
- **Eliminación**: Borrar cualquier entrada
- **Backend Docker**: FastAPI + MinIO para almacenamiento
- **API REST**: Endpoints para subir audio y texto
- **Sistema de Jobs**: Tracking de procesamiento con job_id
- **Almacenamiento S3**: MinIO para archivos de audio
- **Sincronización**: Envío automático al backend

### 🔄 En Desarrollo
- **Análisis con IA**: Transcripción y interpretación (Fase 3)
- **Procesamiento de Jobs**: Cambio de estado pending → done

## 🛠️ Scripts Disponibles

### Scripts Principales
```bash
# Desarrollo
pnpm -F app-mobile dev     # Iniciar app móvil
pnpm -F backend dev        # Iniciar servidor backend (desarrollo local)

# Docker (Recomendado para Fase 2)
docker compose up -d --build    # Levantar backend + MinIO
docker compose down             # Parar servicios
docker compose logs api         # Ver logs del backend

# Calidad de código
pnpm lint                  # ESLint en todo el monorepo
pnpm build                 # Compilar TypeScript
pnpm test                  # Ejecutar tests

# Instalación
pnpm install               # Instalar todas las dependencias
```

### Scripts por Paquete
```bash
# App Mobile
cd app-mobile
pnpm dev                   # Expo development server
pnpm build                 # Compilar TypeScript
pnpm lint                  # Linting específico
pnpm test                  # Tests específicos

# Backend
cd backend
pnpm dev                   # Servidor Fastify
pnpm build                 # Compilar a JavaScript
pnpm start                 # Ejecutar versión compilada
```

## 🔧 Requisitos del Sistema

### Desarrollo
- **Node.js**: v18+ (recomendado v20+)
- **pnpm**: v8+ (gestor de paquetes)
- **Git**: Para clonar el repositorio

### Móvil
- **Android**: API 21+ (Android 5.0+)
- **iOS**: iOS 13.0+
- **Expo Go**: Para testing en dispositivo real

### Herramientas Opcionales
- **Android Studio**: Para emulador Android
- **Xcode**: Para simulador iOS (solo macOS)
- **VS Code**: Editor recomendado

## 📱 Cómo Usar la App

1. **Primera vez:**
   - La app pedirá permisos de micrófono
   - Acepta para poder grabar audios

2. **Grabar sueño:**
   - Selecciona "Voz" en el selector
   - Presiona "Grabar" y habla
   - Presiona "Detener" cuando termines

3. **Escribir sueño:**
   - Selecciona "Texto" en el selector
   - Escribe tu sueño (mínimo 5 caracteres)
   - Presiona "Guardar texto"

4. **Gestionar entradas:**
   - Ve la lista de todas tus entradas
   - Reproduce audios con el botón ▶️
   - Elimina entradas con el botón 🗑️

## 🐛 Solución de Problemas

### Error: "pnpm no encontrado"
```bash
# Instalar pnpm globalmente
npm install -g pnpm
```

### Error: "Metro bundler no inicia"
```bash
# Limpiar caché de Metro
pnpm -F app-mobile start --clear
```

### Error: "Permisos de micrófono"
- **Android**: Ve a Configuración > Apps > Somnia > Permisos
- **iOS**: Ve a Configuración > Privacidad > Micrófono > Somnia

### Error: "Puerto 8081 ocupado"
```bash
# Usar puerto diferente
pnpm -F app-mobile dev --port 8082
```

## 🤝 Contribuir

1. **Fork** el repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -m 'feat: añadir nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. **Abre** un Pull Request

## 🔧 Guía Rápida para Nuevo Ordenador

### ⚡ Instalación Express (5 minutos)

```bash
# 1. Clonar
git clone https://github.com/Jairogelpi/somnia.git
cd somnia

# 2. Instalar dependencias
pnpm install

# 3. Levantar backend
docker compose up -d --build

# 4. Iniciar app
pnpm -F app-mobile dev
```

### 🚨 Problemas Comunes

| Error | Solución |
|-------|----------|
| `pnpm no encontrado` | `npm install -g pnpm` |
| `Docker no encontrado` | Instalar Docker Desktop |
| `Puerto ocupado` | `pnpm -F app-mobile dev --port 8082` |
| `Backend no responde` | `docker compose restart` |
| `Metro no inicia` | `pnpm -F app-mobile start --clear` |

### 📱 Probar la App

1. **Web**: http://localhost:8081
2. **Móvil**: Instalar Expo Go y escanear QR
3. **Backend**: http://localhost:8000/health
4. **MinIO**: http://localhost:9001

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🔗 Enlaces Útiles

- **Repositorio**: [https://github.com/Jairogelpi/somnia](https://github.com/Jairogelpi/somnia)
- **Issues**: [https://github.com/Jairogelpi/somnia/issues](https://github.com/Jairogelpi/somnia/issues)
- **Expo**: [https://expo.dev](https://expo.dev)
- **Fastify**: [https://fastify.dev](https://fastify.dev)

## 📊 Estado del Proyecto

- ✅ **Fase 0**: Monorepo configurado
- ✅ **Fase 1**: Grabación de audio básica  
- ✅ **Fase 1.5**: Selector Voz/Texto con almacenamiento unificado
- ✅ **Fase 2**: Backend Docker + FastAPI + MinIO + API REST
- 🔄 **Fase 3**: IA para transcripción/análisis (planificado)

---

**¿Necesitas ayuda?** Abre un [issue](https://github.com/Jairogelpi/somnia/issues) en GitHub o contacta al desarrollador.
