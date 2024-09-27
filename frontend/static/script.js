import { recreateDom } from './functions/recreateDom.js';

const rootElement = document.querySelector("#root");

const init = () => recreateDom(rootElement);

init();