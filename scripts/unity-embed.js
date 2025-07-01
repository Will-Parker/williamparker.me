const unityContainer = document.getElementById('unity-container');
const src = unityContainer.getAttribute('unity-src');

unityContainer.addEventListener('click', function() {
    const iframe = document.createElement('iframe');
    iframe.id = 'unity-embed';
    iframe.src = src;
    iframe.allow = 'fullscreen';

    this.innerHTML = '';
    this.appendChild(iframe);
});