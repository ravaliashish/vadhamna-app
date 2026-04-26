let entries = JSON.parse(localStorage.getItem('vadhamna')) || [];

function addEntry() {
    const entry = {
        name: document.getElementById('nameInp').value,
        place: document.getElementById('placeInp').value,
        amount: Number(document.getElementById('amountInp').value),
        id: Date.now()
    };
    
    entries.push(entry);
    localStorage.setItem('vadhamna', JSON.stringify(entries));
    render();
    toggleModal();
}

function render(filter = '') {
    const list = document.getElementById('entriesList');
    const totalDisp = document.getElementById('grandTotal');
    
    const filtered = entries.filter(e => 
        e.name.toLowerCase().includes(filter.toLowerCase()) || 
        e.place.toLowerCase().includes(filter.toLowerCase())
    );

    list.innerHTML = filtered.map(e => `
        <div class="border-b border-black/5 pb-2">
            <div class="flex justify-between text-lg">
                <span>${e.name}</span>
                <span class="font-sans font-medium">₹${e.amount}</span>
            </div>
            <div class="text-xs uppercase opacity-40 tracking-tighter">${e.place}</div>
        </div>
    `).join('');

    const total = filtered.reduce((acc, curr) => acc + curr.amount, 0);
    totalDisp.innerText = `₹ ${total.toLocaleString('en-IN')}`;
}

document.getElementById('searchInput').addEventListener('input', (e) => render(e.target.value));
function toggleModal() { document.getElementById('modal').classList.toggle('hidden'); }
render();