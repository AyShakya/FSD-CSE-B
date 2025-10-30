
import Book from "./component/book";
import Footer from "./component/Footer";
import Header from "./component/Header";
import React, { useState } from "react";

const App = () => {
  // const data=[
  //   {image:"",title:"Physics",price:432},
  //   {image:"",title:"Chemistry",price:432},
  //   {image:"",title:"Mathematics",price:432},
  // ]

  return (
    <div>
      <Header />
    <div className="boxlist">
      <Book />
      <Book />
      <Book />
    </div>
      <Footer />
      </div>
  );
};

export default App;
