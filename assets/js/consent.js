/* =============================================================================
   consent.js — GDPR / TDDDG Consent Manager
   josemuck.com

   NOTE: This is a technical implementation scaffold.
   Final review by a qualified Rechtsanwalt / Datenschutzbeauftragter
   is strongly recommended before treating this as complete legal coverage.

   Consent categories:
     essential  — always true; required for site operation
     analytics  — optional; gates Vercel Web Analytics

   localStorage key: "jsm_consent"
   Version: "1.0" — bump when consent purposes change materially.

   IMPORTANT: No analytics or tracking scripts should be loaded
   before this module has confirmed analytics consent.
============================================================================= */

/* ── Vercel Web Analytics — queue stub ─────────────────────────────────────
   Initialise window.va and window.vaq before the analytics script loads.
   This queues any va() calls made before the script is dynamically injected,
   so they are replayed once the script loads after consent is granted.
   See: https://vercel.com/docs/analytics/quickstart#add-@vercel/analytics-to-your-project
   Script path: /_vercel/insights/script.js
   Auto-injection in Vercel dashboard MUST remain disabled — gating is
   handled exclusively by this consent manager.
   ─────────────────────────────────────────────────────────────────────────── */
window.va  = window.va  || function () { (window.vaq = window.vaq || []).push(arguments); };

