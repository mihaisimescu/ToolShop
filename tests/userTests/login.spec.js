import { test, expect, request } from '@playwright/test';

const loginURL = 'users/login'

let email = "customer@practicesoftwaretesting.com"
let password = "welcome01"
let wrongEmail = "testest"

const bodyLogin ={
    email: email,
    password: password
}

let apiContext

test.beforeAll(async () => {
    // we create a new instance of a request
    apiContext = await request.newContext()
})

// to use await function on test, we need to write async
test('Login user - valid data', async ({ }) => {
    const loginRequest = await apiContext.post(loginURL,
        { data: bodyLogin }
    )

    const jsonLoginRequest = await loginRequest.json()

    expect(loginRequest.ok()).toBeTruthy()
    console.log(jsonLoginRequest.password)
    
    expect(jsonLoginRequest.access_token).toEqual(expect.any(String))

    expect(jsonLoginRequest.token_type).toEqual(expect.any(String))
    expect(jsonLoginRequest.token_type).toEqual('bearer')

    expect(jsonLoginRequest.expires_in).toEqual(expect.any(Number))

})

test('Login user - invalid email', async () => {
    const loginRequest = await apiContext.post(loginURL, {
        data: {
            email: wrongEmail,
            password: password
        }
    })

    const jsonLoginRequest = await loginRequest.json()

    expect(loginRequest.status()).toBe(401)
    expect(jsonLoginRequest.error).toEqual(expect.any(String))
    expect(jsonLoginRequest.error).toBe("Unauthorized")
    

})

test('Login user - invalid password', async () => {
    const loginRequest = await apiContext.post(loginURL, {
        data: {
            email: email,
            password: "1"
        }
    })

    const jsonLoginRequest = await loginRequest.json()

    expect(loginRequest.status()).toBe(401)
    //console.log(`Status code is ${loginRequest.status()}`)

    expect(jsonLoginRequest.error).toEqual(expect.any(String))
    expect(jsonLoginRequest.error).toBe("Unauthorized")
    

})

test('Login user - without an email', async () => {
    const loginRequest = await apiContext.post(loginURL, {
        data: {
            email: "",
            password: password
        }
    })

    const jsonLoginRequest = await loginRequest.json()

    expect(loginRequest.status()).toBe(401)
    //console.log(`Status code is ${loginRequest.status()}`)

    expect(jsonLoginRequest.error).toEqual(expect.any(String))
    expect(jsonLoginRequest.error).toBe("Invalid login request")
    

})

test('Login user - without a password', async () => {
    const loginRequest = await apiContext.post(loginURL, {
        data: {
            email: email,
            password: ""
        }
    })

    const jsonLoginRequest = await loginRequest.json()

    expect(loginRequest.status()).toBe(401)
    //console.log(`Status code is ${loginRequest.status()}`)

    expect(jsonLoginRequest.error).toEqual(expect.any(String))
    expect(jsonLoginRequest.error).toBe("Invalid login request")
    

})