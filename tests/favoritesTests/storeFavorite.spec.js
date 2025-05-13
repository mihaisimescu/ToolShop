import { test, expect, request } from '@playwright/test';

const loginURL = 'users/login'
const favoritesURL = '${baseURL}favorites'

let email = "customer@practicesoftwaretesting.com"
let password = "welcome01"


const bodyLogin ={
    email: email,
    password: password
}

const bodyFavorite = {
    product_id: '63c4b0f1e4b0a2d3f8c5e4b0'
}

let apiContext

test.beforeAll(async () => {
    // we create a new instance of a request
    apiContext = await request.newContext()
})

let access_token

test('Store a favorite product', async ({ }) => {

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

    await test.step('Store a favorite', async() => {
            const storeFavoriteRequest = await apiContext.post(favoritesURL,
                { 
                    headers: {
                        Authorization: `Bearer ${access_token}`
                    },
                  data: bodyFavorite
                })
    
            const jsonStoreFavoriteRequest = await storeFavoriteRequest.json()

            console.log(storeFavoriteRequest.status())
    
            expect(storeFavoriteRequest.ok()).toBeTruthy()
    
            expect(jsonStoreFavoriteRequest.product_id).toEqual('63c4b0f1e4b0a2d3f8c5e4b0')
            expect(jsonStoreFavoriteRequest.user_id).toEqual(expect.any(String))
        })

})