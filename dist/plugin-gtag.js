
caph.attach(...JSON.parse(LZUTF8.decompress("W3sicmVmIjoiY2FwaC1kb2NzL3BsdWdpbnMvZ3RhZ8UFLmNzcyIsImNvbnRlbnQiOiJcbi7FL2Fib3V0LW91dGVye1xuICBiYWNrZ3JvdW5kOiB2YXIoLS3KEi1lbXB0eSk7yChkcm9wLWZpbHRlcjogYmx1cig0cHjGH3BhZGRpbmc6IDN2aCAwZW07XG59znNpbm7Hc21heC13aWR0aDogY2FsYyg4MHZ3IC0gMmVtxkzEIGhlaWdodMchOTB2aCAtIDUuNcgjb3ZlcmZsb3cteTogYXV0b8UVY29sb3LoAMZ0ZXh06gC6+ADiyHFyZ2luOslJ6QDNMcRy5ACZIDTGCMZRb3JkZXItcmFkaXVzOiAxxxdmb250LWZhbWlseTogbW9ub3NwYWNlLCBhcmlhbOcBEGhpZGRlbuUBBmRpc3BsYXk6IG5vbmXGH1xuLmJveC1zaGFkb3fFJcoPOiAwcHjGBC4zcmVtIDAuMDXECOcA08kp5ADTxGvLO2jkAS/fUCAwLjLcT2Z1bGxzY3JlZW4tbGF5x0/nAcYxMDAl5QED6AG2yRFwb3NpdGlvbjogZml4ZWTFFHRvcDogMMULbGVmdMgMei1pbmRleMU9xnRcbi8qIC5oYm94e+oBLmZsZXg7IOQAknbUGcQGLWRpcmVjxndjb2x1bW7GMWJveGNlbuQC+SBqdXN0aWZ5LecDIDogxhnGKOUBuC1h5QIh0yvMH8wxYmV0d2VlbtkyxyDGM+QAqHvlAK46IDHGE+cCHOkA0uUCGMUa5gPeLdoh5gKS5wHixAs6IHNvbGlkIDJweOsDEC1zdHJvbmflAdMgKi8ifV0=", {inputEncoding: 'Base64'})));
caph.plugins.about = new class extends caph.Plugin {

  async loader() {
    await caph.load('caph-docs/plugins/gtag/gtag.css');
  }

  Component({ GA_MEASUREMENT_ID }) {
    preact.useEffect(() => {
      assert(GA_MEASUREMENT_ID);
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
