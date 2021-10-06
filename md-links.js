const fsp = require('fs').promises;
const fs = require('fs');
const Path = require('path');
const markdownLinkExtractor = require('markdown-link-extractor')

/* rutas para probar: 
dir  'C:\Users\asus\Documents\Laboratoria\BOG003-data-lovers\' --Al pasarle esta ruta se queda sin hacer nada
                                                             pienso que por la cantidad de archivos que encuentra
dir2    'C:\Users\asus\Documents\Laboratoria\BOG003-data-lovers\node_modules\@eslint'  FUNCIONA
archivo  'C:\Users\asus\Documents\Laboratoria\BOG003-md-links\readme1.md' FUNCIONA */

/* mdLinks contiene todas las funciones del flujo */
const mdLinks = (path) => new Promise((resolve, reject) => {
  let arr = [];
  if (path) {
    /* 2. Llamar función isAnDirectory() y pasarle como argumento la función isAbsolute */
    isAnDirectory(isAbsolute(path)).then((res) => {
      if (res === true) {
        /* Llamar promesa que resuelve el listado de rutas recursivamente */
        arrFiles(path).then((files) => {

          files.forEach((file) => {
            // console.log(file) // HAY UN PROBLEMA CON ALGUNOS DIRECTORIOS QUE NO LEE BIEN
            /* Por cada archivo se resuelve resReadFile que agregan los objetos que con sus propiedades al arreglo arr */
            arr.push(resReadFile(file).then((object) => object).catch((error) => console.error('error en arry.push', error)))
            // PONER ALGUNA CONDICIÓN PARA CUANDO NO ENCUENTRE NINGUN LINK DENTRO DEL README
          })
          /* Al resolverse todas las promesas anteriores se da resolve a la promesa que retorna objetos(uno por link)  */
          resolve(Promise.all(arr).then((resolve) => resolve).catch((error) => console.error('error en resolve promise', error)))
        }).catch((error) => console.error('error en res read', error))
        /* Si es de extensión .md se lee el archivo*/
      } else if (isMd(path)) {
        // ME FALTA HACER ALGO PARA CUANDO NO SEA UN ARCHIVO MD
        /* Resolver promesa de leer archivo para crear el objeto */
        resReadFile(path).then((object) => {
          resolve(object)
        }).catch((error) => console.error('error en resReadFile mdlinks', error));
      }
    }).catch((error) => console.error('error en is a directory', error))

  } else {
    reject(new Error('Error al retornar promesa'))
  }
})

/* Comprobar si recibe ruta absoluta o relativa */
const isAbsolute = (path) => {
  // Si es absoluta retornar la ruta normal 
  if (Path.isAbsolute(path) === true) {
    return path;
  } else {
    // Convertir la ruta a absolta
    let newPath = Path.resolve(__dirname, path);
    return newPath;
  }
}

/* Comprobar que la extensión del archivo sea .md */
const isMd = (path) => Path.extname(path) === '.md' ? true : false;

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
const resReadFile = (path) => new Promise((resolve, reject) => {
  /* Se resuelve la promesa de leer el archivo */
  readFile(path).then((data) => {
    if (data)
      resolve(linksObject(data, path))
    else {
      reject(new Error('no hay datos al leer'))
    }
  }).catch(error => console.log('error al leer archivo ', error))
})

/* Función de recursividad para extraer todos los archivos md del directorio */
const readRecursive = (dir, files) => {
  fs.readdirSync(dir).map(file => { // leer el directorio
    const path = Path.join(dir, file); // obtener ruta de cada archivo
    let directory = fs.statSync(path).isDirectory()
    if (directory) { // si es un directorio se vuelve a ejecutar la función
      readRecursive(path, files);
    } else if (isMd(path)) { // si es archivo y es .md lo incluye en el arreglo files 
      files.push(path);
    }
  });
  return files;
}

/* Función con promesa que llama readRecursive y resuelve el listado de archivos .md dentro del arreglo files */
const arrFiles = (path) => new Promise((resolve, reject) => {
  let files = [];
  let listFiles = readRecursive(path, files);
  if (files != []) {
    resolve(listFiles)
  }
  else {
    reject(new Error('no hay links'))
  }
});

/* exports: para que la función esté disponible para su importación en otro lugar */
exports.mdLinks = mdLinks;
