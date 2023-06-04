var module = (function() {
    function _promise_callbacks(resolve, reject) {
        var unique = (Math.random() * 10000).toFixed(0)
        
        global["dialog__resolve_" + unique] = function(params) { 
            resolve(params);
    
            delete global["dialog__resolve_" + unique];
            delete global["dialog__reject_"  + unique];
        }
    
        global["dialog__reject_" + unique] = function(error) { 
            reject(error);
    
            delete global["dialog__resolve_" + unique];
            delete global["dialog__reject_"  + unique];
        }
    
        return [ "dialog__resolve_" + unique, "dialog__reject_" + unique ]
    }

    return {
        confirm: function(message, ok_label, options) {
            var display_unit = (options || {})["display-unit"] || "S_CONFIRM";

            return new Promise(function(resolve, reject) {
                var [ resolve_name, reject_name ] = _promise_callbacks(resolve, reject);

                controller.catalog().submit("showcase", "others", display_unit, {
                    "message": message,
                    "ok-label": ok_label || "",
                    "resolve": resolve_name,
                    "reject": reject_name
                });
                controller.action("bottom-sheet", { "display-unit": display_unit });
            });
        },

        yes_or_no: function(message, options) {
            var display_unit = (options || {})["display-unit"] || "S_CONFIRM";

            return new Promise(function(resolve, reject) {
                var [ resolve_name, reject_name ] = _promise_callbacks(resolve, reject);

                controller.catalog().submit("showcase", "others", display_unit, {
                    "message": message,
                    "ok-label": "Yes",
                    "cancel-label": "No",
                    "resolve": resolve_name,
                    "reject": reject_name
                });
                controller.action("bottom-sheet", { "display-unit": display_unit });
            });
        },

        error: function(title, message) {
            var display_unit = (options || {})["display-unit"] || "S_ERROR";

            controller.catalog().submit("showcase", "others", display_unit, {
                "title": title,
                "message": message
            });
            controller.action("popup", { "display-unit": display_unit });
        }
    }
})();

__MODULE__ = module;
