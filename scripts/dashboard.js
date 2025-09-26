document.addEventListener('DOMContentLoaded', function() {
    // Vérifie si l'utilisateur est un admin (à remplacer par ta logique réelle)
    const isAdmin = true; // MODIF : Remplace par une vérification réelle (ex: sessionStorage.getItem('userRole') === 'admin')

    // Affiche/masque les boutons admin
    if (isAdmin) {
        document.getElementById('add-meuble-button').style.display = 'block';
        document.querySelectorAll('.admin-actions').forEach(el => {
            el.style.display = 'flex';
        });
    }

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
            const status = card.querySelector('.meuble-status');
            const button = card.querySelector('.reserve-button');

            status.textContent = 'Réservé';
            status.classList.remove('available');
            status.classList.add('reserved');
            button.textContent = 'Réservé';
            button.classList.add('reserved');
            button.disabled = true;

            alert('Meuble réservé avec succès !');
        });
    });

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

    if (meubleForm) {
        meubleForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const meubleId = document.getElementById('meuble-id').value;
            const title = document.getElementById('meuble-title-input').value;
            const description = document.getElementById('meuble-description-input').value;
            const status = document.getElementById('meuble-status-input').value;
            const image = document.getElementById('meuble-image-input').value || '🪑';

            if (meubleId) {
                alert(`Meuble "${title}" modifié avec succès !`);
            } else {
                const meublesGrid = document.getElementById('meubles-grid');
                const newMeuble = document.createElement('div');
                newMeuble.className = 'meuble-card';
                newMeuble.innerHTML = `
                    <div class="meuble-image">${image}</div>
                    <div class="meuble-info">
                        <h3 class="meuble-title">${title}</h3>
                        <p class="meuble-description">${description}</p>
                        <div class="meuble-meta">
                            <span class="meuble-status ${status}">${status === 'available' ? 'Disponible' : 'Réservé'}</span>
                            <span class="meuble-price">Gratuit</span>
                        </div>
                        <button class="reserve-button ${status === 'reserved' ? 'reserved' : ''}" ${status === 'reserved' ? 'disabled' : ''}>
                            ${status === 'reserved' ? 'Réservé' : 'Réserver'}
                        </button>
                        <div class="admin-actions" ${isAdmin ? '' : 'style="display: none;"'}>
                            <button class="admin-button edit-button">Modifier</button>
                            <button class="admin-button delete-button">Supprimer</button>
                        </div>
                    </div>
                `;
                meublesGrid.prepend(newMeuble);
                alert(`Meuble "${title}" ajouté avec succès !`);

                // Ajoute les écouteurs d'événements pour les nouveaux boutons
                newMeuble.querySelector('.reserve-button:not(.reserved)').addEventListener('click', (e) => {
                    e.preventDefault();
                    const card = e.target.closest('.meuble-card');
                    const status = card.querySelector('.meuble-status');
                    const button = card.querySelector('.reserve-button');

                    status.textContent = 'Réservé';
                    status.classList.remove('available');
                    status.classList.add('reserved');
                    button.textContent = 'Réservé';
                    button.classList.add('reserved');
                    button.disabled = true;
                    alert('Meuble réservé avec succès !');
                });

                newMeuble.querySelector('.edit-button').addEventListener('click', (e) => {
                    const card = e.target.closest('.meuble-card');
                    const title = card.querySelector('.meuble-title').textContent;
                    const description = card.querySelector('.meuble-description').textContent;
                    const status = card.querySelector('.meuble-status').classList.contains('available') ? 'available' : 'reserved';

                    document.getElementById('modal-title').textContent = 'Modifier le meuble';
                    document.getElementById('meuble-id').value = '1';
                    document.getElementById('meuble-title-input').value = title;
                    document.getElementById('meuble-description-input').value = description;
                    document.getElementById('meuble-status-input').value = status;
                    modal.classList.add('active');
                });

                newMeuble.querySelector('.delete-button').addEventListener('click', (e) => {
                    if (confirm('Voulez-vous vraiment supprimer ce meuble ?')) {
                        newMeuble.remove();
                        alert('Meuble supprimé avec succès !');
                    }
                });
            }

            modal.classList.remove('active');
            meubleForm.reset();
        });
    }

    // Gestion des boutons admin (modifier/supprimer)
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.meuble-card');
            const title = card.querySelector('.meuble-title').textContent;
            const description = card.querySelector('.meuble-description').textContent;
            const status = card.querySelector('.meuble-status').classList.contains('available') ? 'available' : 'reserved';

            document.getElementById('modal-title').textContent = 'Modifier le meuble';
            document.getElementById('meuble-id').value = '1';
            document.getElementById('meuble-title-input').value = title;
            document.getElementById('meuble-description-input').value = description;
            document.getElementById('meuble-status-input').value = status;
            modal.classList.add('active');
        });
    });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', (e) => {
            if (confirm('Voulez-vous vraiment supprimer ce meuble ?')) {
                const card = e.target.closest('.meuble-card');
                card.remove();
                alert('Meuble supprimé avec succès !');
            }
        });
    });
});
