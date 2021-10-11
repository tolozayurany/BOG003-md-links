const mdLinks = require('../md-links.js');

const path = './readme1.md'
const pathDir = 'C:/Users/asus/Documents/Laboratoria/prueba-mdLinks'
const pathAbsolute = 'C:/Users/asus/Documents/Laboratoria/prueba-mdLinks/Dir3/readme1.md'

let object =
  [
    {
      href: 'https://user-images.githubusercontent.com/110297/42118443-b7a5f1f0-7bc8-11e8-96ad-9cc5593715a6.jpg',
      text: 'https://user-images.githubusercontent.com/110297/42118443-b7a5f1f0-7bc8-11e8-96ad-9cc5593715a6.jpg',
      file: 'C:/Users/asus/Documents/Laboratoria/prueba-mdLinks/Dir3/readme1.md'
    },
    {
      href: 'https://nodejs.org/es/',
      text: 'Node.js',
      file: 'C:/Users/asus/Documents/Laboratoria/prueba-mdLinks/Dir3/readme1.md'
    },
    {
      href: 'https://issuu.com/tolozayury/docs/encuestas_en_l_nea.pptx',
      text: 'motor de JavaScript V8 de Chrome',
      file: 'C:/Users/asus/Documents/Laboratoria/prueba-mdLinks/Dir3/readme1.md'
    }
  ]
  
let object2 =
[
  {
    href: 'https://user-images.githubusercontent.com/110297/42118443-b7a5f1f0-7bc8-11e8-96ad-9cc5593715a6.jpg',
    text: 'https://user-images.githubusercontent.com/110297/42118443-b7a5f1f0-7bc8-11e8-96ad-9cc5593715a6.jpg',
    file: 'C:\\Users\\asus\\Documents\\Laboratoria\\BOG003-md-links\\readme1.md'
  },
  {
    href: 'https://nodejs.org/es/',
    text: 'Node.js',
    file: 'C:\\Users\\asus\\Documents\\Laboratoria\\BOG003-md-links\\readme1.md'
  },
  {
    href: 'https://issuu.com/tolozayury/docs/encuestas_en_l_nea.pptx',
    text: 'motor de JavaScript V8 de Chrome',
    file: 'C:\\Users\\asus\\Documents\\Laboratoria\\BOG003-md-links\\readme1.md'
  }
]


describe('mdLinks', () => {
  it('mdLinks should be a object', () => {
    expect(typeof mdLinks.mdLinks()).toBe('object')
  });
  it('mdLinks should returned a object in path absolute', () => {
    mdLinks.mdLinks(pathAbsolute).then((res) => {
      expect(res).toStrictEqual(object)
    });
  });
  it('mdLinks should returned a object in path relative', () => {
    mdLinks.mdLinks(path).then((res) => {
      expect(res).toStrictEqual(object2)
    });
  })
});
