function populate(project_details) {
    for (let projectDetailsKey in project_details) {
        switch (projectDetailsKey) {
            case "due_date":
                let date = new Date(project_details[projectDetailsKey]);
                let [year, month, day] = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
                document.getElementById(projectDetailsKey).lastElementChild.innerHTML = `${day}/${month}/${year}`;
                break;
            case "perc_compl":
                (document.getElementById("progress").setAttribute("value", String(project_details[projectDetailsKey])));
                document.getElementById("perc_compl").innerHTML =
                    project_details[projectDetailsKey].toString() + "%";
                break;
            case "p_id":
                document.getElementById("p_id").innerHTML = project_details[projectDetailsKey];
                break;
            default:
                document.getElementById(projectDetailsKey).lastElementChild.innerHTML = project_details[projectDetailsKey];
                break;
        }
    }
}
function get_the_project() {
    fetch("/projects/populate", {
        method: "GET",
        mode: "cors",
    }).then((response) => response.json().then((data) => {
        if (data["data"] !== false) {
            let project_details = data["data"];
            populate(project_details);
        }
    }));
}
window.document.addEventListener('DOMContentLoaded', function () {
    get_the_project();
});
