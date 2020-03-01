# FooPicker

### Pure JavaScript Datepicker

* Lightweight (6.2KB minified)
* Zero dependencies

![FooPicker Screenshot](https://raw.githubusercontent.com/yogasaikrishna/foopicker/master/Screenshot.png)

## Instructions

### Bower

```
npm install foopicker
```

### Other

Download the latest code and include both **foopicker.css** and **foopicker.js** in your page and then bind foopicker to an input field

```html
<input type="text" id="datepicker">
```

Add the following JavaScript code before closing the body tag

```html
<script>
  var foopicker = new FooPicker({
    id: 'datepicker'
  });
</script>
```

