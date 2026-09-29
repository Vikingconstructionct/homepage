const form = document.querySelector('#quote-form');
const serviceChecks = [...document.querySelectorAll('input[name="services[]"]')];

function updateServices() {
  const selected = serviceChecks.filter(input => input.checked).map(input => input.value);
  if (form) form.elements.namedItem('service').value = selected.join(', ');
  serviceChecks[0]?.setCustomValidity(selected.length ? '' : 'Choose at least one service, or select “Not sure”.');
  const note = document.querySelector('#selected-service');
  if (note) {
    note.hidden = !selected.length;
    note.textContent = selected.length ? `Selected: ${selected.join(', ')}` : '';
  }
  document.querySelectorAll('.service-tile').forEach(tile => {
    if (selected.includes(tile.dataset.service)) tile.setAttribute('aria-current', 'true');
    else tile.removeAttribute('aria-current');
  });
}

function updateContactMethod() {
  const emailPreferred = document.querySelector('#contact-method')?.value === 'Email';
  const phone = document.querySelector('#contact-phone');
  const email = document.querySelector('#contact-email');
  if (!phone || !email) return;
  phone.required = !emailPreferred;
  email.required = emailPreferred;
  document.querySelector('#phone-requirement').textContent = emailPreferred ? '(optional)' : '(required)';
  document.querySelector('#email-requirement').textContent = emailPreferred ? '(required)' : '(optional)';
}

const PHOTO_LIMIT = 2 * 1024 * 1024;
const SOURCE_LIMIT = 20 * 1024 * 1024;
const imageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const photoInputs = [...document.querySelectorAll('.photo-fields input[type="file"]')];

function validatePhoto(input) {
  const file = input.files[0];
  let error = '';
  if (file && !imageTypes.has(file.type)) error = 'Choose a JPG, PNG or WebP photo.';
  else if (file && file.size > SOURCE_LIMIT) error = 'Choose a photo smaller than 20 MB.';
  input.setCustomValidity(error);
  return error;
}

function updatePhotoStatus() {
  const errors = photoInputs.map(validatePhoto).filter(Boolean);
  const selected = photoInputs.filter(input => input.files.length).length;
  document.querySelector('#photo-status').textContent = errors[0] || (selected ? `${selected} photo${selected === 1 ? '' : 's'} selected. Large photos will be resized before sending.` : '');
}

async function preparePhoto(file) {
  if (file.size <= PHOTO_LIMIT) return file;
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not prepare a photo. Try a smaller JPG or PNG.');
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    let blob;
    for (const quality of [0.85, 0.7, 0.5]) {
      blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
      if (blob && blob.size <= PHOTO_LIMIT) break;
    }
    if (!blob || blob.size > PHOTO_LIMIT) throw new Error('A photo is still too large. Choose a smaller photo and try again.');
    return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' });
  } catch (error) {
    throw new Error('Could not prepare a photo. Try a smaller JPG or PNG, or remove that photo and send the request.');
  } finally {
    URL.revokeObjectURL(url);
  }
}

if (form) {
  // Open any optional panel containing an invalid field before browser validation.
  form.noValidate = true;
  serviceChecks.forEach(input => input.addEventListener('change', updateServices));
  document.querySelector('#contact-method')?.addEventListener('change', updateContactMethod);
  photoInputs.forEach(input => input.addEventListener('change', updatePhotoStatus));
  updateServices();
  updateContactMethod();
  form.addEventListener('reset', () => setTimeout(() => { updateServices(); updateContactMethod(); updatePhotoStatus(); }, 0));
  form.addEventListener('submit', async event => {
    event.preventDefault();
    updateServices();
    updateContactMethod();
    photoInputs.forEach(validatePhoto);
    const invalid = [...form.elements].find(input => typeof input.checkValidity === 'function' && !input.checkValidity());
    const panel = invalid?.closest('details');
    if (panel) panel.open = true;
    if (!form.reportValidity()) return;
    const status = document.querySelector('#form-status');
    const button = form.querySelector('button[type="submit"]');
    if (document.body.dataset.preview === 'true' || ['localhost', '127.0.0.1', ''].includes(location.hostname) || new URLSearchParams(location.search).has('preview')) {
      status.textContent = 'Preview only: your request has not been sent.';
      return;
    }
    if (button.disabled) return;
    button.disabled = true;
    form.setAttribute('aria-busy', 'true');
    status.textContent = 'Preparing your request…';
    try {
      const body = new FormData(form);
      for (const input of photoInputs) {
        body.delete(input.name);
        if (input.files[0]) {
          status.textContent = 'Preparing your photos…';
          const file = await preparePhoto(input.files[0]);
          body.append(input.name, file, file.name);
        }
      }
      status.textContent = 'Sending your request…';
      // Leave Content-Type to the browser so the multipart boundary includes photos.
      const response = await fetch('/', { method: 'POST', body });
      if (!response.ok) throw new Error('Your request could not be sent. Please try again or call (203) 979-4724.');
      location.assign('/thank-you.html');
    } catch (error) {
      status.textContent = error.message || 'Your request could not be sent. Please try again or call (203) 979-4724.';
      button.disabled = false;
      form.removeAttribute('aria-busy');
    }
  });
}

document.querySelectorAll('[data-service]').forEach(link => {
  link.addEventListener('click', () => {
    const input = serviceChecks.find(input => input.value === link.dataset.service);
    if (!input) return;
    input.checked = true;
    updateServices();
    const title = document.querySelector('#estimate h2');
    title?.setAttribute('tabindex', '-1');
    title?.focus({ preventScroll: true });
  });
});
const menu = document.querySelector('.mobile-menu');
menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.open = false; }));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu?.open) { menu.open = false; menu.querySelector('summary').focus(); }
});
