# 🔑 Comandos para Subir a GitHub

## Si tienes problemas con el push, prueba estas opciones:

### Opción 1: Reintentar el push simple
```bash
cd "c:/Users/pipet/Desktop/Global Analitik/Dashboard web/Metas Dashboard/plan-indicativo-dashboard"
git push -u origin main
```

### Opción 2: Usar GitHub CLI (si lo tienes instalado)
```bash
gh auth login
git push -u origin main
```

### Opción 3: Usar SSH en lugar de HTTPS
```bash
# Cambiar la URL remota a SSH
git remote set-url origin git@github.com:Cracklord98/dashboard-plan-indicativo-gachancipa.git
git push -u origin main
```

### Opción 4: Usar token de acceso personal
```bash
# Primero crea un token en: https://github.com/settings/tokens
# Luego usa:
git push -u origin main
# Te pedirá usuario y contraseña (usa el token como contraseña)
```

### Opción 5: Usar GitHub Desktop
1. Descarga GitHub Desktop: https://desktop.github.com/
2. File → Add Local Repository
3. Selecciona la carpeta del proyecto
4. Publish repository

## ✅ Verificar que el código se subió
Visita: https://github.com/Cracklord98/dashboard-plan-indicativo-gachancipa

Deberías ver todos tus archivos ahí.

## 📝 Repositorio Configurado
- **URL**: https://github.com/Cracklord98/dashboard-plan-indicativo-gachancipa.git
- **Rama**: main
- **Commit inicial**: ✅ Listo
- **Archivos**: 33 archivos listos para subir

## Error 503/500
Si ves estos errores, significa que GitHub tiene problemas temporales del servidor.
Espera unos minutos y vuelve a intentar.
