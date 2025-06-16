import { useAuth } from '../auth/AuthContext'

function SignUp() {
  const { login } = useAuth()
  return (
    <>
      <h1>Sign Up</h1>
      <button
        onClick={() =>
          login({ name: 'User', picture: 'https://via.placeholder.com/40' })
        }
      >
        Create Account
      </button>
    </>
  )
}

export default SignUp
