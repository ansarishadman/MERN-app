import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './src/components/Login'
import Register from './src/components/Register'
import Dashboard from './src/components/Dashboard'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" exact element={<Login />} />
          <Route path="/register" exact element={<Register />} />
          <Route path="/dashboard" exact element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App