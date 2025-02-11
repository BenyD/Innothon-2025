export const scrollToSection = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    const navbarHeight = 80; // Height of your fixed navbar
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
}; 