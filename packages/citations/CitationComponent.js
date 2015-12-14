'use strict';

var AnnotationComponent = require('substance/ui/AnnotationComponent');
var Component = require('substance/ui/Component');
var $$ = Component.$$;

function CitationComponent() {
  AnnotationComponent.apply(this, arguments);

  this.props.node.connect(this, {
    "label:changed": this.onLabelChanged
  });
}

CitationComponent.Prototype = function() {

  this.dispose = function() {
    AnnotationComponent.prototype.dispose.call(this);
    this.props.node.disconnect(this);
  };

  this.render = function() {
    return $$('span')
      .addClass(this.getClassNames())
      .attr({
        "data-id": this.props.node.id,
        "data-external": 1,
        "contentEditable": false
      })
      .on('click', this.onClick)
      .on('mousedown', this.onMouseDown)
      .append(this.props.node.label || "");
  };

  this.getClassNames = function() {
    var classNames = ['sc-citation', 'sm-'+this.props.node.type];
    if (this.props.node.highlighted) {
      classNames.push('sm-highlighted');
      // classNames.push('sm-'+this.props.node.highlightedScope);
    }
    return classNames.join(' ');
  };

  this.onMouseDown = function(e) {
    e.preventDefault();
    e.stopPropagation();
    var citation = this.props.node;
    var surface = this.context.surface;
    surface.setSelection(citation.getSelection());
    var controller = this.context.controller;
    controller.emit('citation:selected', citation);
  };

  this.onClick = function(e) {
    e.preventDefault();
    e.stopPropagation();
  };

  this.onLabelChanged = function() {
    this.rerender();
  };
};

AnnotationComponent.extend(CitationComponent);

module.exports = CitationComponent;
