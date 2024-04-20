import React from 'react'
import { Navigate } from 'react-router-dom'

const AdminRoute = ({admin, children}) => {
  if(!admin) {
    return <Navigate to="/" />
  }
  return children;
}

export default AdminRoute