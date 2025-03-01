import { useState, useEffect } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Avatar } from '../Avatar/Avatar';
import styles from './Comment.module.css'
import { Trash, ThumbsUp } from 'phosphor-react';
import { api } from '../../services/api'
import { useAuth } from '../../hooks/auth';
import avatarPlaceholder from '../../assets/profileNull.jpg'
import { postAuthors } from '../../hooks/postsAuthors';

export function Comment({ id, content, authorId, createdAt, likesCount, onDeleteComment, postId}) {
  const [likeCount, setLikeCount] = useState(likesCount)
  const [author, setAuthor] = useState(null)
  const { user } = useAuth()
  const { author: fetchedAuthor, loading} = postAuthors(authorId)
  const avatarUrl = loading || !author?.avatar ? avatarPlaceholder : `${api.defaults.baseURL}/files/avatars/${author.avatar}`
  const authorName = loading ? 'Carregando Autor' : author?.name || 'Autor Desconhecido';
  const authorRole = loading ? 'Carregando Cargo...' : author?.role || 'Sem cargo';
  const [errorMessage, setErrorMessage] = useState('');
  
  // Formatando a data/hora
  
  const createdAtFormatted = format(new Date(createdAt), "d 'de' LLLL 'às' HH:mm'h'", {
    locale: ptBR,
  });

  // Função para converte-la para a hora local (vem como UTC 0)

  const convertToLocalTime = (date) => {
    const offsetMs = date.getTimezoneOffset() * 60 * 1000;
    return new Date(date.getTime() - offsetMs);
  };

  const updatedAtLocal = convertToLocalTime(new Date(createdAt));

  // Distância de tempo relativa
  const createdAtRelative = formatDistanceToNow(new Date(updatedAtLocal), {
    locale: ptBR,
    addSuffix: true,
  });

  useEffect(() => {
    if(fetchedAuthor){
      setAuthor(fetchedAuthor)
    }
  }, [fetchedAuthor])

  
  async function handleDeleteComment(){
    try{
      const response = await api.delete(`/comments/${id}`)
      if(response.status === 200){
        onDeleteComment(id)
      }
    } catch(error) {
        if(error.response) {
          alert(error.response.data.message)
      } else {
          alert("Ocorreu um erro.")
      }

    }
  }

  if (loading) {
    return <p>Carregando autor...</p>;
  }

  async function handleLikeComment(){
    try {
      const response = await api.post(`/comments/likes/${id}`);
  
      // Verifica se a resposta foi bem-sucedida
      if (response.status === 200) {
        alert("Seu like foi registrado!");
        setLikeCount(prevCount => prevCount + 1);
        setErrorMessage('');
        
      } else {
        throw new Error("Não foi possível dar like.");
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Não foi possível dar like ):");
      }
    }
  }

  return(
    <div className={styles.comment}>
      <Avatar hasBorder={false} src={avatarUrl} alt=''/>

      <div className={styles.commentBox}>
        <div className={styles.commentContent}>
          <header>
            <div className={styles.authorAndTime}>
              <strong>{authorName}</strong>
              <span>{authorRole}</span>
              <time 
              title={createdAtFormatted} 
              dateTime={new Date(updatedAtLocal).toISOString()}>{createdAtRelative}</time>
            </div>

            <button onClick={handleDeleteComment} title='Deletar comentário'>
              <Trash size={24}/>
            </button>
          </header>
          
          <p>{content}</p>
        </div>

        <footer>
          <button onClick={handleLikeComment}>
            <ThumbsUp/>
            Aplaudir <span>{likeCount}</span>
          </button>
        </footer>
      </div>

    </div>
  )
}