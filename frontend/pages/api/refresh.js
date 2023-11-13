// We use next.js api only to simulate a middleware.
// The ideal would be to have a server to manage the refresh token.

import nookies from 'nookies';
import { HttpClient } from '../../src/infra/HttpClient/HttpClient';
import { tokenService } from '../../src/services/auth/tokenService';

const REFRESH_TOKEN_NAME = 'REFRESH_TOKEN_NAME';

const controllers = {
  async storeRefreshToken(request, response) {
    const ctx = { request, response };
    // console.log('/api/refresh - handle: ', request.body);

    // More about sameSite: 'lax' -> https://support.cloudflare.com/hc/pt-br/articles/360038470312-Como-funciona-a-intera%C3%A7%C3%A3o-de-cookies-do-SameSite-com-a-Cloudflare
    nookies.set(ctx, REFRESH_TOKEN_NAME, request.body.refresh_token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      // maxAge: 60 * 60 * 24 * 7,
    });

    // console.log('/api/refresh - storeRefreshToken - nookies.get: ', nookies.get(ctx));

    response.json({
      data: {
        message: 'Stored with Success! Or maybe not...',
        // cookies: nookies.get(ctx),
      }
    });
  },

  async displayCookies(req, res) {
    // Method created for testing only. Do not use in an actual application.
    const ctx = { req, res };
    res.json({
      data: {
        cookies: nookies.get(ctx),
      }
    });
  },

  async regenerateTokens(req, res) {
    const ctx = { req, res };
    const cookies = nookies.get(ctx);
    const refresh_token = cookies[REFRESH_TOKEN_NAME] || req.body.refresh_token;

    // console.log('/api/refresh - regenerateTokens - cookies: ', cookies);
    // console.log('/api/refresh - regenerateTokens - refresh-token: ', refresh_token);

    const refreshResponse = await HttpClient(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/refresh`, {
      method: 'POST',
      body: {
        refresh_token,
      }
    });

    // console.log('/api/refresh - regenerateTokens - refreshResponse: ', refreshResponse);

    if(refreshResponse.ok) {
      nookies.set(ctx, REFRESH_TOKEN_NAME, refreshResponse.body.data.refresh_token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        // maxAge: 60 * 60 * 24 * 7,
      });

      // console.log('/api/refresh - regenerateTokens - nookies: ', nookies.get(ctx));

      tokenService.save(refreshResponse.body.data.access_token, ctx);

      res.status(200).json({
        data: refreshResponse.body.data,
      });
    } else {
      res.status(401).json({
        status: 401,
        message: 'Not authorized.',
        cookies: cookies, // nookies.get(ctx),
      })
    }
  },

  destroyTokens(req, res) {
    const ctx = { req, res };
    nookies.destroy(ctx, REFRESH_TOKEN_NAME, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });

    res.status(200).json({
      data: {
        message: 'deleted with success!',
      }
    });
  }
}

const controllerBy = {
  POST: controllers.storeRefreshToken,
  GET: controllers.regenerateTokens,
  PUT: controllers.regenerateTokens,
  DELETE: controllers.destroyTokens,
}
// GET: controllers.displayCookies, // Created only for testing. Do not use in an actual application.

export default function handler(request, response) {
  if(controllerBy[request.method]) {
    return controllerBy[request.method](request, response);
  }

  response.status(404).json({
    status: 404,
    message: 'Not Found',
  })
}
