const View = (() => {
    const renderNotes = (notes) => {
        const container = document.getElementById('notesContainer');
        container.innerHTML = ''; 
        for (const color in notes) {
            const colorGroup = document.createElement('div');
            colorGroup.innerHTML = `<h2 class="subtitle">${color}</h2>`;
            notes[color].forEach(note => {
                const noteDiv = document.createElement('div');
                noteDiv.className = `note box has-background-${color}`;
                noteDiv.innerHTML = `
                    <h3 class="title">${note.title}</h3>
                    <p>${note.text}</p>
                    <small>${note.date}</small>
                    <button class="deleteNote button is-danger">Delete</button>
                `;
                colorGroup.appendChild(noteDiv);
            });
            container.appendChild(colorGroup);
        }
    };

    const showError = (id) => {
        document.querySelector(`#${id} .help`).classList.remove('is-hidden');
    };

    const hideError = (id) => {
        document.querySelector(`#${id} .help`).classList.add('is-hidden');
    };

    return {
        renderNotes,
        showError,
        hideError,
    };
})();
