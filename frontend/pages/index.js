import { useState } from 'react';
import { useRouter } from 'next/router';
import { authService } from '../src/services/auth/authService';

export default function HomeScreen() {
  const [values, setValues] = useState({
    username: 'devthiart',
    password: 'safepassword'
  });
  const router = useRouter();

  function handleChange(event) {
    const fieldValue = event.target.value;
    const fieldName = event.target.name;

    // The function inside to setValues get the values that were already filled. (currentValues) 
    // and change only the specific value of the input (fieldName = event.target.name;).
    setValues((currentValues) => {
      return {
        ...currentValues,
        [fieldName]: fieldValue
      }
    });
  }

  return (
    <div>
      <h1>Login</h1>
      <form 
        onSubmit={(event) => {
          event.preventDefault();
          authService.login({
            username: values.username,
            password: values.password,
          })
          .then(()=> {
            // Page - Server Side Render
            router.push('/auth-page-ssr');

            // Page - Static
            // router.push('/auth-page-static');
          })
          .catch((response) => {
            alert('Invalid username or password.');
            console.log(response);
          })
        }}
      >
        <input
          placeholder="Usuário" 
          name="username"
          value={values.username}
          onChange={handleChange}
        />
        <input
          placeholder="Senha" name="password" type="password"
          value={values.password}
          onChange={handleChange}
        />
        {/* <pre>
          {JSON.stringify(values, null, 2)}
        </pre> */}
        <div>
          <button>
            Entrar
          </button>
        </div>
      </form>
      <p>
        <a href="/auth-page-ssr">auth-page-ssr</a>
      </p>
      <p>
        <a href="/auth-page-static">auth-page-static</a>
      </p>
    </div>
  );
}
