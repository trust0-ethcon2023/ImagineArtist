const nft    = require("nft-api"),
      dialog = require("dialog");

var _transaction_id = '';

function on_loaded() {
    _update_transaction_status($data["ticket"]);
}

function back() {
    var message = controller.catalog().string("Even if you back to home, your transcation will not be canceled. Are you sure to want to go home?");

    dialog.yes_or_no(message)
        .then(function() {
            controller.action("subview-back");
        });  
}

function _update_transaction_status(ticket) {
    var uid = device("id");

    nft.get_ticket_status(uid, ticket)
        .then(function({ status, transaction_hash }) {
            console.log(status, transaction_hash);
            
            if (status === "done") {
                controller.catalog().submit("subcatalog", null, "nft_done", {
                    "ticket": ticket,
                    "transaction-hash": transaction_hash
                });
                controller.action("subview", {
                    "subview": "V_NFT_DONE",
                    "target": "self"
                });

                return;
            }

            if (status === "failed") {
                controller.catalog().submit("subcatalog", null, "nft_failed", {
                    "ticket": ticket,
                    "transaction-hash": transaction_hash
                });
                controller.action("subview", {
                    "subview": "V_NFT_FAILED",
                    "target": "self"
                });

                return;
            }

            timeout(1.0, function() {
                _update_transaction_status(ticket);
            });
        });
}
