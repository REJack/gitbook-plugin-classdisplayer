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
                    console.log(parentBlock.args[0]);
                    if (!parentBlock.args[0]) {
                        throw new Error('PHP class Displayer requires a argument as class-name');
                    }
                    var class_name = parentBlock.args[0];
                    gl_class_name = class_name;
                    var class_desc = parentBlock.body.trim();
                    var anchor = escape(class_name);
                    return '<div class="PHPclassDisplayer-class">'+
                        '<a name="'+anchor+'"></a>'+
                        '<div class="PHPcD-title">Class <b>'+escape(class_name)+'</b></div>'+
                        '<div class="PHPcD-desc">' + escape(class_desc) + '<div>' +
                    '</div>';
                }
            }
        },
        PHPconstDisplayer: {
            process: function(parentBlock) {
                var blocks = [parentBlock].concat(parentBlock.blocks);
                if (!parentBlock.args[0]) {
                    throw new Error('PHP class Displayer requires a argument as constant-name');
                }
                var const_name = parentBlock.args[0];
                var const_desc = parentBlock.body.trim();
                var anchor = escape(const_name);
                var classSwitch = '';
                if(gl_class_name !== ''){
                    anchor = escape(gl_class_name)+'::'+escape(const_name);
                    classSwitch = 'gl-';
                }
                return '<div class="PHPclassDisplayer-'+classSwitch+'const">'+
                    '<a name="'+anchor+'"></a>'+
                    '<div class="PHPcD-title"><em>constant</em> <b>'+escape(const_name)+'</b></div>'+
                    '<div class="PHPcD-desc">'+escape(const_desc)+'<div>'+
                '</div>';
            }
        },
        PHPmethodDisplayer: {
            blocks: ['param','return'],
            process: function(parentBlock) {
                var blocks = [parentBlock].concat(parentBlock.blocks);
                if (!parentBlock.args[0]) {
                    throw new Error('PHP class Displayer requires a argument as method/function-name');
                }
                var method_name = parentBlock.args[0];
                method_name = escape(method_name);
                method_name_wo_args = method_name.match(/(\w+)/);
                method_name = method_name.replace(/(\w+)/, "<b>$1</b>");
                method_name = method_name.replace(/([$]\w+)/g, "<em>$1</em>");
                var method_desc = parentBlock.body.trim();
                var method_params = '<ul>';
                var method_return;
                var param_count = 0;
                blocks.forEach(function(block, i) {
                    if(block.name == 'param'){
                        param_count++;
                        method_params += '<li>'+
                            '<b>'+escape(block.args[0])+'</b> '+
                            '(<em>'+escape(block.kwargs.type)+'</em>) '+
                            '- '+escape(block.body.trim())+
                        '</li>';
                    }else if(block.name == 'return'){
                        method_return = block.body.trim();
                    }
                });
                method_params += '</ul>';

                var classSwitch = 'function';
                var anchor = escape(method_name_wo_args[0])+'()';
                if(gl_class_name !== ''){
                    classSwitch = 'method';
                    anchor = escape(gl_class_name)+'::'+escape(method_name_wo_args)[0]+'()';
                }
                var params = '';
                if(param_count !== 0){
                    params = '<tr>' + 
                        '<td width="20%" valign="top" class="PHPcD-params-title">' + 
                            '<b>Parameters:</b>'+
                        '</td>' +
                        '<td class="PHPcD-params-list">' + 
                            method_params+
                        '</td>' +
                    '</tr>';
                }
                return '<div class="PHPclassDisplayer-'+classSwitch+'">' +
                    '<a name="'+anchor+'"></a>'+
                    '<div class="PHPcD-title">' + escape(method_name) + '</div>' +
                    '<div class="PHPcD-desc">' + escape(method_desc) + 
                        '<table>' + 
                            params +
                            '<tr>' + 
                                '<td width="20%" class="PHPcD-return-title">' + 
                                    '<b>Returns:</b>'+
                                '</td>' +
                                '<td class="PHPcD-return-text">' + 
                                    escape(method_return)+
                                '</td>' +
                            '</tr>' +
                        '</table>' +
                    '</div>' +
                '</div>';
            }
        },
    }
};