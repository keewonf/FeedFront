import { Header } from './components/Header/Header'
import { Post } from './components/Post/Post'
import { Sidebar } from './components/Sidebar/Sidebar'
import { New } from './components/New'

import { useState, useEffect } from 'react'
import { api } from './services/api'

import styles from './App.module.css'

/* const posts = [
  {
    id: 1,
    author: {
      avatarUrl: 'https://github.com/diego3g.png',
      name: "Diego Fernandes",
      role: 'CTO @RocketSeat'
    },
    content: [
      { type: 'paragraph', content: 'Fala galeraa 👋',},
      { type: 'paragraph', content: 'Acabei de subir mais um projeto no meu portifa. É um projeto que fiz no NLW Return, evento da Rocketseat. O nome do projeto é DoctorCare 🚀'},
      { type: 'link', content: 'jane.design/doctorcare'},
    ],
    publishedAt: new Date('2025-10-05 20:00:00')
  },
  {
    id: 2,
    author: {
      avatarUrl: 'https://github.com/maykbrito.png',
      name: "Mayk Brito",
      role: 'Educator @RocketSeat'
    },
    content: [
      { type: 'paragraph', content: 'Fala galeraa 👋',},
      { type: 'paragraph', content: 'Acabei de subir mais um projeto no meu portifa. É um projeto que fiz no NLW Return, evento da Rocketseat. O nome do projeto é DoctorCare 🚀'},
      { type: 'link', content: 'jane.design/doctorcare'},
    ],
    publishedAt: new Date('2025-12-02 20:00:00')
  },
]
*/


export function App() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    async function fetchPosts(){
      try{
        const response = await api.get('/posts')
        setPosts(response.data)
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
                content={post.content}
                publishedAt={new Date(post.created_at)}
                initialComments={post.comments}
                commentLikes={post.commentLikes}
                onAddComment={onAddComment}
              />
            )
          })}
        </main>
      </div>
    </div>
  )
}

export default App
