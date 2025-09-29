document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".admin-form");

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Empêche l'envoi classique

        const email = document.getElementById("admin-email").value.trim();
        const password = document.getElementById("admin-password").value.trim();

        if (email && password) {
            // Ton HTML de succès est au même niveau que la page de login
            window.location.href = "admin_login_success.html";
        } else {
            alert("Veuillez remplir tous les champs.");
        }
    });
});
