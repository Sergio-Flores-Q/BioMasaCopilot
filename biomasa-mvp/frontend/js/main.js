// Funciones comunes y navegación
document.addEventListener('DOMContentLoaded', () => {
  // Enlaces activos simples
  const links = document.querySelectorAll('.nav-link');
  links.forEach(l => {
    if (l.href === location.href || location.href.includes(l.getAttribute('href'))) {
      l.classList.add('active');
    }
  });
});
