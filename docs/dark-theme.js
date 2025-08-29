export function darkTheme() {
  const html = document.documentElement;
  const themeGrid = document.getElementById("theme-switcher-grid");

  const storedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const startDark = storedTheme === "dark" || (!storedTheme && prefersDark);

  function applyTheme(isDark) {
    html.classList.toggle("dark", isDark);
    themeGrid.classList.toggle("night-theme", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }

  applyTheme(startDark);

  themeGrid.addEventListener("click", (e) => {
    e.preventDefault(); // prevent form reload if inside one
    const isDark = !html.classList.contains("dark");
    applyTheme(isDark);
  });
}
