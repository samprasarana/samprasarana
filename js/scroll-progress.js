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

    /*
      The gallery is exactly one viewport tall, so its own
      scrollTop maps directly and proportionally to the rail.
    */
    var maximumScroll = Math.max(
      0,
      scroller.scrollHeight -
        scroller.clientHeight
    );

    var galleryRect =
      scroller.getBoundingClientRect();

    var leftPosition =
      galleryRect.right -
      8 -
      rail.offsetWidth;

    var visibleTop = Math.max(
      0,
      galleryRect.top
    );

    var visibleBottom = Math.min(
      window.innerHeight,
      galleryRect.bottom
    );

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
      Math.max(
        0,
        leftPosition
      ).toFixed(2) + "px"
    );

    rail.style.setProperty(
      "--scroll-progress-top",
      topPosition.toFixed(2) + "px"
    );

    rail.style.setProperty(
      "--scroll-progress-height",
      railHeight.toFixed(2) + "px"
    );

    var shouldShow =
      desktopQuery.matches &&
      maximumScroll > 2 &&
      railHeight > thumb.offsetHeight &&
      scroller.matches(":hover");

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

    var currentScroll = Math.min(
      maximumScroll,
      Math.max(
        0,
        scroller.scrollTop
      )
    );

    var progress;

    if (currentScroll <= 1) {
      progress = 0;
    }
    else if (
      maximumScroll -
        currentScroll <= 1
    ) {
      progress = 1;
    }
    else {
      progress =
        currentScroll /
        maximumScroll;
    }

    var thumbPosition =
      availableTravel * progress;

    thumb.style.transform =
      "translate3d(0, " +
      thumbPosition.toFixed(2) +
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

  /*
    Document scrolling does not affect gallery progress,
    but the rail may need its screen position refreshed.
  */
  window.addEventListener(
    "scroll",
    queueUpdate,
    { passive: true }
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
