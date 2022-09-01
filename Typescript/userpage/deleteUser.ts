window.document.addEventListener('DOMContentLoaded', function () {

    let delete_button: HTMLButtonElement = <HTMLButtonElement>document.getElementById('delete_button');

    let confirmation_buttons: HTMLElement = document.getElementById('confirmation_buttons');

    document.addEventListener('click', function (e) {

        let target = <HTMLButtonElement>e.target;

        if (target.closest('#delete_button')) {
            delete_button.setAttribute('disabled', '');
            confirmation_buttons.classList.remove('is-hidden');
        }

        if (target.closest('#cancel_button')) {
            delete_button.attributes.removeNamedItem('disabled');
            confirmation_buttons.classList.add('is-hidden');
        }

        if (target.closest('#confirm_button')) {

            fetch('/user/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify({"confirms": true})
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                if (data["data"] === true) {
                    window.location.href = '/home';
                }else {
                    delete_button.attributes.removeNamedItem('disabled');
                    confirmation_buttons.classList.add('is-hidden');
                    alert("Something went wrong,\nplease try again later");
                }
            });

        }

    });
});