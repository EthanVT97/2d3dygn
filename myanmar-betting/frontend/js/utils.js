export function formatMoney(amount) {
    return new Intl.NumberFormat('my-MM').format(amount);
}

export function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric',
        hour12: true
    };
    return new Date(dateString).toLocaleDateString('my-MM', options);
}

export function getTransactionStatus(status) {
    const statusClasses = {
        pending: 'status-pending',
        completed: 'status-completed',
        won: 'status-won',
        lost: 'status-lost'
    };

    const statusText = {
        pending: 'စောင့်ဆိုင်းဆဲ',
        completed: 'ပြီးဆုံး',
        won: 'ထီပေါက်',
        lost: 'မပေါက်'
    };

    const statusClass = statusClasses[status.toLowerCase()] || '';
    const text = statusText[status.toLowerCase()] || status;

    return `<span class="status-badge ${statusClass}">${text}</span>`;
}

export function updateTodayNumbers() {
    const now = new Date();
    const noon = new Date(now);
    noon.setHours(12, 0, 0, 0);

    const evening = new Date(now);
    evening.setHours(16, 30, 0, 0);

    const numbersElement = document.getElementById('todayNumbers');
    if (!numbersElement) return;

    if (now < noon) {
        const timeLeft = Math.floor((noon - now) / (1000 * 60));
        numbersElement.textContent = `12:00 PM - ${timeLeft} မိနစ် ကျန်ပါသေးသည်`;
    } else if (now < evening) {
        const timeLeft = Math.floor((evening - now) / (1000 * 60));
        numbersElement.textContent = `4:30 PM - ${timeLeft} မိနစ် ကျန်ပါသေးသည်`;
    } else {
        numbersElement.textContent = 'ယနေ့အတွက် ပိတ်ပါပြီ';
    }
}
