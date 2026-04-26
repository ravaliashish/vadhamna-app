// Use a specific key for your data vault
let entries = JSON.parse(localStorage.getItem('vadhamna_vault_v2')) || [];

function toggleModal() {
    const modal = document.getElementById('modal');
    modal.classList.toggle('hidden');
}

function addEntry() {
    const name = document.getElementById('nameInp').value;
    const place = document.getElementById('placeInp').value;
    const amount = document.getElementById('amountInp').value;
    const occasion = document.getElementById('occasionInp').value;
    const expectReturn = document.getElementById('trackReturn').checked;

    if (!name || !amount) return alert("Please fill Name and Amount");

    const newEntry = {
        id: Date.now(),
        name,
        place: place || "Local",
        amount: Number(amount),
        occasion,
        expectReturn,
        isReturned: false // Tracking for your brother's wedding
    };

    entries.unshift(newEntry); // Newest at the top
    saveAndRender();
    
    // Clear inputs and close
    document.getElementById('nameInp').value = '';
    document.getElementById('placeInp').value = '';
    document.getElementById('amountInp').value = '';
    document.getElementById('trackReturn').checked = false;
    toggleModal();
}

function markReturned(id) {
    const index = entries.findIndex(e => e.id === id);
    if (index !== -1) {
        entries[index].isReturned = true;
        saveAndRender();
    }
}

function saveAndRender() {
    localStorage.setItem('vadhamna_vault_v2', JSON.stringify(entries));
    render();
}

function render(filterText = '') {
    const list = document.getElementById('entriesList');
    const totalDisplay = document.getElementById('grandTotal');
    
    const filtered = entries.filter(e => 
        e.name.toLowerCase().includes(filterText.toLowerCase()) || 
        e.place.toLowerCase().includes(filterText.toLowerCase())
    );

    list.innerHTML = filtered.map(e => `
        <div class="p-4 rounded shadow-sm border border-black/5 ${e.expectReturn && !e.isReturned ? 'pending-card' : 'bg-white/40 returned-card'}">
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="text-lg font-medium">${e.name}</h3>
                    <p class="text-[10px] uppercase tracking-wider opacity-50">${e.place} • ${e.occasion}</p>
                </div>
                <div class="text-right">
                    <span class="text-xl font-sans font-bold">₹${e.amount.toLocaleString('en-IN')}</span>
                    ${e.expectReturn ? `
                        <div class="mt-1">
                            ${e.isReturned 
                                ? '<span class="text-[9px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase font-bold">Returned</span>' 
                                : '<span class="text-[9px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase font-bold">Pending Return</span>'}
                        </div>
                    ` : ''}
                </div>
            </div>
            
            ${e.expectReturn && !e.isReturned ? `
                <button onclick="markReturned(${e.id})" class="mt-3 text-xs font-sans text-amber-700 underline decoration-dotted">
                    Mark as received at Brother's Wedding
                </button>
            ` : ''}
        </div>
    `).join('');

    const total = filtered.reduce((sum, item) => sum + item.amount, 0);
    totalDisplay.innerText = `₹ ${total.toLocaleString('en-IN')}`;
}

// Event Listeners
document.getElementById('searchInput').addEventListener('input', (e) => render(e.target.value));

// Expose to global for HTML onclicks
window.toggleModal = toggleModal;
window.addEntry = addEntry;
window.markReturned = markReturned;

// Initial render
render();