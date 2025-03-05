import { Routes, Route } from 'react-router-dom'

import { App } from '../App'
import { AdminPage } from '../pages/AdminPage'
import { NotFound } from '../pages/NotFound';

export function AdminRoutes(){
  return(
    <Routes>
      <Route path='/' element={<App/>}/>
      <Route path='/admin' element={<AdminPage/>}/>
      <Route path="*" exact={true} element={<NotFound />} />
    </Routes>
  )
}