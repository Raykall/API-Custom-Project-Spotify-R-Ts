# API - Project-Spotify-React.js+Typescript

This API - was customized by me to perform authentication on the website developed by me in the example: "Project-Spotify-R.js+Ts" and fetch user information for effective login.

# JSONServer + JWT Auth

This is a mocked Rest API, using json-server and JWT.

## 🛠️ installation

```
$ npm install

```

## 🛠️ run API

```
$ npm run start-api

```

## 🛠️ How to register?

You can do this by making a post request to:

```
POST http://localhost:8000/public/registrar
```

With the data that will be saved as follows:

```
Exempla:
{
    "nome": "Rayandro",
    "email": "rayandroteste@gmail.com",
    "senha": "123456"
}
```

 - Note that the email must be unique. Otherwise you will receive a validation error.

## 🛠️ How to login?

You can do this by making a post request to:

```
Method - POST http://localhost:8000/public/login
```

With the following data:

```
{
  "email": "rayandroteste@gmail.com",
    "senha": "123456"
}
```

You will receive a token that will be used to verify whether you were able to connect in the following format:

```
{
   "access_token": "<ACCESS_TOKEN>",
   "user": { ... dados do usuário ... }
}
```

## Authenticate upcoming requests?

```
Authorization: Bearer <ACCESS_TOKEN>
```