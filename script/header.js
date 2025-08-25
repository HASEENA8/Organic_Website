let menuDisplayed = false;

const activeUser = JSON.parse(localStorage.getItem('activeUser'));
console.log(activeUser);

// Select the hamburger menu button (label with class ham-menu)
document.querySelector('.ham-menu').addEventListener('click', () => {
    const navBar = document.querySelector('nav');

    if (menuDisplayed) {
        navBar.style.display = "none";
        menuDisplayed = false;
    } else {
        navBar.style.display = "flex";
        menuDisplayed = true;
    }
});

// Select the user detail button (li with class user-detail)
const userDetailContainer = document.querySelector('.user-detail');
