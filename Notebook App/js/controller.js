document.addEventListener('DOMContentLoaded', () => {
    const notes = Model.loadNotes();
    View.renderNotes(notes);

    document.getElementById('addNote').addEventListener('click', () => {
        const title = document.getElementById('title').value;
        const color = document.getElementById('color').value;
        const text = document.getElementById('text').value;

        let valid = true;
        if (!title) {
            View.showError('fieldTitle');
            valid = false;
        } else {
            View.hideError('fieldTitle');
        }

        if (!text) {
            View.showError('fieldText');
            valid = false;
        } else {
            View.hideError('fieldText');
        }

        if (!color) {
            View.showError('fieldColor');
            valid = false;
        } else {
            View.hideError('fieldColor');
        }

        if (valid) {
            const date = new Date().toLocaleString();
            const note = { title, text, date };
            if (!notes[color]) {
                notes[color] = [];
            }
            notes[color].push(note);
            Model.saveNotes(notes);
            View.renderNotes(notes);
            document.getElementById('title').value = '';
            document.getElementById('color').value = '';
            document.getElementById('text').value = '';
        }
    });

    document.getElementById('notesContainer').addEventListener('click', (event) => {
        if (event.target.classList.contains('deleteNote')) {
            const noteDiv = event.target.closest('.note');
            const color = noteDiv.classList[2].split('-')[2];
            const title = noteDiv.querySelector('.title').innerText;

            notes[color] = notes[color].filter(note => note.title !== title);
            Model.saveNotes(notes);
            View.renderNotes(notes);
        }
    });
});
