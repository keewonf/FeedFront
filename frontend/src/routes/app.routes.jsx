import { Routes, Route } from 'react-router-dom'

import { App } from '../App'
import { NotFound } from '../pages/NotFound';

export function AppRoutes(){
  return(
    <Routes>
      <Route path='/' element={<App/>}/>
      <Route path="*" exact={true} element={<NotFound />} />
    </Routes>
  )
}