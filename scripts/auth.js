document.addEventListener('DOMContentLoaded', function() {
    // Sélection des éléments
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const showConnexionLink = document.getElementById('show-connexion');
    const showInscriptionLink = document.getElementById('show-inscription');

    // Fonction pour basculer les onglets/formulaires
    function switchTab(target) {
        // Désactive tous les onglets et formulaires
        authTabs.forEach(tab => tab.classList.remove('active'));
        authForms.forEach(form => form.classList.remove('active'));

        // Active l'onglet et le formulaire ciblés
        const targetTab = document.querySelector(`.auth-tab[data-target="${target}"]`);
        const targetForm = document.getElementById(target);

        if (targetTab && targetForm) {
            targetTab.classList.add('active');
            targetForm.classList.add('active');
        }
    }

    // Gestion des clics sur les onglets
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-target');
            switchTab(target);
        });
    });

    // Gestion du lien "Connectez-vous ici"
    if (showConnexionLink) {
        showConnexionLink.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab('connexion');
        });
    }

    // Gestion du lien "Inscrivez-vous ici"
    if (showInscriptionLink) {
        showInscriptionLink.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab('inscription');
        });
    }

    // Gestion des formulaires (remplace la partie existante)
authForms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const role = formData.get('role');
        const email = formData.get('email');
        const action = form.id === 'inscription' ? 'inscription' : 'connexion';

        // Redirection vers la page de succès
        if (action === 'inscription') {
            window.location.href = 'register_success.html';
        } else {
            window.location.href = 'auth_success.html';
        }
      });
    });
});
