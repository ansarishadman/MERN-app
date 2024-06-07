import React, { useEffect } from 'react'
import { useNavigate } from 'react-router';
import jwt from 'jsonwebtoken'

const Dashboard = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            const user = jwt.decode(token)
            if (!user) {
                localStorage.removeItem('token')
                navigate('/login', { replace: true })
            }
        }
    }, [])

    return (
        <>
            <h1>Here goes your code!</h1>
        </>
    )
}

export default Dashboard