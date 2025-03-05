import { BrowserRouter } from 'react-router-dom'

import { useAuth } from '../hooks/auth'
import { USER_PERMISSIONS } from '../utils/permissions'

import { AppRoutes } from './app.routes'
import { AuthRoutes } from './auth.routes'
import { AdminRoutes } from './admin.routes'

export function Routes(){
  const { user } = useAuth()

  function AccessRoute(){
    switch(user.permission){
      case USER_PERMISSIONS.OWNER:
        return <AdminRoutes />
      case USER_PERMISSIONS.MOD:
        return <AdminRoutes />
      case USER_PERMISSIONS.MEMBER:
        return <AppRoutes />
      default: 
        return <AppRoutes />
    }
  }

  return (
    <BrowserRouter>
      { user? <AccessRoute /> : <AuthRoutes/>}
    </BrowserRouter>
  )
}