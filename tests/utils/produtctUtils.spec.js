import {test, expect} from '@playwright/test';
let productURL = "/products"

export class ProductUtils{

    constructor(apiContext){
        this.apiContext = apiContext
    }

    async getAllProducts(statusCode){
        let jsonResponse

        await test.step("Retrieve all products",async ()=>{
            const startTime = Date.now(); // Record the start time
            const response = await this.apiContext.get(productURL)
            const endTime = Date.now(); // Record the end time
            const responseTime = endTime - startTime; // Calculate response time

            jsonResponse = await response.json()

            expect(responseTime,`The response time is ${responseTime}`).toBeLessThan(2000); // less than 2s
            expect(response.status(),`Expect the status to be ${statusCode}`).toBe(statusCode)
        })

        return jsonResponse
    }

    async storeNewProduct(statusCode,body){
        let jsonResponse

        await test.step("Store a new product",async ()=>{
            const startTime = Date.now(); // Record the start time
            const response = await this.apiContext.post(productURL,{
                data: body
            })
            const endTime = Date.now(); // Record the end time
            const responseTime = endTime - startTime; // Calculate response time

            jsonResponse = await response.json()

            expect(responseTime,`The response time is ${responseTime}`).toBeLessThan(2000); // less than 2s
            expect(response.status(),`Expect the status to be ${statusCode}`).toBe(statusCode)
        })
        return jsonResponse
    }

    async getSpecificProduct(product_id,statusCode){
        let jsonResponse
        await test.step("Retrieve specific product",async ()=>{
            const startTime = Date.now(); // Record the start time
            const response = await this.apiContext.get(productURL+"/"+product_id)
            const endTime = Date.now(); // Record the end time
            const responseTime = endTime - startTime; // Calculate response time

            jsonResponse = await response.json()

            expect(responseTime,`The response time is ${responseTime}`).toBeLessThan(2000); // less than 2s
            expect(response.status(),`Expect the status to be ${statusCode}`).toBe(statusCode)
        })

        return jsonResponse
    }

    async updateProduct(product_id,statusCode,body){
        let jsonResponse

        await test.step("Update a product",async ()=>{
            const startTime = Date.now(); // Record the start time
            const response = await this.apiContext.put(productURL+"/"+product_id,{
                data: body
            })
            const endTime = Date.now(); // Record the end time
            const responseTime = endTime - startTime; // Calculate response time

            jsonResponse = await response.json()

            expect(responseTime,`The response time is ${responseTime}`).toBeLessThan(2000); // less than 2s
            expect(response.status(),`Expect the status to be ${statusCode}`).toBe(statusCode)
        })
        return jsonResponse
    }
    
    // Admin role is required to delete a specific product
    async deleteProduct(product_id,statusCode){
        let jsonResponse

        await test.step("Delete a product",async ()=>{
            const startTime = Date.now(); // Record the start time
            const response = await this.apiContext.delete(productURL+"/"+product_id)
            const endTime = Date.now(); // Record the end time
            const responseTime = endTime - startTime; // Calculate response time

            jsonResponse = await response.json()

            expect(responseTime,`The response time is ${responseTime}`).toBeLessThan(2000); // less than 2s
            expect(response.status(),`Expect the status to be ${statusCode}`).toBe(statusCode)
        })
        return jsonResponse
    }        
    async partiallyUpdateProduct(product_id,statusCode,body){
        let jsonResponse

        await test.step("Partially update a product",async ()=>{
            const startTime = Date.now(); // Record the start time
            const response = await this.apiContext.patch(productURL+"/"+product_id,{
                data: body
            })
            const endTime = Date.now(); // Record the end time
            const responseTime = endTime - startTime; // Calculate response time

            jsonResponse = await response.json()

            expect(responseTime,`The response time is ${responseTime}`).toBeLessThan(2000); // less than 2s
            expect(response.status(),`Expect the status to be ${statusCode}`).toBe(statusCode)
        })
        return jsonResponse
    }
    
    async getRelatedProducts(product_id,statusCode){
        let jsonResponse

        await test.step("Retrieve related products",async ()=>{
            const startTime = Date.now(); // Record the start time
            const response = await this.apiContext.get(productURL+"/"+product_id+"/related")
            const endTime = Date.now(); // Record the end time
            const responseTime = endTime - startTime; // Calculate response time

            jsonResponse = await response.json()

            expect(responseTime,`The response time is ${responseTime}`).toBeLessThan(2000); // less than 2s
            expect(response.status(),`Expect the status to be ${statusCode}`).toBe(statusCode)
        })
        return jsonResponse
    }

    async getSpecificProductsMatchingQuery(query,statusCode,{ 
        page = null 
    } = {}){
        let jsonResponse

        await test.step("Retrieve specific products matching the search query",async ()=>{
            const startTime = Date.now(); // Record the start time
            const response = await this.apiContext.get("/products/search",{
                params: {
                    q: query,
                    page:page
                }
            })
            const endTime = Date.now(); // Record the end time
            const responseTime = endTime - startTime; // Calculate response time

            jsonResponse = await response.json()

            expect(responseTime,`The response time is ${responseTime}`).toBeLessThan(2000); // less than 2s
            expect(response.status(),`Expect the status to be ${statusCode}`).toBe(statusCode)
        })
    }
}

export default ProductUtils