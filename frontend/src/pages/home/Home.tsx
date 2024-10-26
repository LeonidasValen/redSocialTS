import { useEffect } from 'react'
import { Post } from '../../components/home/Post/Post'
import { Posts } from '../../components/home/Posts/Posts'
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
