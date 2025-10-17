import express from 'express'
import cors from 'cors'
import mysql from 'mysql2/promise'
import bcrypt from 'bcrypt'

const app = express()
const PORT = process.env.PORT || 3000

// Configuración de conexión (usa variables de entorno si están presentes)
const DB_HOST = process.env.DB_HOST || 'localhost'
const DB_PORT = process.env.DB_PORT || 3306
const DB_USER = process.env.DB_USER || 'root'
const DB_PASS = process.env.DB_PASS || ''
const DB_NAME = process.env.DB_NAME || 'test'
const USERS_TABLE = process.env.USERS_TABLE || 'users'

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())

// Helper: obtener conexión
async function getConnection() {
  return mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
  })
}

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente')
})

// Ruta validar (puedes mejorar con sesiones)
app.get('/validar', (req, res) => {
  res.status(200).json({ mensaje: 'Sesión válida' })
})

// Ruta login: consulta la tabla de usuarios por email o usuario
app.get('/login', async (req, res) => {
  try {
    const { usuario, clave, email, password } = req.query
    const userField = email || usuario
    const passField = password || clave

    if (!userField || !passField) {
      return res.status(400).json({ mensaje: 'Faltan credenciales' })
    }

  // (Logs depuración eliminados)

    const conn = await getConnection()
    // Suponemos que la tabla tiene columnas 'email' y 'password' (ajusta si es diferente)
    const [rows] = await conn.execute(
      `SELECT * FROM ${USERS_TABLE} WHERE email = ? OR usuario = ? LIMIT 1`,
      [userField, userField]
    )
    await conn.end()

  // filas encontradas:

    if (rows.length === 0) {
      return res.status(401).json({ mensaje: 'Usuario o clave incorrectos' })
    }

    const user = rows[0]

    // Comprobación de contraseña: si la contraseña en DB parece bcrypt ($2y$/$2b$) la usamos
    const dbPass = user.password || user.clave || ''
    // debug: muestra parte del hash si es necesario
    const isBcrypt = typeof dbPass === 'string' && dbPass.startsWith('$2')

    let match = false
    if (isBcrypt) {
      match = await bcrypt.compare(passField, dbPass)
    } else {
      match = passField === dbPass
    }

    if (!match) {
      return res.status(401).json({ mensaje: 'Usuario o clave incorrectos' })
    }

    // Login correcto
    return res.status(200).json({ mensaje: 'Login correcto', usuario: { id: user.id, email: user.email || user.usuario } })
  } catch (err) {
    console.error('Error en /login', err)
    return res.status(500).json({ mensaje: 'Error interno' })
  }
})

app.listen(PORT, () => console.log(`Servidor backend escuchando en http://localhost:${PORT}`))
