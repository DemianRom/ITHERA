#  Ithera

> Ecosistema digital colaborativo para la planificación de viajes grupales en tiempo real.

**IPN ESCOM · Análisis y Diseño de Sistemas · 5CM3 · Equipo 3**

---

##  Descripción

Ithera centraliza en una sola interfaz todos los flujos de trabajo de un viaje grupal: itinerario colaborativo, presupuesto compartido, logística de transporte, bóveda de documentos y comunicación en tiempo real.

El núcleo del sistema es la sincronización multiusuario mediante WebSockets — cualquier propuesta, cambio de presupuesto o bloqueo de itinerario se refleja instantáneamente en todos los dispositivos conectados.

---

##  Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Backend | Node.js + TypeScript + Express.js |
| Real-time | Socket.io + Redis (adaptador) |
| Frontend | React.js + TypeScript + Tailwind CSS |
| Base de datos | PostgreSQL (principal) + Redis (sesiones/caché) |
| ORM | TypeORM |
| HTTP Client | Axios + React Query |
| APIs externas | Amadeus, Google Maps Platform, OpenWeatherMap, ExchangeRate-API, Navitia |

---

##  Estructura del proyecto

```
ithera/
├── .github/                   ← CI, templates de PR e issues, CODEOWNERS
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── task.md
│   ├── workflows/
│   │   ├── ci-backend.yml     ← lint + typecheck + tests + Copilot review
│   │   └── ci-frontend.yml    ← lint + typecheck + build + Copilot review
│   ├── CODEOWNERS             ← Demian asignado como reviewer automático
│   └── PULL_REQUEST_TEMPLATE.md
│
├── backend/
│   └── src/
│       ├── config/            ← db, redis, env
│       ├── domain/            ← lógica de negocio por módulo
│       │   ├── auth/
│       │   ├── groups/
│       │   ├── itinerary/
│       │   ├── proposals/
│       │   ├── budget/
│       │   └── notifications/
│       ├── infrastructure/    ← adaptadores externos
│       │   ├── db/
│       │   ├── redis/
│       │   ├── sockets/
│       │   └── external-apis/
│       ├── routes/            ← Express routers por módulo
│       └── middlewares/       ← JWT, error handler, rate limit
│
├── frontend/
│   └── src/
│       ├── components/        ← componentes React reutilizables
│       ├── pages/             ← vistas por módulo
│       ├── hooks/             ← custom hooks (socket, network)
│       ├── context/           ← AuthContext, TripContext
│       ├── services/          ← llamadas HTTP (Axios)
│       └── types/             ← TypeScript interfaces globales
│
└── docs/                      ← Documentación oficial del proyecto
    ├── requerimientos/
    ├── diagramas/
    ├── casos-de-uso/
    ├── api/
    └── ADS/
```

---

##  Módulos del sistema

| ID | Módulo |
|----|--------|
| M1 | Autenticación y Acceso |
| M2 | Gestión de Grupo |
| M3 | Itinerario Colaborativo y Colaboración |
| M4 | Búsqueda y APIs Externas |
| M5 | Sincronización en Tiempo Real |
| M6 | Presupuesto y Gastos |
| M7 | Notificaciones, Historial y Exportación |

---

##  GitFlow — Estrategia de Ramas

### Mapa de ramas

```
main ←────────────────────────── release/vX.X ←── develop ←── feature/*
  ↑                                                              ↑
hotfix/*─────────────────────────────────────────────────────────┘
```

### Tabla de ramas

| Rama | Origen | Destino | Propósito |
|------|--------|---------|-----------|
| `main` | — | — | Código estable para entrega. **CERO commits directos.** |
| `develop` | `main` | `main` (vía release) | Integración. Todo PR aprobado converge aquí. |
| `feature/nombre` | `develop` | `develop` | Nueva funcionalidad o tarea de Sprint. |
| `hotfix/nombre` | `main` | `main` + `develop` | Fix urgente sobre producción. |
| `release/vX.X` | `develop` | `main` + `develop` | Freeze para entrega académica. |

### Convención de nombres de ramas

```
feature/auth-registro-otp
feature/backend-socket-heartbeat
feature/frontend-dashboard-financiero
hotfix/fix-token-expiry
release/v1.2-sprint3
```

---

##  Protocolo de Pull Request

### Flujo completo

