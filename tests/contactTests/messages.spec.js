import { test, expect, request } from '@playwright/test';

const contactURL = 'messages'
const loginURL = 'users/login'

const contactBody = {
   name : "John Doe",
   email : "john@doe.example",
   subject: "website",
   message: "Something is wrong with the website." 
}

let email = "admin@practicesoftwaretesting.com"
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

test('Send new contact message', async ({ }) => {
    const contactRequest = await apiContext.post(contactURL, {
        data: contactBody
    })

    const jsonContactRequest = await contactRequest.json()

    expect(contactRequest.ok()).toBeTruthy()
    expect(jsonContactRequest.name).toEqual(contactBody.name)
    expect(jsonContactRequest.email).toEqual(contactBody.email)
    expect(jsonContactRequest.subject).toEqual(contactBody.subject)
    expect(jsonContactRequest.message).toEqual(contactBody.message)
    expect(jsonContactRequest.status).toEqual('NEW')
    expect(jsonContactRequest.id).toEqual(expect.any(String))
    //expect(jsonContactRequest.createdAt).toEqual(expect.any(String))

})

test('Send new contact message - empty body', async ({ }) => {
    const contactRequest = await apiContext.post(contactURL, {
        data: {}
    })

    const jsonContactRequest = await contactRequest.json()

    expect(contactRequest.status()).toBe(422)

    expect(jsonContactRequest.subject).toEqual(['The subject field is required.'])
    expect(jsonContactRequest.message).toEqual(['The message field is required.'])

})

let access_token

 test(' Retrieve contact message ', async () => {

    await test.step('Login as admin', async() => {
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

    await test.step('get messages', async() => {
        const messagesRequest = await apiContext.get(contactURL,
            { 
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })

        const jsonMessagesRequest = await messagesRequest.json()

        expect(messagesRequest.ok()).toBeTruthy()
        //expect(jsonMessagesRequest).toEqual(expect.any(Array))
        expect(jsonMessagesRequest.data[0].id).toEqual(expect.any(String))
        expect(jsonMessagesRequest.data[0].name).toEqual(contactBody.name)
        expect(jsonMessagesRequest.data[0].email).toEqual(contactBody.email)
        expect(jsonMessagesRequest.data[0].subject).toEqual(contactBody.subject)
        expect(jsonMessagesRequest.data[0].message).toEqual(contactBody.message)
        expect(jsonMessagesRequest.data[0].status).toEqual('NEW')
    })

 })