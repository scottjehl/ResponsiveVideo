/*
ResponsiveVideo Web Component.
To use: load this module in your page and wrap a responsive-video element around your video element
This makes a responsive video element respond to source media changes too
Copyright 2023 Scott Jehl, @scottjehl
MIT License
*/
class ResponsiveVideo extends HTMLElement {
  constructor() {
    super();
    this.video = this.querySelector('video');
    this.listenedMedia = [];
    this.reloadQueued = false;
  }
  connectedCallback() {
    this.bindMediaListeners();
  }
  disconnectedCallback() {
    this.unbindMediaListeners();
  }
  bindMediaListeners(){
    const video = this.video;
    this.querySelectorAll('source').forEach( source => {
    if( source.media ){
      let mqListener = () => {
        if( source.media === video.currentSrc || !this.previousSiblingIsPlaying(source, video.currentSrc) && !this.reloadQueued ){
          this.reloadVideo();
        }
      };
      this.listenedMedia.push({media: source.media, handler: mqListener});
      window.matchMedia( source.media ).addEventListener("change", mqListener);
    }
    }, this );
  }
  unbindMediaListeners(){
    this.listenedMedia.forEach( listener => {
    window.matchMedia( listener.media ).removeEventListener("change", listener.handler);
    });
  }
  previousSiblingIsPlaying(elem, src) {
    let prevSibling = elem;
    let ret = false;
    while (elem.previousElementSibling) {
      if(prevSibling.src === src){
        ret = true;
      }
    }
    return ret;
  }
  reloadVideo(){
    this.reloadQueued = true;
    const currentTime = this.video.currentTime;
    const playState = this.video.playState;
    this.video.load();
    let videoLoaded = () => {
      this.video.playState = playState;
      this.video.currentTime = currentTime.toString();
      this.reloadQueued = false;
      this.video.removeEventListener("loadeddata", videoLoaded);
    }
    this.video.addEventListener("loadeddata", videoLoaded );
  }
}

// feature test for native video media switching media
const videoMediaChangeSupport = async () => {
  return new Promise((resolve) => {
    const iframe = document.createElement("iframe");
    const video = document.createElement("video");
    const source = document.createElement("source");
    const mediaSource = new MediaSource();
    mediaSource.addEventListener("sourceopen", () => resolve(true));
    source.src = URL.createObjectURL(mediaSource);
    source.media = "(min-width:10px)";
    video.append(source);
    iframe.width = "5";
    iframe.style.cssText = `position: absolute; visibility: hidden;`;
    document.documentElement.append(iframe);
    iframe.contentDocument.body.append(video);
    setTimeout(() => { iframe.width = "15px"; });
    setTimeout(() => {
      resolve(false);
      iframe.remove();
    }, 1000);
  });
};

if( await videoMediaChangeSupport() === false ){
  customElements.define("responsive-video", ResponsiveVideo);
}
