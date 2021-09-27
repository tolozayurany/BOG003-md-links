const index = require('./index.js');
const fsp = require('fs').promises;
const fs = require('fs');
const modulePath = require('path');

/* Variable route que contiene el argumento pasado en la consola */
let route = process.argv[2];

/* mdLinks contiene todas las funciones del flujo */
const mdLinks = (path) => {
  /* 1. Comprobar si se recibe la ruta y existe */
  routeExists(path).then(() => {
    /* 2. Llamar función isAnDirectory() y pasarle como argumento la función isAbsolute */
    isAnDirectory(isAbsolute(path)).then((res) => {
      if (res === true) {
        /* Leer el directorio */
        readDirectory(path);
      } else {
        /* Leer el contenido del archivo */
        /* Primero debe preguntar si es de extensión .md para luego leerlo */
        readFile(path);
      }
    });
  })
    .catch(error => { console.log('error encontrado => ', error) });
}

/* Comprobar si se recibe la ruta y existe */
const routeExists = (path) => fsp.stat(path);

/* Comprobar si recibe ruta absoluta o relativa */
const isAbsolute = (path) => {
  // si es absoluta retornar la ruta normal 
  if (modulePath.isAbsolute(path) === true) {
    return path;
  } else {
    // convertir la ruta a absolta
    let newPath = modulePath.resolve(__dirname, path);
    return newPath;
  }
}

/* Comprobar si es un archivo o un directorio */
const isAnDirectory = (path) => fsp.stat(path).then((stats) => stats.isDirectory())
  .catch(error => {
    console.log('error dentro de isAnDirectory =>', error)
  });

/* Leer el contenido del archivo */
const readFile = (path) => {
  fs.readFile(path, { encoding: 'utf-8' }, (error, data) => {
    if (error) {
      console.log('ocurrió un error', error);
    }
    console.log('correcto', data);
  })
}

/* Leer los archivos de un directorio */
const readDirectory = (path) => {
  fsp.readdir(path)
    // Si la promesa se resuelve empieza a leer cada archvo
    .then(filenames => {
      for (let filename of filenames) {
        console.log(filename);
      }
    })
    .catch(err => {
      console.log(err);
    })
}


/*  CREACION DE UNA PROMESA
const promise = new Promise((resolve, reject) => {
   if (path) {
     resolve(path)
   } else {
     reject(new Error('no hay ruta'))
   }
 })
 
return promise
LLAMAR LA PROMESA
.then(path => console.log(path))
.catch(error => console.error(error)); 

// EXTRAER LA RUTA DEL ARCHIVO
  console.log(path.extname(route)) */


mdLinks(route);
