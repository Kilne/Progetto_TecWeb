let modal_container: HTMLElement = document.getElementById("modal") as HTMLElement;

function get_the_existing_project(): data_orm {

    let date_arranger: string[] = (document.getElementById("due_date").lastElementChild.innerHTML as string)
        .split("/");
    return {
        p_id: document.getElementById("p_id").innerHTML,
        p_name: document.getElementById("p_name").lastElementChild.innerHTML,
        obj: document.getElementById("obj").lastElementChild.innerHTML,
        description: document.getElementById("description").lastElementChild.innerHTML,
        due_date: new Date(date_arranger[1] + "/" + date_arranger[0] + "/" + date_arranger[2]),
        goal: parseInt(document.getElementById("goal").lastElementChild.innerHTML),
        num_steps_completed: parseInt(
            document.getElementById("num_steps_completed").lastElementChild.innerHTML),
        num_steps_total: parseInt(document.getElementById("num_steps_total").lastElementChild.innerHTML),
        perc_compl: parseInt(
            (document.getElementById("perc_compl").innerHTML as string).split("%")[0]),
        single_step_value: parseInt(document.getElementById("single_step_value").lastElementChild.innerHTML),
        time_left: parseInt(document.getElementById("time_left").lastElementChild.innerHTML),

    }


}

function get_the_new_project(): data_orm | boolean {
    let date_arranger: string[] = (
        document.getElementById("due_date_edit")as HTMLInputElement).value.split("-");

    let new_name: string = (document.getElementById("p_name_edit") as HTMLInputElement).value;

    let new_obj: string = (document.getElementById("obj_edit") as HTMLInputElement).value;

    let new_description: string = (document.getElementById("description_edit") as HTMLInputElement).value;

    let new_due_date: Date = new Date(date_arranger[0] + "/" + date_arranger[1] + "/" + date_arranger[2]);

    let new_goal: number = parseInt(
        (document.getElementById("goal_edit") as HTMLInputElement).value);

    let new_num_steps_total: number = parseInt(
        (document.getElementById("num_steps_total_edit")as HTMLInputElement).value);

    let existing_project: data_orm = get_the_existing_project();

    let wrong_input: boolean = false;

    if (new_name === "" || new_name.length > 30) {
        document.getElementById("p_name_edit").classList.add("is-danger");
        new_name = existing_project.p_name;
        wrong_input = true;
    }

    if (new_goal <= 0 || isNaN(new_goal)) {
        document.getElementById("goal_edit").classList.add("is-danger");
        new_goal = existing_project.goal;
        wrong_input = true;
    }

    if (new_due_date < existing_project.due_date) {
        document.getElementById("due_date_edit").classList.add("is-danger");
        new_due_date = existing_project.due_date;
        wrong_input = true;
    }

    if (new_num_steps_total <= 0 || isNaN(new_num_steps_total) ||
        new_num_steps_total < existing_project.num_steps_completed) {
        document.getElementById("num_steps_total_edit").classList.add("is-danger");
        new_num_steps_total = existing_project.num_steps_total;
        wrong_input = true;
    }

    if (wrong_input) {
        alert("Some fields are incorrect or incoherent with the existing project values.\n Please review your inputs.");
        return false;
    } else {

        return {
            description: new_description,
            due_date: new_due_date,
            goal: new_goal,
            num_steps_completed: existing_project.num_steps_completed,
            num_steps_total: new_num_steps_total,
            obj: new_obj,
            p_id: existing_project.p_id,
            p_name: new_name,
            perc_compl: Math.floor((existing_project.num_steps_completed / new_num_steps_total) * 100),
            single_step_value: new_goal / Math.floor(
                (new_due_date.getTime() - new Date().getTime()) / (86400 * 1000)
            ),
            time_left: Math.floor(
                (new_due_date.getTime() - new Date().getTime()) / (86400 * 1000)
            ),
        }
    }


}

function form_filler() {

    let existing_project: data_orm = get_the_existing_project();

    let date_correction: string[] = [];

    date_correction.push(existing_project.due_date.getFullYear().toString());

    if (existing_project.due_date.getMonth() < 9) {
        date_correction.push("0" + (existing_project.due_date.getMonth() + 1).toString());
    }else {
        date_correction.push((existing_project.due_date.getMonth() + 1).toString());
    }

    if (existing_project.due_date.getDate() < 10) {
        date_correction.push("0" + existing_project.due_date.getDate().toString());
    }else {
        date_correction.push(existing_project.due_date.getDate().toString());
    }

    (document.getElementById("p_name_edit") as HTMLInputElement).value = existing_project.p_name;
    (document.getElementById("obj_edit") as HTMLInputElement).value = existing_project.obj;
    (document.getElementById("description_edit") as HTMLInputElement).value = existing_project.description;
    (document.getElementById("due_date_edit") as HTMLInputElement).value = date_correction.join("-");
    (document.getElementById("goal_edit") as HTMLInputElement).value = existing_project.goal.toString();
    (document.getElementById("num_steps_total_edit") as HTMLInputElement).value =
        existing_project.num_steps_total.toString();
}

document.addEventListener("click", function (event) {
    let target: HTMLElement = event.target as HTMLElement;

    if (target.classList.contains("modal-close") ||
        target.closest("#cancel_changes")) {
        modal_container.classList.remove("is-active", "is-clipped");
    }

    if (target.closest("#edit_button")) {
        modal_container.classList.add("is-active", "is-clipped");
        form_filler();
    }

    if (target.closest("#submit_changes")) {
        let new_project: data_orm | boolean = get_the_new_project();
        if (new_project !== false) {

            fetch(
                "/projects/update",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({"updated_project":new_project}),
                    mode: "cors"
                }
            ).then((response) => response.json().then((data) => {
                if (data["data"] === true){
                    modal_container.classList.remove("is-active", "is-clipped");
                    window.location.href = "/projects/details";
                } else {
                    alert("Something went wrong. Please try again.");
                    modal_container.classList.remove("is-active", "is-clipped");
                }
            }));

        }
    }
});