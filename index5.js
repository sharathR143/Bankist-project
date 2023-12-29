'use strict';
///////////////////////////////////////
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabscontainer = document.querySelector('.operations__tab-container');
const tabscontent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window

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

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Button scrolling
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();

  /*
  console.log(s1coords);
  console.log(e.target.getBoundingClientRect());

  console.log('current scroll (x/y)', window.pageXOffset, window.pageYOffset);

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );
  */

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

//////////////////////////////////////////
// page navigation

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

/////////////////////////////////////////
//  Event Delegation implementing page navigation
// 1.Add event listener to common parent element
// 2.Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  // console.log(e.target);
  e.preventDefault();

  // matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    // console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
//////////////////////////////////////////////
// Tabbed component
// const tabs = document.querySelectorAll('.operations__tab');
// const tabscontainer = document.querySelector('.operations__tab-container');
// const tabscontent = document.querySelectorAll('.operations__content');

tabscontainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);

  // guard  clause
  if (!clicked) return;

  // Remove active clasess
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabscontent.forEach(c => c.classList.remove('operations__content--active'));

  // ACTIVE TAB
  clicked.classList.add('operations__tab--active');

  // ACTIVATE content area
  console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// menu fade animation
const HandlerHover = function (e, opacity) {
  // console.log(this, e.currentTarget);
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// passing 'argument' into handler
nav.addEventListener('mouseover', HandlerHover.bind(0.5));
nav.addEventListener('mouseout', HandlerHover.bind(1));

//////////////////////////////////////
// Sticky  Navigation

// const initialcoords = section1.getBoundingClientRect();
// console.log(initialcoords);
// window.addEventListener('scroll', function () {
//   console.log(window.scrollY);
//   if (window.scrollY > initialcoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

///////////////////////////////////////////
// sticky navigation:Intersection observer API

// const obscallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsoption = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obscallback, obsoption);
// observer.observe(section1);

const header = document.querySelector('.header');
const navheight = nav.getBoundingClientRect().height;
// console.log(navheight);
const stickyNav = function (entries) {
  const [entry] = entries;
  console.log(entry);
  if (entry.isIntersecting == false) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const headerobserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navheight}px`,
});
headerobserver.observe(header);

////////////////////////////////////////////
// Reveal sections
const allsection = document.querySelectorAll('.section');

const revealsection = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionobserver = new IntersectionObserver(revealsection, {
  root: null,
  threshold: 0.15,
});
allsection.forEach(function (section) {
  sectionobserver.observe(section);
  // section.classList.add('section--hidden');
});

////////////////////////////////////////////
// Lazy loading Images
const imgTarget = document.querySelectorAll('img[data-src]');

const loadimg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgobserver = new IntersectionObserver(loadimg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTarget.forEach(img => imgobserver.observe(img));

//////////////////////////////////////////
// slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotcontainer = document.querySelector('.dots');

  let curslide = 0;
  const maxslide = slides.length;

  // Function
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotcontainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide='${slide}']`)
      .classList.add('dots__dot--active');
  };

  const gotoslide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translatex(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextslide = function () {
    if (curslide === maxslide - 1) {
      curslide = 0;
    } else {
      curslide++;
    }
    gotoslide(curslide);
    activateDot(curslide);
  };

  const prevslide = function () {
    if (curslide === 0) {
      curslide = maxslide - 1;
    } else {
      curslide--;
    }
    gotoslide(curslide);
    activateDot(curslide);
  };

  const init = function () {
    gotoslide(0);
    createDots();
    activateDot(0);
  };
  init();

  //Event  handler
  btnRight.addEventListener('click', nextslide);
  btnLeft.addEventListener('click', prevslide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevslide();
    e.key === 'ArrowRight' && nextslide();
  });

  dotcontainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      gotoslide(slide);
      activateDot(slide);
    }
  });
};
slider();

