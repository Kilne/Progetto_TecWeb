function radio_and_buttons_enable() {
    document.getElementById("buttons_options_confirm").setAttribute("style", "visibility: visible");
    document.getElementById("buttons_options_refuse").setAttribute("style", "visibility: visible");
    for (let elementsByClassNameElement of document.getElementsByTagName("input")) {
        if (elementsByClassNameElement.id === "project_list_column_element_box_checkbox") {
            elementsByClassNameElement.style.visibility = "visible";
        }
    }
    for (let elementsByTagNameElement of document.getElementsByTagName("label")) {
        if (elementsByTagNameElement.id === "project_list_column_element_box_label") {
            elementsByTagNameElement.style.visibility = "visible";
        }
    }
    document.getElementById("buttons_options_create").setAttribute("disabled", "");
    document.getElementById("buttons_options_refresh").setAttribute("disabled", "");
    document.getElementById("buttons_options_delete").setAttribute("disabled", "");
}
function radio_and_buttons_disable() {
    document.getElementById("buttons_options_confirm").setAttribute("style", "visibility: hidden");
    document.getElementById("buttons_options_refuse").setAttribute("style", "visibility: hidden");
    for (let elementsByClassNameElement of document.getElementsByTagName("input")) {
        if (elementsByClassNameElement.id === "project_list_column_element_box_checkbox") {
            elementsByClassNameElement.style.visibility = "hidden";
        }
    }
    for (let elementsByTagNameElement of document.getElementsByTagName("label")) {
        if (elementsByTagNameElement.id === "project_list_column_element_box_label") {
            elementsByTagNameElement.style.visibility = "hidden";
        }
    }
    document.getElementById("buttons_options_create").removeAttribute("disabled");
    document.getElementById("buttons_options_refresh").removeAttribute("disabled");
    document.getElementById("buttons_options_delete").removeAttribute("disabled");
}
document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function (event) {
        let target = event.target;
        if (target.closest("#buttons_options_delete")) {
            radio_and_buttons_enable();
        }
    });
});
document.addEventListener("click", function (event) {
    let target = event.target;
    let project_id = [];
    if (target.closest("#buttons_options_confirm")) {
        let collected_checkboxes = [];
        for (let elements of document.getElementsByTagName("input")) {
            if (elements.id === "project_list_column_element_box_checkbox" && elements.checked) {
                collected_checkboxes.push(elements);
                let next_cyle = elements;
                while (next_cyle.nextElementSibling != null) {
                    next_cyle = next_cyle.nextElementSibling;
                    if (next_cyle.id === "project_list_column_element_box_internal_unique_id") {
                        project_id.push(next_cyle.innerHTML);
                        break;
                    }
                }
            }
        }
        if (collected_checkboxes.length > 0) {
            fetch("/projects/delete", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "project_id": project_id
                }),
                mode: "cors"
            }).then((response) => response.json().then((data) => {
                if (data.hasOwnProperty("data")) {
                    if (data["data"] === true) {
                        for (let element of collected_checkboxes) {
                            element.parentElement.parentElement.remove();
                        }
                        radio_and_buttons_disable();
                    }
                    else {
                        alert("Error while deleting projects");
                        radio_and_buttons_disable();
                    }
                }
                else if (data.hasOwnProperty("partial")) {
                    alert("Not all projects have been deleted");
                    radio_and_buttons_disable();
                }
            }));
        }
        else {
            alert("No project selected");
            radio_and_buttons_disable();
        }
    }
});
document.addEventListener("click", function (event) {
    let target = event.target;
    if (target.closest("#buttons_options_refuse")) {
        radio_and_buttons_disable();
    }
});
