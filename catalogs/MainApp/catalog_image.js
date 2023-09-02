const nft     = require("nft-api"),
      dialog  = require("dialog"),
      accounts = require("accounts-api");

var _nft_image_name = "nft_" + $data["image"];

let _account = {};

function on_loaded() {
    get_current_account();
}

function get_current_account() {
    if (!_account.hasOwnProperty("accounts")) {
        return accounts.get_current_account()
            .then(function( { account }) {
                return _account = JSON.parse(account);
            })
    } else {
        return Promise.resolve(_account);
    }
}

function mint_nft() {
    var message = controller.catalog().string("Are you sure to want to mint your image as NFT?");

    dialog.yes_or_no(message, { "display-unit": "S_NFT_CONFIRM" })
        .then(function() {
            _capture_nft_image();
        });
}

function on_capture_nft_image() {
    _mint_nft(_nft_image_name, $data["prompt"]);
}

function back() {
    var message = controller.catalog().string("Are you sure to want to cancel?");

    dialog.yes_or_no(message)
        .then(function() {
            controller.action("subview-back");
        });  
}

function _capture_nft_image() {
    view.object("section.nft.image").action("capture", {
        "filename": _nft_image_name,
        "script-when-done": "on_capture_nft_image"
    });
    view.object("btn.mint").action("wait");
}

function _mint_nft(name, prompt) {
    if (_account.accounts) {
        var uid = device("id");
        var title = "Imagine You are An Artist";
        var author = _account.accounts.polygon.address;
        var description = "Image generated from ImagineArtist"
        
        media("image", name, {
            "width": 512,
            "height": 512,
            "output": "base64",
            "format": "png"
        })
            .then(function(image) {
                return nft.mint_nft(uid, "", author, description, image, prompt)
            })
            .then(function({ ticket }) {
                controller.catalog().submit("subcatalog", null, "nft_progress", {
                    "ticket": ticket,
                    "image": _nft_image_name
                });
                controller.action("subview", {
                    "subview": "V_NFT_PROGRESS",
                    "target": "self"
                });
            });
    } else {
        controller.action("toast", {message: "invalid address"})
    }
}