(function () {
  'use strict';

  var STORAGE_KEY = 'jsm_consent';
  var VERSION     = '1.0';

  /* ── Storage helpers ───────────────────────────────────────────────────── */
  function readConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var d = JSON.parse(raw);
      if (d.version !== VERSION) return null;
      return d;
    } catch (e) { return null; }
  }

  function writeConsent(analytics) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version:   VERSION,
        timestamp: new Date().toISOString(),
        essential: true,
        analytics: !!analytics
      }));
    } catch (e) {}
  }

  /* ── Analytics gating ──────────────────────────────────────────────────── */
  var _analyticsLoaded = false;
  function loadAnalytics() {
    if (_analyticsLoaded) return;
    _analyticsLoaded = true;
    /* Vercel Web Analytics — injected only after explicit consent.
       Auto-injection in the Vercel dashboard MUST be disabled for this
       consent gate to work. The script self-initialises window.va and
       replays any calls queued in window.vaq by the stub above. */
    var s = document.createElement('script');
    s.defer = true;
    s.src   = '/_vercel/insights/script.js';
    document.head.appendChild(s);
  }

  /* ── CSS ───────────────────────────────────────────────────────────────── */
  var CSS = [
    /* Banner */
    '#jsm-consent-banner{position:fixed;bottom:0;left:0;right:0;z-index:10000;',
    'background:#0f1628;border-top:1px solid #1e2a44;padding:1.25rem 2rem;',
    'display:none;box-shadow:0 -4px 32px rgba(0,0,0,.5)}',
    '#jsm-consent-banner.cb-show{display:block}',
    '.cb-inner{max-width:1100px;margin:0 auto;display:flex;align-items:center;',
    'gap:2rem;flex-wrap:wrap}',
    '.cb-text{flex:1;min-width:240px}',
    '.cb-title{font-family:"Playfair Display",serif;font-size:.95rem;',
    'color:#f0ece4;margin:0 0 .35rem}',
    '.cb-body{font-family:"DM Sans",sans-serif;font-size:.74rem;',
    'color:#8a9ab8;line-height:1.6;margin:0}',
    '.cb-policy-link{color:#4ade80;text-decoration:none;margin-left:.3em}',
    '.cb-policy-link:hover{text-decoration:underline}',
    '.cb-actions{display:flex;gap:.65rem;flex-wrap:wrap;align-items:center}',
    /* Shared button base */
    '.cb-btn{font-family:"DM Mono",monospace;font-size:.62rem;letter-spacing:.12em;',
    'text-transform:uppercase;padding:.6rem 1.1rem;border-radius:2px;border:none;',
    'cursor:pointer;transition:background .2s,color .2s,border-color .2s;white-space:nowrap}',
    '.cb-btn-primary{background:#4ade80;color:#0a0f1e}',
    '.cb-btn-primary:hover{background:#6ee7b7}',
    '.cb-btn-secondary{background:transparent;color:#8a9ab8;border:1px solid #1e2a44}',
    '.cb-btn-secondary:hover{border-color:#4ade80;color:#f0ece4}',
    /* Settings panel */
    '#jsm-consent-settings{display:none}',
    '#jsm-consent-settings.cs-show{display:block}',
    '.cs-backdrop{position:fixed;inset:0;background:rgba(10,15,30,.85);',
    'backdrop-filter:blur(4px);z-index:10001}',
    '.cs-panel{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);',
    'z-index:10002;background:#0f1628;border:1px solid #1e2a44;border-radius:4px;',
    'width:min(540px,94vw);max-height:90vh;overflow-y:auto;',
    'box-shadow:0 24px 80px rgba(0,0,0,.7)}',
    '.cs-header{display:flex;align-items:center;justify-content:space-between;',
    'padding:1.5rem 1.75rem 1rem;border-bottom:1px solid #1e2a44}',
    '.cs-title{font-family:"Playfair Display",serif;font-size:1rem;color:#f0ece4;margin:0}',
    '.cs-close{background:none;border:none;cursor:pointer;color:#8a9ab8;',
    'font-size:1.1rem;padding:.25rem;transition:color .2s;line-height:1}',
    '.cs-close:hover{color:#f0ece4}',
    '.cs-body{padding:1.25rem 1.75rem}',
    '.cs-cat{padding:1rem 0;border-bottom:1px solid #1e2a44}',
    '.cs-cat:last-child{border-bottom:none}',
    '.cs-cat-row{display:flex;justify-content:space-between;align-items:flex-start;gap:1.5rem}',
    '.cs-cat-name{font-family:"DM Sans",sans-serif;font-size:.82rem;font-weight:500;',
    'color:#f0ece4;margin:0 0 .35rem}',
    '.cs-cat-desc{font-family:"DM Sans",sans-serif;font-size:.72rem;',
    'color:#8a9ab8;line-height:1.6;margin:0}',
    '.cs-always{font-family:"DM Mono",monospace;font-size:.58rem;letter-spacing:.1em;',
    'text-transform:uppercase;color:#4ade80;white-space:nowrap;padding-top:.2rem}',
    /* Toggle */
    '.cs-toggle-wrap{flex-shrink:0;cursor:pointer;display:inline-flex;align-items:center}',
    '.cs-toggle-input{position:absolute;opacity:0;width:0;height:0}',
    '.cs-toggle-track{display:block;width:44px;height:24px;background:#1e2a44;',
    'border-radius:12px;position:relative;transition:background .25s}',
    '.cs-toggle-input:checked~.cs-toggle-track{background:#4ade80}',
    '.cs-toggle-thumb{position:absolute;top:3px;left:3px;width:18px;height:18px;',
    'background:#f0ece4;border-radius:50%;transition:transform .25s}',
    '.cs-toggle-input:checked~.cs-toggle-track .cs-toggle-thumb{transform:translateX(20px)}',
    '.cs-toggle-input:focus~.cs-toggle-track{outline:2px solid #4ade80;outline-offset:2px}',
    /* Footer */
    '.cs-footer-btns{display:flex;gap:.65rem;justify-content:flex-end;',
    'padding:1rem 1.75rem 1.5rem;border-top:1px solid #1e2a44}',
    /* Responsive */
    '@media(max-width:600px){',
    '#jsm-consent-banner{padding:1rem}',
    '.cb-inner{gap:1rem}',
    '.cb-actions{width:100%;justify-content:flex-end}',
    '.cs-footer-btns{flex-direction:column-reverse}',
    '.cs-footer-btns .cb-btn{width:100%;text-align:center}}'
  ].join('');

  /* ── Templates ─────────────────────────────────────────────────────────── */
  var BANNER_HTML = [
    '<div id="jsm-consent-banner" role="dialog" ',
    'aria-label="Cookie-Einstellungen" aria-live="polite">',
    '<div class="cb-inner">',
    '<div class="cb-text">',
    '<p class="cb-title">Cookies &amp; Datenschutz</p>',
    '<p class="cb-body">Diese Website verwendet essentielle Cookies für Ihre Einstellungen ',
    'sowie optional datenschutzfreundliche Analysen (Vercel Analytics, ohne Drittanbieter-Cookies). ',
    'This site uses essential cookies for preferences and optional privacy-friendly analytics.',
    '<a href="privacy.html" class="cb-policy-link">Datenschutzerklärung / Privacy Policy</a>',
    '</p></div>',
    '<div class="cb-actions">',
    '<button class="cb-btn cb-btn-secondary" id="jsm-cb-manage">Einstellungen / Settings</button>',
    '<button class="cb-btn cb-btn-secondary" id="jsm-cb-reject">Ablehnen / Reject</button>',
    '<button class="cb-btn cb-btn-primary"   id="jsm-cb-accept">Akzeptieren / Accept</button>',
    '</div></div></div>'
  ].join('');

  var SETTINGS_HTML = [
    '<div id="jsm-consent-settings" role="dialog" ',
    'aria-label="Cookie-Einstellungen" aria-modal="true">',
    '<div class="cs-backdrop" id="jsm-cs-backdrop"></div>',
    '<div class="cs-panel">',
    '<div class="cs-header">',
    '<p class="cs-title">Cookie-Einstellungen / Cookie Settings</p>',
    '<button class="cs-close" id="jsm-cs-close" aria-label="Schließen">✕</button>',
    '</div>',
    '<div class="cs-body">',
    /* Essential */
    '<div class="cs-cat">',
    '<div class="cs-cat-row">',
    '<div><p class="cs-cat-name">Essentiell / Essential</p>',
    '<p class="cs-cat-desc">Notwendig für die Funktion der Website und zur Speicherung Ihrer ',
    'Cookie-Einstellungen. Nicht deaktivierbar. / Required for site operation and saving your ',
    'preferences. Always active.</p></div>',
    '<div class="cs-always">Immer aktiv</div>',
    '</div></div>',
    /* Analytics */
    '<div class="cs-cat">',
    '<div class="cs-cat-row">',
    '<div><p class="cs-cat-name">Analyse / Analytics</p>',
    '<p class="cs-cat-desc">Datenschutzfreundliche Nutzungsstatistiken via Vercel Web Analytics. ',
    'Keine Drittanbieter-Cookies, keine personenbezogenen Daten. / Privacy-friendly usage statistics ',
    'via Vercel Web Analytics. No third-party cookies, no personal data.</p></div>',
    '<label class="cs-toggle-wrap" aria-label="Analytics aktivieren">',
    '<input type="checkbox" id="jsm-analytics-toggle" class="cs-toggle-input">',
    '<span class="cs-toggle-track"><span class="cs-toggle-thumb"></span></span>',
    '</label>',
    '</div></div>',
    '</div>',/* footer buttons */
    '<div class="cs-footer-btns">',
    '<button class="cb-btn cb-btn-secondary" id="jsm-cs-save">Auswahl speichern / Save</button>',
    '<button class="cb-btn cb-btn-primary" id="jsm-cs-accept-all">Alle akzeptieren / Accept all</button>',
    '</div>',
    '</div></div>'
  ].join('');

  /* ── Inject style + UI ─────────────────────────────────────────────────── */
  function injectUI() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    document.body.insertAdjacentHTML('beforeend', BANNER_HTML);
    document.body.insertAdjacentHTML('beforeend', SETTINGS_HTML);
  }

  /* ── Wire events ───────────────────────────────────────────────────────── */
  function wireEvents() {
    var banner   = document.getElementById('jsm-consent-banner');
    var settings = document.getElementById('jsm-consent-settings');
    var toggle   = document.getElementById('jsm-analytics-toggle');

    function showBanner()    { banner.classList.add('cb-show'); }
    function hideBanner()    { banner.classList.remove('cb-show'); }
    function showSettings()  { settings.classList.add('cs-show'); }
    function hideSettings()  { settings.classList.remove('cs-show'); }

    function acceptAll() {
      writeConsent(true);
      loadAnalytics();
      hideBanner();
      hideSettings();
    }
    function rejectAll() {
      writeConsent(false);
      hideBanner();
      hideSettings();
    }
    function saveSelection() {
      var ok = toggle && toggle.checked;
      writeConsent(ok);
      if (ok) loadAnalytics();
      hideBanner();
      hideSettings();
    }
    function openSettings() {
      var stored = readConsent();
      if (toggle) toggle.checked = !!(stored && stored.analytics);
      showSettings();
    }

    document.getElementById('jsm-cb-accept').addEventListener('click', acceptAll);
    document.getElementById('jsm-cb-reject').addEventListener('click', rejectAll);
    document.getElementById('jsm-cb-manage').addEventListener('click', openSettings);
    document.getElementById('jsm-cs-close').addEventListener('click', hideSettings);
    document.getElementById('jsm-cs-backdrop').addEventListener('click', hideSettings);
    document.getElementById('jsm-cs-accept-all').addEventListener('click', acceptAll);
    document.getElementById('jsm-cs-save').addEventListener('click', saveSelection);

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (settings.classList.contains('cs-show')) hideSettings();
      else hideBanner();
    });

    /* Public API — used by footer Cookie-Einstellungen button */
    window.consentManager = {
      openSettings: openSettings,
      getConsent:   readConsent
    };

    /* Show banner only if no stored consent */
    var stored = readConsent();
    if (stored) {
      if (stored.analytics) loadAnalytics();
    } else {
      showBanner();
    }
  }

  /* ── Boot ──────────────────────────────────────────────────────────────── */
  function boot() {
    injectUI();
    wireEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
