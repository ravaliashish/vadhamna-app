let entries = JSON.parse(localStorage.getItem('vadhamna_v3')) || [];

function toggleModal() {
    document.getElementById('modal').classList.toggle('hidden');
    document.getElementById('nameInp').focus();
}

function addEntry(keepOpen) {
    const name = document.getElementById('nameInp').value;
    const place = document.getElementById('placeInp').value;
    const amount = document.getElementById('amountInp').value;
    const occasion = document.getElementById('occasionInp').value;
    const track = document.getElementById('trackReturn').checked;

    if (!name || !amount) return;

    const newEntry = {
        id: Date.now(),
        name,
        place: place || "Local",
        amount: Number(amount),
        occasion,
        track,
        completed: false 
    };

    entries.unshift(newEntry);
    saveAndRender();

    // Clear only Name and Amount for Quick Mode
    document.getElementById('nameInp').value = '';
    document.getElementById('amountInp').value = '';
    
    if (!keepOpen) toggleModal();
    else document.getElementById('nameInp').focus();
}

function deleteEntry(id) {
    if (confirm("Delete this entry permanently?")) {
        entries = entries.filter(e => e.id !== id);
        saveAndRender();
    }
}

function markCompleted(id) {
    const index = entries.findIndex(e => e.id === id);
    entries[index].completed = true;
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem('vadhamna_v3', JSON.stringify(entries));
    render();
}

function render(filter = '') {
    const list = document.getElementById('entriesList');
    const filtered = entries.filter(e => 
        e.name.toLowerCase().includes(filter.toLowerCase()) || 
        e.place.toLowerCase().includes(filter.toLowerCase())
    );

    list.innerHTML = filtered.map(e => `
        <div class="card p-4 rounded-lg shadow-sm ${e.track && !e.completed ? 'pending-border' : ''}">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <div class="flex items-center gap-2">
                        <span class="text-lg">${e.name}</span>
                        <button onclick="deleteEntry(${e.id})" class="opacity-20 hover:opacity-100">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>
                    <p class="text-[10px] uppercase opacity-40">${e.place} • ${e.occasion}</p>
                </div>
                <div class="text-right">
                    <div class="font-bold">₹${e.amount.toLocaleString('en-IN')}</div>
                    ${e.track ? `
                        <button onclick="markCompleted(${e.id})" class="text-[9px] px-2 py-1 rounded-full mt-1 ${e.completed ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700 underline underline-offset-4'}">
                            ${e.completed ? 'Acknowledged' : 'Acknowledge at Brother\'s'}
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');

    const total = filtered.reduce((s, i) => s + i.amount, 0);
    document.getElementById('grandTotal').innerText = `₹ ${total.toLocaleString('en-IN')}`;
}

document.getElementById('searchInput').addEventListener('input', (e) => render(e.target.value));
window.toggleModal = toggleModal;
window.addEntry = addEntry;
window.deleteEntry = deleteEntry;
window.markCompleted = markCompleted;
render();