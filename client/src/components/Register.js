import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { authenticationAPI } from '../constants/constants';
import jwt from 'jsonwebtoken'

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate()

  useEffect(() => {
		const checkUser = async () => {
			const token = localStorage.getItem('token');
			if (token) {
				try {
					const user = jwt.decode(token);
					console.log(user)
					if (!user) {
						localStorage.removeItem('token');
					} else {
						navigate('/dashboard', { replace: true });
					}
				} catch (error) {
					console.error('Invalid token:', error);
					localStorage.removeItem('token');
				}
			}
		};

		checkUser();
	})


  const registerUser = async (e) => {
    e.preventDefault();
    const response = await fetch(`${authenticationAPI}/register`, {
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
        <div className='mt-4 text-center'>
          <p>
            Already registered?{' '}
            <Link to='/login' className='text-blue-500 hover:underline'>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
