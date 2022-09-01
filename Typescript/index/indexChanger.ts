window.addEventListener("DOMContentLoaded", function () {

    let box_element: HTMLElement = document.getElementById("column_box_title");
    let buttons_zone: HTMLElement = document.getElementById("column_box_item_columns");



    fetch("/home/user",
        {
            method: "GET",
            mode: "cors",
        }
    ).then(
        response => response.json().then(
            user => {
                if (user.hasOwnProperty("username") && user["username"] !== "") {
                    box_element.innerHTML = `Welcome <strong>${user["username"]}</strong>`;
                    buttons_zone.innerHTML = "";
                    buttons_zone.innerHTML = `
                        <div id="column_box_item_columns_item_sign_up" class="column is-narrow">
                            <a
                                id="column_box_item_columns_item_button_signup"
                                class="button has-background-warning 
                                has-text-black has-text-weight-medium"
                                href="/projects">  
                                Projects page
                            </a>
                        </div>
                    `;
                }
            }
        )
    )

});