// Handles active state for section-rail and cat-nav based on current URL
document.querySelectorAll('.section-rail a').forEach(function(link) {
  if (link.classList.contains('active')) {
    var img = link.querySelector('img');
    if (img) {
      img.src = img.src
        .replace('_white.', '_black.')
        .replace('_fucsia.', '_black.');
    }
  }
});

// Mobile hamburger and sidebar for cat-nav
(function() {
  var catNav = document.querySelector('.cat-nav');
  var sidebar = document.getElementById('mobile-sidebar');
  var sidebarNav = document.getElementById('mobile-sidebar-nav');
  var sidebarOverlay = document.getElementById('mobile-sidebar-overlay');
  var sidebarClose = document.getElementById('mobile-sidebar-close');

  if (!catNav || !sidebar) return;
  if (catNav.querySelector('.cat-nav-toggle')) return;

  // Inject page title into sidebar
  var headingEl = document.querySelector('.section-heading-desktop a, .section-heading-mobile');
  if (headingEl && sidebarNav) {
    var titleEl = document.createElement('span');
    titleEl.className = 'mobile-sidebar-title';
    titleEl.textContent = headingEl.textContent.trim();
    sidebar.insertBefore(titleEl, sidebarNav);
  }

  // Clone links into sidebar
  catNav.querySelectorAll('a').forEach(function(link) {
    var clone = link.cloneNode(true);
    clone.addEventListener('click', closeSidebar);
    sidebarNav.appendChild(clone);
  });

  // Clone talk button into sidebar
  var talkBtn = document.getElementById('talk-btn');
  if (talkBtn) {
    var talkClone = talkBtn.cloneNode(true);
    talkClone.removeAttribute('id');
    talkClone.addEventListener('click', function() {
      closeSidebar();
      // trigger original talk modal
      if (talkBtn) talkBtn.click();
    });
    sidebar.appendChild(talkClone);
  }

  // Inject hamburger toggle button
  var activeLink = catNav.querySelector('a.active');
  var activeLabel = activeLink ? activeLink.textContent : 'Categories';

  var toggle = document.createElement('button');
  toggle.className = 'cat-nav-toggle';
  toggle.innerHTML =
    '<span class="cat-nav-toggle-icon">' +
      '<span></span><span></span><span></span>' +
    '</span>';

  catNav.insertBefore(toggle, catNav.firstChild);

  toggle.addEventListener('click', openSidebar);
  if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeSidebar();
  });

  function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

})();

// Mobile rail icon swap
(function() {
  if (window.innerWidth > 768) return;

  document.querySelectorAll('.section-rail a, .section-rail .rail-disabled-wrap').forEach(function(el) {
    var img = el.querySelector('img');
    if (!img) return;

    if (el.classList.contains('active')) {
      img.src = img.src
        .replace('_white.', '_fucsia.')
        .replace('_black.', '_fucsia.');
    } else {
      img.src = img.src
        .replace('_white.', '_black.')
        .replace('_fucsia.', '_black.');
    }
  });
})();
