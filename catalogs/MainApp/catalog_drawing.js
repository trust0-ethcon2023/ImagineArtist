const dialog = require("dialog");

var _image_name = parseInt(Math.random() * 1000000) + '.png';

function undo() {
    view.object("drawing").action("undo");
}

function redo() {
    view.object("drawing").action("redo");
}

function clear() {
    view.object("drawing").action("clear");
}

function next() {
    view.object("drawing").action("save", {
        "filename": _image_name,
        "script-when-done": "on_save_done"
    });
    view.object("btn.next").action("wait");
}

function on_save_done(params) {
    controller.catalog().submit("subcatalog", null, "prompt", {
        "image": _image_name
    });
    controller.action("subview", {
        "subview": "V_PROMPT",
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