import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard/Dashboard'
import NotFound from './components/NotFound'

const App = () => {
  return (
    <Routes>
      <Route path="/" exact element={<Register />} />
      <Route path="/login" exact element={<Login />} />
      <Route path="/dashboard" exact element={<Dashboard />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App