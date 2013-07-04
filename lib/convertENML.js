var htmlparser = require('htmlparser');

exports.convert = function(raw_html, callback) {
    var handler = new htmlparser.DefaultHandler(function (err, dom) {
        var resultXHTML = make_xhtml(dom);
        callback(err, resultXHTML);
    });

    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(raw_html);
};

function make_attributes(attr, invalidTag) {
    if(attr == null) return '';
    if(invalidTag == true) return '';

    var keys = Object.keys(attr);

    var resultAttribute = ' ';
    for(var i=0; i<keys.length; i++) {
        if( prohibited_attributes.indexOf(keys[i]) < 0 ) { // not found
            if ( /[a-zA-Z0-9]+/.test(keys[i]) ) { // attribute name must be english
                
                var foundInvalidateValues = false;
                for(var j=0; j<prohibited_attribute_values.length; j++) {
                    if ( attr[keys[i]].indexOf(prohibited_attribute_values[j]) >= 0 ) {
                        foundInvalidateValues = true;
                    }
                }
//                if ( keys[i].indexOf(permitted_attributes) < 0 ) {
//                    foundInvalidateValues = true;
//                }

                if( attr[keys[i]].indexOf('&amp;') < 0 ) { // not found
                    attr[keys[i]] = attr[keys[i]].replace('&', '&amp;');
                }

                // remove javascripts
                if( foundInvalidateValues == false && /^on.*/.test(keys[i]) == false) {
                    resultAttribute += keys[i] + '="' + attr[keys[i]] + '" '
                }
            }
        }
    }
    return resultAttribute;
}

function make_xhtml(dom) {
    if(dom == null) return '';

    var resultHtml = '';
    for(var i=0; i<dom.length; i++) {
        if(dom[i].hasOwnProperty('name')) {
            var tagname = dom[i].name;

            var invalidate = false;
            if( prohibited_elements.indexOf(tagname) >= 0 ) { // found
                tagname = 'div';
                invalidate = true;
            } else if( permitted_elements.indexOf(tagname) < 0 ) { // not found {
                tagname = 'div';
                invalidate = true;
            }

            resultHtml += '<' + tagname + make_attributes(dom[i].attribs, invalidate) + '>';
            resultHtml += make_xhtml(dom[i].children);
            resultHtml += '</' + tagname + '>';
        } else if( dom[i].hasOwnProperty('type') && dom[i].type == 'text' ) {
            resultHtml += dom[i].data.replace('&', '&amp;');
        }
    }
    return resultHtml;
};

var permitted_elements = [
'a'
,'abbr'
,'acronym'
,'address'
,'area'
,'b'
,'bdo'
,'big'
,'blockquote'
,'br'
,'caption'
,'center'
,'cite'
,'code'
,'col'
,'colgroup'
,'dd'
,'del'
,'dfn'
,'div'
,'dl'
,'dt'
,'em'
,'font'
,'h1'
,'h2'
,'h3'
,'h4'
,'h5'
,'h6'
,'hr'
,'i'
,'img'
,'ins'
,'kbd'
,'li'
,'map'
,'ol'
,'p'
,'pre'
,'q'
,'s'
,'samp'
,'small'
,'span'
,'strike'
,'strong'
,'sub'
,'sup'
,'table'
,'tbody'
,'td'
,'tfoot'
,'th'
,'thead'
,'title'
,'tr'
,'tt'
,'u'
,'ul'
,'var'
,'xmp'
];

var prohibited_elements = [
'applet'
,'base'
,'basefont'
,'bgsound'
,'blink'
,'body'
,'button'
,'dir'
,'embed'
,'fieldset'
,'form'
,'frame'
,'frameset'
,'head'
,'html'
,'iframe'
,'ilayer'
,'input'
,'isindex'
,'label'
,'layer'
,'legend'
,'link'
,'marquee'
,'menu'
,'meta'
,'noframes'
,'noscript'
,'object'
,'optgroup'
,'option'
,'param'
,'plaintext'
,'script'
,'select'
,'style'
,'textarea'
,'xml'
];

var permitted_attributes = [
'bgcolor'
,'text'
,'style'
,'title'
,'lang'
,'dir'
,'hash'
,'type'
,'align'
,'alt'
,'longdesc'
,'height'
,'width'
,'border'
,'hspace'
,'vspace'
,'hint'
,'cipher'
,'length'
,'checked'
,'src'
];

var prohibited_attributes = [
'id'
,'class'
,'onclick'
,'ondblclick'
,'on'
,'accesskey'
,'data'
,'dynsrc'
,'tabindex'
,'rel'
,'target'
];

var prohibited_attribute_values = [ 
'javascript'
,'vbscript'
];
