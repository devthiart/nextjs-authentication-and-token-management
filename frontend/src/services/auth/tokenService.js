import nookies from 'nookies';

const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN_KEY'; // You can change this value to make it difficult to identify the access cookie in the browser.

const ONE_SECOND = 1;
const ONE_MINUTE = ONE_SECOND * 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;
const ONE_YEAR = ONE_DAY * 365;

export const tokenService = {
  save(accessToken, ctx = null) {
    /*** USING LOCAL\SESSION STORAGE ***/
    // We put the 'globalThis' and the '?' to only run getItem if it exists.
    // As Next runs on both the browser and the server, it might not find localStorage 
    // on the server and return 'not defined'.
    // globalThis?.localStorage?.setItem(ACCESS_TOKEN_KEY, accessToken);
    // globalThis?.sessionStorage?.setItem(ACCESS_TOKEN_KEY, accessToken);
    /*** USING COOKIES ***/
    nookies.set(ctx, ACCESS_TOKEN_KEY, accessToken, {
      maxAge: ONE_YEAR, // Cookie Lifetime.
      path: '/', // From which URL will this cookie exist.
    });
  },
  get(ctx = null) {
    /*** USING LOCAL\SESSION STORAGE ***/
    // We put the 'globalThis' and the '?' to only run getItem if it exists.
    // As Next runs on both the browser and the server, it might not find localStorage 
    // on the server and return 'not defined'.
    // return globalThis?.localStorage?.getItem(ACCESS_TOKEN_KEY);
    // return globalThis?.sessionStorage?.getItem(ACCESS_TOKEN_KEY);

    /*** USING COOKIES ***/
    const cookies = nookies.get(ctx);
    return cookies[ACCESS_TOKEN_KEY] || '';
  },
  delete(ctx = null) {
    /*** USING LOCAL\SESSION STORAGE ***/
    // globalThis?.localStorage?.removeItem(ACCESS_TOKEN_KEY);
    // globalThis?.sessionStorage?.removeItem(ACCESS_TOKEN_KEY);
    /*** USING COOKIES ***/
    nookies.destroy(ctx, ACCESS_TOKEN_KEY);
  }
}
