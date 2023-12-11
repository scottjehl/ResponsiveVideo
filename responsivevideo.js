/*
ResponsiveVideo Web Component.
Copyright 2023 Scott Jehl, @scottjehl
MIT License
This makes a responsive video element reassess video sources when their media changes
To use: load this module in your page and wrap a responsive-video element around your video element

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
    const that = this;
    this.querySelectorAll('source').forEach( source => {
      if( source.media ){
        function mqListener(){
            if( source.media === video.currentSrc || !that.previousSiblingIsPlaying(source, video.currentSrc) && !that.reloadQueued ){
                that.reloadVideo();
            }
        }
        that.listenedMedia.push({media: source.media, handler: mqListener});
        window.matchMedia( source.media ).addEventListener("change", mqListener);
      }
    } );
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
    const that = this;
    const currentTime = this.video.currentTime;
    const playState = this.video.playState;
    this.video.load();
    function videoLoaded() {
        this.playState = playState;
        this.currentTime = currentTime.toString();
        that.reloadQueued = false;
        this.removeEventListener("loadeddata", videoLoaded);
    }
    this.video.addEventListener("loadeddata", videoLoaded );
  }
}

customElements.define("responsive-video", ResponsiveVideo);
