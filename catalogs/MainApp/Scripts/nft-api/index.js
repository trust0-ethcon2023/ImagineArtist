var module = (function() {
    const _baseurl = "https://us-central1-imagineartist2023.cloudfunctions.net/nft";

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
                console.log(response.status);
                if (response.ok) {
                    return response.json()
                        .then(function({ result }) {
                            return result;
                        });
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
        mint_nft: function(uid, title, author, description, image, prompt) {
            return new Promise(function(resolve, reject) {
                _request_api("mint", "POST", {
                    "uid": uid,
                    "author": author,
                    "name": title,
                    "prompt": prompt,
                    "image": "data:image/png;base64," + image,
                    "description": description
                })
                    .then(function(result) {
                        resolve(result);
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            });
        },

        get_ticket_status: function(uid, ticket) {
            return new Promise(function(resolve, reject) {
                _request_api("ticket", "GET", {
                    "id": ticket
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
