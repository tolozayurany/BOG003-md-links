const index = require('./index.js');
const fsp = require('fs').promises;
const fs = require('fs');
const modulePath = require('path');
const markdownLinkExtractor = require('markdown-link-extractor')


/* Variable route que contiene el argumento pasado en la consola */
let route = process.argv[2];

/* mdLinks contiene todas las funciones del flujo */
const mdLinks = (path) => {
  /* 2. Llamar función isAnDirectory() y pasarle como argumento la función isAbsolute */
  isAnDirectory(isAbsolute(path))
}

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
  .then((res) => {
    if (res === true) {
      /* Leer el directorio */
      readDirectory(path);
      /* Si es de extensión .md se lee el archivo*/
    } else if (isMd(path)) {
      // ME FALTA HACER ALGO PARA CUANDO NO SEA UN ARCHIVO MD
      /* Leer el contenido del archivo */
      readFile(path);
    }
  })
  .catch(error => {
    console.log('error dentro de isAnDirectory => ', error)
  });

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

/* Extraer los links de un archivo md */
const extractLinks = (markdown) => markdownLinkExtractor(markdown, true);

/* Por cada link extraer sus propiedades (href,text,file) */
const links = (markdown) => {
  const promise = new Promise((resolve, reject) => {
    if (extractLinks(markdown)) {
      resolve(extractLinks(markdown))
    } else {
      reject(new Error('no funciono'))
    }
  })
  return promise;
}

/* Leer el contenido del archivo */
const readFile = (path) => {
  let array = [];
  fs.readFile(path, { encoding: 'utf-8' }, (error, data) => {
    if (error) {
      console.log(error)
    }
    links(data).then((res) => {  
      res.forEach(element => {
        let object = {
          href: element.href,
          text: element.text,
          file: path,
        }
        array.push(object) 
      })
      console.log(array) // ya se crea el array de objetos con las propiedades que necesito
      // ahora tengo un problema con el valor de retorno de esta función 
      // revisar si puedo sacar esto a otra función para hacerla mas pura o alguna forma de retornarla 
    })
      .catch(error => {
        console.log(error)
      })
  })
  console.log(array)
  return array
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
 */


mdLinks(route);
