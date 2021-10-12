#!/usr/bin/env node
const mdLinks = require('./md-links.js');

/* Variable route que contiene el argumento pasado en la consola */
const route = process.argv[2];
const options = process.argv[3];
const option2 = process.argv[4];

/* mdLinks ./readme1.md --validate */

const uniqueLinks = (array) => {
  let arr = []
  let arry = []
  array.forEach(element => {
    arr.push(element.href);
  });
  arr.map((href, i) => {
    if (arr[href] === arr[i]) {
      arry.push(href)
    }
  });
  return arry.length
}

/* Ejecutar estadísticas de links cuando la opción es --stats y --validate */
const statsValidate = (array) => {
  let count = array.length;
  /* let unique = uniqueLinks(array); */
  let broken = 0;
  array.map((e) => {
    if (e.status >= 400 && e.status <= 599) {
      broken++
    }
  })
  let stats = {
    Total: count,
    Unique: 0,
    Broken: broken,
  }
  return stats
}

/* Ejecutar estadísticas de links cuando la opción es --stats */
const stats = (array) => {
  let count = array.length;
  let stats = {
    Total: count,
    Unique: 3,
  }
  return stats
}

/* Llamar función mdLinks que retorna el objeto y si se pasa --validate y/o --stats */
mdLinks.mdLinks(route, options).then((res) => res)
  .then((object) => {
    if (options === '--validate' && option2 === '--stats') {
      console.log(statsValidate(object))
    }
    else if (options === '--validate') {
      console.log(object)
    }
    else if (options === '--stats') {
      console.log(stats(object))
    }
    else {
      console.log(object)
    }
  })


