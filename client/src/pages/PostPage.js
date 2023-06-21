import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const PostPage = () => {
    const [postInfo, setPostInfo] =useState(null)
    const { id } = useParams()
    console.log(id)

    useEffect(() => {
        fetch(`http://localhost:8000/${id}`)
        .then(response => {
            response.json().then(postInfo => {
                setPostInfo(postInfo)
            })
        })
    }, [])


    if (!postInfo){
        return ''
    }
    return (
        <div>
            <img src={`http://localhost:8000/${postInfo.cover}` alt}/>
        </div>
    )
}

export default PostPage