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

//Buttons
const addCtryBtn = document.querySelector('.addCountry')

let countryId = null

//Server access
const url = 'https://well-informed-traveller.herokuapp.com/'

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
const showNav = () => {
    navBar.classList.remove('hidden')
}

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
    searchContainer.classList.add('hidden')

}

// const showSearch = () => {
//     searchContainer.classList.remove('hidden')
//     navBar.classList.remove('hidden')
//     logInContainer.classList.add('hidden')
//     signupContainer.classList.add('hidden')
//     profileContainer.classList.add('hidden')
// }

//Functions to access profile

//Sign Up
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
        // console.log(userId);
        localStorage.setItem('userId', userId)
        const userName = response.data.user.name
        localStorage.setItem('userName', userName)

        showProfile()
        showNav()
        getUserLocations()

    }catch (error) {
        // console.log(error);
        alert('user already exist')
    }
})


// Log-in
loginForm.addEventListener('submit', async (event) => {
    // console.log("it clicked");
    event.preventDefault()

    const email = document.querySelector('#login-email').value
    const password = document.querySelector('#login-password').value

    try{
        const response = await axios.post(`${url}users/login`, {
            email: email,
            password: password
        })

        console.log(response);

        const userId = response.data.user.id
        // console.log(userLogin);
        localStorage.setItem('userId', userId)

        showProfile()
        showNav()
        getUserLocations()

    }catch (error) {
        alert('login failed')
    }    
})

// Search for Country
searchCountry.addEventListener('submit', async (event) => {
    // console.log('you made it here');
    event.preventDefault()

    const countryName = document.querySelector('#cSearchField').value
    console.log(countryName);

    try{
        const response = await axios.get(`${url}countries/${countryName}`, {
            //'country' is the new variable we are defining from countryName and sending to backend
            params: {
                country: countryName
            }
        })
        // console.log(response.data, 'got data');
        // console.log(Object.keys(response.data), 'these are the keys');

        countryResults.classList.remove('hidden')
        document.querySelector('.cName').innerHTML = `Name: ${response.data.names.name}`
        
        countryResults.classList.remove('hidden')
        document.querySelector('.language').innerHTML = `Official Language: ${response.data.language[0].language}`
        
        countryResults.classList.remove('hidden')
        document.querySelector('.currency').innerHTML = `Official Currency: ${response.data.currency.name}`
        
        countryResults.classList.remove('hidden')
        for(let i = 0; i < response.data.vaccinations.length; i++) {
            let name = response.data.vaccinations[i].name
            let message = response.data.vaccinations[i].message
            document.querySelector('.vaccines').innerHTML += `${name}- ${message}<br/>`
            // console.log(name, message);
        }

        // document.querySelector('.travelAdvisory').innerHTML = `Current Advisory: ${response.data.advise[0].ua.advise}`

        const getName = response.data.names.name
        console.log(getName, 'found country ID');
        countryId = getName

        document.querySelector('.saveSearch').classList.remove('hidden')

        console.log(response.data, 'main.js 198');

        addCtryBtn.addEventListener('click', () => {addCountryDb(response.data)})


    }catch (error) {
        // console.log(error);
        alert('country not available')
    }
})

// Add country to profile/db
async function addCountryDb(data) {
        console.log('it clicked');
        console.log(data, 'main.js 210');
        console.log(countryId, 'got countryId');
        try{
            let userId = localStorage.getItem('userId')
            const response = await axios.post(`${url}countries/${countryId}/${userId}`, {
                    userId: userId,
                    countryId: countryId,
                    data: data
            })
            console.log(response);
            // res.send(language, currency, vaccines, travelAdvisory)

        }catch (error) {
            console.log(error);
            alert('did not save country')
        }

        showProfile()
        getUserLocations()

}

// Get user locations
const getUserLocations = async () => {
    let userId = localStorage.getItem('userId')
    let countryContainer = document.querySelector('.profileContainer')

    for(let i = 0; i < response.data.countryId; i++) {
        const response = await axios.get(`${url}/users/${userId}/${countryId}`)
        console.log('line 245', response.data);

        let div = document.createElement('div')
        let h1 = document.createElement('h1')
        let language = document.createElement('p')
        let currency = document.createElement('p')
        let vaccines = document.createElement('li')
        let travelAdvisory = document.createElement('p')

        language.classList.add('language')
        language.innerHTML = response.data.language[0].language
        currency.classList.add('currency')
        currency.innerHTML = response.data.currency.name
        vaccines.classList.add('vaccines')
        travelAdvisory.classList.add('travelAdvisory')
        div.classList.add('singleCountry')
        h1.innerHTML = response.data.names.name
        
    }
    countryContainer.append(div)
}