import { test, expect, request } from '@playwright/test';
import ProductUtils from "../utils/produtctUtils.spec.js"
import RegisterUtils from '../utils/registerUtils.spec.js';

const loginURL = '/users/login'
const favoritesURL = '/favorites'

let email 
let password 
let productUtils
let registerUtils
let apiContext
let bodyLogin
let favoriteId

test.beforeAll(async () => {
    // we create a new instance of a request
    apiContext = await request.newContext()
    productUtils = new ProductUtils(apiContext)
    registerUtils = new RegisterUtils(apiContext)
    
    await registerUtils.registerUser(201)

    email = registerUtils.bodyRegister.email
    password = registerUtils.bodyRegister.password

    bodyLogin ={
        email: email,
        password: password
    }
});


let access_token
let productId

const bodyFavorite_invalid = {
    product_id: "01JV9FATSV25RCDBTPK9N0P0VQ"
};

test('Store a favorite product', async ({ }) => {

    await test.step('1. Login as user', async() => {
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

    await test.step('2. Get products', async() => {
        let productsResponse = await productUtils.getAllProducts(200)
        expect(productsResponse.data,"The response should contain the list of products").toEqual(expect.any(Array))
        expect(productsResponse.data.length,"The number of products should be greater than 0").toBeGreaterThan(0)
        productId = productsResponse.data[7].id

        })

    await test.step('3. Store a favorite', async() => {
        
        const bodyFavorite = {
            product_id: productId
        };


        const response = await apiContext.post(favoritesURL, {
            headers: {
                Authorization: `Bearer ${access_token}`
                },
              data: bodyFavorite
           
        })
        
        const jsonResponse = await response.json()
        expect(response.ok()).toBeTruthy()

    })

})

test('Store a favorite product - User not authentificated', async ({ }) => {

    const response = await apiContext.post(favoritesURL, {
        data: productId,
         })
    
    const jsonResponse = await response.json()
    expect(response.status()).toBe(401)
    expect(jsonResponse.message).toEqual(expect.any(String))
})

test('Store a favorite product - Item not found', async ({ }) => {

    await test.step('1. Login as user', async() => {
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

    await test.step('2. Store a invalid favorite', async() => {
    
        const response = await apiContext.post(favoritesURL, {
            headers: {
                Authorization: `Bearer ${access_token}`
                },

            data: bodyFavorite_invalid,
        })
    
        const jsonResponse = await response.json()

        //console.log(jsonResponse.message)
        //console.log(jsonResponse)
        expect([404, 422]).toContain(response.status());
   

        })
})

test ('Delete a favorite product', async ({ }) => {

    await test.step('1. Login as user', async() => {
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

await test.step('2. Get products', async() => {
    let productsResponse = await productUtils.getAllProducts(200)
    expect(productsResponse.data,"The response should contain the list of products").toEqual(expect.any(Array))
    expect(productsResponse.data.length,"The number of products should be greater than 0").toBeGreaterThan(0)
    favoriteId = productsResponse.data[7].id

    })

await test.step('3. Store a favorite', async() => {
    
    const bodyFavorite = {
        product_id: favoriteId
    };


    const response = await apiContext.post(favoritesURL, {
        headers: {
            Authorization: `Bearer ${access_token}`
            },
          data: bodyFavorite
       
    })
    
    const jsonResponse = await response.json()
    expect(response.ok()).toBeTruthy()

})

await test.step('4. Delete a favorite - invalid body', async() => {
    const deleteURL = `/favorites/${favoriteId}`;
    const response = await apiContext.delete(deleteURL, {   
        headers: {
            Authorization: `Bearer ${access_token}`
            }
    })

    expect(response.status()).toBe(204)

    })

})