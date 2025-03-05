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
        const sortedPosts = response.data.sort((a, b) => (a.isFixed === b.isFixed ? 0 : a.isFixed ? -1 : 1))
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
          ? { ...post, comments: [...post.comments, newComment]}
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
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, ...isFixed} : { ...post, isFixed: 0 }
        ).sort((a, b) => (a.isFixed === b.isFixed ? 0 : a.isFixed ? -1 : 1))
      )
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
