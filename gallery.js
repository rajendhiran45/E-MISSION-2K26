const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const glow = $('#glow');
window.addEventListener('pointermove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });
window.addEventListener('scroll', () => { const h = document.documentElement.scrollHeight - innerHeight; $('#scrollProgress').style.width = (scrollY / h * 100) + '%'; });
$('#hamburger').onclick = () => $('#menu').classList.toggle('open');
$$('#menu a').forEach(a => a.onclick = () => $('#menu').classList.remove('open'));

const filters = $$('.filter-button');
const items = $$('.gallery-item');
const mediaGroups = $$('.media-group');
filters.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filters.forEach(item => item.classList.toggle('active', item === button));
  mediaGroups.forEach(group => group.hidden = filter !== 'all' && group.dataset.category !== filter);
  items.forEach(item => item.hidden = filter !== 'all' && item.dataset.category !== filter);
}));

const photos = [...$$('.photo-card')];
const lightbox = $('#lightbox');
const lightboxImage = $('#lightboxImage');
const lightboxCaption = $('#lightboxCaption');
const lightboxCount = $('#lightboxCount');
const lightboxDownload = $('#lightboxDownload');
let activePhoto = 0;
function showPhoto(index) {
  activePhoto = (index + photos.length) % photos.length;
  const photo = photos[activePhoto];
  lightboxImage.src = photo.dataset.full;
  lightboxImage.alt = photo.dataset.caption;
  lightboxCaption.textContent = photo.dataset.caption;
  lightboxCount.textContent = `${String(activePhoto + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')}`;
  lightboxDownload.href = photo.dataset.full;
  lightboxDownload.download = photo.dataset.full.split('/').pop();
}
photos.forEach((photo, index) => photo.addEventListener('click', () => { showPhoto(index); lightbox.showModal(); }));
$('.lightbox-close').onclick = () => lightbox.close();
$('.lightbox-nav.previous').onclick = () => showPhoto(activePhoto - 1);
$('.lightbox-nav.next').onclick = () => showPhoto(activePhoto + 1);
lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
lightbox.addEventListener('keydown', event => { if (event.key === 'ArrowLeft') showPhoto(activePhoto - 1); if (event.key === 'ArrowRight') showPhoto(activePhoto + 1); });

$('#shareGallery').onclick = async () => {
  const data = { title: 'E-MISSION 2K26 Gallery', text: 'Explore moments from E-MISSION 2K26.', url: location.href };
  if (navigator.share) { try { await navigator.share(data); } catch {} return; }
  await navigator.clipboard.writeText(location.href);
  const toast = $('#galleryToast'); toast.textContent = 'Gallery link copied!'; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2600);
};
