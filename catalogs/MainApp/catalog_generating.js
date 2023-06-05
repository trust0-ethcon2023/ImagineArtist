const aglippa = require("aglippa-api"),
      dialog  = require("dialog");

var _generated_image_name = "generated_" + $data["image"];

function on_loaded() {
    _generate_image($data["image"], $data["prompt"]);
}

function regenerate() {
    _generate_image($data["image"], $data["prompt"]);
    _update_generating_progress(0.0);
    _show_generating_effect();
    _hide_regenerate_button();
    _disable_next_button();
}

function next() {
    view.object("img.generating").action("save", {
        "filename": _generated_image_name,
        "script-when-done": "on_save_generated_image"
    });
    view.object("btn.next").action("wait");
}

function on_save_generated_image() {
    controller.catalog().submit("subcatalog", null, "image", {
        "image": $data["image"],
        "prompt": $data["prompt"],
        "generated-image": _generated_image_name
    });
    controller.action("subview", {
        "subview": "V_IMAGE",
        "target": "self"
    });
}

function back() {
    var message = controller.catalog().string("Are you sure to want to cancel?");

    dialog.yes_or_no(message)
        .then(function() {
            controller.action("subview-back");
        });  
}

function _generate_image(name, prompt) {
    var uid = device("id");

    media("image", name, {
        "width": 512,
        "height": 512,
        "output": "base64",
        "format": "png"
    })
        .then(function(image) {
            return aglippa.generate_from_drawing(uid, image, prompt)
        })
        .then(function({ token }) {
            console.log(token);
            _update_generating_status(token);
        })
        .catch(function(error) {
            console.log(error);
        });
}

function _update_generating_status(token) {
    var uid = device("id");

    aglippa.get_progress(uid, token)
        .then(function({ state, "current_image": image, progress }) {
            console.log(state, progress);

            if (state === "none") {
                return Promise.reject({ status: 404 });
            }

            if (state !== "completed") {
                _update_generating_image(image);

                if (state === "progress") {
                    _update_generating_progress(progress);
                }

                timeout(1, function() {
                    _update_generating_status(token);
                })
            } else {
                _update_generating_image(image);
                _update_generating_progress(progress);
                _hide_generating_effect();
                _show_regenerate_button();
                _enable_next_button();
            }
        })
        .catch(function(error) {
            console.log(error);
        });
}

function _update_generating_image(image) {
    view.object("img.generating").property({
        "data": "data:image/png;base64," + image
    });
}

function _update_generating_progress(progress) {
    view.object("progress.generating").property({
        "progress": progress.toFixed(2)
    });
    view.object("label.progress").property({
        "text": _format_amount(progress * 100, 1) + "%"
    });
}

function _show_generating_effect() {
    view.object("effect.generating").action("load", {
        "filename": "generating_effect.sbml"
    });
    view.object("effect.generating").action("show");
}

function _hide_generating_effect() {
    view.object("effect.generating").action("hide");    
}

function _show_regenerate_button() {
    view.object("btn.regenerate").action("show");
}

function _hide_regenerate_button() {
    view.object("btn.regenerate").action("hide");
}

function _enable_next_button() {
    view.object("btn.next").property({
        "enabled": "yes"
    });
}

function _disable_next_button() {
    view.object("btn.next").property({
        "enabled": "no"
    });
}

function _format_amount(amount, digits=5) {
    var [ number, decimal ] = amount.toFixed(digits)
                                    .replace(/0+$/, "")
                                    .replace(/\.$/, ".0")
                                    .split(".");
    
    return [ number.replace(/\B(?=(\d{3})+(?!\d))/g, ","), decimal ].join(".");
}
