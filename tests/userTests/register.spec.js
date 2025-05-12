import { test, expect, request } from '@playwright/test';


const registerURL = '/users/register'
const randomNumber = Math.floor(Math.random() * 1000000) // generate a random number between 0 and 999999

let email = "simM" + randomNumber.toString() +  "@yahoo.com" // generate a random email address
let password = "Arsenal#5" + randomNumber.toString() // generate a random password

const bodyRegister = {
  first_name : "Mihai",
  last_name: "Sim",
  address : {
    street : "Bld. 15 Noiembrie ",
    city : "Sibiu",
    state : "Romania",
    country : "Romania",
    postal_code : "12345"
  },
  phone : "0987654321",
  dob : "1970-01-01",
  password : password,
  email : email
}

let apiContext

test.beforeAll(async () => {
    // we create a new instance of a request
    apiContext = await request.newContext()
})

// to use await function on test, we need to write async
test('Register new user', async ({ }) => {
    const registerRequest = await apiContext.post(registerURL,
        { data: bodyRegister }
    )

    const jsonRegisterRequest = await registerRequest.json()

    expect(registerRequest.ok()).toBeTruthy()
    expect(jsonRegisterRequest.first_name).toEqual(expect.any(String))
    expect(jsonRegisterRequest.last_name).toEqual(expect.any(String))
    expect(jsonRegisterRequest.address.street).toEqual(expect.any(String))
    expect(jsonRegisterRequest.address.city).toEqual(expect.any(String))
    expect(jsonRegisterRequest.address.state).toEqual(expect.any(String))
    expect(jsonRegisterRequest.address.country).toEqual(expect.any(String))
    expect(jsonRegisterRequest.address.postal_code).toEqual(expect.any(String))
    expect(jsonRegisterRequest.phone).toEqual(expect.any(String))
    expect(jsonRegisterRequest.dob).toEqual(expect.any(String))
    expect(jsonRegisterRequest.email).toEqual(expect.any(String))
    expect(jsonRegisterRequest.id).toEqual(expect.any(String))

})

test('Register new user - with empty first name field', async ({ }) => {
    const registerRequest = await apiContext.post(registerURL,
        {
            data:   {
                first_name : "",
                last_name: "Sim",
                address : {
                    street : "Bld. 15 Noiembrie ",
                    city : "Sibiu",
                    state : "Romania",
                    country : "Romania",
                postal_code : "12345"
            },
            phone : "0987654321",
            dob : "1970-01-01",
            password : password,
            email : email
          }
        }
    )

    const jsonRegisterRequest = await registerRequest.json()

    expect(registerRequest.status()).toBe(422)
    expect(jsonRegisterRequest.first_name).toContain("The first name field is required.")

})

test('Register new user - with empty last name field', async ({ }) => {
    const registerRequest = await apiContext.post(registerURL,
        {
            data:   {
                first_name : "Mihai",
                last_name: "",
                address : {
                    street : "Bld. 15 Noiembrie ",
                    city : "Sibiu",
                    state : "Romania",
                    country : "Romania",
                postal_code : "12345"
            },
            phone : "0987654321",
            dob : "1970-01-01",
            password : password,
            email : email
          }
        }
    )

    const jsonRegisterRequest = await registerRequest.json()

    expect(registerRequest.status()).toBe(422)
    expect(jsonRegisterRequest.last_name).toContain("The last name field is required.")

})

test('Register new user - with empty street field', async ({ }) => {
    const registerRequest = await apiContext.post(registerURL,
        {
            data:   {
                first_name : "Mihai",
                last_name: "Sim",
                address : {
                    street : "",
                    city : "Sibiu",
                    state : "Romania",
                    country : "Romania",
                postal_code : "12345"
            },
            phone : "0987654321",
            dob : "1970-01-01",
            password : password,
            email : email
          }
        }
    )

    const jsonRegisterRequest = await registerRequest.json()

    expect(registerRequest.status()).toBe(422)
    expect(jsonRegisterRequest["address.street"]).toContain("The address.street field must be a string.")

})

test('Register new user - with empty city field', async ({ }) => {
    const registerRequest = await apiContext.post(registerURL,
        {
            data:   {
                first_name : "Mihai",
                last_name: "Sim",
                address : {
                    street : "Bld. 15 Noiembrie ",
                    city : "",
                    state : "Romania",
                    country : "Romania",
                postal_code : "12345"
            },
            phone : "0987654321",
            dob : "1970-01-01",
            password : password,
            email : email
          }
        }
    )

    const jsonRegisterRequest = await registerRequest.json()

    expect(registerRequest.status()).toBe(422)
    expect(jsonRegisterRequest["address.city"]).toContain("The address.city field must be a string.")

})

