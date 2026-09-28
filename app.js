const form = document.querySelector('#quote-form');
if (form) form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const status = document.querySelector('#form-status');
  const button = form.querySelector('button[type="submit"]');
  if (document.body.dataset.preview === 'true' || ['localhost', '127.0.0.1', ''].includes(location.hostname) || new URLSearchParams(location.search).has('preview')) {
    status.textContent = 'This is a preview. Your request has not been sent. Form delivery will be enabled when the website is published.';
    return;
  }
  button.disabled = true;
  status.textContent = 'Sending your request…';
  try {
    const response = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() });
    if (!response.ok) throw new Error('Submission failed');
    location.assign('/thank-you.html');
  } catch (error) {
    status.textContent = 'Your request could not be sent. Please try again or call (203) 979-4724.';
    button.disabled = false;
  }
});

// Service tiles carry the visitor's choice into the estimate form.
document.querySelectorAll('[data-service]').forEach(link => {
  link.addEventListener('click', () => {
    const select = document.querySelector('select[name="service"]');
    if (!select) return;
    select.value = link.dataset.service;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    const title = document.querySelector('#estimate h2');
    title.setAttribute('tabindex', '-1');
    title.focus({ preventScroll: true });
  });
});
const serviceSelect = document.querySelector('select[name="service"]');
serviceSelect?.addEventListener('change', () => {
  const note = document.querySelector('#selected-service');
  if (note) { note.hidden = !serviceSelect.value; note.textContent = serviceSelect.value ? `Your service: ${serviceSelect.value}` : ''; }
  document.querySelectorAll('.service-tile').forEach(tile => {
    if (tile.dataset.service === serviceSelect.value) tile.setAttribute('aria-current','true');
    else tile.removeAttribute('aria-current');
  });
});
const menu = document.querySelector('.mobile-menu');
menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.open = false; }));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu?.open) { menu.open=false; menu.querySelector('summary').focus(); } });
