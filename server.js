const fs = require('fs')
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')

const server = jsonServer.create()
let userdb = JSON.parse(fs.readFileSync('./usuarios.json', 'UTF-8'))

server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.use(jsonServer.defaults());

const SECRET_KEY = '123456789'

function createToken(payload, expiresIn = '12h') {
  return jwt.sign(payload, SECRET_KEY, { expiresIn })
}

function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ? decode : err)
}

function usuarioExiste({ email, password }) {
  return userdb.usuarios.findIndex(user => user.email === email && user.password === password) !== -1
}

function emailExiste(email) {
  return userdb.usuarios.findIndex(user => user.email === email) !== -1
}

server.post('/public/registrar', (req, res) => {
  const { email, password, name } = req.body;

  if (emailExiste(email)) {
    const status = 401;
    const message = 'E-mail já foi utilizado!';
    res.status(status).json({ status, message });
    return
  }

  fs.readFile("./usuarios.json", (err, data) => {
    if (err) {
      const status = 401
      const message = err
      res.status(status).json({ status, message })
      return
    };

    const json = JSON.parse(data.toString());

    const last_item_id = json.usuarios.length > 0 ? json.usuarios[json.usuarios.length - 1].id : 0;

    json.usuarios.push({ id: last_item_id + 1, email, password, name});
    fs.writeFile("./usuarios.json", JSON.stringify(json), (err) => {
      if (err) {
        const status = 401
        const message = err
        res.status(status).json({ status, message })
        return
      }
    });
    userdb = json
  });

  const access_token = createToken({ email, password })
  res.status(200).json({ access_token })
})

server.post('/public/login', (req, res) => {
  const { email, password } = req.body;
  if (!usuarioExiste({ email, password })) {
    const status = 401
    const message = 'E-mail ou password incorretos!'
    res.status(status).json({ status, message })
    return
  }
  const access_token = createToken({ email, password })
  let user = { ...userdb.usuarios.find(user => user.email === email && user.password === password) }
  delete user.password
  res.status(200).json({ access_token, user })
})

server.use(/^(?!\/(public)).*$/, (req, res, next) => {
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    const status = 401
    const message = 'Token inválido'
    res.status(status).json({ status, message })
    return
  }
  try {
    let verifyTokenResult;
    verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1]);

    if (verifyTokenResult instanceof Error) {
      const status = 401
      const message = 'Token de autenticação não encontrado'
      res.status(status).json({ status, message })
      return
    }
    next()
  } catch (err) {
    const status = 401
    const message = 'Token revogado'
    res.status(status).json({ status, message })
  }
})

server.listen(8000, () => {
  console.log("API disponível em http://localhost:8000")
})