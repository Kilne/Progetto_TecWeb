type data_orm = {
    "p_name": string,
    "obj": string,
    "goal": number,
    "num_steps_total": number,
    "num_steps_completed": number,
    "single_step_value": number,
    "due_date": Date,
    "time_left": number,
    "perc_compl": number,
    "description": string,
    "p_id": string,
}


function fetch_the_projects_data(html_element: HTMLElement) {
    fetch("/projects/data",
        {
            method: "POST",
            mode: "cors",
            body: JSON.stringify(
                {
                    "time_stamp": new Date().getTime()
                }
            ),
            headers: {
                "Content-Type": "application/json"
            }
        }
    )
        .then((response) => response.json())
        .then((data) => {

                if (data["data"] === false) {
                    document.getElementById("project_list_column").innerHTML = `
                    <div class="title is-bold has-text-dark">No projects found for now...</div>`
                } else {

                    let project_container: Array<data_orm> = [];
                    for (let i = 0; i < data["data"].length; i++) {
                        project_container.push(data["data"][i]);
                    }

                    if (project_container.length > 0) {
                        clear_the_projects_area();
                        project_element_builder(project_container, html_element);
                    }
                }
            }
        );
}

function clear_the_projects_area() {
    let html_element: HTMLElement = document.getElementById("project_list_column");
    html_element.innerHTML = "";
}

function project_element_builder(project_container: Array<data_orm>, html_element: HTMLElement) {
    for (let i = 0; i < project_container.length; i++) {
        let new_project_element: HTMLElement = document.createElement("div");
        new_project_element.setAttribute("class", "column is-narrow");
        new_project_element.setAttribute("id", "project_list_column_element");
        new_project_element.innerHTML =
            `<div id="project_list_column_element" class="column is-narrow">
                <div id="project_list_column_element_box" 
                     class="box has-text-dark has-text-weight-medium has-text-centered"
                     style="width: 300px; height: fit-content ">
                    <label id="project_list_column_element_box_label" style="visibility: hidden"> 
                    Select for delete</label>
                    <input id="project_list_column_element_box_checkbox" type="checkbox" style="visibility: hidden"/>
                    <h3 id="project_list_column_element_box_internal_title">
                        <strong>${project_container[i].p_name}</strong>
                    </h3>
                    <div id="project_list_column_element_box_internal_p_title">
                        Project completition:
                    </div>
                    <progress id="project_list_column_element_box_internal_p_bar" class="progress is is-small"
                              max="100" value="${project_container[i].perc_compl}">
                              ${project_container[i].perc_compl}
                    </progress>
                    <div id="project_list_column_element_box_internal_time_left">
                        ${project_container[i].time_left} days left
                    </div>
                    <div id="project_list_column_element_box_internal_open"
                         class="button is-black has-text-danger-light">
                        Open Project
                    </div>
                    <div id="project_list_column_element_box_internal_unique_id" style="visibility: hidden"
                    >${project_container[i].p_id}</div>
                </div>
            </div>`;
        html_element.appendChild(new_project_element);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    fetch_the_projects_data(document.getElementById("project_list_column"));
});

document.addEventListener("click", function (event) {
    let target: HTMLElement = event.target as HTMLElement;

    if (target.closest("#buttons_options_refresh") !== null) {
        fetch_the_projects_data(document.getElementById("project_list_column"));
        let notification = document.createElement("div");
        notification.setAttribute("class", "notification is-success");
        notification.innerHTML = `
        <button id="close_notify" class="delete"></button>
        The projects list has been refreshed!`;
        document.getElementsByTagName("header")[0].insertAdjacentElement("afterend", notification);
    }
});

document.addEventListener("click", function (event) {
    let target: HTMLElement = event.target as HTMLElement;
    if (target.closest("#close_notify") !== null) {
        target.parentElement.remove();
    }
});

