
caph._scriptLoader.attach(...JSON.parse(LZUTF8.decompress("W10=", {inputEncoding: 'Base64'})));

caph.pluginDefs[caph.currentSrc] = new class extends caph.Plugin {

  Component() { return null; }

  async post_loader() {
    this.init();
  }

  async init(ms = 200, ms_stable = 3000) {
    window.addEventListener('keydown', (e) => {
      if (e.keyCode == 116) this.savePosition(); // F5 key
    });
    // scrolls to last saved scroll position every ms until the
    // document height is stable for at least ms_stable
    // fights scroll unstability after each visible plugin loads
    let t = 0, h, prevh, initialh;
    do {
      prevh = initialh = document.body.scrollHeight;
      for (let t = 0; t < ms_stable; t += ms) {
        await caph.sleep(ms);
        h = document.body.scrollHeight;
        if (h != prevh) { prevh = h; this.loadPosition(); }
      }
    } while (prevh != initialh);
    this.daemon();
  }
  async daemon(ms = 5000) {
    while (1) {
      this.savePosition();
      await caph.sleep(ms);
    }
  }

  savePosition() {
    window.localStorage.setItem('scrollX', '' + window.scrollX);
    window.localStorage.setItem('scrollY', '' + window.scrollY);
    //console.log('saved', window.scrollY);
  }
  loadPosition() {
    const scrollX = parseInt(window.localStorage.getItem('scrollX'));
    const scrollY = parseInt(window.localStorage.getItem('scrollY'));
    window.scrollBy(scrollX - window.scrollX, scrollY - window.scrollY);
    //console.log('loaded', scrollY);
    return;
  }
  load_href_scroll_position() {
    const href = window.location.href;
    if (href.indexOf('startAt') != -1) {
      const match = href.split('?')[1].split("&")[0].split("=");
      document.getElementsByTagName("body")[0].scrollTop = match[1];
    }
  }
};
