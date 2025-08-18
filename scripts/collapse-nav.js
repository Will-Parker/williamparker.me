import { anim, easeInOutCirc, easeInOutBack } from './animation.js';

const navButton = document.getElementById('nav-btn');
var nav = document.getElementById('nav-include');

let navAnimInterval;
let frame;

// Anim parameters
const duration = 0.2; // s
const framerate = 60;  // fps

function toggleNav(isNavInclude) {
    if (isNavInclude) {
        const src = '/partials/nav.html';
        if (src) {
            fetch(src)
                .then(response => {
                    if (!response.ok) throw new Error('Fetch failed');
                    return response.text();
                })
                .then(html => {
                    clearInterval(navAnimInterval);
                    navAnimInterval = null;
                    frame = null;

                    nav.outerHTML = html;
                    nav = document.getElementById('rightSidebar');
                    const baseFontSize = parseFloat(window.getComputedStyle(nav, null).getPropertyValue('font-size'));
                    const baseWidth = parseFloat(window.getComputedStyle(nav, null).getPropertyValue('width'));
                    nav.style.fontSize = '0px';
                    nav.style.width = '0px';
                    navAnimInterval ??= setInterval(navAnim, 1000 / framerate, 0, baseFontSize, 0, baseWidth);
                });
        }
    }
    else {
        clearInterval(navAnimInterval);
        navAnimInterval = null;
        frame = null;

        const baseFontSize = parseFloat(window.getComputedStyle(nav, null).getPropertyValue('font-size'));
        const baseWidth = parseFloat(window.getComputedStyle(nav, null).getPropertyValue('width'));
        navAnimInterval ??= setInterval(navAnim, 1000 / framerate, baseFontSize, 0, baseWidth, 0);
    }
}

function navAnim(startFontSize, endFontSize, startWidth, endWidth) {
    frame ??= 0;
    const t = (frame / framerate) / duration;

    if (t == 1) {
        clearInterval(navAnimInterval);
        navAnimInterval = null;
        frame = null;
        
        nav.style.fontSize = endFontSize + 'px';
        nav.style.width = endWidth + 'px';
        // if shrink
        if (endFontSize < startFontSize) {
            nav.outerHTML = '<div id="nav-include"></div>';
            nav = document.getElementById('nav-include');
        }
    }
    else {
        // if shrink
        if (endFontSize < startFontSize) {
            nav.style.fontSize = anim(easeInOutCirc, startFontSize, endFontSize, (frame / framerate) / duration) + 'px';
            nav.style.width = anim(easeInOutCirc, startWidth, endWidth, (frame / framerate) / duration) + 'px';
        }
        // if grow
        else {
            nav.style.fontSize = anim(easeInOutBack, startFontSize, endFontSize, (frame / framerate) / duration) + 'px';
            nav.style.width = anim(easeInOutBack, startWidth, endWidth, (frame / framerate) / duration) + 'px';
        }
    }
    frame += 1;
}

document.addEventListener("DOMContentLoaded", (event) => {
    const isNavInclude = (localStorage.getItem('is-nav-include') || 'true') === 'true' ? true : false;
    if (isNavInclude) {
        const src = '/partials/nav.html';
        if (src) {
            fetch(src)
                .then(response => {
                    if (!response.ok) throw new Error('Fetch failed');
                    return response.text();
                })
                .then(html => {
                    nav.outerHTML = html;
                    nav = document.getElementById('rightSidebar');
                });
        }
    }
    else {
        nav.outerHTML = '<div id="nav-include"></div>';
        nav = document.getElementById('nav-include');
    }
});

navButton.addEventListener('click', function() {
    const isNavInclude = (localStorage.getItem('is-nav-include') || 'true') === 'true' ? true : false;
    toggleNav(!isNavInclude);
    if (isNavInclude) {
        localStorage.setItem('is-nav-include', 'false');
    }
    else {
        localStorage.setItem('is-nav-include', 'true');
    }
});