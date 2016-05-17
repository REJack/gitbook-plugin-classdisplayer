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
                    if (!parentBlock.args[0]) {
                        throw new Error('`PHPclassDisplayer` requires a argument as class-name');
                    }
                    var class_name = parentBlock.args[0];
                    gl_class_name = class_name;
                    var class_desc = parentBlock.body.trim();
	                var anchor_body = '';
	                if(this.config.options.pluginsConfig.phpclassdisplayer.anchors === true){
	                    anchor_body = '<a name="'+escape(class_name)+'"></a>';
	                }
                    return '<div class="PHPclassDisplayer-class">'+
                        anchor_body+
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
                    throw new Error('`PHPconstDisplayer` requires a argument as constant-name');
                }
                var const_name = parentBlock.args[0];
                var const_desc = parentBlock.body.trim();
                var anchor = escape(const_name);
                var classSwitch = '';
                var scope = this.config.options.pluginsConfig.phpclassdisplayer.scope;
                if(gl_class_name !== ''){
                    anchor = escape(gl_class_name)+scope+escape(const_name);
                    classSwitch = 'gl-';
                }
                var anchor_body = '';
                if(this.config.options.pluginsConfig.phpclassdisplayer.anchors === true){
                    anchor_body = '<a name="'+anchor+'"></a>';
                }
                return '<div class="PHPclassDisplayer-'+classSwitch+'const">'+
                	anchor_body+
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
                    throw new Error('`PHPmethodDisplayer` requires a argument as method/function-name');
                }
                var method_name = parentBlock.args[0];
                method_name = escape(method_name);
                method_name_wo_args = method_name.match(/(\w+)/);
                method_name = method_name.replace(/(\w+)/, "<b>"+escape("$1")+"</b>");
                method_name = method_name.replace(/([$]\w+)/g, "<em>"+escape("$1")+"</em>");
                var method_desc = parentBlock.body.trim();
                var method_params = '<ul>';
                var method_return;
                var param_count = 0;
                blocks.forEach(function(block, i) {
                    if(block.name == 'param'){
                        if (!block.args[0]) {
                            throw new Error('`PHPmethodDisplayer` requires for `param` a argument parameter-name');
                        }
                        if (!block.kwargs.type) {
                            throw new Error('`PHPmethodDisplayer` requires for `param` a "type" property');
                        }
                        param_count++;
                        var param_body = '';
                        if (block.body.trim() !== '') {
                            param_body = '- '+escape(block.body.trim());
                        }
                        method_params += '<li>'+
                            '<b>'+escape(block.args[0])+'</b> '+
                            '(<em>'+escape(block.kwargs.type)+'</em>) '+
                            param_body+
                        '</li>';
                    }else if(block.name == 'return'){
                        method_return = block.body.trim();
                    }
                });
                method_params += '</ul>';

                var classSwitch = 'function';
                var anchor = escape(method_name_wo_args[0])+'()';
                var scope = this.config.options.pluginsConfig.phpclassdisplayer.scope;
                if(gl_class_name !== ''){
                    classSwitch = 'method';
                    anchor = escape(gl_class_name)+scope+escape(method_name_wo_args[0])+'()';
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
                var anchor_body = '';
                if(this.config.options.pluginsConfig.phpclassdisplayer.anchors === true){
                    anchor_body = '<a name="'+anchor+'"></a>';
                }
                return '<div class="PHPclassDisplayer-'+classSwitch+'">' +
                    anchor_body+
                    '<div class="PHPcD-title">' + method_name + '</div>' +
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