'use strict';

var postcss = require('postcss');

module.exports = postcss.plugin('postcss-colors-only', function (options) {
    var extractor = require('css-color-extractor');

    function transformProperty(decl, colors) {
        var propertyTransformers = {
            background:      'background-color',
            border:          'border-color',
            'border-top':    'border-top-color',
            'border-right':  'border-right-color',
            'border-bottom': 'border-bottom-color',
            'border-left':   'border-left-color',
            outline:         'outline-color'
        };

        if (typeof propertyTransformers[decl.prop] === 'undefined') {
            return;
        }

        if (colors.length === 1) {
            decl.prop = propertyTransformers[decl.prop];
            decl.value = colors[0];
        }
    }

    function processDecl(decl) {
        var colors = extractor.fromDecl(decl, options);

        if (colors.length === 0) {
            decl.remove();
        } else {
            transformProperty(decl, colors);
        }
    }

    function processRule(rule) {
        rule.each(processDecl);

        if (rule.nodes.length === 0) {
            rule.remove();
        }
    }

    function processAtrule(atrule) {
        switch (atrule.name) {
            case 'media':
                atrule.each(processNode);

                if (atrule.nodes.length === 0) {
                    atrule.remove();
                }

                break;
            // @TODO deal with other types of atrules
            default:
                atrule.remove();
                break;
        }
    }

    function processNode(node) {
        switch (node.type) {
            case 'atrule':
                processAtrule(node);
                break;
            case 'rule':
                processRule(node);
                break;
            default:
                node.remove();
                break;
        }
    }

    return function (css) {
        css.each(processNode);
    };
});
