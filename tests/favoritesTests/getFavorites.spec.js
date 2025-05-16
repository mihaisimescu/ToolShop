import { test, expect, request } from '@playwright/test';
import RegisterUtils from '../utils/registerUtils.spec.js';

const loginURL = '/users/login'
const favoritesURL = '/favorites'

let email 
let password
let registerUtils


let bodyLogin 

let apiContext

test.beforeAll(async () => {
    // we create a new instance of a request
    apiContext = await request.newContext()
    registerUtils = new RegisterUtils(apiContext)

    await registerUtils.registerUser(201)

    email = registerUtils.bodyRegister.email
    password = registerUtils.bodyRegister.password

    bodyLogin ={
        email: email,
        password: password
    }
})

let access_token

test('Get all favorites', async ({ }) => {

    await test.step('Login as user', async() => {
            const loginRequest = await apiContext.post(loginURL, 
               { data: bodyLogin }
            )
            const jsonLoginRequest = await loginRequest.json()

            expect(loginRequest.ok()).toBeTruthy()
              
            expect(jsonLoginRequest.access_token).toEqual(expect.any(String))
        
            expect(jsonLoginRequest.token_type).toEqual(expect.any(String))
            expect(jsonLoginRequest.token_type).toEqual('bearer')
        
            expect(jsonLoginRequest.expires_in).toEqual(expect.any(Number))
    
            access_token = jsonLoginRequest.access_token
        })

    await test.step('get favorites', async() => {
            const messagesRequest = await apiContext.get(favoritesURL,
                { 
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    }
                })
    
            const jsonMessagesRequest = await messagesRequest.json()

            expect(messagesRequest.ok()).toBeTruthy()
            expect(messagesRequest.status()).toBe(200)

    })


})

test('Get all favorites - not logged', async ({ }) => {

    const messagesRequest = await apiContext.get(favoritesURL)
    
    const jsonMessagesRequest = await messagesRequest.json()

    expect(messagesRequest.status()).toBe(401)
    expect(jsonMessagesRequest.message).toEqual("Unauthorized")

})