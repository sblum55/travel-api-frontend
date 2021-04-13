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
        localStorage.setItem('userId', userId)
        const userName = response.data.user.name
        localStorage.setItem('userName', userName)

        showProfile()
        showNav()
        getUserLocations()

    }catch (error) {
        alert('user already exist')
    }
})


// Log-in
loginForm.addEventListener('submit', async (event) => {
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
        localStorage.setItem('userId', userId)
        const userName = response.data.user.name
        localStorage.setItem('userName', userName)

        showProfile()
        showNav()
        getUserLocations()

    }catch (error) {
        alert('login failed')
    }    
})

// Search for Country
searchCountry.addEventListener('submit', async (event) => {
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

        countryResults.classList.remove('hidden')
        document.querySelector('.searchName').innerHTML = `${response.data.names.name}`
        
        countryResults.classList.remove('hidden')
        document.querySelector('.searchLanguage').innerHTML = `Official Language: ${response.data.language[0].language}`
        
        countryResults.classList.remove('hidden')
        document.querySelector('.searchCurrency').innerHTML = `Official Currency: ${response.data.currency.name}`
        
        countryResults.classList.remove('hidden')
        for(let i = 0; i < response.data.vaccinations.length; i++) {
            let name = response.data.vaccinations[i].name
            let message = response.data.vaccinations[i].message
            document.querySelector('.searchVaccines').innerHTML += `${name}- ${message}<br/>`
        }

        // document.querySelector('.travelAdvisory').innerHTML = `Current Advisory: ${response.data.advise.advise}`

        const getName = response.data.names.name
        countryId = getName

        document.querySelector('.saveSearch').classList.remove('hidden')

        addCtryBtn.addEventListener('click', () => {addCountryDb(response.data)})


    }catch (error) {
        alert('country not available')
    }
})

// Add country to profile/db
async function addCountryDb(data) {
        try{
            let userId = localStorage.getItem('userId')
            const response = await axios.post(`${url}countries/${countryId}/${userId}`, {
                    userId: userId,
                    countryId: countryId,
                    data: data
            })
            console.log(response);

        }catch (error) {
            console.log(error);
            alert('did not save country')
        }

        showProfile()
        getUserLocations()

}

// Get Users Saved Locations
const getUserLocations = async () => {
    let userId = localStorage.getItem('userId')
    let userName = localStorage.getItem('userName')
    let countryContainer = document.querySelector('.profileContainer')
    while(countryContainer.firstChild) {
        countryContainer.firstChild.remove()
    }
    try {
        const response = await axios.get(`${url}users/${userId}/savedCountries`)
        console.log('line 226', response.data);
        response.data.countries.forEach(ctry => {
            let savedCountries = document.createElement('div')
            let countryName = document.createElement('h2')
            let language = document.createElement('p')
            let currency = document.createElement('p')
            let vaccines = document.createElement('ul')
            // let travelAdvisory = document.createElement('p')
    
            countryName.classList.add('countryName')
            countryName.innerHTML = ctry.country.name
            savedCountries.append(countryName)

            language.classList.add('language')
            language.innerHTML = ctry.country.language
            savedCountries.append(language)

            currency.classList.add('currency')
            currency.innerHTML = ctry.country.currency && ctry.country.currency
            savedCountries.append(currency)

            vaccines.classList.add('vaccines')
            ctry.vaccines.forEach(vacs => {
                let vaccine = document.createElement('li')
                vaccine.classList.add('vaccineLists')
                vaccine.innerText = `Name: ${vacs.name}- ${vacs.message}`
                vaccines.append(vaccine)
            })
            savedCountries.append(vaccines)

            // travelAdvisory.classList.add('travelAdvisory')
            // travelAdvisory.innerHTML = ctry.names.name

            savedCountries.classList.add('savedCountries')
            countryContainer.append(savedCountries)

        })
            
        }catch (error) {
            console.log(error);
        alert('no saved cities')
    }

}