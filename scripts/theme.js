import { recolorSVG } from './svg-recolor.js';

export function setTheme(themeColor) {
    document.documentElement.style.setProperty('--default-color', themeColor);
    localStorage.setItem('theme', themeColor);
    let svgEls = document.getElementsByClassName('svg');
    console.log(svgEls);
    for (let svgEl of svgEls) {
        recolorSVG(svgEl);
    }
}

document.addEventListener("DOMContentLoaded", (event) => {
    const savedTheme = localStorage.getItem('theme') || 'chartreuse';
    document.documentElement.style.setProperty('--default-color', savedTheme);
    let svgEls = document.getElementsByClassName('svg');
    console.log(svgEls);
    for (let svgEl of svgEls) {
        recolorSVG(svgEl);
    }
});