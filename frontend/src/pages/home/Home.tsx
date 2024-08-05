import { Post } from '../../components/Post/Post'
import { Posts } from '../../components/Posts/Posts'
import './home.css'

export function Home() {
  return (
    <main className="home">
      <Post/>
      <Posts/>
    </main>
  )
}
