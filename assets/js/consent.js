/* =============================================================================
   consent.js — GDPR / TDDDG Consent Manager
   josemuck.com

   NOTE: This is a technical implementation scaffold.
   Final review by a qualified Rechtsanwalt / Datenschutzbeauftragter
   is strongly recommended before treating this as complete legal coverage.

   Consent categories:
     essential  — always true; required for site operation
     analytics  — optional; gates Vercel Web Analytics + Google Analytics 4

   localStorage key: "jsm_consent"
   Version: "1.1" — bumped when GA4 was added (2026-06)
   Previous version "1.0" stored consents are invalidated to re-prompt users.

   IMPORTANT: No analytics or tracking scripts should be loaded
   before this module has confirmed analytics consent.
============================================================================= */

/* ── Analytics configuration ───────────────────────────────────────────────
   Single location for all analytics identifiers.
   To change a script path or measurement ID, edit only this section.
   ─────────────────────────────────────────────────────────────────────────── */
var GA_MEASUREMENT_ID  = 'G-9FH2DWH9DV';
var VERCEL_SCRIPT_PATH = '/_vercel/insights/script.js';

/* ── Debug mode ────────────────────────────────────────────────────────────
   Enable via URL: ?debug_analytics=true
   Or by setting DEBUG_ANALYTICS = true below and redeploying (dev only).
   When active, logs all consent and analytics events to the browser console.
   ─────────────────────────────────────────────────────────────────────────── */
var DEBUG_ANALYTICS = /[?&]debug_analytics=true/.test(
  typeof location !== 'undefined' ? location.search : ''
);
function _dbg() {
  if (DEBUG_ANALYTICS) {
    var args = Array.prototype.slice.call(arguments);
    args.unshift('[Analytics]');
    console.log.apply(console, args);
  }
}

/* ── Vercel Web Analytics — queue stub ─────────────────────────────────────
   Queues va() calls made before the gated script loads.
   Script path: /_vercel/insights/script.js
   See: https://vercel.com/docs/analytics/quickstart
   ─────────────────────────────────────────────────────────────────────────── */
window.va  = window.va  || function () { (window.vaq = window.vaq || []).push(arguments); };

/* ── Google Analytics 4 — Consent Mode v2 + dataLayer stub ────────────────
   Must run before gtag.js loads. Sets all consent to denied by default.
   analytics_storage is updated to 'granted' only after explicit user consent.
   Advertising-related consent is intentionally kept denied (not used).
   See: https://developers.google.com/tag-platform/security/guides/consent
   ─────────────────────────────────────────────────────────────────────────── */
window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }
gtag('js', new Date());
gtag('consent', 'default', {
  'analytics_storage':  'denied',
  'ad_storage':         'denied',
  'ad_user_data':       'denied',
  'ad_personalization': 'denied',
  'wait_for_update':    500
});
_dbg('Consent Mode default: all denied');

(function () {
  'use strict';

  var STORAGE_KEY = 'jsm_consent';
  var VERSION     = '1.1';  /* bumped — invalidates v1.0 consent; re-prompts returning visitors */

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

  /* ── Analytics loaders ─────────────────────────────────────────────────── */
  var _vercelLoaded = false;
  function loadVercel() {
    if (_vercelLoaded) return;
    _vercelLoaded = true;
    /* Vercel Web Analytics — injected only after explicit consent.
       Auto-injection in the Vercel dashboard MUST remain disabled.
       The script self-initialises window.va and replays window.vaq. */
    var s = document.createElement('script');
    s.defer = true;
    s.src   = VERCEL_SCRIPT_PATH;
    document.head.appendChild(s);
    _dbg('Vercel Analytics script injected:', VERCEL_SCRIPT_PATH);
  }

  var _ga4Loaded = false;
  function loadGA4() {
    if (_ga4Loaded) return;
    _ga4Loaded = true;
    /* Google Analytics 4 — injected only after explicit consent.
       Consent Mode is updated to 'granted' before the script is loaded
       so GA4 operates with full consent from the first hit. */
    gtag('consent', 'update', { 'analytics_storage': 'granted' });
    _dbg('Consent Mode update: analytics_storage → granted');

    var s = document.createElement('script');
    s.async = true;
    s.src   = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(s);

    /* Config queued — fires page_view once the script loads */
    gtag('config', GA_MEASUREMENT_ID);
    _dbg('GA4 script injected, config queued for:', GA_MEASUREMENT_ID);
  }

  /* Revoke consent for already-loaded GA4 (user changed preference) */
  function revokeGA4() {
    gtag('consent', 'update', { 'analytics_storage': 'denied' });
    _dbg('Consent Mode update: analytics_storage → denied (preference revoked)');
  }

  function loadAnalytics() {
    loadVercel();
    loadGA4();
  }

  function revokeAnalytics() {
    revokeGA4();
    /* Vercel has no consent API — the script is already loaded.
       It will not be injected again on future page loads (stored consent is false). */
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
    '<p class="cb-body">Diese Website verwendet essentielle Cookies sowie optional ',
    'Analyse-Dienste (Vercel Analytics, Google Analytics 4). Analysen werden nur nach ',
    'Ihrer Einwilligung geladen. / This site uses essential cookies and optional analytics ',
    '(Vercel Analytics, Google Analytics 4). Analytics load only after your consent.',
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
    '<p class="cs-cat-desc">Nutzungsstatistiken via Vercel Analytics und Google Analytics 4. ',
    'Ermöglicht Verbesserungen der Website auf Basis aggregierter Daten. / ',
    'Usage statistics via Vercel Analytics and Google Analytics 4. ',
    'Enables website improvements based on aggregated data.</p></div>',
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
      _dbg('User accepted all analytics');
    }
    function rejectAll() {
      writeConsent(false);
      revokeAnalytics();
      hideBanner();
      hideSettings();
      _dbg('User rejected all analytics');
    }
    function saveSelection() {
      var ok = toggle && toggle.checked;
      writeConsent(ok);
      if (ok) {
        loadAnalytics();
        _dbg('User saved: analytics ON');
      } else {
        revokeAnalytics();
        _dbg('User saved: analytics OFF');
      }
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

    /* On page load: honour stored consent or show banner */
    var stored = readConsent();
    if (stored) {
      _dbg('Stored consent found:', stored);
      if (stored.analytics) {
        loadAnalytics();
      } else {
        _dbg('Analytics consent: denied — scripts not loaded');
      }
    } else {
      _dbg('No consent stored — showing banner');
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
