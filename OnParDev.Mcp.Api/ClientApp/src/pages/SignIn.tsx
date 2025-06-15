import { useAuth } from '../auth/AuthContext'

function SignIn() {
  const { login } = useAuth()
  return (
    <>
      <h1>Sign In</h1>
      <button onClick={login}>Log In</button>
    </>
  )
}

export default SignIn
