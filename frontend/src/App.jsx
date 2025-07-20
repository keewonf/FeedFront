import { Header } from './components/Header/Header'
import { Post } from './components/Post/Post'
import { Sidebar } from './components/Sidebar/Sidebar'
import { New } from './components/New'

import { useState, useEffect } from 'react'
import { api } from './services/api'

import styles from './App.module.css'

export function App() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    
    async function fetchPosts(){
      try{
        const response = await api.get('/posts')
        const sortedById = response.data.sort((a, b) => b.id - a.id)
        const sortedPosts = sortedById.sort((a, b) => (a.isFixed === b.isFixed ? 0 : a.isFixed ? -1 : 1))
        setPosts(sortedPosts)

      } catch(error){
        console.log('Erro ao carregar posts', error)
      }
    }
    fetchPosts()
  },[])

  async function onAddComment(postId, commentContent){
    try {
      const response = await api.post(`/comments/${postId}`,{
        content: commentContent
      })

      const newComment = response.data
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
          ? { ...post, comments: [...post.comments, newComment].sort((a, b) => b.id - a.id)}
          : post
        )
      )
    } catch (error) {
      console.log('Erro ao adicionar comentário', error)
    }
  }

  function handleDeletePost(postId){
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  }

  function handleCreatePost(newPost) {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  }

  const onUpdatePost = (postId, updatedContent) => {
    setPosts(prevPosts =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, content: updatedContent } : post
      )
    );
  };

  const onUpdatePostFixed = (postId, isFixed) => {
    setPosts(prevPosts => {
      // Atualizando o estado de posts, mudando isFixed
      const updatedPosts = prevPosts.map(post =>
        post.id === postId ? { ...post, isFixed: isFixed } : { ...post, isFixed: 0 }
      )
  
      // Verificando se todos os posts estão desfixados (isFixed === 0)
      const allUnfixed = updatedPosts.every(post => post.isFixed === 0)
      console.log('Updated Posts:', updatedPosts);
      console.log('All Unfixed:', allUnfixed);

      if (allUnfixed) {
        return updatedPosts.sort((a, b) => b.id - a.id)
      } else {
        // Caso contrário, aplicamos o sort para ordenar os fixados no topo
        return updatedPosts.sort((a, b) => (a.isFixed === b.isFixed ? 0 : a.isFixed ? -1 : 1))
      }
    })
  }

 
  return (
    <div>
      <Header />

      <div className={styles.wrapper}>
        <Sidebar/>
        <main>
          <New/> 
          {posts.map((post) => {
            return (
              <Post
                key={post.id}
                id={post.id}
                authorId={post.user_id}
                isFixed={post.isFixed}
                content={post.content}
                publishedAt={new Date(post.created_at)}
                updatedAt={new Date(post.updated_at)}
                initialComments={post.comments}
                postLikes={post.TotalLikes}
                commentLikes={post.commentLikes}
                onAddComment={onAddComment}
                onDeletePost={handleDeletePost}
                onUpdatePost={onUpdatePost}
                onUpdatePostFixed={onUpdatePostFixed}
              />
            )
          })}
        </main>
      </div>
    </div>
  )
}

export default App
