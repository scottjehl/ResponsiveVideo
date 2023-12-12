# ResponsiveVideo
This is a web component that makes video elements reassess video sources when their media changes, which it doesn't do by default.

Read the article https://scottjehl.com/posts/even-responsiver-video/ 

Docs are TBD here but for now, here's how you an use it:

```html
<responsive-video>
  <video controls autoplay loop>
    <source src="/sandbox/video-media/small.mp4" media="(max-width: 599px)">
    <source src="/sandbox/video-media/large.mp4">
  </video>
</responsive-video>
<script type="module" src="responsivevideo.js"></script>
```


