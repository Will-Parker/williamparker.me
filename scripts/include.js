document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('[data-include]');

    elements.forEach(element => {
        const src = element.getAttribute('data-include');
        if (src) {
            fetch(src)
                .then(response => {
                    if (!response.ok) throw new Error('Fetch failed');
                    return response.text();
                })
                .then(html => {
                    element.outerHTML = html;
                });
        }
    });
});