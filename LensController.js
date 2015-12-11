'use strict';

var _ = require('substance/util/helpers');

var oo = require('substance/util/oo');
var omit = require('lodash/object/omit');
var Controller = require("substance/ui/Controller");
var CrossrefSearch = require('./packages/bibliography/CrossrefSearch');
var $ = require('substance/util/jquery');

// Substance is i18n ready, but by now we did not need it
// Thus, we configure I18n statically as opposed to loading
// language files for the current locale
var I18n = require('substance/ui/i18n');
I18n.instance.load(require('substance/i18n/en'));
I18n.instance.load(require('./i18n/en'));
// e.g. in german
// I18n.instance.load(require('substance/ui/i18n/de'));
// I18n.instance.load(require('./i18n/de'));

function LensController(parent, params) {
  Controller.call(this, parent, params);

  this.handleApplicationKeyCombos = this.handleApplicationKeyCombos.bind(this);

  // action handlers
  this.actions({
    "switchState": this.switchState,
    "switchContext": this.switchContext,
    "toggleBibItem": this.toggleBibItem
  });
}

LensController.Prototype = function() {
  // Extract props needed for panel parametrization
  this._panelPropsFromState = function() {
    var props = omit(this.state, 'contextId');
    props.doc = this.getDocument();
    return props;
  };

  // Action used by BibItemComponent when clicked on focus
  this.toggleBibItem = function(bibItem) {
    if (this.state.bibItemId === bibItem.id) {
      this.setState({
        contextId: 'bib-items'
      });
    } else {
      this.setState({
        contextId: 'bib-items',
        bibItemId: bibItem.id
      });
    }
  };

  // Some things should go into controller
  this.getChildContext = function() {
    var childContext = Controller.prototype.getChildContext.call(this);

    return _.extend(childContext, {
      bibSearchEngines: [new CrossrefSearch()],
      i18n: I18n.instance,
      // Used for turning embed urls to HTML content
      embedResolver: function(srcUrl, cb) {
        $.get('http://iframe.ly/api/iframely?url='+encodeURIComponent(srcUrl)+'&api_key=712fe98e864c79e054e2da')
        // $.get('http://iframely.coko.foundation/iframely?url='+encodeURIComponent(srcUrl)+'')
          .success(function(res) {
            cb(null, res.html);
          })
          .error(function(err) {
            cb(err);
          });
      }
    });
  };

  this.getInitialState = function() {
    return {'contextId': 'toc'};
  };

  // Action handlers
  // ---------------

  // handles 'switch-state'
  this.switchState = function(newState, options) {
    options = options || {};
    this.setState(newState);
    if (options.restoreSelection) {
      this.restoreSelection();
    }
  };

  // handles 'switch-context'
  this.switchContext = function(contextId, options) {
    options = options || {};
    this.setState({ contextId: contextId });
    if (options.restoreSelection) {
      this.restoreSelection();
    }
  };

  this.restoreSelection = function() {
    var surface = this.getSurface('body');
    surface.rerenderDomSelection();
  };


  this.uploadFile = function(file, cb) {
    // This is a testing implementation
    if (this.props.onUploadFile) {
      return this.props.onUploadFile(file, cb);
    } else {
      // Default file upload implementation
      // We just return a temporary objectUrl
      var fileUrl = window.URL.createObjectURL(file);
      cb(null, fileUrl);
    }
  };


  // Hande Writer state change updates
  // --------------
  //
  // Here we update highlights

  this.handleStateUpdate = function(newState) {
    // var oldState = this.state;
    var doc = this.getDocument();

    function getActiveNodes(state) {
      if (state.citationId) {
        // TODO: targets only works for figures
        // However if we click on a bib ref [1-4]
        // it would maybe be useful to show all citations that
        // reference 1,2,3, or 4.
        var citation = doc.get(state.citationId);
        if (citation) {
          return [ state.citationId ].concat(citation.targets);
        } else {
          return [];
        }
      }
      if (state.bibItemId) {
        // Get citations for a given target
        var citations = Object.keys(doc.citationsIndex.get(state.bibItemId));
        return citations;
      }
      return [];
    }

    var activeAnnos = getActiveNodes(newState);
    var contentPanel = this.refs.contentPanel;
    // contentPanel.setHighlights('bib-items', ['citation_234234']);
    // contentPanel.setHighlights('user-selections', ['user-selection_234234'], 'sm-user-selection-user1');

    // HACK: updates the highlights when state
    // transition has finished    
    // setTimeout(function() {
    //   doc.setHighlights(activeAnnos);
    // }, 0);
  };
};

oo.inherit(LensController, Controller);

module.exports = LensController;