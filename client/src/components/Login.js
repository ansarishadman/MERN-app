import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { authenticationAPI } from '../constants/constants';
import jwt from 'jsonwebtoken'

function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const navigate = useNavigate();

	useEffect(() => {
		const checkUser = async () => {
			const token = localStorage.getItem('token');
			if (token) {
				try {
					const user = jwt.decode(token);
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

	async function loginUser(event) {
		event.preventDefault()

		const response = await fetch(`${authenticationAPI}/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				password,
			}),
		})

		const data = await response.json()

		if (data.user) {
			localStorage.setItem('token', `${data.user}`)
			alert('Login successful')
			navigate('/dashboard', { replace: true })
		} else {
			alert('Please check your username and password')
		}
	}

	return (
		<div className='flex justify-center items-center h-screen'>
			<div className='w-full max-w-md'>
				<h1 className='text-2xl font-bold mb-4'>Login</h1>
				<form onSubmit={loginUser}>
					<div className='mb-4'>
						<input
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
							type='email'
							placeholder='Email'
						/>
					</div>
					<div className='mb-6'>
						<input
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
							type='password'
							placeholder='Password'
						/>
					</div>
					<div className='flex items-center justify-between'>
						<input
							className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
							type='submit'
							value='Login'
						/>
					</div>
				</form>
			</div>
		</div>
	)
}

export default Login
