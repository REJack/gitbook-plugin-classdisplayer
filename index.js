var escape = require('escape-html');
var markdown = require('gitbook-markdown');

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
            blocks: ['hint','param','return'],
            process: function(parentBlock) {
                var HINT_CLASSES = {
                    info:'info',
                    tip:'success',
                    danger:'danger',
                    working:'warning'
                };

                var hint_icon_info = this.config.options.pluginsConfig.phpclassdisplayer.hint_icon_info;
                var hint_icon_tip = this.config.options.pluginsConfig.phpclassdisplayer.hint_icon_tip;
                var hint_icon_danger = this.config.options.pluginsConfig.phpclassdisplayer.hint_icon_danger;
                var hint_icon_working = this.config.options.pluginsConfig.phpclassdisplayer.hint_icon_working;
                var hint_iconsize = this.config.options.pluginsConfig.phpclassdisplayer.hint_iconsize;
                var hint_iconcenter = this.config.options.pluginsConfig.phpclassdisplayer.hint_iconcenter;

                var HINT_ICONS = {
                    info: '<i class="fa fa-'+hint_icon_info+' '+hint_iconsize+'"></i>',
                    tip: '<i class="fa fa-'+hint_icon_tip+' '+hint_iconsize+'"></i>',
                    danger: '<i class="fa fa-'+hint_icon_danger+' '+hint_iconsize+'"></i>',
                    working: '<i class="fa fa-'+hint_icon_working+' '+hint_iconsize+'"></i>'
                };

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
                var method_return = '';
                var method_hint = '';
                var param_count = 0;
                blocks.forEach(function(block, i) {
                    if(block.name == 'hint'){
                        if(block.body.trim() !== ''){
                            var style = block.kwargs.style || 'info';
                            var hint_body = block.body.trim();
                            var hint_center = '';
                            if(hint_iconcenter === true){
                                hint_center = 'align="middle"';
                            }
                            hint_body = markdown.page(hint_body).content;
                            method_hint = '<div class="PHPcD-alert alert alert-'+HINT_CLASSES[style]+'">' + 
                                '<table>' + 
                                    '<tr>' + 
                                        '<td width="15%" class="PHPcD-hint-icon" '+hint_center+'>' + 
                                            '<b>'+HINT_ICONS[style]+'</b>'+
                                        '</td>' +
                                        '<td class="PHPcD-hint-text">' + 
                                            hint_body.replace(/<p>|<\/p>/gi, '')+
                                        '</td>' +
                                    '</tr>' + 
                                '</table>' +
                            '</div>';
                        }
                    }else if(block.name == 'param'){
                        if (!block.args[0]) {
                            throw new Error('`PHPmethodDisplayer` requires for `param` a argument parameter-name');
                        }
                        if (!block.kwargs.type) {
                            throw new Error('`PHPmethodDisplayer` requires for `param` a "type" property');
                        }
                        param_count++;
                        var param_body = block.body.trim();
                        param_body = markdown.page(param_body).content.replace(/<p>|<\/p>/gi, '');
                        method_params += '<li>'+
                            '<b>'+escape(block.args[0])+'</b> '+
                            '(<em>'+escape(block.kwargs.type)+'</em>) '+
                            ' - '+param_body+
                        '</li>';
                    }else if(block.name == 'return'){
                        if(block.body.trim() !== ''){
                            return_body = block.body.trim();
                            return_body = markdown.page(return_body).content.replace(/<p>|<\/p>/gi, '');
                            method_return = '<tr>' + 
                                '<td width="20%" class="PHPcD-return-title">' + 
                                    '<b>Returns:</b>'+
                                '</td>' +
                                '<td class="PHPcD-return-text">' + 
                                    return_body+
                                '</td>' +
                            '</tr>';
                        }
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
                    '<div class="PHPcD-desc">' + markdown.page(method_desc).content + 
                        '<table>' + 
                            params +
                            method_return +
                        '</table>' +
                            method_hint +

                    '</div>' +
                '</div>';
            }
        },
    }
};