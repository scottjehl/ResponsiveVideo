# ResponsiveVideo
This is a web component that makes responsive HTML video elements remain responsive after page load, you know like when someone resizes the browser, which they don't currently do by default.

Read the article https://scottjehl.com/posts/even-responsiver-video/ 

Docs are TBD here but for now, here's how you an use it. There's no API or configuration other than that.

```html
<responsive-video>
  <video controls autoplay loop>
    <source src="/sandbox/video-media/small.mp4" media="(max-width: 599px)">
    <source src="/sandbox/video-media/large.mp4">
  </video>
</responsive-video>
<script type="module" src="responsivevideo.js"></script>
```


## Known Limitations

I'll add notes here for any issues that seem relevant to mention.

### Chrome issue with setting currentTime on localhost
This is not an issue particular to this component, but it's related. In Chrome, when working in a local development environment, you might find that videos appear to lose track of their currentTime when sources swap. This problem tends to go away on a live web server with more thorough configuration, but the basic issue is that Chrome expects range reponses for video and will not let you set the currentTime on a video if the server is not configured to send those. This issue tracks the Chrome situation: https://bugs.chromium.org/p/chromium/issues/detail?id=1018533

