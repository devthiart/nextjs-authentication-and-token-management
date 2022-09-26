import { HttpClient } from "../../infra/HttpClient/HttpClient";
import { tokenService } from "./tokenService";

// Get the environment variable in the file .env.local
const URL_LOGIN = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`;
const URL_SESSION = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/session`;

export const authService = {

  async login({ username, password }) {
    return HttpClient(
      URL_LOGIN,
      {
        method: 'POST',
        body: { username, password }
      }
    )
    .then(async (serverResponse) => {
      // Save Access Token

      if(serverResponse.ok === false) {
        throw new Error("Usuário ou senha inválidos!");
      }
      const body = serverResponse.body;
      tokenService.save(body.data.access_token);
      return body;
    })
    .then(async ({data}) => {
      // Working with Refresh Token

      const { refresh_token } = data;

      const response = await HttpClient('/api/refresh', {
        method: 'POST',
        body: {
          refresh_token,
        }
      })

      console.log('login response: ', response);
    }); 
  },

  async getSession(ctx = null) {
    const token = tokenService.get(ctx);

    return HttpClient(
      URL_SESSION,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        ctx,
        refresh: true,
      }
    ).then(response => {
      if(response.ok !== true) {
        throw new Error('Não autorizado');
      }
      return response.body.data;
    })
  }
};
