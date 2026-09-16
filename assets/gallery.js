/* Shared product gallery: swipeable carousels + click-to-open scrollable/zoomable lightbox.
   Each page sets window.PRODUCT_GAL = { key: {title, imgs:[...]} } before this loads. */
(function(){
  var GAL = window.PRODUCT_GAL || {};
  var lb = document.createElement('div');
  lb.className = 'lb'; lb.id = 'lb';
  lb.innerHTML = '<div class="lb-bar"><span class="lb-title" id="lbTitle"></span>' +
                 '<button class="lb-close" id="lbClose" aria-label="Close gallery">&#10005;</button></div>' +
                 '<div class="lb-body" id="lbBody"></div>';
  document.body.appendChild(lb);
  var lbBody = lb.querySelector('#lbBody'), lbTitle = lb.querySelector('#lbTitle');

  function openGal(key){
    var g = GAL[key];
    if(!g || !g.imgs || !g.imgs.length) return;
    lbTitle.textContent = g.title || '';
    lbBody.innerHTML = '';
    g.imgs.forEach(function(src){
      var im = new Image();
      im.src = src; im.loading = 'lazy';
      im.alt = (g.title || '') + ' — Juttu Extensions';
      im.addEventListener('click', function(){ im.classList.toggle('zoom'); });
      lbBody.appendChild(im);
    });
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbBody.scrollTop = 0;
  }
  function closeLb(){ lb.classList.remove('open'); document.body.style.overflow = ''; }

  lb.querySelector('#lbClose').addEventListener('click', closeLb);
  lb.addEventListener('click', function(e){ if(e.target === lb || e.target === lbBody) closeLb(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeLb(); });

  // clickable cards
  document.querySelectorAll('[data-gal]').forEach(function(el){
    if(el.classList.contains('pcar')) return;
    el.addEventListener('click', function(){ openGal(el.getAttribute('data-gal')); });
  });

  // carousels
  document.querySelectorAll('.pcar').forEach(function(pc){
    var track = pc.querySelector('.pcar-track'), key = pc.getAttribute('data-gal');
    var nx = pc.querySelector('.pcar-next'), pv = pc.querySelector('.pcar-prev');
    if(nx) nx.addEventListener('click', function(){ track.scrollBy({left: track.clientWidth, behavior:'smooth'}); });
    if(pv) pv.addEventListener('click', function(){ track.scrollBy({left: -track.clientWidth, behavior:'smooth'}); });
    track.querySelectorAll('img').forEach(function(im){ im.addEventListener('click', function(){ openGal(key); }); });
  });
})();
