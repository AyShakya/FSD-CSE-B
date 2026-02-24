function dosomething() {
  throw new Error("a error is thrown from do something");
}
function init() {
  try {
    dosomething();
  } catch (e) {
    console.log(e);
  }
  console.log("after successful error handling");
}
init();
