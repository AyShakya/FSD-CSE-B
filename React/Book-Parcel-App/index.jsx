import React from "react";
import "./index.css";
function Book(){
return(
    <div className="card">
        <img src="https://www.bing.com/images/search?view=detailV2&ccid=1Kis%2fmth&id=7625FBDC40DAE3B8B6027FAC927FF4F859606010&thid=OIP.1Kis_mthP77favEcfzT93QHaLT&mediaurl=https%3a%2f%2fd28hgpri8am2if.cloudfront.net%2fbook_images%2fonix%2fcvr9781668016138%2fholly-9781668016138_hr.jpg&exph=2138&expw=1400&q=book&FORM=IRPRST&ck=CFF6C188EA98BFE5971B37384117C55A&selectedIndex=1&itb=0" alt="book image"width="400px" height="400px" />
        <h3>Title:Physics</h3>
        <h4>Price:₹381/-</h4>
        <button>Add to Cart</button>
    </div>
);
}
const parent=document.getElementById("root");
const root=ReactDOM.ceateroot(parent)
root.render(<Book/>)