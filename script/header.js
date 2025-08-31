let menuDisplayed = false;

const activeUser = JSON.parse(localStorage.getItem('activeUser'));
console.log(activeUser);
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

const userDetailContainer = document.querySelector('.user-detail');
