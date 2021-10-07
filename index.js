#!/usr/bin/env node
const mdLinks = require('./md-links.js');

/* Variable route que contiene el argumento pasado en la consola */
const route = process.argv[2];
const options = process.argv[3];
/* Comprobar si recibe como option --validate */

const isValidate = (options) => options === '--validate' ? true : false;

mdLinks.mdLinks(route, options).then((res) => {
 
  if (isValidate(options)){
    res.map((element) => {
      element.status = '45778'
      element.ok = 'ok'
      console.log(res)
      // console.log(position);
    });
    
  }
  else {
    console.log('response in mdLinks call ', res);
  }
}).catch(error => console.log('error promesa', error));
