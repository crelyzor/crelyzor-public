(function () {
  'use strict';

  function Crelyzor(action, config) {
    if (action !== 'init') return;
    if (!config || !config.link || !config.container) {
      console.error('[Crelyzor] embed requires { link, container }');
      return;
    }

    var base = config.baseUrl || 'https://crelyzor.app';
    var container = document.querySelector(config.container);
    if (!container) {
      console.error('[Crelyzor] container not found:', config.container);
      return;
    }

    var iframe = document.createElement('iframe');
    iframe.src = base + '/schedule/' + config.link + '?embed=1';
    iframe.style.cssText =
      'width:100%;border:none;display:block;min-height:600px;';
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('allow', 'clipboard-write');
    container.appendChild(iframe);

    window.addEventListener('message', function (e) {
      if (!e.data || typeof e.data.type !== 'string') return;
      if (!e.data.type.startsWith('CRELYZOR:')) return;

      if (
        e.data.type === 'CRELYZOR:resize' &&
        typeof e.data.height === 'number'
      ) {
        iframe.style.height = e.data.height + 'px';
      }

      if (e.data.type === 'CRELYZOR:booking-confirmed') {
        if (typeof config.onBooking === 'function') {
          config.onBooking(e.data.data);
        }
      }
    });
  }

  window.Crelyzor = Crelyzor;
})();
