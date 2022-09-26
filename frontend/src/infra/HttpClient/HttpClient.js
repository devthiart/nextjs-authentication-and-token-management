// Hexagonal Architecture
// Ports & Adapters -> consistency in the use of the fetch method in our system.

import { tokenService } from "../../services/auth/tokenService";
import nookies from 'nookies';

// consistency in the use of the fetch method in our system.
export async function HttpClient(fetchUrl, fetchOptions) {
  const options = {
    ...fetchOptions,
    headers: {
      'Content-Type': 'application/json', // Default headers in our fetch
      ...fetchOptions.headers, // You can customize this headers using fetchOptions
    },
    body: fetchOptions.body ? JSON.stringify(fetchOptions.body) : null, // Pegamos o valor de body e passamos para JSON.
  }
  
  return fetch(fetchUrl, options)
      .then(async (serverResponse) => {
        return {
          ok: serverResponse.ok,
          status: serverResponse.status,
          statusText: serverResponse.statusText,
          body: await serverResponse.json(),
        }
      })
      .then(async (response) => {
        // console.log('/HttpClient - fetchOptions.refresh: ', fetchOptions.refresh);
        // console.log('/HttpClient - response.status: ', response.status);
        if(!fetchOptions.refresh) {
          console.log('/HttpClient - returned in fetchOptions.refresh');
          return response;
        }
        if(response.status !== 401){
          console.log('/HttpClient - returned in response.status');
          return response;
        }  

        console.log('/HttpClient - *** Middleware: Rodar código para atualizar o token ***');

        const isServer = Boolean(fetchOptions?.ctx);

        console.log('/HttpClient - fetchOptions.ctx.req.cookies: ', fetchOptions.ctx.req.cookies);
        const currentRefreshToken = fetchOptions?.ctx?.req?.cookies['REFRESH_TOKEN_NAME'];
        console.log('/HttpClient - currentRefreshToken: ', currentRefreshToken);
        
        try {
          // Update Tokens
          const refreshResponse = await HttpClient('http://localhost:3000/api/refresh', {
            method: isServer ? 'PUT' : 'GET',
            body: isServer ? { refresh_token: currentRefreshToken } : undefined,
          });

          const newAccessToken = refreshResponse.body.data?.access_token;
          const newRefreshToken = refreshResponse.body.data?.refresh_token;
  
          if(isServer) {
            console.log('/HttpClient - newRefreshToken: ', newAccessToken);
            nookies.set(fetchOptions.ctx, 'REFRESH_TOKEN_NAME', newRefreshToken, {
              httpOnly: true,
              sameSite: 'lax',
              path: '/',
            });
          }
  
          // Storage token
          tokenService.save(newAccessToken);

          // Run previous request
          const retryResponse = await HttpClient(fetchUrl, {
            ...options,
            refresh: false,
            headers: {
              'Authorization': `Bearer ${newAccessToken}`
            }
          })
  
          return retryResponse;
        } 
        catch(err) {
          console.error(err);
          return response;
        }
        
      });
}
