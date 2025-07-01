import { anim, easeInOutCirc, easeInOutBack } from './animation.js';
import { matmul } from './math.js';
import { setTheme } from './theme.js';

const settingsButton = document.getElementById('settings-btn');
var settings = document.getElementById('settings-include');

let isSettingsInclude = false;

let settingsAnimInterval;
let frame;

// Anim parameters
const duration = 0.2; // s
const framerate = 60;  // fps

function toggleSettings() {
    if (isSettingsInclude) {
        const src = 'partials/settings.html';
        if (src) {
            fetch(src)
                .then(response => {
                    if (!response.ok) throw new Error('Fetch failed');
                    return response.text();
                })
                .then(html => {
                    clearInterval(settingsAnimInterval);
                    settingsAnimInterval = null;
                    frame = null;

                    settings.outerHTML = html;
                    settings = document.getElementById('settings');

                    const baseTransformStr = window.getComputedStyle(settings, null).getPropertyValue('transform');
                    const baseTransform = parseTransform(baseTransformStr);
                    const zeroScale = [[0, 0, 0], [0, 0, 0], [0, 0, 1]];
                    const startTransform = matmul(baseTransform, zeroScale);

                    settings.style.transform = `matrix(${startTransform[0][0]}, ${startTransform[0][1]}, ${startTransform[1][0]}, ${startTransform[1][1]}, ${startTransform[0][2]}, ${startTransform[1][2]})`;
                    settingsAnimInterval ??= setInterval(settingsAnim, 1000 / framerate, [0, 0], [1, 1], [startTransform[0][2], startTransform[1][2]], [baseTransform[0][2], baseTransform[1][2]]);

                    enableSettings();
                });
        }
    }
    else {
        clearInterval(settingsAnimInterval);
        settingsAnimInterval = null;
        frame = null;

        const baseTransformStr = window.getComputedStyle(settings, null).getPropertyValue('transform');
        const baseTransform = parseTransform(baseTransformStr);
        const zeroScale = [[0, 0, 0], [0, 0, 0], [0, 0, 1]];
        const endTransform = matmul(baseTransform, zeroScale);
        settingsAnimInterval ??= setInterval(settingsAnim, 1000 / framerate, [1, 1], [0, 0], [baseTransform[0][2], baseTransform[1][2]], [endTransform[0][2], endTransform[1][2]]);

    }
}

function settingsAnim(startScale, endScale, startTranslation, endTranslation) {
    let [sx_0, sy_0] = startScale;
    let [sx_1, sy_1] = endScale;
    let [u_0, v_0] = startTranslation;
    let [u_1, v_1] = endTranslation;

    frame ??= 0;
    const t = (frame / framerate) / duration;

    if (t == 1) {
        clearInterval(settingsAnimInterval);
        settingsAnimInterval = null;
        frame = null;
        
        settings.style.transform = `matrix(${sx_1}, 0, 0, ${sy_1}, ${u_1}, ${v_1})`;
        // if shrink
        if (sx_1 < sx_0) {
            settings.outerHTML = '<div id="settings-include"></div>';
            settings = document.getElementById('settings-include');
        }
    }
    else {
        // if shrink
        if (sx_1 < sx_0) {
            let sx_i = anim(easeInOutCirc, sx_0, sx_1, (frame / framerate) / duration);
            let sy_i = anim(easeInOutCirc, sy_0, sy_1, (frame / framerate) / duration);
            let u_i = anim(easeInOutCirc, u_0, u_1, (frame / framerate) / duration);
            let v_i = anim(easeInOutCirc, v_0, v_1, (frame / framerate) / duration);
            settings.style.transform = `matrix(${sx_i}, 0, 0, ${sy_i}, ${u_i}, ${v_i})`;
        }
        // if grow
        else {
            let sx_i = anim(easeInOutBack, sx_0, sx_1, (frame / framerate) / duration);
            let sy_i = anim(easeInOutBack, sy_0, sy_1, (frame / framerate) / duration);
            let u_i = anim(easeInOutBack, u_0, u_1, (frame / framerate) / duration);
            let v_i = anim(easeInOutBack, v_0, v_1, (frame / framerate) / duration);
            settings.style.transform = `matrix(${sx_i}, 0, 0, ${sy_i}, ${u_i}, ${v_i})`;
        }
    }
    frame += 1;
}

settingsButton.addEventListener('click', function() {
    isSettingsInclude = !isSettingsInclude;
    toggleSettings();
});

function enableSettings() {
    let themeToggles = document.getElementsByClassName('theme-toggle');

    for (let themeToggle of themeToggles) {
        themeToggle.addEventListener('click', function() {
            const newColor = themeToggle.getAttribute('theme-color');
            setTheme(newColor);
        });
    }
}

function disableSettings() {
    
}

function parseTransform(transform) {
    let a, d = 1;
    let b, c, u, v = 0;
    const pattern = new RegExp('(-?[0-9]+(.[0-9]+)?)', 'g');
    const matches = transform.match(pattern);
    if (matches) {
        [a, b, c, d, u, v] = matches;
    }
    return [[parseFloat(a), parseFloat(b), parseFloat(u)], [parseFloat(c), parseFloat(d), parseFloat(v)], [0, 0, 1]];
}