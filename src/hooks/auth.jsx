import { createContext, useContext, useState, useEffect } from 'react'

import { api } from '../services/api'

export const AuthContext = createContext({})

function AuthProvider({ children }){
  const [data, setData] = useState({})

  async function signIn({ email, password }) {

    try {
      const response = await api.post('/sessions', { email, password})
      const { user, token} = response.data
      console.log(user)
      
      localStorage.setItem("@ignitefeed:user", JSON.stringify(user))
      localStorage.setItem("@ignitefeed:token", token)
      
      
      api.defaults.headers.common['Authorization']= `Bearer ${token}`
      setData({ user, token})

    } catch(error) {
      if(error.response) {
        alert(error.response.data.message)
      }else{
        alert("Não foi possível entrar.")
      }
    } 
  }

  async function signOut() {
    localStorage.removeItem('@ignitefeed:token')
    localStorage.removeItem('@ignitefeed:user')

    setData({})
  }
 
  async function updateProfile({ user, avatarFile, bannerFile }){
    try{
      
      if(avatarFile){
        const fileAvatarForm = new FormData()
        fileAvatarForm.append('avatar', avatarFile)

        const response = await api.patch('/users/avatar', fileAvatarForm)
        user.avatar = response.data.avatar
      }

      if(bannerFile){
        const fileBannerForm = new FormData()
        fileBannerForm.append('banner', bannerFile)

        const response = await api.patch('/users/banner', fileBannerForm)
        user.banner = response.data.banner
      }

      const storedUser = JSON.parse(localStorage.getItem("@ignitefeed:user"));

      const updatedUser = {
        ...storedUser,
        ...user,
        avatar: user.avatar || storedUser.avatar,
        banner: user.banner || storedUser.banner,
      }

      await api.put('/users', updatedUser)
      localStorage.setItem("@ignitefeed:user", JSON.stringify(updatedUser))

      setData({ user: updatedUser, token: data.token })
      alert("Perfil atualizado!")

    } catch(error) {
      if(error.response) {
        alert(error.response.data.message)
      }else{
        alert("Não foi possível atualizar seus dados.")
      }
    } 
  }
  useEffect(() => {
    const token = localStorage.getItem('@ignitefeed:token')
    const user = localStorage.getItem('@ignitefeed:user')

      if(token && user){
        api.defaults.headers.common['Authorization']= `Bearer ${token}`

        setData({
          token,
          user: JSON.parse(user)
        })
    }
  },[])

  return (
  <AuthContext.Provider value={{ signIn, user: data.user, signOut, updateProfile}}>
    {children}
  </AuthContext.Provider>
  )
}

function useAuth(){
  const context = useContext(AuthContext)

  return context
}

export { AuthProvider, useAuth }