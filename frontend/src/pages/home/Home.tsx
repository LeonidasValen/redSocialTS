import { useEffect } from 'react'
import { Post } from '../../components/Post/Post'
import { Posts } from '../../components/Posts/Posts'
import './home.css'
import { usePost } from '../../context/postContext'

export function Home() {
  const { getPost } = usePost()
  //trae post
  useEffect(() => {
    getPost()
  }, [])
  
  return (
    <main className="home">
      <Post />
      <Posts />
    </main>
  )
}
