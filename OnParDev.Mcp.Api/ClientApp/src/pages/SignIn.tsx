import { useAuth } from '../auth/AuthContext'

function SignIn() {
  const { login } = useAuth()
  return (
    <>
      <h1>Sign In</h1>
      <button
        onClick={() =>
          login({ name: 'User', picture: 'https://via.placeholder.com/40' })
        }
      >
        Log In
      </button>
    </>
  )
}

export default SignIn
