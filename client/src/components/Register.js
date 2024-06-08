import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate()

  const registerUser = async (e) => {
    e.preventDefault();
    const response = await fetch('http://127.0.0.1:1337/api/authentication/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    })

    const data = await response.json();

    if (data) {
      alert('Registration successful!')
      navigate('/login')
    }
  }

  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='w-full max-w-md'>
        <h1 className='text-2xl font-bold mb-4'>Register</h1>
        <form onSubmit={registerUser}>
          <div className='mb-4'>
            <input
              type='text'
              placeholder='Name'
              className='shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div className='mb-4'>
            <input
              type='email'
              placeholder='Email'
              className='shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className='mb-6'>
            <input
              type='password'
              placeholder='Password'
              className='shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <div className='flex items-center justify-between'>
            <input
              type='submit'
              value='Register'
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
