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


