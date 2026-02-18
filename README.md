### Usuario administrador por defecto
Se crea automaticamente si la tabla de usuarios esta vacia.

- Username: `admin`
- Email: `admin@ksports.local`
- Password: `Admin@1234!`

---

## Configuración

Crear un archivo `.env` en la raíz del proyecto:

```env
# Server
NODE_ENV=development
PORT=3005

MONGODB_URI=mongodb://localhost:27017/opinion_system

# Database PostgreSQL
DB_HOST=localhost
DB_PORT=5435
DB_NAME=GestorOpiniones
DB_USERNAME=root
DB_PASSWORD=admin
DB_SQL_LOGGING=false

# JWT Configuration
JWT_SECRET=MyVerySecretKeyForJWTTokenAuthenticationWith256Bits!
JWT_EXPIRES_IN=30m
JWT_REFRESH_EXPIRES_IN=7d
JWT_ISSUER=AuthService
JWT_AUDIENCE=AuthService

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_ENABLE_SSL=true
SMTP_USERNAME=kinalsports@gmail.com
SMTP_PASSWORD=yrsd prvf kwat toee
EMAIL_FROM=kinalsports@gmail.com
EMAIL_FROM_NAME=AuthDotnet App

# Cloudinary (upload de perfiles)
CLOUDINARY_CLOUD_NAME=dut08rmaz
CLOUDINARY_API_KEY=279612751725163
CLOUDINARY_API_SECRET=UxGMRqU1iB580Kxb2AlDR4n4hu0
CLOUDINARY_BASE_URL=https://res.cloudinary.com/dut08rmaz/image/upload/
CLOUDINARY_FOLDER=auth_service/profiles
CLOUDINARY_DEFAULT_AVATAR_FILENAME=default-avatar_ewzxwx.png

# File Upload
UPLOAD_PATH=./uploads

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Security
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
ADMIN_ALLOWED_ORIGINS=http://localhost:5173

# Verification Tokens (en horas)
VERIFICATION_EMAIL_EXPIRY_HOURS=24
PASSWORD_RESET_EXPIRY_HOURS=1
```

## Ejecución

```bash
docker compose up -d

pnpm install

pnpm run dev

crear el .env 

El servidor estará disponible en: `http://localhost:3005/api/v1`

---

## Endpoints - Referencia Completa



**Respuesta (200):**
```json
{
  "status": "Healthy",
  "timestamp": "2026-02-17T10:30:00.000Z",
  "service": "Gestor de Opiniones"
}
```

---

## Autenticación (Authentication)

### POST `/auth/register`
Registra un nuevo usuario.

**cURL:**
```bash
curl -X POST http://localhost:3005/api/v1/auth/register \
  -F "name=Juan" \
  -F "surname=Pérez" \
  -F "username=juanperez" \
  -F "email=juan@example.com" \
  -F "password=Password123!" \
  -F "phone=12345678"
```

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "uuid",
    "name": "Juan",
    "email": "juan@example.com"
  },
  "token": "jwt_token"
}
```

---

### POST `/auth/login`
Autentica un usuario.

**cURL:**
```bash
curl -X POST http://localhost:3005/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrUsername": "juanperez",
    "password": "Password123!"
  }'
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Login exitoso",
  "user": {
    "id": "uuid",
    "name": "Juan",
    "email": "juan@example.com",
    "roles": ["USER"]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```



### POST `/auth/verify-email`
Verifica el email del usuario usando el token enviado por correo.

**cURL:**
```bash
curl -X POST http://localhost:3005/api/v1/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_VERIFICATION_TOKEN"
  }'
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Email verificado exitosamente"
}
```

**Errores:**
- **400:** Token inválido o expirado

---

### POST `/auth/resend-verification`
Reenvía el email de verificación a un usuario.

**cURL:**
```bash
curl -X POST http://localhost:3005/api/v1/auth/resend-verification \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com"
  }'
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Email de verificación reenviado exitosamente"
}
```

**Errores:**
- **404:** Usuario no encontrado

---

### POST `/auth/forgot-password`
Inicia el proceso de recuperación de contraseña enviando un email con el token.

**cURL:**
```bash
curl -X POST http://localhost:3005/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com"
  }'
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Instrucciones de recuperación enviadas al email"
}
```

---

### POST `/auth/reset-password`
Cambia la contraseña usando el token de recuperación.

**cURL:**
```bash
curl -X POST http://localhost:3005/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_RESET_TOKEN",
    "newPassword": "NewPassword123!"
  }'
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Contraseña actualizada exitosamente"
}
```

**Errores:**
- **400:** Token inválido o expirado
- **400:** Contraseña no cumple requisitos de seguridad

---

### GET `/auth/profile`
Obtiene el perfil del usuario autenticado.

**cURL:**
```bash
curl -X GET http://localhost:3005/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Respuesta (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "name": "Juan",
    "email": "juan@example.com",
    "roles": ["USER"]
  }
}
```

---

### POST `/auth/profile/by-id`
Obtiene el perfil de un usuario específico usando su ID.

**cURL:**
```bash
curl -X POST http://localhost:3005/api/v1/auth/profile/by-id \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "target-user-id"
  }'
