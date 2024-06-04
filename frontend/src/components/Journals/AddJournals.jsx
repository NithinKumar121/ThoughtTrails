/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'
import axios from 'axios'
import {useNavigate,useParams} from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddJournals = () => {
 
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ]
  
  
  const navigator = useNavigate()

  const {id} = useParams();
  const [title , setTitle] = useState('')
  const [description , setDescription] = useState('')
  const [journalContent , setJournalContent] = useState('')
  const [author , setAuthor] = useState('')
  const [image , setImage] = useState("")
  const [data,setData] = useState([])
  const [_id,setId] = useState('')

  function getCookieValue(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}
   

   const fetchOldData = async() =>{
    const token = getCookieValue('journal_token')
    console.log(id)
    try{
    const data = await axios.post(`${import.meta.env.VITE_BASE_URL}journal/getJournalbyId`,{
      id:id
    },
    {
     headers:{
       'Authorization' : `Bearer ${token}`,
       'Content-Type' : 'application/json'
      }
    })
    // setData(data.data.message)
    setId(_id)
    setTitle(data.data.message.title)
    setAuthor(data.data.message.author)
    setImage(data.data.message.image)
    setDescription(data.data.message.description)
    setJournalContent(data.data.message.journalContent)
  }catch(err){
    console.log(err.message)
  }
  }
  
  const restoreData =()=>{
    
  }

    useEffect(()=>{
      if(id){
        fetchOldData()
      }
    },[id])
    
 
  const handleSubmit = async() => {
    try{
      const token = getCookieValue('journal_token')
      console.log('insubmit')
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}journal/add`, {
        id:id,
        title: title,
        description: description,
        journalContent: journalContent,
        image: image,
        author: author
    }, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    console.log(response)
    if(response.status === 200){
      navigator('/home')
    }
    }
    catch(err){
      toast.error("incomplete data")
    }
  }

  return (
    <div className='p-4 '>
      <div className='flex items-center flex-col'>
        <div className='text-4xl border-b-2 border-solid border-[silver] p-4'>Showcase Your Journals</div>
        <div className='w-full sm:w-[70%] flex flex-col items-start gap-4 text-lg m-2'>
          <div>Title : </div>
          <input type='text' className='w-full p-2 border-2 border-gray-300 rounded-lg shadow-md' placeholder='Enter your Title here...'
          value={title} onChange={(e) => { setTitle(e.target.value) }} required
          />
        </div>
        <div className='w-full sm:w-[70%] flex flex-col items-start gap-4 text-lg m-2'>
          <div>Description : </div>
          <textarea type='text' className='w-full p-2 border-2 border-gray-300 rounded-lg shadow-md h-30' placeholder='Enter your description here...'
          value={description} onChange={(e) => { setDescription(e.target.value) }} required
          />
        </div>
        <div className='w-full sm:w-[70%] flex flex-col items-start gap-4 text-lg m-2'>
          <div>Journal Content : </div>
          <ReactQuill
              modules={modules}
              formats={formats}
              placeholder='Write your Journal Content here...'
              className='w-full p-2 border-2 border-gray-300 bg-white rounded-lg h-30'
              value={journalContent} onChange={(e) => { setJournalContent(e) }}
              required
          />
        </div>
        <div className='flex w-full sm:w-[70%] flex-col sm:flex-row'>
          <div className='w-full sm:w-[50%] flex flex-col items-start gap-4 text-lg m-2'>
            <div>Author : </div>
            <input type='text' className='w-full p-2 border-2 border-gray-300 rounded-lg shadow-md' placeholder='@authorName' required
            value={author} onChange={(e) => { setAuthor(e.target.value) }}
            />
          </div>
          <div className='w-full sm:w-[50%] flex flex-col items-start gap-4 text-lg m-2'>
            <div>Cover image : </div>
            <input type='text' className='w-full p-2 border-2 border-gray-300 rounded-lg shadow-md' placeholder='Enter your image url...' 
              value = {image}
             onChange={(e) => {
              setImage(e.target.value)
            }}
  
            />
          </div>
        </div>
          <button className='bg-green-400 px-3 py-3 rounded-lg mt-7 text-2xl shadow-xl' onClick={()=>{handleSubmit()}}>Add Post</button>
      </div>
      <ToastContainer />
    </div>
  )
}

export default AddJournals