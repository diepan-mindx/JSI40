const name = "ABC";
// Arrow function không có ngữ cảnh 
// this -> window
hello = () => {
  return this.name;
};

console.log(hello());
