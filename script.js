'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const btnsOperationsTabs = document.querySelectorAll('.operations__tab');

const headerDOM = document.querySelector('.header');
const navDOM = document.querySelector('.nav');
const navLinksContainerDOM = document.querySelector('.nav__links');
const navLinksDOM = document.querySelectorAll('.nav__link');
const operationsTabContainerDOM = document.querySelector(
  '.operations__tab-container'
);
const operationsContentsDOM = document.querySelectorAll('.operations__content');
const sectionsDOM = document.querySelectorAll('.section');
const section1DOM = document.getElementById('section--1');
const lazyImagesDOM = document.querySelectorAll('img[data-src]');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// SMOOTH SCROLLING

btnScrollTo.addEventListener('click', function () {
  section1DOM.scrollIntoView({ behavior: 'smooth' });
  // window.scrollTo({
  //   left: window.pageXOffset,
  //   top:
  //     window.pageYOffset +
  //     document.getElementById('section--1').getBoundingClientRect().top,
  //   behavior: 'smooth',
  // });
});

navLinksContainerDOM.addEventListener('click', function (e) {
  e.preventDefault();
  const { section } = e.target.dataset;
  if (!section) return;

  document
    .getElementById(`section--${section}`)
    .scrollIntoView({ behavior: 'smooth' });
});

// FADE OUT BUTTONS

navLinksContainerDOM.addEventListener('mouseover', function (e) {
  if (e.target.classList.contains('nav__link'))
    navLinksDOM.forEach(child => {
      if (child === e.target) return;
      child.style.opacity = '40%';
    });
});

// RESET FADE OUT

navLinksContainerDOM.addEventListener('mouseout', function (e) {
  if (e.target.classList.contains('nav__link'))
    navLinksDOM.forEach(child => {
      child.style.opacity = '100%';
    });
});

// IMPLEMENT OPERATIONS CONTENTS

operationsTabContainerDOM.addEventListener('click', function (e) {
  const btn = e.target.closest('.operations__tab');
  if (!btn) return;
  const { tab } = btn.dataset;

  btnsOperationsTabs.forEach(btn =>
    btn.classList.remove('operations__tab--active')
  );
  operationsContentsDOM.forEach(cont =>
    cont.classList.remove('operations__content--active')
  );

  document
    .querySelector(`.operations__tab--${tab}`)
    .classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${tab}`)
    .classList.add('operations__content--active');
});

// IMPLEMENT STICKY NAVIGATION

const stickyNav = function (entries) {
  const [intersection] = [...entries];
  if (!intersection.isIntersecting) navDOM.classList.add('sticky');
  else navDOM.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: '-100px',
});

headerObserver.observe(headerDOM);

// document.addEventListener('scroll', function (e) {
//   if (
//     window.pageYOffset >=
//     section1DOM.getBoundingClientRect().top + window.pageYOffset - 100
//   ) {
//     navDOM.classList.add('sticky');
//   } else {
//     navDOM.classList.remove('sticky');
//   }
// });

// REVEAL ELEMENT ON SCROLL
const revealSection = function (entries, observer) {
  [...entries].forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('section--hidden');
      observer.unobserve(entry.target);
    }
  });
};

const sectionsObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
});

sectionsDOM.forEach(section => {
  sectionsObserver.observe(section);
  section.classList.add('section--hidden');
});

// IMPLEMENT LAZY IMAGE LOADING

const loadImage = function (entries) {
  [...entries].forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.setAttribute('src', entry.target.dataset.src);
      entry.target.addEventListener('load', function () {
        this.classList.remove('lazy-img');
      });
    }
  });
};

const lazyImageObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0.1,
  rootMargin: '200px',
});

lazyImagesDOM.forEach(img => lazyImageObserver.observe(img));

//////////////////////
/////////////////////
// IMPLEMENT SLIDER COMPONENT
const slider = function () {
  const btnSliderLeft = document.querySelector('.slider__btn--left');
  const btnSliderRight = document.querySelector('.slider__btn--right');

  const slidesDOM = document.querySelectorAll('.slide');
  const dotsContainer = document.querySelector('.dots');

  let currentSlide = 0;

  const createDots = function (slides) {
    slides.forEach((slide, i) => {
      const dot = document.createElement('div');
      dot.classList.add('dots__dot');
      dot.setAttribute('data-slide', i);
      dotsContainer.appendChild(dot);
    });
  };
  const activateDot = function () {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${currentSlide}"]`)
      .classList.add('dots__dot--active');
  };

  const moveSlides = function () {
    slidesDOM.forEach((slide, i) => {
      slide.style.transform = `translateX(${100 * (i - currentSlide)}%)`;
    });
    activateDot();
  };

  const slideRight = function () {
    if (currentSlide < slidesDOM.length - 1) {
      currentSlide++;
    } else {
      currentSlide = 0;
    }
    moveSlides();
  };

  const slideLeft = function () {
    if (currentSlide > 0) {
      currentSlide--;
    } else {
      currentSlide = slidesDOM.length - 1;
    }
    moveSlides();
  };

  const init = function () {
    createDots(slidesDOM);
    moveSlides();
  };

  init();

  btnSliderRight.addEventListener('click', slideRight);
  btnSliderLeft.addEventListener('click', slideLeft);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') slideRight();
    if (e.key === 'ArrowLeft') slideLeft();
  });

  dotsContainer.addEventListener('click', function (e) {
    if (!e.target.classList.contains('dots__dot')) return;
    currentSlide = e.target.dataset.slide;
    moveSlides();
  });
};

slider();
