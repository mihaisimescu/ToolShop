import { test, expect, request } from '@playwright/test';
import RegisterUtils from '../utils/registerUtils.spec.js';

const contactURL = '/messages'
const loginURL = '/users/login'

const contactBody = {
   name : "John Doe",
   email : "john@doe.example",
   subject: "website",
   message: "Something is wrong with the website." 
}


const updateMessageBody = {
    status: "RESOLVED"
}

let registerUtils
let email
let password 
let apiContext
let messageId
let bodyLogin


let bodyLoginAdmin ={
    email: "admin@practicesoftwaretesting.com",
    password: "welcome01"   
}        

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

 test(' Retrieve contact message - while logged as admin', async () => {

    await test.step('1. Login as admin', async() => {
        const loginRequest = await apiContext.post(loginURL, 
           { data: bodyLoginAdmin }
        )
        const jsonLoginRequest = await loginRequest.json()

        expect(loginRequest.ok()).toBeTruthy()
          
        expect(jsonLoginRequest.access_token).toEqual(expect.any(String))
    
        expect(jsonLoginRequest.token_type).toEqual(expect.any(String))
        expect(jsonLoginRequest.token_type).toEqual('bearer')
    
        expect(jsonLoginRequest.expires_in).toEqual(expect.any(Number))

        access_token = jsonLoginRequest.access_token
    })

    await test.step('2. Get messages', async() => {
        const messagesRequest = await apiContext.get(contactURL,
            { 
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })

        const jsonMessagesRequest = await messagesRequest.json()

        expect(messagesRequest.ok()).toBeTruthy()
        expect(jsonMessagesRequest.data[0].id).toEqual(expect.any(String))
        expect(jsonMessagesRequest.data[0].name).toEqual(contactBody.name)
        expect(jsonMessagesRequest.data[0].email).toEqual(contactBody.email)
        expect(jsonMessagesRequest.data[0].subject).toEqual(contactBody.subject)
        expect(jsonMessagesRequest.data[0].message).toEqual(contactBody.message)

    })

 })

 test('Retrieve contact message - Error user not logged', async () => {
    const messagesRequest = await apiContext.get(contactURL)

    const jsonMessagesRequest = await messagesRequest.json()

    expect(messagesRequest.status()).toBe(401)
    expect(jsonMessagesRequest.message).toBe("Unauthorized")  

 })

 test('Update contact message status', async () => {    

    await test.step('1. Login as admin', async() => {
            const loginRequest = await apiContext.post(loginURL, 
               { data: bodyLoginAdmin }
            )
    
            const jsonLoginRequest = await loginRequest.json()
    
            expect(loginRequest.ok()).toBeTruthy()
              
            expect(jsonLoginRequest.access_token).toEqual(expect.any(String))
        
            expect(jsonLoginRequest.token_type).toEqual(expect.any(String))
            expect(jsonLoginRequest.token_type).toEqual('bearer')
        
            expect(jsonLoginRequest.expires_in).toEqual(expect.any(Number))
    
            access_token = jsonLoginRequest.access_token
        })

    await test.step ('2. Get all contact messages', async() => {

        const messagesRequest = await apiContext.get(contactURL,
            { 
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })

        const jsonMessagesRequest = await messagesRequest.json()

        expect(messagesRequest.ok()).toBeTruthy()
        expect(jsonMessagesRequest.data[0].id).toEqual(expect.any(String))
        expect(jsonMessagesRequest.data[0].name).toEqual(contactBody.name)
        expect(jsonMessagesRequest.data[0].email).toEqual(contactBody.email)
        expect(jsonMessagesRequest.data[0].subject).toEqual(contactBody.subject)
        expect(jsonMessagesRequest.data[0].message).toEqual(contactBody.message)

        messageId = jsonMessagesRequest.data[0].id

    })


    await test.step ('3. Update contact message status', async() => {

        const updateMessageURL = `/messages/${messageId}/status`

        const updateMessageRequest = await apiContext.put(updateMessageURL, {
            headers: {
                Authorization: `Bearer ${access_token}`
            },
            data: updateMessageBody
        })
        const jsonUpdateMessageRequest = await updateMessageRequest.json()

        expect(updateMessageRequest.ok()).toBeTruthy()
        expect(updateMessageRequest.status()).toBe(200)

    })

    await test.step('4. Check message status', async() => {

        const getMessageURL = `/messages/${messageId}`

        const getMessageRequest = await apiContext.get(getMessageURL, {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })

        const jsonGetMessageRequest = await getMessageRequest.json()
        
        expect(getMessageRequest.ok()).toBeTruthy()
        expect(getMessageRequest.status()).toBe(200)

        expect(jsonGetMessageRequest.status).toEqual('RESOLVED')

    })

 })