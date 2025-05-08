const toggleBtn = document.getElementById("theme-toggle");
const currentTheme = localStorage.getItem("theme") || "light";

document.documentElement.setAttribute("data-theme", currentTheme);
updateIcon(currentTheme);

toggleBtn.addEventListener("click", () => {
    const newTheme = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateIcon(newTheme);
});

function updateIcon(theme) {
    toggleBtn.innerHTML = theme === "dark"
        ? "<i class='bx bx-sun'></i>"
        : "<i class='bx bx-moon'></i>";
}