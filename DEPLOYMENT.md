# 🚀 Guía de Deployment

Esta guía te ayudará a desplegar el Dashboard Plan Indicativo en Render (Backend) y Vercel (Frontend).

## 📋 Pre-requisitos

- [ ] Cuenta en [GitHub](https://github.com)
- [ ] Cuenta en [Render](https://render.com)
- [ ] Cuenta en [Vercel](https://vercel.com)
- [ ] Archivo `PlanIndicativo.xlsx` listo en `backend/data/`

---

## 1️⃣ Preparar Repositorio Git

### Crear el repositorio en GitHub

1. Ve a [GitHub](https://github.com/new)
2. Crea un nuevo repositorio (ej: `dashboard-plan-indicativo`)
3. **NO inicialices** con README, .gitignore o licencia (ya los tenemos)
4. Copia la URL del repositorio (ej: `https://github.com/tu-usuario/dashboard-plan-indicativo.git`)

### Inicializar Git localmente

Abre la terminal en la raíz del proyecto y ejecuta:

```bash
# Inicializar repositorio Git
git init

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit: Dashboard Plan Indicativo v1.0"

# Agregar el repositorio remoto (reemplaza con tu URL)
git remote add origin https://github.com/tu-usuario/dashboard-plan-indicativo.git

# Subir a GitHub
git branch -M main
git push -u origin main
```

---

## 2️⃣ Deploy Backend en Render

### Paso 1: Conectar Repositorio

1. Ve a [Render Dashboard](https://dashboard.render.com/)
2. Click en **"New +"** → **"Web Service"**
3. Conecta tu cuenta de GitHub
4. Selecciona el repositorio `dashboard-plan-indicativo`

### Paso 2: Configurar el Servicio

Completa los siguientes campos:

- **Name**: `plan-indicativo-backend` (o el que prefieras)
- **Region**: `Oregon (US West)` (o el más cercano)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: `Free` (o el que prefieras)

### Paso 3: Variables de Entorno

En la sección **Environment**, agrega:

```
NODE_ENV=production
```

**Opcional**: Si deseas restringir CORS, agrega:

```
FRONTEND_URL=https://tu-dominio-vercel.vercel.app
```

### Paso 4: Configurar Health Check

- **Health Check Path**: `/health`

### Paso 5: Deploy

1. Click en **"Create Web Service"**
2. Espera a que termine el build (puede tomar 2-5 minutos)
3. Una vez completado, copia la URL del backend (ej: `https://plan-indicativo-backend.onrender.com`)

### ⚠️ Importante: Subir el Excel

Render no tiene acceso a tus archivos locales. Debes asegurarte de que `backend/data/PlanIndicativo.xlsx` esté en el repositorio de Git.

**Opciones:**

1. **Subir el Excel al repositorio** (recomendado para pruebas):
   ```bash
   git add backend/data/PlanIndicativo.xlsx
   git commit -m "Add PlanIndicativo.xlsx"
   git push
   ```

2. **Usar variables de entorno** (para producción con datos sensibles):
   - Convertir Excel a JSON
   - Guardar en variable de entorno o base de datos

---

## 3️⃣ Deploy Frontend en Vercel

### Paso 1: Preparar Variables de Entorno

1. Crea el archivo `.env` en `frontend/` (basado en `.env.example`):

```bash
VITE_API_URL=https://plan-indicativo-backend.onrender.com
```

**Reemplaza** con la URL de tu backend de Render del paso anterior.

### Paso 2: Conectar con Vercel

1. Ve a [Vercel Dashboard](https://vercel.com/new)
2. Importa tu proyecto desde GitHub
3. Selecciona el repositorio `dashboard-plan-indicativo`

### Paso 3: Configurar el Proyecto

Vercel detectará automáticamente que es un proyecto Vite. Configura:

- **Framework Preset**: `Vite`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (autodetectado)
- **Output Directory**: `dist` (autodetectado)
- **Install Command**: `npm install` (autodetectado)

### Paso 4: Variables de Entorno

En la sección **Environment Variables**, agrega:

```
VITE_API_URL=https://plan-indicativo-backend.onrender.com
```

**Importante**: Usa la URL exacta de tu backend de Render (sin `/` al final).

### Paso 5: Deploy

1. Click en **"Deploy"**
2. Espera a que termine el build (1-2 minutos)
3. ¡Tu aplicación está lista! 🎉

---

## 4️⃣ Verificar el Deployment

### Backend (Render)

Prueba estos endpoints:

```
https://tu-backend.onrender.com/health
https://tu-backend.onrender.com/api/metas
https://tu-backend.onrender.com/api/metrics/global
```

### Frontend (Vercel)

1. Abre la URL de Vercel en tu navegador
2. Verifica que el dashboard cargue correctamente
3. Comprueba que las métricas se muestren
4. Navega entre Dashboard y Metas

---

## 5️⃣ Actualizar CORS en Backend (Opcional)

Si configuraste `FRONTEND_URL`, actualiza la variable de entorno en Render:

1. Ve a tu servicio en Render
2. **Settings** → **Environment**
3. Edita `FRONTEND_URL` con tu URL de Vercel
4. Guarda y espera a que se reinicie el servicio

---

## 🔄 Actualizaciones Futuras

Cuando hagas cambios en el código:

```bash
# Hacer cambios en el código
git add .
git commit -m "Descripción de los cambios"
git push

# Render y Vercel harán auto-deploy automáticamente
```

---

## 🐛 Solución de Problemas

### Error: "Cannot find module 'xlsx'"

**Solución**: Asegúrate de que `package.json` tenga todas las dependencias y que el `Build Command` sea `npm install`.

### Error: CORS en producción

**Solución**: Verifica que:
1. La URL del backend en `VITE_API_URL` sea correcta (sin `/` al final)
2. El backend tenga configurado CORS correctamente
3. La variable `FRONTEND_URL` en Render apunte a tu dominio de Vercel

### Frontend muestra "Cargando datos..." indefinidamente

**Solución**:
1. Verifica que el backend esté funcionando (visita `/health`)
2. Abre la consola del navegador (F12) para ver errores
3. Confirma que `VITE_API_URL` esté configurada en Vercel

### Backend no encuentra el Excel

**Solución**:
1. Verifica que el archivo esté en el repositorio de Git
2. Confirma que la ruta sea `backend/data/PlanIndicativo.xlsx`
3. Revisa los logs de Render para errores

### Render: "This service is taking longer than expected to respond"

**Solución**: El plan gratuito de Render "duerme" después de inactividad. La primera carga puede tomar 30-60 segundos. Considera:
1. Usar un plan pagado
2. Implementar un "keep-alive" ping
3. Avisar a los usuarios que la primera carga es lenta

---

## 📊 Costos

- **GitHub**: Gratis para repositorios públicos y privados
- **Render**: 
  - Free tier: 750 horas/mes gratis
  - Limitación: Se duerme después de 15 min de inactividad
- **Vercel**:
  - Free tier: 100 GB bandwidth/mes
  - Ilimitados deploys

---

## ✅ Checklist Final

- [ ] Repositorio creado en GitHub
- [ ] Código subido a GitHub
- [ ] Backend desplegado en Render
- [ ] URL del backend copiada
- [ ] Variable `VITE_API_URL` configurada en Vercel
- [ ] Frontend desplegado en Vercel
- [ ] Health check del backend funciona
- [ ] Dashboard carga correctamente
- [ ] Navegación entre páginas funciona
- [ ] Gráficos se visualizan
- [ ] Datos se cargan desde el backend

---

## 🎉 ¡Listo!

Tu Dashboard Plan Indicativo está ahora en producción y accesible desde cualquier lugar.

**URLs de acceso:**
- Frontend: `https://tu-proyecto.vercel.app`
- Backend: `https://tu-backend.onrender.com`

---

**Desarrollado para la Alcaldía de Gachancipá** 🏛️
