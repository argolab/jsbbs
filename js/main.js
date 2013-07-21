define(function(require){

    var ko = require('knockout');
    var f = require('lib');
    
    var localStorage;
    if(window.localStorage){
        localStorage = window.localStorage;
    }else{
        localStorage = {};
    }
    
    function get_tpl(tplname){
        var key = 'tpl:'+tplname;
        if(!(tplname in localStorage)){
            $.ajax('template/'+tplname+'.html',
                   {
                       dataType: 'text',
                       cache: false,
                       async: false,
                       success: function(data){
                           localStorage[tpl_key] = data;
                       }
                   });
        };
        return localStorage[tpl_key];
    }

    function new_modal(vmname, data, callback){
        require.async('vm/'+modname, function(vmc){
            var dom = $(get_tpl('template/vm/'+vmname));
            var vm = new vmc(data);
            ko.applyBindings(dom, vm);
            dom.data('vm', vm);
            callback(dom);
        });
    }

    function before_remote(){
    }

    function after_remote(br){
    }

    var urloffset = (location.protocol + "//" + location.host
                     + "/n/index.html#!").length;    

    function route_go(url){
        var i, m, mm;
        if(!url){
            url = location.href.substring(urloffset);
        }
        for(i=0; i<routes.length; ++i){
            if(m = url.match(routes[i][0])){
                mm = routes[i][1](m);
                break;
            }
        }
        if(mm){
            var br = before_remote();
            var vmc = window[mm.$name];
            vmc.async_init(mm, function(data){
                var dom = $(get_tpl('template/'+mm.$name));
                after_remote(br);
                ko.applyBindings(dom, data);
                $('#main').replaceWith(dom);
            });
        }
        else{
            console.error('Wrong Route');
        }
    }


    var routes = [
        [/^~(\w{2,20})\/(\w{2,20})\/?$/, function(match){
            return {
                $name : 'ReadVM',
                boardname : match[1],
                postid : match[2],
                tab : ''
            };
        }],
        [/^~(\w{2,20})\/([tpd])\/(\d{2,20})\/?$/, function(match){
            return {
                $name : 'ReadVM',
                boardname : match[1],
                startindex : match[3],
                tab : match[2]
            };
        }],
        [/^@(\w{2,20})\/?$/, function(match){
            return {
                $name : 'UserVM',
                userid : match[1]
            };
        }],
        [/^(allboards|admin|)\/?$/, function(match){
            return {
                $name : single_url[match[1]];
            };
        }],
        [/^profile\/(\w{2,20})\/?$/, function(match){
            return {
                $name : 'ProfileVM',
                tab : match[1]
            };
        }],
        [/^mail\/(\w{2,20})\/?$/, function(match){
            return {
                $name : 'MailVM',
                tab : '',
                mailid : match[1]
            };
        }],
        [/^mail\/l\/(\d{2,20})\/?$/, function(match){
            return {
                $name : 'MailVM',
                tab : 'l',
                startindex : match[1]
            };
        }],
    ];

    return {
        get_tpl : get_tpl,
        new_modal :  new_modal,
        route_go : route_go
    };
        
});                
