import { useEffect, useState } from 'react';

import { format, formatDistanceToNow, parseISO} from 'date-fns'


import { ptBR } from 'date-fns/locale'
import { api } from '../../services/api'
import { Avatar } from '../Avatar/Avatar'
import styles from './Post.module.css'
import { Comment } from '../Comment/Comment';
import avatarPlaceholder from '../../assets/profileNull.jpg'
import { postAuthors } from '../../hooks/postsAuthors'
import { useAuth } from '../../hooks/auth';

export function Post({id, authorId, publishedAt, content,initialComments, commentLikes, onAddComment}) {
  const [comments, setComments] = useState(initialComments || []);
  const [newCommentText, setNewCommentText] = useState('')
  const { user } = useAuth()
  const { author, loading} = postAuthors(authorId)
  const avatarUrl = loading || !author?.avatar ? avatarPlaceholder : `${api.defaults.baseURL}/files/avatars/${author.avatar}`
  
  // Formatando a data/hora

  const publishedDateFormatted = format(publishedAt, "d 'de' LLLL 'às' HH:mm'h'", {
    locale: ptBR,
    })

  // Função para converte-la para a hora local (vem como UTC 0)

  const convertToLocalTime = (date) => {
    const offsetMs = date.getTimezoneOffset() * 60 * 1000;
    return new Date(date.getTime() - offsetMs);
  };

  const updatedAtLocal = convertToLocalTime(new Date(publishedAt));

  const publishedDateRelativeToNow = formatDistanceToNow(updatedAtLocal, {
    locale: ptBR,
    addSuffix: true,
  })

  if(loading) {
    return <p>Carregando biscoitos...</p>
  }
  

  function handleCreateNewComment(event){

    const newComment = {
      id: Math.random(),  // Gera um ID temporário para evitar chave duplicada
      content: newCommentText,
      user_id: user.id,  // Você deve ajustar isso para o ID real do usuário logado
      created_at: new Date().toISOString(),
    };

    setComments(prevComments => [...prevComments, newComment]);

    // Chama o callback para adicionar o comentário no backend
    onAddComment(id, newCommentText)
    
    setNewCommentText('');
  }

  function handleNewCommentChange(event){
    event.target.setCustomValidity('')
    setNewCommentText(event.target.value)
  }

  function handleNewCommentInvalid(event){
    event.target.setCustomValidity('Esse campo é obrigatório!')
  }

  function handleDeleteComment(commentId){
    setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
  }

  const isNewCommentEmpty = newCommentText.length === 0

  return (

    <article className={styles.post}>
      <header>
        <div className={styles.author}>
          <Avatar src={avatarUrl}/>
          <div className={styles.authorInfo}>
            <strong>{author.name}</strong>
            <span>{author.role}</span>
          </div>
        </div>

        <time title={publishedDateFormatted} dateTime={updatedAtLocal.toISOString()}>{publishedDateRelativeToNow}</time>
      </header>

      <div className={styles.content}>
        {content.split('\n').map((line, index) => (
          <p key={line + index}>{line}</p>
        ))}
      </div>

      <form 
        onSubmit={handleCreateNewComment} 
        className={styles.commentForm}>

        <strong>Deixe seu feedback</strong>

        <textarea name='comment' placeholder='Escreva um comentário...' 
        value={newCommentText}
        onChange={handleNewCommentChange}
        onInvalid={handleNewCommentInvalid}
        required
        />
        
        <footer>
          <button type='submit' disabled={isNewCommentEmpty}>Publicar</button>
        </footer>
      </form>

      <div className={styles.commentList}>
        {comments.map((comment) => {
          const commentLike = commentLikes.find(like => like.
          comment_id === comment.id)
          const likesCount = commentLike ? commentLike.likesCount : 0


          return <Comment key={comment.id}
          id={comment.id}
          postId={id}
          content={comment.content} authorId={comment.user_id} createdAt={comment.created_at} likesCount={likesCount} onDeleteComment={handleDeleteComment}/>
        })}
      </div>

    </article>
  )
}