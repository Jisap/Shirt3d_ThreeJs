import { proxy } from 'valtio';

// valtio  usa la API de Proxy de JavaScript para crear un objeto observable 
// que se puede usar para almacenar y manipular datos de estado en una aplicación.

const state = proxy({
  intro: true,
  color: '#EFBD48',
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: './threejs.png',
  fullDecal: './threejs.png',
});

export default state;