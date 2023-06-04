const dialog = require("dialog");

function next() {
    controller.catalog().submit("subcatalog", null, "generating", {
        "image": $data["image"],
        "prompt": view.object("prompt").value()
    });
    controller.action("subview", {
        "subview": "V_GENERATING",
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
