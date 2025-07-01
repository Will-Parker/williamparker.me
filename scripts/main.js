document.addEventListener('DOMContentLoaded', () => {
    const button = document.createElement('button');
    button.innerText = "Click Me!";
    button.addEventListener('click', () => {
        alert("Hello! Thanks for clicking.");
    });
    document.body.appendChild(button);
});