```
1. Partir siempre desde develop actualizado
   git checkout develop
   git pull origin develop
   git checkout -b feature/nombre

2. Desarrollar y commitear con mensajes descriptivos
   git commit -m "feat: descripción clara del cambio"

3. Sincronizar antes de abrir el PR
   git pull origin develop

4. Hacer push y abrir PR en GitHub hacia develop
   git push -u origin feature/nombre

5. El CI corre automáticamente:
   → lint + typecheck + build/tests
   → Copilot code review automático

6. Esperar aprobación del reviewer asignado (Scrum Master)

7. Solo mergear cuando el CI pasa y hay aprobación
```

### Reglas de aprobación

| PR hacia | Aprobaciones requeridas | Quién aprueba |
|----------|------------------------|---------------|
| `develop` | 1 | Scrum Master o líder de célula |
| `main` | 2 | Scrum Master + Product Owner |

>  **Nunca hagas merge de tu propio PR.** Siempre espera revisión externa.

### Mensajes de commit — Convención

```
feat:     nueva funcionalidad
fix:      corrección de bug
refactor: refactor sin cambio de comportamiento
docs:     cambios en documentación
test:     agregar o corregir tests
ci:       cambios en workflows o configuración de CI
chore:    tareas de mantenimiento
```

---

##  Branch Protection — Rulesets activos

### Ruleset `protect-main`

```
Target:               main
Enforcement:          Active
Bypass:               Repository admin (solo Scrum Master)

Reglas activas:
 Restrict deletions
Block force pushes
 Require a pull request before merging
       └ Required approvals: 2
       └ Dismiss stale reviews on new commits
       └ Require review from code owners (CODEOWNERS)
 Require status checks to pass
       └ lint-and-test (backend)
       └ lint-and-build (frontend)
```

### Ruleset `protect-develop`

```
Target:               develop
Enforcement:          Active
Bypass:               Repository admin (solo Scrum Master)

Reglas activas:
  Restrict deletions
  Block force pushes
  Require a pull request before merging
       └ Required approvals: 1
       └ Dismiss stale reviews on new commits
  Require status checks to pass
       └ lint-and-test (backend)
       └ lint-and-build (frontend)
```

---

##  CI/CD — GitHub Actions

Cada PR activa automáticamente los siguientes checks:

### Backend (`ci-backend.yml`)

```
Trigger:  PR hacia main o develop con cambios en backend/
Jobs:
  1. lint-and-test
     → npm run lint
     → npx tsc --noEmit
     → npm test
  2. request-copilot-review
     → Solicita review automático de GitHub Copilot
```

### Frontend (`ci-frontend.yml`)

```
Trigger:  PR hacia main o develop con cambios en frontend/
Jobs:
  1. lint-and-build
     → npm run lint
     → npx tsc --noEmit
     → npm run build
  2. request-copilot-review
     → Solicita review automático de GitHub Copilot
```

> El CI debe pasar **obligatoriamente** antes de que cualquier PR pueda mergearse, sin excepciones.

---

##  Configuración local

```bash
# 1. Clonar
git clone https://github.com/ximcaher20/repo-equipo3ads
cd ithera

# 2. Variables de entorno
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edita los .env con tus credenciales locales

# 3. Instalar dependencias
cd backend && npm install
cd ../frontend && npm install

# 4. Correr en desarrollo
cd backend && npm run dev
cd ../frontend && npm run dev
```

---

## 👥 Equipo

| Rol | Integrante | GitHub |
|-----|-----------|--------|
| Scrum Master | Demian Romero Bautista | @DemianRomero |
| Product Owner | Ximena Cárdenas Hernández | @ximcaher20 |
| Líder Backend | Hector Said Ferreira Rodríguez | @HectorSaidFerreira |
| Backend Dev | Ali Yair Riaño Ortiz | @AliYairRiano |
| Backend Dev | Yael Sebastián Sangrador Curiel | @YaelSangrador |
| Backend Dev | Leonardo Esaú Olivares Valdez | @LeonardoOlivares |
| Líder Frontend | Bryan Ayala Baños | @BryanAyala |
| Frontend Dev | Carlos Daniel Juárez Gómez | @CarlosDanielJuarez |
| Frontend Dev | Kevin Antonio López Toledo | @KevinLopez |
| Líder Docs | Gabriel Hernández Flores | @GabrielHernandez |
| Analista | Emilio Díaz Maturano | @EmilioDiaz |
| Analista | Edgar Correa Cano | @EdgarCorrea |

---

## 🔗 Recursos

-  [Tablero Notion](https://www.notion.so/3169d31c051280f69a33cb0401001bd0)
-  [Seguimiento Google Sheets](https://docs.google.com/spreadsheets/d/1usizFziQstavDTBPxTMygbx_ATeBYn-N/edit)
-  Documentación completa en `/docs`

---

*Proyecto académico — IPN ESCOM 2026 · Equipo 3*