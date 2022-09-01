document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("click", function (event) {
    if (
      (event.target as HTMLElement).id ===
      "modal_login_box_submit_field_submit_button"
    ) {
      const data = {
        username: (
          document.getElementById(
            "modal_login_box_username_field_user_input"
          ) as HTMLInputElement
        ).value,
        password: (
          document.getElementById(
            "modal_login_box_password_field_password_input"
          ) as HTMLInputElement
        ).value,
      };

      const submit_button = document.getElementById(
        "modal_login_box_submit_field_submit_button"
      ) as HTMLButtonElement;
      submit_button.classList.add("is-loading");

      const form_user = document.getElementById(
        "modal_login_box_username_field_user_input"
      ) as HTMLElement;
      const form_password = document.getElementById(
        "modal_login_box_password_field_password_input"
      ) as HTMLElement;

      form_user.setAttribute("disabled", "");
      form_password.setAttribute("disabled", "");

      const input_user = document.getElementById(
        "modal_login_box_username_field_user_input"
      ) as HTMLInputElement;
      const input_password = document.getElementById(
        "modal_login_box_password_field_password_input"
      ) as HTMLInputElement;

      fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: JSON.stringify(data),
      })
        .then((resposne) => resposne.json())
        .then((datares) => {
          if (datares.Response != true) {
            submit_button.classList.remove("is-loading");
            form_user.removeAttribute("disabled");
            form_password.removeAttribute("disabled");
            form_user.classList.add("is-danger");
            form_password.classList.add("is-danger");
            input_user.value = "";
            input_password.value = "";
            alert("Log in has failed, please try again");
          } else {
            alert("Log in has been successful, press ok to continue");
            window.location.href = datares.Redirect;
          }
        });
    }
  });
});
