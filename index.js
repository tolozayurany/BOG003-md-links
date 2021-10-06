const mdLinks = require('./md-links.js');

/* Variable route que contiene el argumento pasado en la consola */
let route = process.argv[2];

mdLinks.mdLinks(route).then((res) => {
  console.log('response in mdLinks call ', res)

}).catch(error => console.log('error promesa', error));
