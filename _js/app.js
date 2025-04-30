setTimeout(function() {
  fadeOutPreloader(document.getElementById('preloader'), 69);
}, 1500);

$(document).ready(function() {
  $(window).on('beforeunload', function() {
    window.scrollTo(0, 0);
  });

  /* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
  // particlesJS.load('landing', 'assets/particles.json', function() {});

  // Typing Text
  var element = document.getElementById('txt-rotate');
  var toRotate = element.getAttribute('data-rotate');
  var period = element.getAttribute('data-period');

  
  if (element) {
    // Reserve space for 2 lines to prevent layout shift during typing
    element.style.minHeight = '3.5rem'; // Reserve enough space for 2 lines
  }

  setTimeout(function() {
    new TxtRotate(element, JSON.parse(toRotate), period);
  }, 1500);

  // INJECT CSS
  var css = document.createElement('style');
  css.type = 'text/css';
  css.innerHTML = '#txt-rotate > .wrap { border-right: 0.08em solid #666 }';
  document.body.appendChild(css);

  // Initialize AOS
  AOS.init({
    disable: 'mobile',
    offset: 200,
    duration: 600,
    easing: 'ease-in-sine',
    delay: 100,
    once: true
  });

  randomizeOrder();
});

/* FUNCTIONS */
/* Preloader */


function fadeOutPreloader(element, duration) {
  opacity = 1;

  interval = setInterval(function() {
    if (opacity <= 0) {
      element.style.zIndex = 0;
      element.style.opacity = 0;
      element.style.filter = 'alpha(opacity = 0)';

      // Allow horizontal scroll
      document.documentElement.style.overflowY = 'auto';

      // Remove preloader div
      document.getElementById('preloader').remove();

      clearInterval(interval);
    } else {
      opacity -= 0.1;
      element.style.opacity = opacity;
      element.style.filter = 'alpha(opacity = ' + opacity * 100 + ')';
    }
  }, duration);
}

/* Typing Text */

var TxtRotate = function(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function () {
  const i = this.loopNum % this.toRotate.length;
  const fullHtml = this.toRotate[i];

  // Create a dummy div to parse and safely strip HTML tags
  const parser = document.createElement('div');
  parser.innerHTML = fullHtml;
  const fullText = parser.textContent || parser.innerText || '';

  // Simulate typing/deleting only the text part
  if (this.isDeleting) {
    this.txt = fullText.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullText.substring(0, this.txt.length + 1);
  }

  // Re-inject the original HTML, replacing the text content only
  const temp = document.createElement('div');
  temp.innerHTML = fullHtml;
  const targetNode = temp;

  function applyTypedText(node, count) {
    for (let child of node.childNodes) {
      if (count <= 0) {
        child.textContent = '';
        continue;
      }

      if (child.nodeType === Node.TEXT_NODE) {
        const len = child.textContent.length;
        if (len <= count) {
          count -= len;
        } else {
          child.textContent = child.textContent.substring(0, count);
          count = 0;
        }
      } else {
        count = applyTypedText(child, count);
      }
    }
    return count;
  }

  applyTypedText(targetNode, this.txt.length);
  this.el.innerHTML = '<span class="wrap">' + targetNode.innerHTML + '</span>';

  const that = this;
  let delta = 80 - Math.random() * 50;

  if (this.isDeleting) {
    delta /= 5;
  }

  if (!this.isDeleting && this.txt === fullText) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function () {
    that.tick();
  }, delta);
};


/* Word Cloud */

function randomizeOrder() {
  var parent = document.getElementById('skills');
  var divs = parent.getElementsByTagName('div');
  var frag = document.createDocumentFragment();

  // Randomize order of skills
  while (divs.length) {
    frag.appendChild(divs[Math.floor(Math.random() * divs.length)]);
  }
  parent.appendChild(frag);
}
