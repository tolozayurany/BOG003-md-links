const mdLinks = require('../md-links.js');

const path = './readme1.md'
const pathDir = 'C:/Users/asus/Documents/Laboratoria/prueba-mdLinks'
const pathAbsolute = 'C:/Users/asus/Documents/Laboratoria/BOG003-md-links/readme1.md'

describe('mdLinks', () => {
  it('mdLinks hould be a object', () => {
    expect(typeof mdLinks.mdLinks()).toBe('object')
  });

});

describe('isAbsolute', () => {
  it('should be a string', () => {
    expect(typeof mdLinks.isAbsolute(path)).toBe('string')
  });
  it('if isAbsolute === true return path', () => {
    expect(mdLinks.isAbsolute(pathAbsolute)).toBe('C:/Users/asus/Documents/Laboratoria/BOG003-md-links/readme1.md')
  });
  it('if isAbsolute === false return converted path', () => {
    expect(mdLinks.isAbsolute(path)).toBe('C:\\Users\\asus\\Documents\\Laboratoria\\BOG003-md-links\\readme1.md')
  });

});

describe('isMd', () => {
  it('should be a boleean', () => {
    expect(typeof mdLinks.isMd(path)).toBe('boolean')
  });
});

describe('isAnDirectory', () => {
  it('should be a object', () => {
    expect(typeof mdLinks.isAnDirectory(path)).toBe('object')
  });
  /* Aqui me pasan las pruebas pero en realidad no están probando lo que hace la función 
  porque las lineas siguen sin cubrirse */
  it('if path is not a directory should be false', () => {
    mdLinks.isAnDirectory(path).then((res) => {
      expect(res).toBe(false)
    })
  });
  it('if path is a directory should be true', () => {
    mdLinks.isAnDirectory(pathDir).then((res) => {
      expect(res).toBe(true)
    })
  });
});

describe('extractLinks', () => {
  it('should be a object', () => {
    expect(typeof mdLinks.extractLinks(path)).toBe('object')
  });
});

describe('linksObject', () => {
  it('should be a object', () => {
    expect(typeof mdLinks.linksObject(path)).toBe('object')
  });
});

describe('readFile', () => {
  it('should be a object', () => {
    expect(typeof mdLinks.readFile(path)).toBe('object')
  });
});

describe('resReadFile', () => {
  it('should be a object', () => {
    expect(typeof mdLinks.resReadFile(pathDir)).toBe('object')
  });
});

describe('readRecursive', () => {
  it('should be a boolean', () => {
    expect(typeof mdLinks.readRecursive(pathDir)).toBe('boolean')
  });
});

describe('arrFiles', () => {
  it('should be a object', () => {
    expect(typeof mdLinks.arrFiles(path)).toBe('object')
  });
});

