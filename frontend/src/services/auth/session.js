import { authService } from "./authService";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Used in Page Server Side Render.
// Decorator Pattern
export function withSession(sessionFunction) {
  return async (ctx) => {
    try {
      const session = await authService.getSession(ctx);
      const modifiedCtx = {
        ...ctx,
        req: {
          ...ctx.req,
          session,
        }
      }
      return sessionFunction(modifiedCtx);
    } 
    catch(err) {
      return {
        redirect: {
          permanent: false,
          destination: '/?error=unauthorized',
        }
      }
    }
  }
}

// Used in Page Static.
// Decorator Pattern - High Order Component (HOC)
export function withSessionHOC(Component) {
  return function Wrapper(props) {
    const router = useRouter();
    const session  = useSession();

    if(!session.loading && session.error) {
      console.log('redirect user to home page...');
      router.push('/?error=unauthorized');
    }

    const modifiedProps = {
      ...props,
      session: session.data.session,
    }

    return (
      <Component {...modifiedProps} />
    )
  }
}

export function useSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    authService.getSession()
      .then((response) => {
        setSession(response);
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => {
        setLoading(false);
      })
  }, []);

  return {
    data: {
      session,
    },
    error,
    loading,
  }
}
