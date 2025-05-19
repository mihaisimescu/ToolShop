import { test, expect, request } from '@playwright/test';
import fs from 'fs';

const loginURL = '/users/login'
const contactURL = '/messages'
let apiContext;
let access_token;
let messageId;

let bodyLoginAdmin ={
    email: "admin@practicesoftwaretesting.com",
    password: "welcome01"   
} 

const contactBody = {
    name : "John Doe",
    email : "john@doe.example",
    subject: "website",
    message: "Something is wrong with the website." 
 }


test.beforeAll(async () => {
    // we create a new instance of a request
    apiContext = await request.newContext()
 
})

test('Attach file to contact message', async ({ }) => {
    
    await test.step('1. Send new contact message', async() => {

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


    })


    await test.step('2. Login as admin', async() => {
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

    await test.step('3. Get messages', async() => {
        const messagesRequest = await apiContext.get(contactURL,
            { 
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })

        const jsonMessagesRequest = await messagesRequest.json()

        expect(messagesRequest.ok()).toBeTruthy()
        expect(jsonMessagesRequest.data[0].id).toEqual(expect.any(String))
        expect(jsonMessagesRequest.data[0].name).toEqual(expect.any(String))

        messageId = jsonMessagesRequest.data[0].id

    })

    await test.step('4. Attach file to contact message', async() => {
        // Prepare the file to attach
    const attachFileURL = `/messages/${messageId}/attach-file`;
    const filePath = 'c:/Training/Proiecte_Playwright/ToolShop/tests/sample.txt';
    const fileBuffer = fs.readFileSync(filePath);

    // Send the POST request to attach the file
    const response = await apiContext.post(attachFileURL, {
        multipart: {
            file: {
                name: 'sample.txt',
                mimeType: 'text/plain',
                buffer: fileBuffer
            }
        }
    });

    // Validate the response
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const jsonResponse = await response.json();
    expect(jsonResponse.success).toEqual(true);


    })


})
