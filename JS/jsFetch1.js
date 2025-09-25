const url = "https://dummyjson.com/users";
// const pr = fetch(url);
//   pr.then((res)=>{
//     return res.json();
//   })
//   .then((data)=>{
//      console.log("name=",data.users[0].firstName);
//      console.log("email=",data.users[0].email);
//      console.log("ip=",data.users[0].ip);
//      console.log("Mac Address=",data.users[0].mcAddress);
//   })
//   .catch((err)=>{
//     console.error("Error: ",err.message);
//   })

async function Fetch(){
    try{
   let pr =await fetch( "https://dummyjson.com/users");
   const jsondata = await pr.json();
   jsondata.users.forEach((data)=>{
    console.log("Name",data.firstName);
   })
}catch(err){
    console.log(err); 
}
}

Fetch();
