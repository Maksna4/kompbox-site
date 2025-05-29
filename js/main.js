document.addEventListener('DOMContentLoaded', () => {
    const hasDefectsRadios = document.querySelectorAll('input[name="hasDefects"]');
    const defectsDetailsGroup = document.getElementById('defectsDetailsGroup');

    hasDefectsRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            defectsDetailsGroup.style.display = radio.value === 'да' ? 'block' : 'none';
        });
    });

    const form = document.getElementById('surveyForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const workDone = getRadioValue('workDone');
            const hasDefects = getRadioValue('hasDefects');
            const defectsDetails = document.getElementById('defectsDetails').value.trim();
            const rating = document.getElementById('ratingSelect').value;

            if (!workDone || !hasDefects || !rating) {
                alert('Пожалуйста, заполните все обязательные поля.');
                return;
            }

            const formData = new FormData();
            formData.append('workDone', escape(workDone));
            formData.append('hasDefects', escape(hasDefects));
            formData.append('defectsDetails', escape(defectsDetails));
            formData.append('rating', escape(rating));

            try {
                await fetch('/api/submit', {
                    method: 'POST',
                    body: formData
                });

                showModal();
                loadRatingData();
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Не удалось отправить форму.');
            }
        });
    }

    async function loadRatingData() {
        try {
            const response = await fetch('/api/rating');
            const data = await response.json();
            const tbody = document.getElementById('ratingTableBody');
            tbody.innerHTML = data.map(item => `
                <tr>
                    <td>${escape(item.name)}</td>
                    <td>${escape(item.position)}</td>
                    <td class="rating-star">${'★'.repeat(parseInt(item.rating))}</td>
                    <td>${new Date(item.date).toLocaleDateString()}</td>
                </tr>
            `).join('');
        } catch (e) {
            console.error("Ошибка загрузки рейтинга", e);
        }
    }

    function escape(str) {
        return str.replace(/[&<>"']/g, tag => ({
            '&': '&amp;',
            '<': '<',
            '>': '>',
            '"': '&quot;',
            "'": '&#39;'
        }[tag]));
    }

    function getRadioValue(name) {
        const radio = document.querySelector(`input[name="${name}"]:checked`);
        return radio ? radio.value : null;
    }

    function showModal() {
        document.getElementById('modalOverlay').style.display = 'flex';
    }

    function closeModal() {
        document.getElementById('modalOverlay').style.display = 'none';
    }

    window.showModal = showModal;
    window.closeModal = closeModal;
});