```

**Respuesta (200):**
```json
{
  "success": true,
  "user": {
    "id": "target-user-id",
    "name": "Juan",
    "surname": "Pérez",
    "username": "juanperez",
    "email": "juan@example.com",
    "profilePicture": "https://...",
    "roles": ["USER"]
  }
}
```

**Errores:**
- **400:** userId no proporcionado
- **404:** Usuario no encontrado

---

## Publicaciones (Posts)

### GET `/posts`
Obtiene todas las publicaciones con paginación y filtros.

**cURL - Sin filtros:**
```bash
curl http://localhost:3005/api/v1/posts
```

**cURL - Con paginación:**
```bash
curl "http://localhost:3005/api/v1/posts?page=1&limit=10"
```

**cURL - Filtrar por categoría:**
```bash
curl "http://localhost:3005/api/v1/posts?category=Technology&limit=10"
```

**cURL - Búsqueda de texto:**
```bash
curl "http://localhost:3005/api/v1/posts?search=nodejs&page=1"
```

**Parámetros Query:**
- `page`: Número de página (default: 1)
- `limit`: Posts por página (default: 10)
- `category`: Technology, Politics, Sports, Entertainment, Education, Health, Business, Other
- `search`: Buscar en título y contenido

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Posts retrieved successfully",
  "data": {
    "posts": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "userId": "user-uuid",
        "userName": "Juan Pérez",
        "title": "Mi opinión sobre Node.js",
        "category": "Technology",
        "content": "Node.js es excelente para crear aplicaciones backend...",
        "commentsCount": 5,
        "createdAt": "2026-02-17T10:30:00.000Z",
        "updatedAt": "2026-02-17T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 45,
      "pages": 5,
      "currentPage": 1,
      "limit": 10
    }
  }
}
```

---

### GET `/posts/:postId`
Obtiene una publicación específica con todos sus comentarios.

**cURL:**
```bash
curl http://localhost:3005/api/v1/posts/507f1f77bcf86cd799439011
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Post retrieved successfully",
  "data": {
    "post": {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "user-uuid",
      "userName": "Juan Pérez",
      "title": "Mi opinión sobre Node.js",
      "category": "Technology",
      "content": "Node.js es excelente...",
      "commentsCount": 2
    },
    "comments": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "postId": "507f1f77bcf86cd799439011",
        "userId": "user-uuid-2",
        "userName": "María López",
        "content": "Excelente punto de vista"
      }
    ]
  }
}
```

---

### POST `/posts`
Crea una nueva publicación (requiere autenticación).

**cURL:**
```bash
curl -X POST http://localhost:3005/api/v1/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi opinión sobre Node.js",
    "category": "Technology",
    "content": "Node.js es excelente para crear aplicaciones backend escalables. Permite manejar múltiples conexiones simultáneamente."
  }'
```

