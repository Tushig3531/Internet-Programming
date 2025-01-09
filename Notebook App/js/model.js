const Model = (() => {
    const loadNotes = () => {
        return JSON.parse(localStorage.getItem('notes')) || {};
    };

    const saveNotes = (notes) => {
        localStorage.setItem('notes', JSON.stringify(notes));
    };

    return {
        loadNotes,
        saveNotes,
    };
})();