test('Register new user - with empty state field', async ({ }) => {
    const registerRequest = await apiContext.post(registerURL,
        {
            data:   {
                first_name : "Mihai",
                last_name: "Sim",
                address : {
                    street : "Bld. 15 Noiembrie ",
                    city : "Sibiu",
                    state : "",
                    country : "Romania",
                postal_code : "12345"
            },
            phone : "0987654321",
            dob : "1970-01-01",
            password : password,
            email : email
          }
        }
    )

    const jsonRegisterRequest = await registerRequest.json()

    expect(registerRequest.status()).toBe(422)
    expect(jsonRegisterRequest["address.state"]).toContain("The address.state field must be a string.")

})

test('Register new user - with empty country field', async ({ }) => {
    const registerRequest = await apiContext.post(registerURL,
        {
            data:   {
                first_name : "Mihai",
                last_name: "Sim",
                address : {
                    street : "Bld. 15 Noiembrie ",
                    city : "Sibiu",
                    state : "Romania",
                    country : "",
                postal_code : "12345"
            },
            phone : "0987654321",
            dob : "1970-01-01",
            password : password,
            email : email
          }
        }
    )

    const jsonRegisterRequest = await registerRequest.json()

    expect(registerRequest.status()).toBe(422)
    expect(jsonRegisterRequest["address.country"]).toContain("The address.country field must be a string.")

})

test('Register new user - with empty postal code field', async ({ }) => {
    const registerRequest = await apiContext.post(registerURL,
        {
            data:   {
                first_name : "Mihai",
                last_name: "Sim",
                address : {
                    street : "Bld. 15 Noiembrie ",
                    city : "Sibiu",
                    state : "Romania",
                    country : "Romania",
                postal_code : ""
            },
            phone : "0987654321",
            dob : "1970-01-01",
            password : password,
            email : email
          }
        }
    )

    const jsonRegisterRequest = await registerRequest.json()

    expect(registerRequest.status()).toBe(422)
    expect(jsonRegisterRequest["address.postal_code"]).toContain("The address.postal code field must be a string.")

})

test('Register new user - with empty phone field', async ({ }) => {
    const registerRequest = await apiContext.post(registerURL,
        {
            data:   {
                first_name : "Mihai",
                last_name: "Sim",
                address : {
                    street : "Bld. 15 Noiembrie ",
                    city : "Sibiu",
                    state : "Romania",
                    country : "Romania",
                postal_code : "12345"
            },
            phone : "",
            dob : "1970-01-01",
            password : password,
            email : email
          }
        }
    )

    const jsonRegisterRequest = await registerRequest.json()

    expect(registerRequest.status()).toBe(422)
    expect(jsonRegisterRequest.phone).toContain("The phone field must be a string.")

})

test('Register new user - with empty dob field', async ({ }) => {
    const registerRequest = await apiContext.post(registerURL,
        {
            data:   {
                first_name : "Mihai",
                last_name: "Sim",
                address : {
                    street : "Bld. 15 Noiembrie ",
                    city : "Sibiu",
                    state : "Romania",
                    country : "Romania",
                postal_code : "12345"
            },
            phone : "0987654321",
            dob : "",
            password : password,
            email : email
          }
        }
    )

    const jsonRegisterRequest = await registerRequest.json()

    expect(registerRequest.status()).toBe(422)
    expect(jsonRegisterRequest.dob).toContain("The dob field must be a valid date.")

})

test('Register new user - with empty password field', async ({ }) => {
    const registerRequest = await apiContext.post(registerURL,
        {
            data:   {
                first_name : "Mihai",
                last_name: "Sim",
                address : {
                    street : "Bld. 15 Noiembrie ",
                    city : "Sibiu",
                    state : "Romania",
                    country : "Romania",
                postal_code : "12345"
            },
            phone : "0987654321",
            dob : "1970-01-01",
            password : "",
            email : email
          }
        }
    )

    const jsonRegisterRequest = await registerRequest.json()

    expect(registerRequest.status()).toBe(422)
    expect(jsonRegisterRequest.password).toContain("The password field is required.")

})

test('Register new user - with empty email field', async ({ }) => {
    const registerRequest = await apiContext.post(registerURL,
        {
            data:   {
                first_name : "Mihai",
                last_name: "Sim",
                address : {
                    street : "Bld. 15 Noiembrie ",
                    city : "Sibiu",
                    state : "Romania",
                    country : "Romania",
                postal_code : "12345"
            },
            phone : "0987654321",
            dob : "1970-01-01",
            password : password,
            email : ""
          }
        }
    )

    const jsonRegisterRequest = await registerRequest.json()

    expect(registerRequest.status()).toBe(422)
    expect(jsonRegisterRequest.email).toContain("The email field is required.")

})

