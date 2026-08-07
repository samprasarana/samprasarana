/* DESKTOP SCROLL PROGRESS RAIL START */
(function () {
  "use strict";

  var scroller = document.querySelector(
    ".detail-page .main-content"
  );

  if (
    !scroller ||
    document.querySelector(".desktop-scroll-progress")
  ) {
    return;
  }

  var desktopQuery = window.matchMedia(
    "(min-width: 769px) and (hover: hover) and (pointer: fine)"
  );

  var rail = document.createElement("div");
  rail.className = "desktop-scroll-progress";
  rail.setAttribute("aria-hidden", "true");

  var thumb = document.createElement("div");
  thumb.className = "desktop-scroll-progress__thumb";

  rail.appendChild(thumb);
  document.body.appendChild(rail);

  var animationFrame = null;

  function updateScrollProgress() {
    animationFrame = null;

    var maximumScroll =
      scroller.scrollHeight -
      scroller.clientHeight;

    var galleryRect =
      scroller.getBoundingClientRect();

    /*
      Position the rail eight pixels inside the gallery's
      right border. Subtracting its width means the gap is
      measured from the rail's right edge.
    */
    var leftPosition =
      galleryRect.right -
      8 -
      rail.offsetWidth;

    /*
      Keep the rail vertically inside the visible portion
      of the gallery rather than spanning unrelated areas.
    */
    var visibleTop = Math.max(
      0,
      galleryRect.top
    );

    var visibleBottom = Math.min(
      window.innerHeight,
      galleryRect.bottom
    );

    /*
      Use half of the gallery's visible height and center
      the shortened rail vertically within that area.
    */
    var availableHeight = Math.max(
      0,
      visibleBottom -
      visibleTop -
      16
    );

    var railHeight =
      availableHeight * 0.5;

    var topPosition =
      visibleTop +
      8 +
      (availableHeight - railHeight) / 2;

    rail.style.setProperty(
      "--scroll-progress-left",
      Math.max(0, leftPosition).toFixed(2) + "px"
    );

    rail.style.setProperty(
      "--scroll-progress-top",
      topPosition.toFixed(2) + "px"
    );

    rail.style.setProperty(
      "--scroll-progress-height",
      railHeight.toFixed(2) + "px"
    );

    var pointerIsOverGallery =
      scroller.matches(":hover");

    var shouldShow =
      desktopQuery.matches &&
      maximumScroll > 2 &&
      railHeight > thumb.offsetHeight &&
      pointerIsOverGallery;

    rail.classList.toggle(
      "is-visible",
      shouldShow
    );

    if (!shouldShow) {
      return;
    }

    var availableTravel = Math.max(
      0,
      rail.clientHeight -
      thumb.offsetHeight
    );

    var progress = Math.min(
      1,
      Math.max(
        0,
        scroller.scrollTop /
        maximumScroll
      )
    );

    var position =
      availableTravel * progress;

    thumb.style.transform =
      "translate3d(0, " +
      position.toFixed(2) +
      "px, 0)";
  }

  function queueUpdate() {
    if (animationFrame !== null) {
      return;
    }

    animationFrame =
      window.requestAnimationFrame(
        updateScrollProgress
      );
  }

  scroller.addEventListener(
    "scroll",
    queueUpdate,
    { passive: true }
  );

  scroller.addEventListener(
    "pointerenter",
    queueUpdate
  );

  scroller.addEventListener(
    "pointerleave",
    queueUpdate
  );

  window.addEventListener(
    "resize",
    queueUpdate
  );

  window.addEventListener(
    "load",
    queueUpdate
  );

  if (desktopQuery.addEventListener) {
    desktopQuery.addEventListener(
      "change",
      queueUpdate
    );
  }
  else {
    desktopQuery.addListener(queueUpdate);
  }

  if ("ResizeObserver" in window) {
    var resizeObserver =
      new ResizeObserver(queueUpdate);

    resizeObserver.observe(scroller);

    var grid =
      scroller.querySelector(".grid");

    if (grid) {
      resizeObserver.observe(grid);
    }
  }

  if ("MutationObserver" in window) {
    var mutationObserver =
      new MutationObserver(queueUpdate);

    mutationObserver.observe(scroller, {
      childList: true,
      subtree: true
    });
  }

  queueUpdate();
}());
/* DESKTOP SCROLL PROGRESS RAIL END */
