import {text_syntax_checker,password_syntax_checker,mail_syntax_checker} from './regcheker.js';

document.addEventListener("click", (event) => {
  const submit_button = event.target as HTMLElement;
  if (submit_button.id === "modal_signup_box_submit_field_submit_button") {
    // Bottone in loading e disabilitato
    submit_button.classList.add("disabled", "is-loading");

    // Elementi che contengono i dati dell'utente
    const email_input_value = document.getElementById(
      "modal_signup_box_email_field_email_input"
    ) as HTMLInputElement;
    const username_input_value = document.getElementById(
      "modal_signup_box_user_field_user_input"
    ) as HTMLInputElement;
    const password_input_value = document.getElementById(
      "modal_signup_box_password_field_password_input"
    ) as HTMLInputElement;

    // Elementi che contengono i contenitori dei form
    const html_email_element = document.getElementById(
      "modal_signup_box_email_field"
    ) as HTMLDivElement;
    const html_username_element = document.getElementById(
      "modal_signup_box_user_field_user"
    ) as HTMLDivElement;
    const html_password_element = document.getElementById(
      "modal_signup_box_password_field_password"
    ) as HTMLDivElement;

    // Rimuovo il danger dai campi se vi è già
    email_input_value.classList.remove("is-danger");
    username_input_value.classList.remove("is-danger");
    password_input_value.classList.remove("is-danger");

    // Rimuovo scritte di controllo
    const email_warn_element = document.getElementById(
      "email_warn"
    ) as HTMLParagraphElement;
    const username_warn_element = document.getElementById(
      "username_warn"
    ) as HTMLParagraphElement;
    const password_warn_element = document.getElementById(
      "password_warn"
    ) as HTMLParagraphElement;
    if (email_warn_element != null) {
      email_warn_element.remove();
    }
    if (username_warn_element != null) {
      username_warn_element.remove();
    }
    if (password_warn_element != null) {
      password_warn_element.remove();
    }
    // Disabilito i campi
    email_input_value.setAttribute("disabled", "");
    username_input_value.setAttribute("disabled", "");
    password_input_value.setAttribute("disabled", "");

    // Oggetto da mandare al server
    const user_data = {
      email: email_input_value.value,
      username: username_input_value.value,
      password: password_input_value.value,
    };
    // Oggetto per i checks
    const checks = {
      email_check: mail_syntax_checker(user_data.email),
      username_check: text_syntax_checker(user_data.username),
      password_check: password_syntax_checker(user_data.password),
    };

    if (
      !checks.email_check ||
      !checks.username_check ||
      !checks.password_check
    ) {
      // riattivo il bottone ed i campi
      email_input_value.removeAttribute("disabled");
      username_input_value.removeAttribute("disabled");
      password_input_value.removeAttribute("disabled");
      if (!checks.email_check) {
        const email_warn = document.createElement("p");
        email_warn.id = "email_warn";
        email_warn.textContent = "Email has invalid characters or is malformed";
        html_email_element.appendChild(email_warn);
        html_email_element.classList.add("has-text-danger");
        email_input_value.classList.add("is-danger");
      }

      if (!checks.username_check) {
        const username_warn = document.createElement("p");
        username_warn.id = "username_warn";
        username_warn.textContent =
          "Username contains invalid chars, or it is less than 3 chars";
        html_username_element.appendChild(username_warn);
        html_username_element.classList.add("has-text-danger");
        username_input_value.classList.add("is-danger");
      }

      if (!checks.password_check) {
        const password_warn = document.createElement("p");
        password_warn.id = "password_warn";
        password_warn.textContent =
          "Password contains invalid chars, or it is less than 8 chars";
        html_password_element.appendChild(password_warn);
        html_password_element.classList.add("has-text-danger");
        password_input_value.classList.add("is-danger");
      }
      alert(
        "Some fields did not pass a preliminary check, please review your data."
      );
      submit_button.classList.remove("disabled", "is-loading");
    } else {
      // Invio dati al server
      fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user_data),
      }).then((response) => {
        response.json().then((data) => {
          if (data.Response === true) {
            // Successo e redirect
            alert(
              "User created successfully, you'll be redirected to your page page after pressing ok."
            );
            window.location.href = data.Redirect;
          } else {
            // Errore riattivo i campi
            alert("User creation failed, please try again.");
            submit_button.classList.remove("disabled", "is-loading");
            email_input_value.removeAttribute("disabled");
            username_input_value.removeAttribute("disabled");
            password_input_value.removeAttribute("disabled");
            email_input_value.value = "";
            username_input_value.value = "";
            password_input_value.value = "";
          }
        });
      });
    }
  }
});
