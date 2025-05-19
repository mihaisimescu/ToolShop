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


test.beforeAll(async () => {
    // we create a new instance of a request
    apiContext = await request.newContext()
 
})

test('Attach file to contact message', async ({ }) => {
 
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
        expect(jsonMessagesRequest.data[0].name).toEqual(expect.any(String))

        messageId = jsonMessagesRequest.data[0].id

    })

    await test.step('3. Attach file to contact message', async() => {
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
