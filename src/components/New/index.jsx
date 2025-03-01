import { Input } from '../../components/Input'
import { Avatar } from '../../components/Avatar/Avatar'
import { Container } from './style.js'
import { useState } from 'react'
import { useAuth} from '../../hooks/auth.jsx'
import { api } from '../../services/api'
import avatarPlaceholder from '../../assets/profileNull.jpg'

export function New(){
  const { user } = useAuth()

  const [post, setPost] = useState('')
  
  const avatarUrl = user.avatar ? `${api.defaults.baseURL}/files/avatars/${user.avatar}` : avatarPlaceholder

  const isNewPostEmpty = post.trim() === '';

  function handleNewPostInvalid(event){
    event.target.setCustomValidity('Esse campo é obrigatório!')
  }

  async function handleNewPost(event){
    
    await api.post('/posts', {
      content: post,
    })

    alert("Você fez seu post!")
  }

  return(
    <Container>
      <div className='userImage'>
        <Avatar src={avatarUrl}/>
      </div>

      <form onSubmit={handleNewPost} className='postForm'>
        <textarea name='posts' placeholder='Fale com o pessoal...' 
          value={post}
          onChange={e => setPost(e.target.value)}
          onInvalid={handleNewPostInvalid}
          required
        />

        <footer>
          <button type='submit' disabled={isNewPostEmpty}>Postar</button>
        </footer>
      </form>
    </Container>
  )
}


