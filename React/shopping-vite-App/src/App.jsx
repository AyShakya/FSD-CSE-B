import React, { useEffect, useState } from 'react'
import Book from './components/Book'
import Header from './components/Header'
import Footer from './components/Footer'
import './App.css'

function App() {
  const [books, setBooks] = useState([])

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => {
        setBooks(data)
      })
      
  }, [])

  return (
    <>
      <Header />
      <div className='BookList'>
        {books.map(book => (
          <Book key={book.id} book={book} />
        ))}
      </div>
      <Footer />
    </>
  )
}

export default App
