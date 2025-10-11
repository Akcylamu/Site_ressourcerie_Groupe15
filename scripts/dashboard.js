document.addEventListener('DOMContentLoaded', function() {
    // Vérifie si l'utilisateur est un admin
    const isAdmin = true; // MODIF : À remplacer par une vérification réelle

    // Affiche/masque les boutons admin
    if (!isAdmin) {
        document.getElementById('add-meuble-button').style.display = 'none';
        document.querySelectorAll('.admin-actions').forEach(el => {
            el.style.display = 'none';
        });
    }

    // Charger les meubles depuis localStorage
    function loadMeubles() {
        const meubles = JSON.parse(localStorage.getItem('meubles')) || [];
        const meublesGrid = document.getElementById('meubles-grid');
        meublesGrid.innerHTML = ''; // Vide la grille avant de recharger

        meubles.forEach(meuble => {
            const meubleCard = document.createElement('div');
            meubleCard.className = 'meuble-card';
            meubleCard.setAttribute('data-id', meuble.id);
            meubleCard.innerHTML = `
                <div class="meuble-image"><img src="${meuble.image}" alt="image"></div>
                <div class="meuble-info">
                    <h3 class="meuble-title">${meuble.title}</h3>
                    <p class="meuble-description">${meuble.description}</p>
                    <div class="meuble-meta">
                        <span class="meuble-status ${meuble.status}">${meuble.status === 'available' ? 'Disponible' : 'Réservé'}</span>
                        <span class="meuble-price">${meuble.price}</span>
                    </div>
                    <button class="reserve-button ${meuble.status === 'reserved' ? 'reserved' : ''}" ${meuble.status === 'reserved' ? 'disabled' : ''}>
                        ${meuble.status === 'reserved' ? 'Réservé' : 'Réserver'}
                    </button>
                    <div class="admin-actions" ${isAdmin ? '' : 'style="display: none;"'}>
                        <button class="admin-button edit-button">Modifier</button>
                        <button class="admin-button delete-button">Supprimer</button>
                    </div>
                </div>
            `;
            meublesGrid.appendChild(meubleCard);
        });

        // Réattacher les écouteurs d'événements après le chargement
        attachEventListeners();
    }

    // Sauvegarder un meuble dans localStorage
    function saveMeuble(meuble) {
        let meubles = JSON.parse(localStorage.getItem('meubles')) || [];
        const existingIndex = meubles.findIndex(m => m.id === meuble.id);

        if (existingIndex >= 0) {
            // Mise à jour d'un meuble existant
            meubles[existingIndex] = meuble;
        } else {
            // Ajout d'un nouveau meuble
            meubles.push(meuble);
        }

        localStorage.setItem('meubles', JSON.stringify(meubles));
    }

    // Supprimer un meuble de localStorage
    function deleteMeuble(meubleId) {
        let meubles = JSON.parse(localStorage.getItem('meubles')) || [];
        meubles = meubles.filter(meuble => meuble.id !== meubleId);
        localStorage.setItem('meubles', JSON.stringify(meubles));
    }

    // Charger les meubles réservés (pour rétrocompatibilité)
    function loadReservedMeubles() {
        const reservedMeubles = JSON.parse(localStorage.getItem('reservedMeubles')) || {};
        Object.keys(reservedMeubles).forEach(meubleId => {
            const card = document.querySelector(`.meuble-card[data-id="${meubleId}"]`);
            if (card) {
                const status = card.querySelector('.meuble-status');
                const button = card.querySelector('.reserve-button');

                status.textContent = 'Réservé';
                status.classList.remove('available');
                status.classList.add('reserved');
                button.textContent = 'Réservé';
                button.classList.add('reserved');
                button.disabled = true;
            }
        });
    }

    // Sauvegarder un meuble comme réservé
    function saveReservedMeuble(meubleId) {
        let reservedMeubles = JSON.parse(localStorage.getItem('reservedMeubles')) || {};
        reservedMeubles[meubleId] = true;
        localStorage.setItem('reservedMeubles', JSON.stringify(reservedMeubles));

        // Mettre à jour le statut dans localStorage
        let meubles = JSON.parse(localStorage.getItem('meubles')) || [];
        const meubleIndex = meubles.findIndex(m => m.id === meubleId);
        if (meubleIndex >= 0) {
            meubles[meubleIndex].status = 'reserved';
            localStorage.setItem('meubles', JSON.stringify(meubles));
        }
    }

    // Réattacher les écouteurs d'événements après un chargement dynamique
    function attachEventListeners() {
        // Gestion des filtres
        document.querySelectorAll('.filter-button').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.filter-button').forEach(b => b.classList.remove('active'));
                button.classList.add('active');

                const filter = button.getAttribute('data-filter');
                document.querySelectorAll('.meuble-card').forEach(card => {
                    if (filter === 'all' ||
                        (filter === 'available' && card.querySelector('.meuble-status').classList.contains('available')) ||
                        (filter === 'reserved' && card.querySelector('.meuble-status').classList.contains('reserved'))) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });

        // Gestion de la réservation
        document.querySelectorAll('.reserve-button:not(.reserved)').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const card = e.target.closest('.meuble-card');
                const meubleId = card.getAttribute('data-id');
                const status = card.querySelector('.meuble-status');
                const button = card.querySelector('.reserve-button');

                status.textContent = 'Réservé';
                status.classList.remove('available');
                status.classList.add('reserved');
                button.textContent = 'Réservé';
                button.classList.add('reserved');
                button.disabled = true;

                // Sauvegarde dans localStorage
                saveReservedMeuble(meubleId);
                alert('Meuble réservé avec succès !');
            });
        });

        // Gestion des boutons admin (modifier)
        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const card = e.target.closest('.meuble-card');
                const meubleId = card.getAttribute('data-id');
                const meuble = JSON.parse(localStorage.getItem('meubles'))?.find(m => m.id === meubleId);

                if (meuble) {
                    document.getElementById('modal-title').textContent = 'Modifier le meuble';
                    document.getElementById('meuble-id').value = meuble.id;
                    document.getElementById('meuble-title-input').value = meuble.title;
                    document.getElementById('meuble-description-input').value = meuble.description;
                    document.getElementById('meuble-price-input').value = meuble.price;
                    document.getElementById('meuble-status-input').value = meuble.status;
                    document.getElementById('meuble-image-input').value = meuble.image;
                    modal.classList.add('active');
                }
            });
        });

        // Gestion des boutons admin (supprimer)
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (e) => {
                if (confirm('Voulez-vous vraiment supprimer ce meuble ?')) {
                    const meubleId = e.target.closest('.meuble-card').getAttribute('data-id');
                    e.target.closest('.meuble-card').remove();
                    deleteMeuble(meubleId);

                    // Supprimer du localStorage des réservations si nécessaire
                    let reservedMeubles = JSON.parse(localStorage.getItem('reservedMeubles')) || {};
                    if (reservedMeubles[meubleId]) {
                        delete reservedMeubles[meubleId];
                        localStorage.setItem('reservedMeubles', JSON.stringify(reservedMeubles));
                    }

                    alert('Meuble supprimé avec succès !');
                }
            });
        });
    }

    // Gestion du modal (admin)
    const modal = document.getElementById('meuble-modal');
    const addButton = document.getElementById('add-meuble-button');
    const closeModal = document.getElementById('close-modal');
    const cancelModal = document.getElementById('cancel-modal');
    const meubleForm = document.getElementById('meuble-form');

    if (addButton) {
        addButton.addEventListener('click', () => {
            modal.classList.add('active');
            document.getElementById('modal-title').textContent = 'Ajouter un meuble';
            meubleForm.reset();
            document.getElementById('meuble-id').value = '';
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    if (cancelModal) {
        cancelModal.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    // Générer un ID unique pour les meubles
    function generateMeubleId() {
        return 'meuble-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    }

    if (meubleForm) {
        meubleForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const meubleId = document.getElementById('meuble-id').value || generateMeubleId();
            const title = document.getElementById('meuble-title-input').value;
            const description = document.getElementById('meuble-description-input').value;
            const price = document.getElementById('meuble-price-input').value || 'Gratuit';
            const status = document.getElementById('meuble-status-input').value;
            const image = document.getElementById('meuble-image-input').value || '🪑';

            const meuble = {
                id: meubleId,
                title,
                description,
                price,
                status,
                image
            };

            saveMeuble(meuble);
            loadMeubles(); // Recharge tous les meubles pour afficher les modifications

            modal.classList.remove('active');
            meubleForm.reset();
        });
    }

    // Charger les meubles et les réservations au chargement de la page
    loadMeubles();
    loadReservedMeubles();
});
