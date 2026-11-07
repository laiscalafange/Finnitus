/**
 * Consentimento opcional para cookies estatísticos.
 * Não carrega analytics antes da manifestação positiva e não inclui publicidade.
 * IMPORTANTE: remover tags antigas de GA/GTM/Pixel do HTML original.
 */
(() => {
  'use strict';
  const KEY = 'finnitus_cookie_consent_v2';
  const CONSENT_VERSION = 2;
  const moduleScript = document.currentScript;
  const gaId = moduleScript?.dataset.gaId || '';
  // Resolva os caminhos em relação ao arquivo JS: funciona no index e em /legal/.
  const policyHref = new URL('politica-de-cookies.html', moduleScript?.src || document.baseURI).href;
  let analyticsLoaded = false;
  let consent;

  function readConsent() {
    try {
      const value = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (value && value.version === CONSENT_VERSION && typeof value.analytics === 'boolean') return value;
    } catch { /* não bloquear o site se storage estiver indisponível */ }
    return null;
  }
  function saveConsent(analytics) {
    const hadActiveAnalytics = analyticsLoaded && consent?.analytics === true;
    consent = { version: CONSENT_VERSION, necessary: true, analytics: Boolean(analytics), savedAt: new Date().toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(consent)); } catch { /* consentimento da sessão */ }
    if (consent.analytics) loadAnalytics(); else revokeAnalytics();
    panel.hidden = true;
    document.dispatchEvent(new CustomEvent('finnitus:consent', { detail: { analytics: consent.analytics } }));
    // Revogação após GA ter sido carregado: recarregar remove o script ativo
    // da nova página, que não o carregará sem consentimento.
    if (!consent.analytics && hadActiveAnalytics) window.location.reload();
  }
  function loadAnalytics() {
    if (!gaId || !/^G-[A-Z0-9]+$/.test(gaId) || analyticsLoaded) return;
    analyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', gaId, { send_page_view: true, allow_google_signals: false, allow_ad_personalization_signals: false });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gaId);
    script.onerror = () => { analyticsLoaded = false; script.remove(); };
    document.head.appendChild(script);
  }
  function revokeAnalytics() {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied' });
    }
    // Elimina cookies de primeira parte conhecidos de GA. Não apaga
    // registros já enviados e não alcança domínios de terceiros.
    document.cookie.split(';').map(v => v.split('=')[0].trim()).filter(n => /^_ga(?:_|$)|^_gid$/.test(n)).forEach(name => {
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
      const host = location.hostname.split('.');
      for (let i = 0; i < host.length - 1; i++) {
        const domain = host.slice(i).join('.');
        document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${domain}; SameSite=Lax`;
      }
    });
  }

  const panel = document.createElement('section');
  panel.className = 'cookie-panel';
  panel.setAttribute('aria-label', 'Preferências de cookies');
  panel.hidden = true;
  panel.innerHTML = `
    <h2>Privacidade no Finnitus</h2>
    <p>Usamos armazenamento essencial para lembrar sua escolha. Estatísticas são opcionais e só ativadas se você autorizar.</p>
    <div class="cookie-options" id="finnitus-cookie-options" hidden>
      <p>Necessários: sempre ativos, somente para guardar sua preferência.</p>
      <label><input type="checkbox" id="finnitus-cookie-analytics"> Permitir cookies estatísticos opcionais</label>
      <p><a href="${policyHref}">Leia a Política de Cookies</a>.</p>
    </div>
    <div class="cookie-actions">
      <button class="secondary" type="button" data-cookie-reject>Rejeitar opcionais</button>
      <button class="secondary" type="button" data-cookie-config>Personalizar</button>
      <button type="button" data-cookie-accept>Aceitar estatísticos</button>
      <button type="button" data-cookie-save hidden>Salvar escolha</button>
    </div>`;
  document.body.appendChild(panel);
  const options = panel.querySelector('#finnitus-cookie-options');
  const checkbox = panel.querySelector('#finnitus-cookie-analytics');
  const saveButton = panel.querySelector('[data-cookie-save]');
  const acceptButton = panel.querySelector('[data-cookie-accept]');
  const rejectButton = panel.querySelector('[data-cookie-reject]');
  panel.querySelector('[data-cookie-config]').addEventListener('click', () => {
    options.hidden = false;
    checkbox.checked = consent?.analytics === true;
    saveButton.hidden = false;
    acceptButton.hidden = true;
    checkbox.focus();
  });
  saveButton.addEventListener('click', () => saveConsent(checkbox.checked));
  acceptButton.addEventListener('click', () => saveConsent(true));
  rejectButton.addEventListener('click', () => saveConsent(false));
  document.querySelectorAll('[data-open-cookie-settings]').forEach(button => {
    button.addEventListener('click', () => {
      panel.hidden = false;
      options.hidden = false;
      checkbox.checked = consent?.analytics === true;
      saveButton.hidden = false;
      acceptButton.hidden = true;
      checkbox.focus();
    });
  });
  consent = readConsent();
  if (!consent) {
    panel.hidden = false;
  } else if (consent.analytics) {
    loadAnalytics();
  } else {
    revokeAnalytics();
  }
})();
