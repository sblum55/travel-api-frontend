const navBar = document.querySelector('.navContainer')
//Containers
const signupContainer = document.querySelector('.signupContainer')
const logInContainer = document.querySelector('.loginContainer')
const profileContainer = document.querySelector('.profileContainer')
const searchContainer = document.querySelector('.searchContainer')
const showSignUp = document.querySelector('#signupBtn')
const countryResults = document.querySelector('.countryResults')

//Form access
const signupForm = document.querySelector('#signupForm')
const loginForm = document.querySelector('#loginForm')
const searchCountry = document.querySelector('#searchCountry')

//Nav links
const homeLink = document.querySelector('#home-link')
const profileLink = document.querySelector('#profile-link')
const searchLink = document.querySelector('#search-link')
const logoutLink = document.querySelector('#logout-link')

//Server access
const url = 'http://localhost:3001/'

//Load on screen
const atHomeScreen = () => {
    logInContainer.classList.remove('hidden')
    signupContainer.classList.add('hidden')
    profileContainer.classList.add('hidden')
    searchContainer.classList.add('hidden')
}
atHomeScreen()


//Nav links
logoutLink.addEventListener('click', () => {
    localStorage.removeItem('userId')
    atHomeScreen()
})

searchLink.addEventListener('click', () => {
    console.log('clicked search link');
    searchContainer.classList.remove('hidden')
    navBar.classList.remove('hidden')
    logInContainer.classList.add('hidden')
    signupContainer.classList.add('hidden')
    profileContainer.classList.add('hidden')
})

profileLink.addEventListener('click', () => {
    profileContainer.classList.remove('hidden')
    navBar.classList.remove('hidden')
    logInContainer.classList.add('hidden')
    signupContainer.classList.add('hidden')
    searchContainer.classList.add('hidden')
})

homeLink.addEventListener('click', () => {
    atHomeScreen()
})


//Accessing visibilty to screens
// const showNav = () => {
//     navBar.classList.remove('hidden')
// }

showSignUp.addEventListener('click', (event) => {
    event.preventDefault()

    signupContainer.classList.remove('hidden')
    logInContainer.classList.add('hidden')
    profileContainer.classList.add('hidden')
    searchContainer.classList.add('hidden')
})

const showProfile = () => {
    profileContainer.classList.remove('hidden')
    navBar.classList.remove('hidden')
    logInContainer.classList.add('hidden')
    signupContainer.classList.add('hidden')
    searchContainer.classList.add('.hidden')

}

// const showSearch = () => {
//     searchContainer.classList.remove('hidden')
//     navBar.classList.remove('hidden')
//     logInContainer.classList.add('hidden')
//     signupContainer.classList.add('hidden')
//     profileContainer.classList.add('hidden')
// }

//Functions to access profile
signupForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    const name = document.querySelector('#signup-name').value
    const email = document.querySelector('#signup-email').value
    const password = document.querySelector('#signup-password').value

    try {
        const response = await axios.post(`${url}users`, {
            name: name,
            email: email,
            password: password
        })

        const userId = response.data.user.id
        console.log(userId);
        localStorage.setItem('userId', userId)
        const userName = response.data.user.name
        localStorage.setItem('userName', userName)

        showProfile()

    }catch (error) {
        console.log(error);
        alert('user already exist')
    }
})

loginForm.addEventListener('submit', async (event) => {
    console.log("it clicked");
    event.preventDefault()

    const email = document.querySelector('#login-email').value
    const password = document.querySelector('#login-password').value

    try{
        const response = await axios.post(`${url}users/login`, {
            email: email,
            password: password
        })

        console.log(response);

        const userLogin = response.data.user.id
        console.log(userLogin);
        localStorage.setItem('userLogin', userLogin)

        showProfile()

    }catch (error) {
        alert('login failed')
    }    
})

searchCountry.addEventListener('submit', async (event) => {
    console.log('you made it here');
    event.preventDefault()

    const countryName = document.querySelector('#cSearchField').value
    console.log(countryName);

    try{
        const response = await axios.get(`${url}countries/${countryName}`, {
            //'country' is the new variable we are defining from countryName and sending to backend
            country: countryName
        })
        console.log(response);

        countryResults.classList.remove('hidden')
        document.querySelector('.cName').innerHTML = `Name: ${response.data.names.name}`
        // countryResults.classList.remove('hidden')
        // document.querySelector('.language').innerHTML = `Official Language: ${repsonse.data.language[0].language}`
        // countryResults.classList.remove('hidden')
        // document.querySelector('.currency').innerHTML = `Official Currency: ${repsonse.data.currency.name}`
        // countryResults.classList.remove('hidden')
        // document.querySelector('.vaccines').innerHTML = `Vaccines to Consider: ${repsonse.data.vaccinations[0]}`
        // countryResults.classList.remove('hidden')
        // document.querySelector('.travelAdvisory').innerHTML = `Travel Advisory(s): ${repsonse.data.advise.UA.advise}`


    }catch (error) {
        console.log(error);
        alert('country not available')
    }
})