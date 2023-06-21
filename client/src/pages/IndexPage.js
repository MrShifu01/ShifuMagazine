import { useEffect, useState } from 'react';
import '../App.css';
import Post from '../components/Post'

const IndexPage = () => {
  const [posts, setPosts] = useState([])
  
  useEffect(() => {
    fetch('http://localhost:8000/post').then(response => {
      response.json().then(posts => {
        setPosts(posts)
      })
    })
  }, [])
  
  return (
    <>
      {posts.length > 0 && posts.map((post => (
        <div key={post._id}>
          <Post {...post}/>
        </div>
      )))} 
    </>
  )
}

export default IndexPage