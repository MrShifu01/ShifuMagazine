import '../App.css'
import { useState } from 'react'

const RegisterPage = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  
  const register = async (e) => {
    e.preventDefault()
      const response = await fetch('http://localhost:8000/register', {
        method: 'POST',
        body: JSON.stringify({username, password}),
        headers: {'Content-Type': 'application/json'}
      })
      if (response.status === 400) {
        alert('Registration failed')
      } else {
        alert('registration successful')
      }
  }
  
  return (
    <form onSubmit={register} className='register'>
      <h1>Register</h1>
        <input 
        type='text' 
        placeholder='username' 
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        />
        <input 
        type='password' 
        placeholder='password' 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        />
        <button>Register</button>
    </form>
  )
}

export default RegisterPage