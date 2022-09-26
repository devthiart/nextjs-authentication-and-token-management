import { withSession } from "../src/services/auth/session";

function AuthPageSSR(props) {

  return (
    <>
      <h1>Auth Page - Server Side Render</h1>
      <p>
        <a href="/logout">Logout</a>
      </p>
      <pre>
        {JSON.stringify(props, null, 2)}
      </pre>
      <p>
        <a href="/api/refresh">/api/refresh</a>
      </p>
    </>
  )
}

export default AuthPageSSR;

// Decorator Pattern
export const getServerSideProps = withSession((ctx) => {
  return ({
    props: {
      session: ctx.req.session,
    }
  })
})

// Without Decoration Pattern
// export async function getServerSideProps(ctx) {
// // ctx means context. It only exists on server, in the brouser its value is null.
// // More details: 
// //  https://stackoverflow.com/questions/57021701/react-js-what-is-the-ctx-object-and-where-does-it-come-from
// //  https://nextjs.org/docs/advanced-features/custom-document#customizing-renderpage
//   try {
//     const session = await authService.getSession(ctx);

//     return {
//       props: {
//         session
//       },
//     }
//   } catch(err) {
//     return {
//       redirect: {
//         permanent: false,
//         destination: '/?error=unauthorized',
//       }
//     }
//   }
// }
