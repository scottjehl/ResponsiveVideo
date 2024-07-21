/*
ResponsiveAudio Web Component
This makes a responsive audio element respond to source media changes too
To use: load this module in your page and wrap a responsive-audio element around your audio element
Copyright 2023 Scott Jehl, @scottjehl
MIT License
*/
class ResponsiveAudio extends HTMLElement {
	constructor() {
		super();
		this.listenedMedia = [];
		this.reloadQueued = false;
	}
	connectedCallback() {
		this.audio = this.querySelector('audio');
		this.bindMediaListeners();
	}
	disconnectedCallback() {
		this.unbindMediaListeners();
	}
	bindMediaListeners(){
		this.querySelectorAll('source').forEach(source => {
			if (source.media) {
				const mqListener = () => {
					if (source.media === this.audio.currentSrc || !this.previousSiblingIsPlaying(source, this.audio.currentSrc) && !this.reloadQueued) {
						this.reloadAudio();
					}
				};
				this.listenedMedia.push({ media: source.media, handler: mqListener });
				window.matchMedia(source.media).addEventListener("change", mqListener);
			}
		});
	}
	unbindMediaListeners(){
		this.listenedMedia.forEach(listener => {
			window.matchMedia(listener.media).removeEventListener("change", listener.handler);
		});
	}
	previousSiblingIsPlaying(elem, src) {
		let prevSibling = elem;
		while (elem.previousElementSibling) {
			if (prevSibling.src === src) {
				return true;
			}
		}
		return false;
	}
	reloadAudio(){
		this.reloadQueued = true;
		const currentTime = this.audio.currentTime;
		const playState = this.audio.playState;
		this.audio.load();
		const audioLoaded = () => {
			this.audio.playState = playState;
			this.audio.currentTime = currentTime.toString();
			this.reloadQueued = false;
			this.audio.removeEventListener("loadeddata", audioLoaded);
		};
		this.audio.addEventListener("loadeddata", audioLoaded);
	}
}

// feature test for native audio media switching media
const audioMediaChangeSupport = async () => {
	return new Promise(resolve => {
		const iframe = document.createElement("iframe");
		const audio = document.createElement("audio");
		const source = document.createElement("source");
		const mediaSource = new MediaSource();
		mediaSource.addEventListener("sourceopen", () => resolve(true));
		source.src = URL.createObjectURL(mediaSource);
		source.media = "(min-width:10px)";
		audio.append(source);
		iframe.width = "5";
		iframe.style.cssText = `position: absolute; visibility: hidden;`;
		document.documentElement.append(iframe);
		iframe.contentDocument.body.append(audio);
		setTimeout(() => { iframe.width = "15"; });
		setTimeout(() => {
			iframe.remove();
			resolve(false);
		}, 1000);
	});
};

if( await audioMediaChangeSupport() === false ){
	customElements.define("responsive-audio", ResponsiveAudio);
}
