# Lens (editable edition)

This a rewrite of [Lens](http://github.com/elifesciences/lens) by [Substance](http://substance.io). It comes with a Writer component for web-based authoring and a Reader component for displaying.

*Important note: This version is not yet compatible with NLM, as we defined a new Article Format based on XML, rather then supporting NLM directly.*

# Install

Clone the repository.

```bash
$ git clone https://github.com/substance/lens.git
```

Navigate to the source directory.

```bash
$ cd lens
```

Install via npm

```bash
$ npm install
```

Start the dev server

```bash
$ npm run start
```

And navigate to [http://localhost:5000](http://localhost:5000)

# Usage from React

Lens provides simple React wrappers, for easier embedding. To embed the Writer do:

```js
var LensWriter = require('lens/ReactLensWriter');

React.createElement(LensWriter, {
  content: LENS_ARTICLE_XML,
  onSave: function(xml, cb) {
    // Save document and confirm with cb(null, )
  },
  onFileUpload(file, cb) {
    // Handle file upload
    // Store file somewhere and confirm with cb(null, 'http://url.to/file.png')
  }
});
```

And for the Reader:

```js
var LensReader = require('lens/ReactLensReader');

React.createElement(LensWriter, {
  content: LENS_ARTICLE_XML
});
```