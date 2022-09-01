function buttons_op_switch() {
    let buttons_container: HTMLElement = document.getElementById("operations_result");
    let edit_button: HTMLElement = document.getElementById("edit_button");
    if (buttons_container.classList.contains("is-hidden")) {
        buttons_container.classList.remove("is-hidden");
        edit_button.setAttribute("disabled", "");
    } else {
        buttons_container.classList.add("is-hidden");
        edit_button.removeAttribute("disabled");
    }
}

window.document.addEventListener('DOMContentLoaded', function () {

    document.addEventListener('click', function (e) {

        let target: HTMLElement = e.target as HTMLElement;

        let steps_completed: HTMLElement = document.getElementById(
            "num_steps_completed").lastElementChild as HTMLElement;
        let steps_total: number = parseInt(
            document.getElementById("num_steps_total").lastElementChild.innerHTML);
        let increment: number = parseInt(steps_completed.innerHTML);
        let perc_ele: HTMLElement = document.getElementById(
            "perc_compl") as HTMLElement;
        let bar_elem: HTMLProgressElement = document.getElementById(
            "progress") as HTMLProgressElement;
        let new_perc: number = 0;


        if (target.id === "step_completed") {

            if (document.getElementById("operations_result").classList.contains("is-hidden")) {
                buttons_op_switch();
            }

            increment++;

            steps_completed.innerHTML = increment.toString();
            new_perc = Math.floor((increment / steps_total) * 100);
            perc_ele.innerHTML = new_perc.toString() + "%";
            bar_elem.value = new_perc;

        }

        if (target.id === "remove_step") {

            if (document.getElementById("operations_result").classList.contains("is-hidden")) {
                buttons_op_switch();
            }

            increment--;

            if (increment < 0) {
                increment = 0;
                steps_completed.innerHTML = increment.toString();
                perc_ele.innerHTML = "0%";
                bar_elem.value = 0;
            } else {
                steps_completed.innerHTML = increment.toString();
                new_perc = Math.floor((increment / steps_total) * 100);
                perc_ele.innerHTML = new_perc.toString() + "%";
                bar_elem.value = new_perc;
            }
        }

        if (target.closest("#buttons_options_confirm") !== null) {

            let date_arranger: string[] = document.getElementById("due_date").
            lastElementChild.innerHTML.split("/");


            let updated_project :data_orm ={
                "p_name": document.getElementById("p_name").lastElementChild.innerHTML,
                "obj": document.getElementById("obj").lastElementChild.innerHTML,
                "goal": parseInt(document.getElementById("goal").lastElementChild.innerHTML),
                "num_steps_total":steps_total,
                "num_steps_completed": parseInt(document.getElementById("num_steps_completed").
                    lastElementChild.innerHTML),
                "single_step_value": parseInt(document.getElementById("single_step_value")
                    .lastElementChild.innerHTML),
                "due_date": new Date(date_arranger[1]+"/"+date_arranger[0]+"/"+date_arranger[2]),
                "time_left": parseInt(document.getElementById("time_left").lastElementChild.innerHTML),
                "perc_compl":parseInt(
                    (document.getElementById("perc_compl").innerHTML as string).split("%")[0]),
                "description": document.getElementById("description").lastElementChild.innerHTML,
                "p_id": document.getElementById("p_id").innerHTML,


            }


            fetch("/projects/update", {
                method: "POST",
                mode: "cors",
                body: JSON.stringify({"updated_project": updated_project}),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(function (response) {
                response.json().then(data => {
                    if (data["data"] === true) {
                        alert("Project updated successfully");
                        window.location.reload();
                    } else {
                        alert("Error updating project");
                        buttons_op_switch();
                    }
                })
            })
        }

        if (target.closest("#buttons_options_refuse") !== null) {
            get_the_project()
            buttons_op_switch();
        }
    });

});