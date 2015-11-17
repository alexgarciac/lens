var _ = require('substance/util/helpers');
var $ = require('substance/util/jquery');
var PropertyAnnotation = require('substance/model/PropertyAnnotation');

var Citation = PropertyAnnotation.extend({
  name: "citation",

  properties: {
    targets: ["array", "id"],
    // volatile properties
    // label: computed dynamically
  },

  getDefaultProperties: function() {
    return {targets: []};
  },

  setLabel: function(label) {
    if (this.label !== label) {
      this.label = label;
      this.emit('label:changed');
    }
  },

  didAttach: function(doc) {
    if (!doc.isTransaction() && !doc.isClipboard()) {
      doc.getEventProxy('path').connect(this, [this.id, 'targets'], this.onTargetChange);
      // doc.getEventProxy('path').connect(this, [this.id, 'path'], this.onChange);
      this.updateCollection(doc);
    }
  },

  didDetach: function(doc) {
    // TODO: still not good...
    doc.getEventProxy('path').disconnect(this, [this.id, 'targets']);
    // doc.getEventProxy('path').disconnect(this, [this.id, 'path']);
    this.updateCollection(doc);
  },

  updateCollection: function(doc) {
    var collection = doc.getCollection(this.getItemType());
    if (collection) {
      collection.update();
    }
  },

  onTargetChange: function(change, info, doc) {
    this.updateCollection(doc);
  }

});

Citation.static.tagName = 'cite';
Citation.static.external = true;




module.exports = Citation;