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
        document.querySelector('.searchLanguage').innerHTML = `<b>Official Language:</b><br/> ${response.data.language[0].language}`
        
        countryResults.classList.remove('hidden')
        document.querySelector('.searchCurrency').innerHTML = `<b>Official Currency:</b><br/> ${response.data.currency.name}`
        
        countryResults.classList.remove('hidden')
        for(let i = 0; i < response.data.vaccinations.length; i++) {
            let name = response.data.vaccinations[i].name
            let message = response.data.vaccinations[i].message
            document.querySelector('.searchVaccines').innerHTML += `<b>${name}</b>- ${message}<br/>`
        }

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

//FUTURE ADD-ON
// let deleteCountry = async () => {
//     let userId = localStorage.getItem('userId')
//     let response = await axios.delete(`${url}users/${userId}/delete`)
//     console.log(response);
// }

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
            let vaccineTitle = document.createElement('p')
            let vaccines = document.createElement('ul')
            // let deleteButton = document.createElement('button')
    
            countryName.classList.add('countryName')
            countryName.innerHTML = ctry.country.name
            savedCountries.append(countryName)

            language.classList.add('language')
            language.innerHTML = `<b>Language:</b><br/> ${ctry.country.language}`
            savedCountries.append(language)

            currency.classList.add('currency')
            currency.innerHTML = `<b>Currency:</b><br/> ${ctry.country.currency && ctry.country.currency}`
            savedCountries.append(currency)

            vaccineTitle.classList.add('vaccineTitle')
            vaccineTitle.innerHTML = `<b>Vaccines to Consider<b>`
            savedCountries.append(vaccineTitle)

            vaccines.innerHTML = ''
            vaccines.classList.add('vaccines')
            ctry.vaccines.forEach(vacs => {
                let vaccine = document.createElement('li')
                vaccine.classList.add('vaccineLists')
                vaccine.innerText = `${vacs.name}- ${vacs.message}`
                vaccines.append(vaccine)
            })
            savedCountries.append(vaccines)

            // deleteButton.innerHTML = 'delete'
            // deleteButton.addEventListener('click', (event) => {
            //     event.preventDefault()
            //     deleteCountry()
            // })
            // savedCountries.append(deleteButton)

            savedCountries.classList.add('savedCountries')
            countryContainer.append(savedCountries)

        })
            
        }catch (error) {
            console.log(error);
        alert('no saved cities')
    }

}