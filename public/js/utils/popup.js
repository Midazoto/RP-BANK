export function showPopup(message = null, type = 'info') {
    const container = document.getElementById('popup-container');
    if (!container) return;

    // Si aucun message n’est fourni, on regarde dans le localStorage
    if (!message) {
        const popupData = localStorage.getItem('popupMessage');
        if (popupData) {
            const data = JSON.parse(popupData);
            message = data.message;
            type = data.type || 'info';
            localStorage.removeItem('popupMessage');
        } else {
            return; // rien à afficher
        }
    }

    const popup = document.createElement('div');
    popup.className = `popup-message ${type}`;
    popup.textContent = message;

    container.appendChild(popup);

    setTimeout(() => {
        popup.remove();
    }, 5000);
}

export function addPopup(message, type = 'info'){
    localStorage.setItem('popupMessage', JSON.stringify({
        message: message,
        type: type
      }));
}