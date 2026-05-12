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

    // Build the iframe URL properly so existing query params in config.link are preserved
    var scheduleUrl = new URL(base + '/schedule/' + config.link);
    scheduleUrl.searchParams.set('embed', '1');

    var iframe = document.createElement('iframe');
    iframe.src = scheduleUrl.toString();
    iframe.style.cssText =
      'width:100%;border:none;display:block;min-height:600px;';
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('allow', 'clipboard-write');
    container.appendChild(iframe);

    var embedOrigin = new URL(base).origin;

    window.addEventListener('message', function (e) {
      // Validate source and origin to prevent spoofed messages
      if (e.source !== iframe.contentWindow) return;
      if (e.origin !== embedOrigin) return;
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
