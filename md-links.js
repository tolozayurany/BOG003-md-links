const fsp = require('fs').promises;
const fs = require('fs');
const Path = require('path');
const markdownLinkExtractor = require('markdown-link-extractor');
const axios = require("axios");

/* 'C:\Users\asus\Documents\Laboratoria\prueba-mdLinks\Dir3' --validate 

flatMap: para sacar los arreglos dentro y dejarlos en un solo arreglo
*/

/* HACER ESTA FUNCIÓN CON THEN ENCADENADOS Y NO ANIDADOS */
/* Contiene todas las funciones del flujo */
const mdLinks = (path, options) => new Promise((resolve, reject) => {
  let arr = [];
  let newArr = [];
  if (path) {
    /* 2. Llamar función isAnDirectory() y pasarle como argumento la función isAbsolute */
    isAnDirectory(isAbsolute(path)).then((res) => {
      if (res === true) {
        /* Llamar promesa que resuelve el listado de rutas recursivamente */
        arrFiles(path).then((files) => {
          files.forEach((file) => {
            /* Por cada archivo se resuelve resReadFile que agregan los objetos que con sus propiedades al arreglo arr */
            arr.push(resReadFile(file).then((object) => {
              /* Si la opción es validate por cada object se agregan las propiedades status y ok*/
              if (validate(options)) {
                object.map((element) => {
                  
                  newArr.push(httpValidate(element)
                    .then(newObject => newObject));
                });
                /* Cuando se ejecuta lo anterior y se cumple la promesa se retorna el objeto */
                /* TODAVIA ME RETORNA UN VALOR UNDEFINED AL PRINCIPIO NO SE POR QUE */
                resolve(Promise.all(newArr).then((response) => response))
              } else {
                /* Si la opción no incluye nada se resuelve cada objeto con sus propiedades iniciales */
                resolve(object)
              }
            }))
          })
        })
          .catch((error) => console.error('error en res read', error))
        /* Si es de extensión .md se lee el archivo*/
      } else if (isMd(path)) {
        /* Resolver promesa de leer archivo para crear el objeto */
        resReadFile(isAbsolute(path)).then((object) => {
          if (validate(options)) {
            object.map((element) => {
              arr.push(httpValidate(element)
                .then(newObject => newObject));
            });
            resolve(Promise.all(arr).then(res => res))
          }
          resolve(object);
        })
      } else {
        console.error('no hay archivos .md')
      }
    })
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
  }).catch(error => console.error('error al leer archivo ', error))
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

/* Comprobar si recibe como option --validate */
const validate = (options) => options === '--validate' ? true : false;

/* Hacer petición HTTP con axios */
/* Se podría llamar esta funcion en otra parte o sea en md-links y luego si traer lo que retorna aqui */
const httpValidate = (object) =>
  axios.get(object.href)
    .then((response) => {
      /* Se agregan las propiedades status y ok al objeto */
      object.status = response.status;
      object.ok = response.statusText;
      return object;
    })
    .catch(e => {
      /* Si el valor de e retorna un status de error se asigna este valor a la propiedad status y fail del objeto */
      if ((e.response !== null) || (400 <= e.response.status <= 599)) {
        object.status = e.response.status;
        object.ok = 'fail';
      }
      return object;
    })

/* exports: para que la función esté disponible para su importación en otro lugar */
exports.mdLinks = mdLinks;
