# Krypnova Landing Page

Landing page premium de Krypnova lista para Vercel, con formulario conectado a PostgreSQL y correos automáticos con Resend.

## Stack

- Next.js 14
- TypeScript
- PostgreSQL
- Resend
- Vercel

## Contacto principal

PedroV@krypnova.com

## Formulario profesional

El formulario captura:

- First Name
- Last Name
- Business Email
- Phone Number
- Company
- Job Title
- Country
- Trading Experience
- Markets of Interest: Crypto, Stocks, Options, Forex, Futures, Multi-Asset
- Trading Style
- Portfolio Size
- Main Goal

## Variables de entorno

Crear estas variables en Vercel:

```bash
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
RESEND_API_KEY=re_YOUR_RESEND_API_KEY
LEAD_NOTIFICATION_EMAIL=PedroV@krypnova.com
RESEND_FROM_EMAIL=Krypnova <noreply@krypnova.com>
```

## Crear tabla en PostgreSQL

Si todavía no creaste la tabla, ejecuta:

```bash
postgres-schema.sql
```

Si ya creaste la tabla anterior, ejecuta:

```bash
postgres-migration-add-lead-profile.sql
```

## Ejecutar localmente

```bash
npm install
npm run dev
```

## Deploy en Vercel

1. Subir este proyecto a GitHub.
2. Entrar a Vercel.
3. Importar el repositorio.
4. Agregar variables de entorno.
5. Deploy.
6. Conectar dominio `krypnova.com`.

## Flujo profesional

Landing Page → API Route `/api/leads` → PostgreSQL `leads` → Resend → PedroV@krypnova.com
