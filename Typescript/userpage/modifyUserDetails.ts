import {text_syntax_checker,password_syntax_checker,mail_syntax_checker} from '../login_signup/regcheker.js';

function switch_buttons_and_field(button_pressed: HTMLButtonElement, field_to_change: HTMLInputElement) {

    let buttons_for_confirm: HTMLElement = document.getElementById("confirmation_modify_buttons");

    if (buttons_for_confirm.classList.contains("is-hidden")) {
        buttons_for_confirm.classList.remove("is-hidden");
    }

    button_pressed.setAttribute("disabled", "");
    field_to_change.removeAttribute("disabled");
}

function cancel_everything() {
    let buttons_for_confirm: HTMLElement = document.getElementById("confirmation_modify_buttons");
    buttons_for_confirm.classList.add("is-hidden");

    let fields_to_change: HTMLCollectionOf<Element> = document.getElementsByClassName("input");
    for (let fieldsToChangeElement of fields_to_change) {
        (<HTMLInputElement>fieldsToChangeElement).value = "";
        fieldsToChangeElement.setAttribute("disabled", "");
    }

    document.getElementById("change_email").removeAttribute("disabled");
    document.getElementById("change_password").removeAttribute("disabled");
    document.getElementById("change_username").removeAttribute("disabled");

}

function send_modify_request() {

    let fields: HTMLCollectionOf<Element> = document.getElementsByClassName("input");

    let field_values: { [id: string]: string } = {};

    let buttons: HTMLCollectionOf<Element> = document.getElementsByClassName("button");

    let confirm_buttons: HTMLElement = document.getElementById("confirmation_modify_buttons");

    for (let field of fields) {
        if((<HTMLInputElement>field).value != "") {
            field_values[field.id.split("_")[0]] = (<HTMLInputElement>field).value;
        }
    }

    let checks_passed: { username: boolean, email: boolean, password: boolean } =
        {username: true, email: true, password: true};

    for (let fieldValuesKey in field_values) {
        switch (fieldValuesKey) {
            case "username":
                checks_passed.username = text_syntax_checker(field_values[fieldValuesKey]);
                break;
            case "email":
                checks_passed.email = mail_syntax_checker(field_values[fieldValuesKey]);
                break;
            case "password":
                checks_passed.password = password_syntax_checker(field_values[fieldValuesKey]);
                break;
        }
    }

    for (let checksPassedKey in checks_passed) {
        if (checks_passed[checksPassedKey] === false) {
            alert("Invalid " + checksPassedKey + "!");
            for (let field of fields) {
                (<HTMLInputElement>field).value = "";
                (<HTMLInputElement>field).setAttribute("disabled", "");
            }
            for (let button of buttons) {
                if (button.id === "change_" + checksPassedKey) {
                    (<HTMLButtonElement>button).removeAttribute("disabled");
                }
            }
            confirm_buttons.classList.add("is-hidden");
            return false;
        }
    }

    fetch("/user/update", {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(field_values)
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        if (data["data"] === true) {
            alert("Successfully updated!");
            cancel_everything();
            window.location.reload();
        } else {
            alert("Error during update!\n Please try again.");
            cancel_everything();
        }
    });


}

window.document.addEventListener('DOMContentLoaded', function () {

    document.addEventListener('click', function (event) {

        let target = event.target as HTMLElement;

        if (target.closest("#change_email") ||
            target.closest("#change_password") || target.closest("#change_username")) {

            switch_buttons_and_field(
                document.getElementById(target.id) as HTMLButtonElement,
                document.getElementById(target.id.split("_")[1] + "_input") as HTMLInputElement
            )
        }

        if (target.closest("#cancel_modify_button")) {
            cancel_everything();
        }

        if (target.closest("#confirm_modify_button")) {
            send_modify_request();
        }

    });


});