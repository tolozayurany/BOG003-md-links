#!/usr/bin/env node
const mdLinks = require('./md-links.js');
const axios = require("axios");

/* Variable route que contiene el argumento pasado en la consola */
const route = process.argv[2];
const options = process.argv[3];

/* mdLinks ./readme1.md --validate */


/* Comprobar si recibe como option --validate */
const isValidate = (options) => options === '--validate' ? true : false;

/* Hacer petición HTTP con axios */
/* Se podría llamar esta funcion en otra parte o sea en md-links y luego si traer lo que retorna aqui */
const httpValidate = (object, res) =>
  axios.get(object.href)
    .then((response) => {
      /* Se agregan las propiedades status y ok al objeto */
      object.status = response.status;
      object.ok = response.statusText;
      return res;
    })
    .catch(e => {
      /* Si el valor de e retorna un status de error se asigna este valor a la propiedad status y fail del objeto */
      if ((e.response !== null) || (400 <= e.response.status <= 599)) {
        object.status = e.response.status;
        object.ok = 'fail';
      } 
      return res;
    })

/* Llamar función mdLinks que retorna el objeto y da respusta http si se pasa --validate */
mdLinks.mdLinks(route, options).then((res) => {
  let arr = [];
  if (isValidate(options)) {
    res.map((element) => {
      arr.push(httpValidate(element, res)
        .then((object) => object));
    });
    Promise.all(arr).then((resolve) => console.log(resolve).catch(error => console.error(error)))
  }
  else {
    console.log('Sin validate', res);
  }
}).catch(error => console.log('Error en el retorno del objeto', error));

/* status: 404,
    statusText: 'Not Found', */