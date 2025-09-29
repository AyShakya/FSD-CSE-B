const num = [10,20,30,40,50];
//Array Destructing

// const a = num[0];
// const b = num[1];
// const c = num[2];
// const d = num[3];
// const e = num[4];

// const [a,b,c,d,e] = num;

const [a,b,...rest] = num;

console.log(a,b + " # " + rest);

const obj = {
    name: "abc",
    id:2,
    email: "abjlbgjg",
}

// const {name, id, email} = obj;
// console.log(name,id,email);

// const {name:newName, id, email} = obj;
// console.log(newName,id,email);

const {name, ...object} = obj;
console.log(object);

const arr1 = [1,2];
const arr2 = [3,4,5];
const newArr = [...arr1, ...arr2];
console.log(newArr);
