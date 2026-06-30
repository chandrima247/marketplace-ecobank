/*
 * Shared flow configuration for embedded MaaS insurance flow pages.
 * Currency (and country) are configurable rather than hardcoded so the same
 * flow pages work across Ecobank's multi-country footprint.
 *
 * Resolution order:
 *   1. ?cur=KES&country=KE query params (passed by the wizard/iframe src)
 *   2. values posted by the parent via { source: 'maas-config', currency, country }
 *   3. defaults below
 *
 * Usage in a page:
 *   - Add class "cur-label" to any element that should display the currency code.
 *   - Call MAAS.currency() to read the current code.
 */
(function () {
  var params = new URLSearchParams(location.search);
  // Persisted market chosen via the shell's country selector (localStorage),
  // so an iframe mounted after selection still shows the right currency.
  var saved = { currency: null, country: null };
  try {
    var code = (window.parent || window).localStorage.getItem('maas-market');
    var MAP = { NG: 'NGN', GH: 'GHS', KE: 'KES', UG: 'UGX', TZ: 'TZS', RW: 'RWF', CI: 'XOF', SN: 'XOF', CM: 'XAF', CD: 'CDF', ZM: 'ZMW', ML: 'XOF', BJ: 'XOF', TG: 'XOF' };
    if (code && MAP[code]) { saved.currency = MAP[code]; saved.country = code; }
  } catch (e) { /* cross-origin / unavailable */ }

  var cfg = {
    currency: params.get('cur') || saved.currency || 'UGX',
    country: params.get('country') || saved.country || 'UG'
  };

  function applyLabels() {
    var els = document.querySelectorAll('.cur-label');
    for (var i = 0; i < els.length; i++) els[i].textContent = cfg.currency;
  }

  window.MAAS = {
    currency: function () { return cfg.currency; },
    country: function () { return cfg.country; },
    set: function (next) { Object.assign(cfg, next || {}); applyLabels(); }
  };

  // Allow the parent shell to override currency at runtime.
  window.addEventListener('message', function (e) {
    var d = e.data;
    if (d && d.source === 'maas-config') {
      window.MAAS.set({ currency: d.currency, country: d.country });
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyLabels);
  } else {
    applyLabels();
  }
})();
