# Innovatube Backend

API RESTful para la gestion de videos y favoritos, con autenticacion segura y proteccion contra bots.

## Tecnologias

- **Runtime:** Node.js 20
- **Framework:** NestJS 10
- **ORM:** Prisma 7
- **Base de datos:** PostgreSQL (Neon)
- **Autenticacion:** JWT (Passport.js)
- **Proteccion:** Google reCAPTCHA v3 (modo invisible)
- **Validacion:** class-validator + Zod (entornos)
- **Containerizacion:** Docker
- **Deploy:** Vercel / Docker

## Variables de entorno

Copiar `.env.template` a `.env` y completar:

```
PORT=3000
DATABASE_URL=postgresql://user:password@host/dbname
ALLOWED_ORIGINS=http://localhost:3000,https://tu-frontend.com
JWT_SECRET=tu-secreto-jwt
JWT_REFRESH_SECRET=tu-secreto-refresh
RECAPTCHA_SECRET_KEY=tu-clave-secreta-recaptcha
NODE_ENV=development
```

## Autenticacion JWT

El sistema usa **JWT (JSON Web Tokens)** con dos tipos de tokens:

- **Access Token:** vida corta (15 minutos), usado para acceder a rutas protegidas.
- **Refresh Token:** vida larga, usado para obtener un nuevo access token sin reiniciar sesion.

### Flujo de autenticacion

1. **Registro:** El usuario envia email, contraseña, nombre y un `recaptchaToken`. Se valida el captcha, se hashea la contraseña con bcrypt y se crean ambos tokens.
2. **Login:** Se validan credenciales y se retornan access y refresh tokens.
3. **Refresh:** Se envia el refresh token y se retornan nuevos tokens.

## Google reCAPTCHA v3 (Invisible)

El backend integra **reCAPTCHA v3 en modo invisible** para proteger el endpoint de registro contra bots y abuso.

### Como funciona

1. El frontend carga el script de reCAPTCHA v3 y ejecuta `grecaptcha.execute()` al enviar el formulario de registro, generando un token.
2. El frontend envia el `recaptchaToken` junto con los datos de registro al backend.
3. El backend verifica el token con Google usando la **Secret Key** (`RECAPTCHA_SECRET_KEY`).
4. Google retorna un score de 0.0 a 1.0. Si el score es **>= 0.5**, se permite el registro.

## Docker

El proyecto incluye un `Dockerfile` multi-stage para produccion:

```bash
# Construir imagen
docker build -t innovatube-backend .

# Ejecutar
docker run -p 3000:3000 --env-file .env innovatube-backend
```

## Base de datos (Neon)

El proyecto usa **Neon** como proveedor de PostgreSQL en la nube.

### Configuracion

1. Crear una cuenta en [Neon](https://neon.tech).
2. Crear un proyecto y copiar la `DATABASE_URL` del dashboard.
3. Ejecutar las migraciones:

```bash
npx prisma migrate deploy
```

### Modelos

- **User:** Usuarios con email unico y contraseña hasheada.
- **Video:** Videos de YouTube con metadatos.
- **Favorite:** Relacion usuario-video para favoritos (unica por usuario).
- **PasswordResetToken:** Tokens temporales para recuperacion de contraseña.

## Instalacion y ejecucion

```bash
# Instalar dependencias
npm install

# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy

# Desarrollo
npm run start:dev

# Produccion
npm run build
npm run start:prod
```
