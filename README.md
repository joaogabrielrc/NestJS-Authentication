# NestJS Authentication

## Descrição

Este projeto implementa funcionalidades de autenticação de usuários utilizando cookies JWT, refresh tokens e OAuth2 com Google. É uma excelente demonstração de como integrar diferentes métodos de autenticação em uma aplicação NestJS.

## Funcionalidades

- Autenticação local com JWT
- Refresh tokens para renovação de sessões
- Autenticação via OAuth2 com Google
- Armazenamento seguro de cookies

## Contato

- Autor: João Gabriel R Cardoso
- GitHub: [@joaogabrielrc](https://github.com/joaogabrielrc)
- E-mail: joaogabrielrcardoso@gmail.com

## Tecnologias Utilizadas

- [NestJS](https://nestjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Passport](http://www.passportjs.org/)
- [JWT (JSON Web Tokens)](https://jwt.io/)
- [OAuth2](https://oauth.net/2/)

## Instalação

Para instalar as dependências do projeto, execute:

```bash
npm install
```

## Uso

Para iniciar o projeto, siga os passos abaixo:

1. Compile o projeto:

```sh
npm run build
```

2. Inicie o servidor:

```sh
npm start
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000)

### Endpoints

- POST /api/v1/auth/login: Autenticação local com JWT
- POST /api/v1/auth/refresh: Renovação de tokens
- GET /api/v1/auth/google: Redirecionamento para autenticação via Google OAuth2
- GET /api/v1/auth/google/redirect: Callback para autenticação via Google OAuth2

## Configuração adicional
  
1. Para testar a autenticação com Google, crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis de ambiente:

```sh
GOOGLE_AUTH_CLIENT_ID=your_google_client_id
GOOGLE_AUTH_CLIENT_SECRET=your_google_client_secret
GOOGLE_AUTH_REDIRECT_URI=http://localhost:3000/api/v1/auth/google/redirect
FRONTEND_REDIRECT_URI=your_frontend_redirect_uri
```

1. Certifique-se de ter as credenciais do Google OAuth2 configuradas no [Google Developer Console](https://console.cloud.google.com/).

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.
