const myModule = (() => {
  const privateFoo = () => {};
  const privateBar = [];

  const exported = {
    publicFoo: () => {},
    publicBar: () => {},
  };

  return exported;
})();

console.log(myModule); // { publicFoo: [Function: publicFoo], publicBar: [Function: publicBar] }
console.log(myModule.privateFoo, myModule.privateBar); // undefined undefined
