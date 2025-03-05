import { useEffect, useState } from 'react';
import { format, formatDistanceToNow, parseISO} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Trash, NotePencil, X, PushPin, PushPinSlash, ThumbsUp} from 'phosphor-react';

import { api } from '../../services/api'
import { Avatar } from '../Avatar/Avatar'
import styles from './Post.module.css'
import { Comment } from '../Comment/Comment';
import avatarPlaceholder from '../../assets/profileNull.jpg'
import { postAuthors } from '../../hooks/postsAuthors'
import { useAuth } from '../../hooks/auth';
import { USER_PERMISSIONS } from '../../utils/permissions';


export function Post({id, authorId, isFixed, publishedAt, updatedAt, content, initialComments, postLikes, commentLikes, onAddComment, onDeletePost, onUpdatePost, onUpdatePostFixed}) {
  // Usuário Logado
  const { user } = useAuth()

  // Configurando comentários
  const orderedByIdComments = [...initialComments].sort((a, b) => b.id - a.id);
  const [comments, setComments] = useState(orderedByIdComments || []);
  const [newCommentText, setNewCommentText] = useState('')
  // Autor info
  const { author, loading} = postAuthors(authorId)
  const avatarUrl = loading || !author?.avatar ? avatarPlaceholder : `${api.defaults.baseURL}/files/avatars/${author.avatar}`
  // Gerenciamento likes do post
  const [postLikeCount, setPostLikeCount] = useState(postLikes)

  // Estado edição do post
  const [ isEditing, setIsEditing ] = useState(false)
  const [ editedContent, setEditedContent ] = useState(content)

  // Estado de fixação do post
  const [isPinned, setIsPinned] = useState(isFixed === 1)
  useEffect(() => {
    setIsPinned(isFixed);
  }, [isFixed]);


  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      await api.patch(`/posts/${id}`, { content: editedContent})
      alert('Post atualizado com sucesso!')
      setIsEditing(false)
      onUpdatePost(id, editedContent);
    } catch(error) {
        if(error.response){
          alert(error.response.data.message)
        } else {
            alert("Não foi possível editar seu post!")
          }
      }
  }

  const handleClose = () => {
    setIsEditing(false)
    setEditedContent(content)
  }

  // Função para converte-la para a hora local (vem como UTC 0)
  const convertToLocalTime = (date) => {
    const offsetMs = date.getTimezoneOffset() * 60 * 1000;
    return new Date(date.getTime() - offsetMs);
  };

  const updatedAtLocal = convertToLocalTime(new Date(publishedAt));
  const editedAtLocal = convertToLocalTime(new Date(updatedAt))

  // Formatando a data/hora
  const publishedDateFormatted = format(updatedAtLocal, "d 'de' LLLL 'às' HH:mm'h'", {
    locale: ptBR,
    })
  const updatedDateFormatted = format(editedAtLocal, "d 'de' LLLL 'às' HH:mm'h'", {
    locale: ptBR,
  });

  const publishedDateRelativeToNow = formatDistanceToNow(updatedAtLocal, {
    locale: ptBR,
    addSuffix: true,
  })

  if(loading) {
    return <p>Carregando biscoitos...</p>
  }
  

  async function handleCreateNewComment(event) {
    event.preventDefault();
  
    try {
      // Chama a função que adiciona o comentário
      await onAddComment(id, newCommentText);
  
      alert("Você comentou");
  
      // Agora, vamos pegar os comentários atualizados da API
      const response = await api.get(`/posts/${id}/comments`);
  
      // Ordena os comentários antes de atualizar o estado
      const sortedComments = response.data.sort((a, b) => b.id - a.id);
  
      // Atualiza o estado com os comentários ordenados
      setComments(sortedComments);
  
    } catch (error) {
      console.error("Erro ao carregar comentários atualizados:", error);
    }
  
    // Limpa o campo de texto do novo comentário
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

  async function handleDeletePost(event){
    event.preventDefault()
    const confirmed = confirm("Você realmente deseja deletar este post?");
    if (!confirmed) return;
    
    try{
      const response = await api.delete(`/posts/${id}`)
      if(response.status === 200){
        onDeletePost(id)
        alert("Você deletou este post!")
      }
    } catch(error) {
        if(error.response) {
          alert(error.response.data.message, console.log(`Estado: ${isPinned},Backend: ${isFixed}, PostID: ${id}`))
        } else {
            alert("Ocorreu um erro.")
        }

    }
  }

  const handleFixed = async () => {
    try {
      const response = await api.patch(`/posts/${id}/fix`);
      
      alert(response.data.message)

      const pinned = response.data.isFixed
      setIsPinned(pinned)
      onUpdatePostFixed(id, pinned)
    } catch (error) {
        if(error.response) {
          alert(error.response.data.message, console.log(`Estado: ${isPinned},Backend: ${isFixed}, PostID: ${id}`))
        } else {
            console.error("Erro ao fixar o post", error);
            alert("Não foi possível fixar o post.");
          }

      }
  }


  const handleLikePost = async () => {
    try {
      const response = await api.post(`/posts/likes/${id}`);
      alert(response.data.message);
      setPostLikeCount(prev => prev + 1);
    } catch (error) {
        if(error.response) {
          alert(error.response.data.message)
        } else {
            console.error("Erro ao curtir o post", error);
            alert("Não foi possível curtir o post.");
          }
    }
  };
  
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
        <div className={styles.postDate}>
          <time 
            title={publishedDateFormatted} 
            dateTime={updatedAtLocal.toISOString()}>
              Publicado {publishedDateRelativeToNow}
          </time>

          {updatedAt > publishedAt && (
            <time dateTime={editedAtLocal.toISOString()} title={updatedDateFormatted}>
              {' '} (Editado em {updatedDateFormatted})
            </time>
          )}

        </div>

        {!isEditing && (          
          <div className={styles.actionButtons}>
            {[USER_PERMISSIONS.OWNER, USER_PERMISSIONS.MOD ].includes(user.permission) && (
              <button className={styles.fixedButton} onClick={handleFixed} title="Fixar post">
                {isPinned ? <PushPinSlash size={24} /> : <PushPin size={24} />}
              </button>
            )}

            <button onClick={handleEdit} title="Editar post">
              <NotePencil size={24} />
            </button>
            <button
              className={styles.deleteButton}
              onClick={handleDeletePost}
              title="Deletar post"
            >
              <Trash size={24} />
            </button>
          </div>
        )}

        {isEditing && (
          <div className={styles.editButtons}>
            <button 
              onClick={handleSave} 
              title="Salvar post"
              className={styles.saveButton}
            >
              Salvar
            </button>

            <button 
              onClick={handleClose}
              title="Fechar edição"
              className={styles.closeButton}
            >
              <X size={24}/>
          </button>
          </div>
        
        )}
      </header>
      {isEditing ? (
        <textarea
          className={styles.editText}
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
        />
      ) : (
        <div className={styles.content}>
          {content.split('\n').map((line, index) => (
            <p key={line + index}>{line}</p>
          ))}
        </div>
      )}

      <div className={styles.postLike}>
        <button onClick={handleLikePost} title="Curtir post">
          <ThumbsUp/>
          Aplaudir <span>{postLikeCount}</span>
        </button>
      </div>
  
      <form 
        onSubmit={handleCreateNewComment} 
        className={styles.commentForm}
      >
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


          return ( 
            <Comment
              key={comment.id}
              id={comment.id}
              postId={id}
              content={comment.content} 
              authorId={comment.user_id} 
              createdAt={comment.created_at} 
              likesCount={likesCount} 
              onDeleteComment={handleDeleteComment}
            />
          )
        })}
      </div>

    </article>
  )
}