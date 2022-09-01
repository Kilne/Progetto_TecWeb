document.addEventListener("DOMContentLoaded", function () {
    let modal_root = document.getElementById("project_creator");
    document.addEventListener("click", function (event) {
        let target = event.target;
        if (target.closest("#buttons_options_create")) {
            modal_root.classList.add("is-active", "is-clipped");
        }
        if (target.closest("#project_creator_modal_content_box_buttons_control_cancel")) {
            modal_root.classList.remove("is-active", "is-clipped");
        }
        target.classList.forEach(function (class_name) {
            if (class_name === "modal-close") {
                modal_root.classList.remove("is-active", "is-clipped");
            }
        });
        if (target.closest("#project_creator_modal_content_box_buttons_control_submit")) {
            project_creator();
        }
    });
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            modal_root.classList.remove("is-active", "is-clipped");
        }
    });
});
function project_creator() {
    let proceed = true;
    let name_input = document.getElementById("project_creator_modal_box_field_name_input_field").value;
    let obj_input = document.getElementById("project_creator_modal_box_field_objective_input_field").value;
    let goal_input = parseInt(document.getElementById("project_creator_modal_box_field_goal_input_field").value);
    let description_input = document.getElementById("project_creator_modal_box_field_description_input_field").value;
    let due_date_input = new Date(document.getElementById("project_creator_modal_box_field_date_input_field").value);
    if (due_date_input.getTime() < new Date(Date()).getTime()) {
        alert("Please enter a valid date.");
        proceed ? proceed = !proceed :
            document.getElementById("project_creator_modal_box_field_date_input_field").classList.add("is-danger");
    }
    if (name_input.length === 0) {
        alert("Please enter a name.");
        proceed ? proceed = !proceed :
            document.getElementById("project_creator_modal_box_field_name_input_field").classList.add("is-danger");
    }
    else if (name_input.length > 30) {
        alert("Please enter a name less than 30 characters.");
        proceed ? proceed = !proceed :
            document.getElementById("project_creator_modal_box_field_name_input_field").classList.add("is-danger");
    }
    if (goal_input <= 0 || isNaN(goal_input)) {
        alert("Please enter a goal.");
        proceed ? proceed = !proceed :
            document.getElementById("project_creator_modal_box_field_goal_input_field").classList.add("is-danger");
    }
    let new_orm = {
        "p_name": name_input,
        "obj": obj_input,
        "goal": goal_input,
        "num_steps_total": Math.floor((due_date_input.getTime() - new Date(Date()).getTime()) / (86400 * 1000)),
        "num_steps_completed": 0,
        "single_step_value": goal_input / Math.floor((due_date_input.getTime() - new Date(Date()).getTime()) / (86400 * 1000)),
        "due_date": due_date_input,
        "time_left": Math.floor((due_date_input.getTime() - new Date(Date()).getTime()) / (86400 * 1000)),
        "perc_compl": 0,
        "description": description_input,
        "p_id": Math.random().toString(16).toString()
    };
    if (proceed !== false) {
        fetch("/projects/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(new_orm),
            mode: "cors"
        }).then(r => r.json()).then(function (data) {
            if (data["data"] === true) {
                alert("Project created successfully. Refresh the page to see the new project.");
                document.getElementById("project_creator_modal_box_field_name_input_field").classList.remove("is-danger");
                document.getElementById("project_creator_modal_box_field_goal_input_field").classList.remove("is-danger");
                document.getElementById("project_creator_modal_box_field_date_input_field").classList.remove("is-danger");
                document.getElementById("project_creator_modal_box_field_objective_input_field").
                    classList.remove("is-danger");
                document.getElementById("project_creator_modal_box_field_description_input_field").
                    classList.remove("is-danger");
                name_input = "";
                obj_input = "";
                goal_input = 0;
                description_input = "";
                due_date_input = new Date();
                window.location.href = "/projects";
            }
            else {
                alert("Error creating project due to a server problem. Please try again later.");
            }
        });
    }
}
