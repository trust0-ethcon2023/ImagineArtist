function show_transaction() {
    var url = "https://mumbai.polygonscan.com/tx/" + $data["transaction-hash"];

    controller.action("link", {
        "url": url,
        "target": "embed"
    });
}

function back() {
    controller.action("subview-back");
}
