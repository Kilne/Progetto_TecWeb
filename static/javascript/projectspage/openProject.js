window.document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('click', function (e) {
        let target = e.target;
        if (target.id === "project_list_column_element_box_internal_open") {
            fetch("/projects/open", {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ "project_id": target.nextElementSibling.innerHTML })
            }).then((response) => response.json().then((data) => {
                if (data["data"] === true) {
                    window.location.href = "/projects/details";
                }
                else {
                    alert("Error opening project");
                }
            }));
        }
    });
});