**Validaciones:**
- titulo: 3-200 caracteres
- categoria: Technology, Politics, Sports, Entertainment, Education, Health, Business, Other
- contenido: 10-5000 caracteres

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "your-user-id",
    "userName": "Tu Nombre",
    "title": "Mi opinión sobre Node.js",
    "category": "Technology",
    "commentsCount": 0
  }
}
```

---

### PUT `/posts/:postId`
Edita una publicación (solo el propietario).

**cURL:**
```bash
curl -X PUT http://localhost:3005/api/v1/posts/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
    -d '{
        "title": "Título actualizado",
        "category": "Politics",
        "content": "Contenido actualizado..."
    }'
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Título actualizado"
  }
}
```

---

### DELETE `/posts/:postId`
Elimina una publicación y sus comentarios (solo el propietario).

**cURL:**
```bash
curl -X DELETE http://localhost:3005/api/v1/posts/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

---

### GET `/posts/user/:userId`
Obtiene publicaciones de un usuario específico.

**cURL:**
```bash
curl "http://localhost:3005/api/v1/posts/user/your-user-id?page=1&limit=10"
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "User posts retrieved successfully",
  "data": {
    "posts": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "userId": "your-user-id",
        "userName": "Tu Nombre",
        "title": "Mi opinión...",
        "category": "Technology",
        "commentsCount": 5
      }
    ],
    "pagination": {
      "total": 1,
      "pages": 1,
      "currentPage": 1,
      "limit": 10
    }
  }
}
```

---

## Comentarios (Comments)

### GET `/comments/post/:postId`
Obtiene comentarios de una publicación.

**cURL:**
```bash
curl "http://localhost:3005/api/v1/comments/post/6995177abfdd16472ffbd634"
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Comments retrieved successfully",
  "data": {
    "comments": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "postId": "507f1f77bcf86cd799439011",
        "userId": "user-id-2",
        "userName": "María López",
        "content": "Excelente punto de vista"
      }
    ],
    "pagination": {
      "total": 5,
      "pages": 1,
      "currentPage": 1,
      "limit": 20
    }
  }
}
```

---

### GET `/comments/:commentId`
Obtiene un comentario específico.

**cURL:**
```bash
curl http://localhost:3005/api/v1/comments/507f1f77bcf86cd799439012
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Comment retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "postId": "507f1f77bcf86cd799439011",
    "userId": "user-id-2",
    "userName": "María López",
    "content": "Excelente punto de vista"
  }
}
```

---

### POST `/comments/post/:postId`
Crea un nuevo comentario (requiere autenticación).

**cURL:**
```bash
curl -X POST http://localhost:3005/api/v1/comments/post/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Excelente punto de vista sobre Node.js"
  }'
```

**Validaciones:**
- contenido: 1-2000 caracteres

**Respuesta (201):**
```json
{
  "success": true,
  "message": "Comment created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "postId": "507f1f77bcf86cd799439011",
    "userId": "your-user-id",
    "userName": "Tu Nombre",
    "content": "Excelente punto de vista sobre Node.js"
  }
}
```

---

### PUT `/comments/:commentId`
Edita un comentario (solo el propietario).

**cURL:**
```bash
curl -X PUT http://localhost:3005/api/v1/comments/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Excelente punto de vista, totalmente de acuerdo"
  }'
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Comment updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "content": "Excelente punto de vista, totalmente de acuerdo"
  }
}
```

---

### DELETE `/comments/:commentId`
Elimina un comentario (solo el propietario).

**cURL:**
```bash
curl -X DELETE http://localhost:3005/api/v1/comments/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

---

## Usuarios (Users)

### GET `/users/:userId/roles`
Obtiene los roles de un usuario.

**cURL:**
```bash
curl http://localhost:3005/api/v1/users/your-user-id/roles
```

**Respuesta (200):**
```json
{
  "success": true,
  "roles": ["USER"]
}
```

---

### PUT `/users/:userId/role`
Actualiza rol del usuario (requiere ser ADMIN).

**cURL:**
```bash
curl -X PUT http://localhost:3005/api/v1/users/target-user-id/role \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "roleName": "ADMIN"
  }'
```

**Respuesta (200):**
```json
{
  "success": true,
  "message": "Rol actualizado exitosamente",
  "user": {
    "id": "target-user-id",
    "name": "Usuario",
    "roles": ["ADMIN"]
  }
}
```


## Categorías de Publicaciones

```
- Technology
- Politics
- Sports
- Entertainment
- Education
- Health
- Business
- Other
```