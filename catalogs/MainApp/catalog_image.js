const nft    = require("nft-api"),
      dialog = require("dialog");

var _nft_image_name = "nft_" + $data["image"];

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
    var uid = device("id");
    var title = "Imagine You are An Artist";
    var author = "0xD3c5f6368a7bd1F9259467AC9A82654bE145bE6D";
    var description = "Image generated from AGLIPPA"
    
    media("image", name, {
        "width": 512,
        "height": 512,
        "output": "base64",
        "format": "png"
    })
        .then(function(image) {
            return nft.mint_nft(uid, title, author, description, image, prompt)
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
}
