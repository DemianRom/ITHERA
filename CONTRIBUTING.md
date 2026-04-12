# 🤝 Guía de Contribución — Ithera

Este documento define el flujo de trabajo obligatorio para todos los integrantes del equipo. Léelo completo antes de hacer tu primer commit.

---

## 📋 Índice

1. [Configuración inicial](#-configuración-inicial)
2. [Estrategia de ramas](#-estrategia-de-ramas)
3. [Flujo de trabajo diario](#-flujo-de-trabajo-diario)
4. [Convención de commits](#-convención-de-commits)
5. [Proceso de Pull Request](#-proceso-de-pull-request)
6. [CI — Qué revisa automáticamente](#-ci--qué-revisa-automáticamente)
7. [Qué hacer si el CI falla](#-qué-hacer-si-el-ci-falla)
8. [Reglas de oro](#-reglas-de-oro)

---

## 🔧 Configuración inicial

Antes de tocar código, configura tu identidad en Git:

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@correo.com"
```

Clona el repo y entra a la carpeta:

```bash
git clone https://github.com/ximcaher20/repo-equipo3ads
cd ithera
```

Instala dependencias:

```bash
cd backend && npm install
cd ../frontend && npm install
```

Copia y configura variables de entorno:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edita ambos archivos con tus credenciales locales
```

---

## 🌿 Estrategia de ramas

### Ramas permanentes (nunca se borran)

| Rama | Propósito |
|------|-----------|
| `main` | Código estable para entrega. **CERO commits directos.** |
| `develop` | Integración. Todo el trabajo aprobado llega aquí. |

### Ramas temporales (se crean y se borran)

| Rama | Origen | Destino | Cuándo usarla |
|------|--------|---------|---------------|
| `feature/nombre` | `develop` | `develop` | Nueva funcionalidad o tarea |
| `hotfix/nombre` | `main` | `main` + `develop` | Bug urgente en producción |
| `release/vX.X` | `develop` | `main` + `develop` | Cierre de sprint / entrega |

### Convención de nombres

```
feature/auth-registro-otp
feature/backend-socket-heartbeat
feature/frontend-dashboard-viaje
hotfix/fix-token-expiry
hotfix/fix-socket-disconnect
release/v1.0-sprint1
release/v1.2-sprint3
```

> Usa kebab-case, sin mayúsculas, sin espacios, sin caracteres especiales.

---

## 🔄 Flujo de trabajo diario

### Iniciar una tarea nueva

```bash
# 1. Siempre parte desde develop actualizado
git checkout develop
git pull origin develop

# 2. Crea tu rama
git checkout -b feature/nombre-de-tu-tarea

# 3. Trabaja y commitea
git add .
git commit -m "feat: descripción de lo que hiciste"
```

### Antes de abrir el PR

```bash
# Sincroniza con develop para evitar conflictos
git checkout develop
git pull origin develop
git checkout feature/nombre-de-tu-tarea
git merge develop

# Resuelve conflictos si los hay, luego:
git push -u origin feature/nombre-de-tu-tarea
```

### Abrir el PR

1. Ve al repo en GitHub
2. Aparecerá un banner "Compare & pull request" — haz clic
3. Asegúrate de que el PR apunta a **`develop`**, no a `main`
4. Llena el template completo
5. Espera a que el CI pase y el Scrum Master apruebe

---

## ✍️ Convención de commits

Todo commit debe seguir este formato:

```
tipo: descripción corta en presente e imperativo
```

### Tipos válidos

| Tipo | Cuándo usarlo |
|------|--------------|
| `feat` | Nueva funcionalidad |
| `fix` | Corrección de bug |
| `refactor` | Cambio de código sin cambiar comportamiento |
| `docs` | Solo documentación |
| `test` | Agregar o corregir tests |
| `ci` | Cambios en workflows o configuración CI |
| `chore` | Mantenimiento, dependencias, config |
| `style` | Formato, espacios, comas (sin cambio de lógica) |

### Ejemplos correctos

```
feat: agregar endpoint de registro de usuario
fix: corregir validación de token expirado
refactor: extraer lógica de cálculo de saldos a helper
docs: agregar documentación de endpoints de autenticación
test: agregar tests unitarios para budget.service
ci: agregar step de type check al workflow de backend
chore: actualizar dependencias de Express a v5
```

### Ejemplos incorrectos ❌

```
fix cosas
WIP
cambios
actualización
arreglé el bug ese del login
```

---

## 🔀 Proceso de Pull Request

### Checklist antes de abrir el PR

- [ ] Mi rama parte de `develop` actualizado
- [ ] El lint pasa sin errores (`npm run lint`)
- [ ] El type check pasa (`npx tsc --noEmit`)
- [ ] Probé los cambios localmente
- [ ] No hay `console.log` de debugging
- [ ] No subí archivos `.env` ni secrets
- [ ] El PR apunta a `develop` (no a `main`)

### Reglas de aprobación

| PR hacia | Aprobaciones requeridas | Quién aprueba |
|----------|------------------------|---------------|
| `develop` | 1 | Scrum Master o líder de célula |
| `main` | 2 | Scrum Master + Product Owner |

### Lo que pasa automáticamente cuando abres un PR

1. **CI corre** — lint, type check, build/tests
2. **Copilot** se agrega como reviewer automático y comenta el código
3. **Scrum Master** recibe notificación para revisar
4. Si todo pasa → se puede mergear
5. Si algo falla → hay que corregir antes de pedir review

> ⚠️ **Nunca hagas merge de tu propio PR.** Sin excepciones.

---

## 🤖 CI — Qué revisa automáticamente

Cada PR activa GitHub Actions que corre:

### Backend
```
✅ npm run lint          — ESLint sin errores
✅ npx tsc --noEmit      — TypeScript sin errores de tipos
✅ npm test              — Tests unitarios
✅ Copilot code review   — Revisión automática de IA
```

### Frontend
```
✅ npm run lint          — ESLint sin errores
✅ npx tsc --noEmit      — TypeScript sin errores de tipos
✅ npm run build         — Build de producción exitoso
✅ Copilot code review   — Revisión automática de IA
```

El CI **debe pasar obligatoriamente** antes de que cualquier PR pueda mergearse.

---

## 🔧 Qué hacer si el CI falla

### Falla el lint

```bash
# Ver errores específicos
npm run lint

# Muchos errores de formato se auto-corrigen con:
npm run lint -- --fix
```

### Falla el type check

```bash
npx tsc --noEmit
# Lee el error, busca el archivo y línea indicada, corrige el tipo
```

### Falla el build (frontend)

```bash
npm run build
# Generalmente es un error de tipos o import incorrecto
# Lee la salida del build para identificar el archivo
```

### Falla en CI pero no en local

```bash
# Asegúrate de que package-lock.json está actualizado
npm install
git add package-lock.json
git commit -m "chore: actualizar package-lock.json"
git push
```

---

## Reglas de oro

```
1. NUNCA hagas push directo a main o develop
2. NUNCA hagas merge de tu propio PR
3. SIEMPRE parte de develop actualizado al crear una rama
4. SIEMPRE llena el PR template completo
5. SIEMPRE espera a que el CI pase antes de pedir review
6. NUNCA subas archivos .env al repo
7. Un PR = una funcionalidad o fix. PRs pequeños son más fáciles de revisar.
```

---

##  Dudas

Cualquier duda sobre el flujo de trabajo, pregunta en el canal del equipo o abre un Issue con el template de `task`.

---

*IPN ESCOM 2026 · Equipo 3 · Ithera*