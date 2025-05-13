import { test, expect, request } from '@playwright/test';

const loginURL = 'users/login'
const favoritesURL = 'favorites'

let email = "customer@practicesoftwaretesting.com"
let password = "welcome01"


const bodyLogin ={
    email: email,
    password: password
}

let apiContext

test.beforeAll(async () => {
    // we create a new instance of a request
    apiContext = await request.newContext()
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

            expect(jsonMessagesRequest).toEqual(expect.any(Array))
            expect(jsonMessagesRequest[0].product_id).toEqual(expect.any(String))
            //console.log(jsonMessagesRequest[0].product_id)

            expect(jsonMessagesRequest[0].product.name).toEqual(expect.any(String))
            //console.log(jsonMessagesRequest[0].product.name)
    })
})

test('Get all favorites - not logged', async ({ }) => {

    const messagesRequest = await apiContext.get(favoritesURL)
    
    const jsonMessagesRequest = await messagesRequest.json()

    expect(messagesRequest.status()).toBe(401)
    expect(jsonMessagesRequest.message).toEqual("Unauthorized")

})