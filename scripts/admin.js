// Gestion du formulaire admin
document.querySelector('.admin-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.elements['email'].value;
    alert(`Connexion admin soumise pour ${email}.`);
    e.target.reset();
});
