var escape = require('escape-html');

var gl_class_name = '';

module.exports = {
    book: {
        assets: './assets',
        css: [
            'phpclassdisplayer.css'
        ]
    },
    blocks: {
        PHPclassDisplayerReset:{
            process: function(parentBlock) {
                gl_class_name = '';
                return '';
            }
        },
        PHPclassDisplayer: {
            process: function(parentBlock) {
                if(parentBlock){
                    var blocks = [parentBlock].concat(parentBlock.blocks);
                    var class_name = parentBlock.args[0];
                    gl_class_name = class_name;
                    var class_desc = parentBlock.body.trim();
                    return '<div class="PHPclassDisplayer-class">'+
                        '<a name="'+class_name+'"></a>'+
                        '<div class="PHPcD-title">Class <b>'+class_name+'</b></div>'+
                        '<div class="PHPcD-desc">' + class_desc + '<div>' +
                    '</div>';
                }
            }
        },
        PHPconstDisplayer: {
            process: function(parentBlock) {
                var blocks = [parentBlock].concat(parentBlock.blocks);
                var const_name = parentBlock.args[0];
                var const_desc = parentBlock.body.trim();
                var anchor = const_name;
                var classSwitch = '';
                if(gl_class_name !== ''){
                    anchor = gl_class_name+'::'+const_name;
                    classSwitch = 'gl-';
                }
                return '<div class="PHPclassDisplayer-'+classSwitch+'const">'+
                    '<a name="'+anchor+'"></a>'+
                    '<div class="PHPcD-title"><em>constant</em> <b>'+const_name+'</b></div>'+
                    '<div class="PHPcD-desc">'+const_desc+'<div>'+
                '</div>';
            }
        },
        PHPmethodDisplayer: {
            blocks: ['param','return'],
            process: function(parentBlock) {
                var blocks = [parentBlock].concat(parentBlock.blocks);
                var method_name = parentBlock.args[0];
                method_name_wo_args = method_name.match(/(\w+)/);
                method_name = method_name.replace(/(\w+)/, "<b>$1</b>");
                method_name = method_name.replace(/([$]\w+)/g, "<em>$1</em>");
                var method_desc = parentBlock.body.trim();
                var method_params = '<ul>';
                var method_return;
                blocks.forEach(function(block, i) {
                    if(block.name == 'param'){
                        method_params += '<li>'+
                            '<b>'+block.args[0]+'</b> '+
                            '(<em>'+block.kwargs.type+'</em>) '+
                            '- '+block.body.trim()+
                        '</li>';
                    }else if(block.name == 'return'){
                        method_return = block.body.trim();
                    }
                });
                method_params += '</ul>';

                var classSwitch = 'function';
                var anchor = method_name_wo_args[0]+'()';
                if(gl_class_name !== ''){
                    classSwitch = 'method';
                    anchor = gl_class_name+'::'+method_name_wo_args[0]+'()';
                }
                return '<div class="PHPclassDisplayer-'+classSwitch+'">' +
                    '<a name="'+anchor+'"></a>'+
                    '<div class="PHPcD-title">' + method_name + '</div>' +
                    '<div class="PHPcD-desc">' + method_desc + 
                        '<table>' + 
                            '<tr>' + 
                                '<td valign="top" class="PHPcD-params-title">' + 
                                    '<b>Parameters:</b>'+
                                '</td>' +
                                '<td class="PHPcD-params-list">' + 
                                    method_params+
                                '</td>' +
                            '</tr>' +
                            '<tr>' + 
                                '<td class="PHPcD-return-title">' + 
                                    '<b>Returns:</b>'+
                                '</td>' +
                                '<td class="PHPcD-return-text">' + 
                                    method_return+
                                '</td>' +
                            '</tr>' +
                        '</table>' +
                    '</div>' +
                '</div>';
            }
        },
    }
};