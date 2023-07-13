window.addEventListener('load', () => {
  setTimeout(() => scrollTo(0, 0), 100);
  document.body.classList.remove('before--load');

  document.querySelector('.loading').addEventListener('transitionend', e => {
    document.body.removeChild(e.currentTarget);
  });
});
