const index = require('./index.js');
const fsp = require('fs').promises;
const fs = require('fs');
const modulePath = require('path');
const markdownLinkExtractor = require('markdown-link-extractor')

/* rutas para probar: 
dir  'C:\Users\asus\Documents\Laboratoria\BOG003-data-lovers\src\data'    ESTA NO SIRVE NO TRAE NADA
      C:\Users\asus\Documents\Laboratoria\BOG003-md-links     ESTA SIRVE
archivo  'C:\Users\asus\Documents\Laboratoria\BOG003-md-links\readme1.md' */

/* Variable route que contiene el argumento pasado en la consola */
let route = process.argv[2];

/* mdLinks contiene todas las funciones del flujo */
const mdLinks = (path) => new Promise((resolve, reject) => {
  if (path) {
    /* 2. Llamar función isAnDirectory() y pasarle como argumento la función isAbsolute */
    isAnDirectory(isAbsolute(path)).then((res) => {
      if (res === true) {
        /* Llamar promesa que resuelve el listado de rutas recursivamente */
        resReadDirectory(path).then((object) => {
          console.log(object);
        })
        /* Si es de extensión .md se lee el archivo*/
      } else if (isMd(path)) {
        // ME FALTA HACER ALGO PARA CUANDO NO SEA UN ARCHIVO MD
        /* Resolver promesa de leer archivo para crear el objeto */
        resReadFile(path).then((object) => {
          resolve(object)
        });
      }
    })

  } else {
    reject(new Error('Error al retornar promesa'))
  }
})

/* Comprobar si recibe ruta absoluta o relativa */
const isAbsolute = (path) => {
  // Si es absoluta retornar la ruta normal 
  if (modulePath.isAbsolute(path) === true) {
    return path;
  } else {
    // Convertir la ruta a absolta
    let newPath = modulePath.resolve(__dirname, path);
    return newPath;
  }
}

/* Comprobar que la extensión del archivo sea .md */
const isMd = (path) => modulePath.extname(path) === '.md' ? true : false;

/* Comprobar si es un archivo o un directorio */
const isAnDirectory = (path) => fsp.stat(path)
  .then((stats) => stats.isDirectory())

  .catch(error => {
    console.error('error dentro de isAnDirectory => ', error)
  });

/* Extraer los links de un archivo md */
const extractLinks = (markdown) => markdownLinkExtractor(markdown, true);

/* Por cada link extraer sus propiedades (href,text,file) */
const linksObject = (markdown, route) => {
  let array = [];
  /* Ejecutar la función de extraer links (por cada link crea el objeto) */
  const objectLinks = extractLinks(markdown);
  objectLinks.forEach(element => {
    let object = {
      href: element.href,
      text: element.text,
      file: route,
    }
    array.push(object);
  })
  return array;
}

/* Leer el contenido del archivo */
const readFile = (path) => fsp.readFile(path, { encoding: 'utf-8' })

/* Se crea promesa que resuelve el array con el listado de objetos */
const resReadFile = (path) => new Promise((resolve) => {
  /* Se resuelve la promesa de leer el archivo */
  readFile(path).then((data) => {
    resolve(linksObject(data, path))
  }).catch(error => console.log('error al leer archivo ', error))
})

/* Función de recursividad para leer todos los archivos */
const readRecursive = (dir, files) => {
  fs.readdirSync(dir).map(file => { // leer el directorio
    const path = modulePath.join(dir, file); // obtener ruta de cada archivo
    let directory = fs.statSync(path).isDirectory()
    if (directory) { // si es un directorio se vuelve a ejecutar la función
      readRecursive(path, files);
    } else if (isMd(path)) { // si es archivo y es .md lo incluye en el arreglo files 
      files.push(path);
    }
  });
  return files;
}

/* Función con promesa que resuelve el listado de archivos .md dentro del arreglo files */
const arrRecursive = (path) => new Promise((resolve) => {
  let files = [];
  let listFiles = readRecursive(path, files);
  resolve(listFiles)
});

/* Se crea promesa que resuelve el array con el listado de objetos x archivo dentro del directorio */
const resReadDirectory = (path) => new Promise((resolve) => {
  arrRecursive(path).then((files) => {
    files.forEach((file) => {
      /* Por cada archivo se llama la función que resuelve un array de objetos*/
      resReadFile(file).then((object) => {
        // console.log(object);
        // PONER ALGUNA CONDICIÓN PARA CUANDO NO ENCUENTRE NINGUN LINK DENTRO DEL README
        resolve(object)
      })
    })
  })
})

/* Pedir ayudantia para retornar lo que es porque aqui si me llama los objetos con el console pero cuando la llamo arriba 
ya no me sirve, creo que es algo en el valor de retorno que estoy dandonle a resolve
   */


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
 */

mdLinks(route).then((res) => {
  console.log(res)
  // isAnDirectory(isAbsolute(res)) // aqui me trae el objeto con los elementos del archivo ahora el problema es 
  // en el caso de exportar esta función no habria algun problema de que las llame aqui?
  // arriba el resolve no se si lo estoy haciendo bien (solo tiene path)
}).catch(error => console.log('error promesa', error));

