caph.plugins.about = new class extends caph.Plugin {

  async loader() {
    await caph.load('caph-docs/plugins/gtag/gtag.css');
  }

  Component({ GA_MEASUREMENT_ID }) {
    preact.useEffect(() => {
      caph.assert(GA_MEASUREMENT_ID);
      const { addOption } = preact.useContext(caph.contexts['core-menu']);
      addOption('Google Analytics', { hold: true });
      caph.inject(caph.parse`
        <script async src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        </script>
      `, { parent: document.body, where: 'beforeend' })
    }, [GA_MEASUREMENT_ID]);

    const [consent, _setConsent] = preact.useState(localStorage.getItem('caph-docs-gtag-consent') == 'true');
    // https://developers.google.com/tag-platform/devguides/privacy#consent_mode_overview
    /*
      ad_storage 	Enables storage (such as cookies) related to advertising
      analytics_storage 	Enables storage (such as cookies) related to analytics e.g. visit duration
      functionality_storage 	Enables storage that supports the functionality of the website or app e.g. language settings
      personalization_storage 	Enables storage related to personalization e.g. video recommendations
      security_storage 	Enables storage related to security such as authentication functionality, fraud prevention, and other user protection
    */
    // const setConsent = () => {
    // }
    const { option } = preact.useContext(caph.contexts['core-menu']);
    const _class = option == 'Google Analytics' ? 'fullscreen-layer caph-about-outer' : 'hidden';
    return caph.parse`
      THIS PLUGIN IS NOT READY YET
      <div class=${_class}>
        <div class="box-shadow caph-about-inner">
          <h1>Google Analytics</h1>
          <p>
            This site uses Google Analytics to allow its owner to see how visitors use the site.
          </p>
        </div>
      </div>`;
  }

}
