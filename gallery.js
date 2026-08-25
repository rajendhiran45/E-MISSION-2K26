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

const categoryForPhoto = photo => {
  const source = photo.querySelector('img')?.getAttribute('src') || '';
  if (source.includes("/Arjuna's/")) return 'arjunas';
  if (source.includes('/Paper Presentation/')) return 'presentation';
  if (source.includes('/Rank Holders/')) return 'rank-holders';
  return 'inauguration';
};
function applyFilter(filter) {
  items.forEach(item => { item.hidden = filter !== 'all' && item.dataset.category !== filter; });
  mediaGroups.forEach(group => {
    group.hidden = filter !== 'all' && ![...group.querySelectorAll('.gallery-item')].some(item => !item.hidden);
  });
}
filters.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filters.forEach(item => item.classList.toggle('active', item === button));
  applyFilter(filter);
}));

const photos = [...$$('.photo-card')];
photos.forEach(photo => { photo.dataset.category = categoryForPhoto(photo); });
const lightbox = $('#lightbox');
const lightboxImage = $('#lightboxImage');
const lightboxCaption = $('#lightboxCaption');
const lightboxCount = $('#lightboxCount');
const lightboxDownload = $('#lightboxDownload');
let activePhoto = 0;
let activePhotos = photos;
const photoSource = photo => photo.querySelector('img')?.getAttribute('src') || photo.dataset.full;
function photoCaption(photo) {
  const label = photo.querySelector('span');
  return [...(label?.childNodes || [])].filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent.trim()).filter(Boolean).join(' ') || photo.dataset.caption || photo.querySelector('img')?.alt || 'Gallery photo';
}
function showPhoto(index) {
  activePhotos = photos.filter(photo => !photo.hidden);
  activePhoto = (index + activePhotos.length) % activePhotos.length;
  const photo = activePhotos[activePhoto];
  const source = photoSource(photo);
  const caption = photoCaption(photo);
  lightboxImage.src = source;
  lightboxImage.alt = caption;
  lightboxCaption.textContent = caption;
  lightboxCount.textContent = `${String(activePhoto + 1).padStart(2, '0')} / ${String(activePhotos.length).padStart(2, '0')}`;
  lightboxDownload.href = source;
  lightboxDownload.download = source.split('/').pop();
}
photos.forEach(photo => photo.addEventListener('click', () => { activePhotos = photos.filter(item => !item.hidden); showPhoto(activePhotos.indexOf(photo)); lightbox.showModal(); }));
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