/*
//////////////////////////////////////////
// Partice example
// SELECTING ELEMENT
console.log(document.documentElement); 
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');

const allsection = document.querySelectorAll('.section');
console.log(allsection);

document.getElementById('section--1');
const allbutton = document.getElementsByTagName('button');
console.log(allbutton);

console.log(document.getElementsByClassName('btn'));

// CREATING AND INSERTING ELEMENTS
// .insertAdjacentHTML

const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent =  'We use cookied for improved functionality and analytics.';
message.innerHTML =
  'We use cookied for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

//it mean move element in last OR first of  header element
// header.prepend(message);
header.append(message);
//header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);

// DELETE ELEMENT

document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    // message.remove();
    message.parentElement.removeChild(message);
  });
////////////////////////////////////////
*/

/*
///////////////////////////////////////
// STYLE
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.color);
console.log(message.style.backgroundColor);

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 30 + 'px';

document.documentElement.style.setProperty('--color-primary', 'red');

// ATTRIBUTES
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
// console.log(logo.src);
console.log(logo.className);
console.log(logo.id);
logo.alt = 'Beautiful minimalist logo';

//Non-standard
console.log(logo.designer);
console.log(logo.getAttribute('designer'));
console.log(logo.setAttribute('company', 'Bankist'));

console.log(logo.src);
console.log(logo.getAttribute('src'));

const link = document.querySelector('.nav__link--btn ');
console.log(link.href);
console.log(link.getAttribute('href'));

// Data Attributes
console.log(logo.dataset.versionNumber);

// Classes
logo.classList.add('c');
logo.classList.remove('c');
logo.classList.toggle('c');
logo.classList.contains('c'); // NOT includes

//  Don't use
logo.className = 'sharath';
////////////////////////////////////////
*/

/*
////////////////////////////////////////
// Implement Smooth scrolling
//////////////////////////////////////

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();

  console.log(s1coords);
  console.log(e.target.getBoundingClientRect());

  console.log('current scroll (x/y)', window.pageXOffset, window.pageYOffset);

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Scrolling
  // methhod 1

  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // old  ways
  // method  2

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // method 3
  section1.scrollIntoView({ behavior: 'smooth' });
});
/////////////////////////////////////////
*/

/*
/////////////////////////////////////////
// Types of Events and Event Handlers

const h1 = document.querySelector('h1');

const alert1 = function (e) {
  alert('addEventlistener:guest! you are reading :D');
  // remove method use to one time use event
  // h1.removeEventListener('mouseenter', alert1);
};
h1.addEventListener('mouseenter', alert1);

setTimeout(() => h1.removeEventListener('mouseenter', alert1), 3000);

// h1.onmouseenter = function (e) {
//   alert('addEventlistener:guest! you are reading :D');
// };

//////////////////////////////////////////
*/

/*
/////////////////////////////////////////
// BUBLLING  PHASE
// Event propagation

// it means click the child event and go  to parent also
// it means click the parent event and go  to parent only

// rgb(255,255,255)

const randomint = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomcolor = () =>
  `rgb(${randomint(0, 255)},${randomint(0, 255)},${randomint(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomcolor();
  console.log('link', e.target, e.currentTarget);
  console.log(e.currentTarget === this);

  // stop propagation
  // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomcolor();
  console.log('container', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomcolor();
  console.log('nav', e.target, e.currentTarget);
});
///////////////////////////////////////////
*/

/*
//////////////////////////////////////////
// DOM TRAVERSING

const h1 = document.querySelector('h1');

// going downwards: child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'red';

// Going upwards:parent
console.log(h1.parentElement);
console.log(h1.parentNode);

h1.closest('.header').style.background = 'var(--gradient-secondary)';

h1.closest('h1').style.background = 'var(--gradient-primary)';

// going sideways: sibling
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (e) {
  if (e !== h1) e.style.transform = 'scale(0.5)';
});
////////////////////////////////////////
*/

document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree bulit', e);
});

window.addEventListener('load', function (e) {
  console.log('page fully loaded', e);
});

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
