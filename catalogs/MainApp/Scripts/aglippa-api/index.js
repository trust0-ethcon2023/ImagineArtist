var module = (function() {
    const _baseurl = "http://0.0.0.0:8888/api/v1/stablediffusion"; // API can not be public yet

    function _request_api(path, method, params) {
        var url = path ? _baseurl + "/" + path : _baseurl;
        var options = { "includes-session-headers": true }

        return Promise.resolve(method.toUpperCase())
            .then(function(method) {
                if (method === "GET") {
                   return fetch(params ? url + "?" + _build_query(params) : url, { 
                        method: method
                    }, options);
                } else {
                    return fetch(url, { 
                        method: method, 
                        body: JSON.stringify(params || {}),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }, options);
                }
            })
            .then(function(response) {
                if (response.ok) {
                    return response.json();
                } else {
                    return Promise.reject({ "status": response.status });
                }
            });
    }

    function _build_query(params) {
        var query = "";

        for (var key in params) {
            query += (query.length > 0) ? "&" : "";
            query += key + "=" + encodeURIComponent(params[key]);
        }
    
        return query;
    }


    return {
        generate_from_drawing: function(uid, image, prompt) {
            return new Promise(function(resolve, reject) {
                _request_api("hand2img", "POST", {
                    "uid": uid,
                    "params": {
                        "image": image,
                        "prompt": prompt
                    }
                })
                    .then(function(result) {
                        resolve(result);
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            });
        },

        get_progress: function(uid, token) {
            return new Promise(function(resolve, reject) {
                _request_api("progress", "GET", {
                    "uid": uid,
                    "token": token
                })
                    .then(function(result) {
                        resolve(result);
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            });
        }
    }
})();

__MODULE__ = module;
