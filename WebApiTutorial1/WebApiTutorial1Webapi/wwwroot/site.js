const uri = "api/todo";
let todos = null;
function getCount(data) {
    const el = window.$("#counter");
    let name = "to-do";
    if (data) {
        if (data > 1) {
            name = "to-dos";
        }
        el.text(data + " " + name);
    } else {
        el.text(`No ${name}`);
    }
}

$(document).ready(function () {
    getData();
});

function getData() {
    window.$.ajax({
        type: "GET",
        url: uri,
        cache: false,
        success: function (data) {
            const tBody = window.$("#todos");

            window.$(tBody).empty();

            getCount(data.length);

            window.$.each(data, function (key, item) {
                const tr = window.$("<tr></tr>")
                    .append(
                        window.$("<td></td>").append(
                            window.$("<input/>", {
                                type: "checkbox",
                                disabled: true,
                                checked: item.isComplete
                            })
                        )
                    )
                    .append(window.$("<td></td>").text(item.name))
                    .append(
                        window.$("<td></td>").append(
                            window.$("<button>Edit</button>").on("click", function () {
                                editItem(item.id);
                            })
                        )
                    )
                    .append(
                        window.$("<td></td>").append(
                            window.$("<button>Delete</button>").on("click", function () {
                                deleteItem(item.id);
                            })
                        )
                    );

                tr.appendTo(tBody);
            });

            todos = data;
        }
    });
}

function addItem() {
    const item = {
        name: window.$("#add-name").val(),
        isComplete: false
    };

    window.$.ajax({
        type: "POST",
        accepts: "application/json",
        url: uri,
        contentType: "application/json",
        data: JSON.stringify(item),
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Something went wrong!");
        },
        success: function (result) {
            getData();
            window.$("#add-name").val("");
        }
    });
}

function deleteItem(id) {
    window.$.ajax({
        url: uri + "/" + id,
        type: "DELETE",
        success: function (result) {
            getData();
        }
    });
}

function editItem(id) {
    window.$.each(todos, function (key, item) {
        if (item.id === id) {
            window.$("#edit-name").val(item.name);
            window.$("#edit-id").val(item.id);
            window.$("#edit-isComplete")[0].checked = item.isComplete;
        }
    });
    window.$("#spoiler").css({ display: "block" });
}

$(".my-form").on("submit", function () {
    const item = {
        name: window.$("#edit-name").val(),
        isComplete: window.$("#edit-isComplete").is(":checked"),
        id: window.$("#edit-id").val()
    };

    window.$.ajax({
        url: uri + "/" + window.$("#edit-id").val(),
        type: "PUT",
        accepts: "application/json",
        contentType: "application/json",
        data: JSON.stringify(item),
        success: function (result) {
            getData();
        }
    });

    closeInput();
    return false;
});

function closeInput() {
    window.$("#spoiler").css({ display: "none" });
}