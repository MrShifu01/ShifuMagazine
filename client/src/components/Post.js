import React from 'react'

const Post = () => {
  return (
    <>
        <div className='post'>
          <div className='image'><img src='/first-entry.jpeg' alt='old technology'/></div>
          <div className='texts'>
            <h2>Deep Work with Web Development</h2>
            <p className='info'>
              <a href='/' className='author'>Christian Stander</a>
              <time>2023-06-20 13:28</time>
            </p>
            <p className='summary'>Deep work is a practice wherein you need to eliminate unnecessary things, even some necessary things, to achieve your main goal.</p>
          </div>
        </div>
    </>
  )
}

export default Post