function addEntry() {
    const entry = {
        id: Date.now(),
        name: document.getElementById('nameInp').value,
        place: document.getElementById('placeInp').value,
        amount: Number(document.getElementById('amountInp').value),
        occasion: document.getElementById('occasionInp').value,
        expectReturn: document.getElementById('trackReturn').checked,
        isReturned: false // Default is false
    };

    entries.push(entry);
    localStorage.setItem('vadhamna_data', JSON.stringify(entries));
    render();
    toggleModal();
}

function render(filter = '') {
    const list = document.getElementById('entriesList');
    const filtered = entries.filter(e => 
        e.name.toLowerCase().includes(filter.toLowerCase()) || 
        e.place.toLowerCase().includes(filter.toLowerCase())
    );

    list.innerHTML = filtered.map(e => `
        <div class="border-b border-black/5 pb-3 ${e.expectReturn && !e.isReturned ? 'bg-orange-50/50' : ''}">
            <div class="flex justify-between items-start">
                <div>
                    <div class="text-lg">${e.name}</div>
                    <div class="text-xs uppercase opacity-40">${e.place} • ${e.occasion}</div>
                </div>
                <div class="text-right">
                    <div class="font-bold">₹${e.amount.toLocaleString('en-IN')}</div>
                    ${e.expectReturn ? 
                        `<span class="text-[10px] px-2 py-0.5 rounded-full ${e.isReturned ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}">
                            ${e.isReturned ? 'Returned' : 'Pending Return'}
                        </span>` : ''
                    }
                </div>
            </div>
            ${e.expectReturn && !e.isReturned ? 
                `<button onclick="markReturned(${e.id})" class="mt-2 text-[10px] underline opacity-50">Mark as Returned</button>` : ''
            }
        </div>
    `).join('');
    
    // Update Total
    const total = filtered.reduce((acc, curr) => acc + curr.amount, 0);
    document.getElementById('grandTotal').innerText = `₹ ${total.toLocaleString('en-IN')}`;
}

function markReturned(id) {
    const index = entries.findIndex(e => e.id === id);
    entries[index].isReturned = true;
    localStorage.setItem('vadhamna_data', JSON.stringify(entries));
    render();
}
window.markReturned = markReturned;