/* article-nav.js — Renders prev/next navigation and related perspectives */
(function () {
  var slug = location.pathname.split('/').pop() || '';
  if (!slug || slug === 'index.html' || slug === '') return;
  if (typeof PERSPECTIVES_DATA === 'undefined') return;

  var idx = -1;
  for (var i = 0; i < PERSPECTIVES_DATA.length; i++) {
    if (PERSPECTIVES_DATA[i].slug === slug) { idx = i; break; }
  }
  if (idx === -1) return;

  var current = PERSPECTIVES_DATA[idx];
  var prev    = idx > 0 ? PERSPECTIVES_DATA[idx - 1] : null;
  var next    = idx < PERSPECTIVES_DATA.length - 1 ? PERSPECTIVES_DATA[idx + 1] : null;

  /* ── Prev / Next navigation ─────────────────────────────────── */
  var navEl = document.getElementById('article-nav-container');
  if (navEl) {
    var navHtml = '<div class="article-nav">';
    if (prev) {
      navHtml += '<a href="' + prev.slug + '" class="article-nav-link article-nav-prev">' +
        '<span class="article-nav-dir">← Previous Perspective</span>' +
        '<span class="article-nav-title">' + prev.title + '</span>' +
        '</a>';
    } else {
      navHtml += '<span></span>';
    }
    if (next) {
      navHtml += '<a href="' + next.slug + '" class="article-nav-link article-nav-next">' +
        '<span class="article-nav-dir">Next Perspective →</span>' +
        '<span class="article-nav-title">' + next.title + '</span>' +
        '</a>';
    }
    navHtml += '</div>';
    navEl.innerHTML = navHtml;
  }

  /* ── Related Perspectives ───────────────────────────────────── */
  var relEl = document.getElementById('related-perspectives-container');
  if (relEl && current.related && current.related.length) {
    var related = current.related.map(function (s) {
      for (var j = 0; j < PERSPECTIVES_DATA.length; j++) {
        if (PERSPECTIVES_DATA[j].slug === s) return PERSPECTIVES_DATA[j];
      }
      return null;
    }).filter(Boolean);

    var html = '<div class="related-section">' +
      '<div class="related-eyebrow"><span class="related-eyebrow-line"></span>Related Perspectives</div>' +
      '<p class="related-section-title">Continue reading.</p>' +
      '<div class="related-grid">';

    related.forEach(function (a) {
      html += '<a href="' + a.slug + '" class="related-card">' +
        '<div class="related-card-img-wrap">' +
          '<img src="' + a.image + '" alt="Editorial illustration for ' + a.title.replace(/"/g, '&quot;') + '" loading="lazy">' +
        '</div>' +
        '<div class="related-card-body">' +
          '<span class="related-cat">' + a.category + '</span>' +
          '<span class="related-title">' + a.title + '</span>' +
          '<span class="related-meta">' + a.readTime + '</span>' +
          '<div class="related-read">Read perspective →</div>' +
        '</div>' +
        '</a>';
    });

    html += '</div></div>';
    relEl.innerHTML = html;
  }
})();
