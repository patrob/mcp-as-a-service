import { useAuth } from '../auth/AuthContext'

function SignUp() {
  const { login } = useAuth()
  return (
    <>
      <h1>Sign Up</h1>
      <button onClick={login}>Create Account</button>
    </>
  )
}

export default SignUp
