// script.js
document.addEventListener('DOMContentLoaded', () => {
    fetch('https://dragonball-api.com/api/characters/1') // Ejemplo con Goku (ID:1)
        .then(response => response.json())
        .then(data => {
            document.getElementById('character-name').textContent = data.name;
            document.getElementById('character-race').textContent = data.race;
            document.getElementById('character-power').textContent = data.power || "N/A";
            document.getElementById('character-img').src = data.image || "https://via.placeholder.com/300x250";
        })
        .catch(error => {
            console.error("Error fetching data: ", error);
        });
});