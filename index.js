#!/usr/bin/env node
const mdLinks = require('./md-links.js');

/* Variable route que contiene el argumento pasado en la consola */
const route = process.argv[2];
const options = process.argv[3];

/* mdLinks ./readme1.md --validate */

/* Comprobar si recibe como option --stats */
const stats = (options) => options === '--stats' ? true : false;

/* Ejecutar estadísticas de links cuando la opción es --stats */
const extractStats = (option, array) => {
  const option2 = process.argv[4];  /* Poner la condicion asi estaría bien */
  if (stats(option) && option2 === '--validate') {
    let count = array.length;
    let unique = array.href
    let stats = {
      Total: count,
      Unique: 3,
      Broken: 1,
    }
    return stats
  } else if (option === '--stats') {
    let count = array.length;
    let stats = {
      Total: count,
      Unique: 3,
    } 
    return stats
  }
}

/* Llamar función mdLinks que retorna el objeto y da respusta http si se pasa --validate */
mdLinks.mdLinks(route, options).then((res) => {
   if (stats(options)) {
    console.log(extractStats(options, res))
  }
  else {
    console.log('respuesta array', res);
  }
}).catch(error => console.log('Error en el retorno del objeto', error));

