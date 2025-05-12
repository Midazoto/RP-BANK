const toggleBtn = document.getElementById("theme-toggle");
const currentTheme = localStorage.getItem("theme") || "light";

// Applique le thème au chargement
document.documentElement.setAttribute("data-theme", currentTheme);

toggleBtn.addEventListener("click", () => {
    const newTheme = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
});