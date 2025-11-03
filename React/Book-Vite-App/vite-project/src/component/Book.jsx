import React from 'react'
import { useState } from 'react';
function Book() {
    const[count, setCount] = useState(0);
    function decrementValue() {
        setCount(count-1);
    }
    function incrementValue() {
        setCount(count+1);
    }
  return (
    <div className='books'>
      <img src="https://m.media-amazon.com/images/I/9115OTjGQgL._SL1500_.jpg" alt=""  width="300px" height="300px" />
      <h3>title:</h3>
      <h4>price:</h4>
      <button onClick={decrementValue}>-</button>
      <button>Add to cart</button>
      <p>{count}</p>
      <button onClick={incrementValue}>+</button>
    </div>
  )
}

export default Book;
