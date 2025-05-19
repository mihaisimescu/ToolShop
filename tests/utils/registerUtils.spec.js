import { test, expect} from '@playwright/test';
import 'dotenv/config';

const randomNumber = Math.floor(Math.random() * 1000000);
let email = `simM${randomNumber}${process.env.EMAIL}`;//process.env.EMAIL
let password = `${process.env.PASSWORD}${randomNumber}`;//process.env.PASSWORD

let counter = 0;

const bodyRegister = {
    first_name: "John",
    last_name: "Doe",
    address: {
        street: "Street 1",
        city: "City",
        state: "State",
        country: "Country",
        postal_code: "1234AA"
    },
    phone: "0987654321",
    dob: "1970-01-01",
    password: password,
    email: email
}

const bodyRegisterNoFirstName = {
    first_name: "",
    last_name: "Doe",
    address: {
        street: "Street 1",
        city: "City",
        state: "State",
        country: "Country",
        postal_code: "1234AA"
    },
    phone: "0987654321",
    dob: "1970-01-01",
    password: password,
    email: email
}

const bodyRegisterNoLastName = {
    first_name: "John",
    last_name: "",
    address: {
        street: "Street 1",
        city: "City",
        state: "State",
        country: "Country",
        postal_code: "1234AA"
    },
    phone: "0987654321",
    dob: "1970-01-01",
    password: password,
    email: email
}

const bodyRegisterNoStreetName = {
    first_name: "John",
    last_name: "Doe",
    address: {
        street: "",
        city: "City",
        state: "State",
        country: "Country",
        postal_code: "1234AA"
    },
    phone: "0987654321",
    dob: "1970-01-01",
    password: password,
    email: email
}

const bodyRegisterNoCityName = {
    first_name: "John",
    last_name: "Doe",
    address: {
        street: "Street 1",
        city: "",
        state: "State",
        country: "Country",
        postal_code: "1234AA"
    },
    phone: "0987654321",
    dob: "1970-01-01",
    password: password,
    email: email
}

const bodyRegisterNoStateName = {
    first_name: "John",
    last_name: "Doe",
    address: {
        street: "Street 1",
        city: "City",
        state: "",
        country: "Country",
        postal_code: "1234AA"
    },
    phone: "0987654321",
    dob: "1970-01-01",
    password: password,
    email: email
}

const bodyRegisterNoCountryName = {
    first_name: "John",
    last_name: "Doe",
    address: {
        street: "Street 1",
        city: "City",
        state: "State",
        country: "",
        postal_code: "1234AA"
    },
    phone: "0987654321",
    dob: "1970-01-01",
    password: password,
    email: email
}
const bodyRegisterNoPhoneNumber = {
    first_name: "John",
    last_name: "Doe",
    address: {
        street: "Street 1",
        city: "City",
        state: "State",
        country: "Country",
        postal_code: "1234AA"
    },
    phone: "",
    dob: "1970-01-01",
    password: password,
    email: email
}

const bodyRegisterNoDobNumber = {
    first_name: "John",
    last_name: "Doe",
    address: {
        street: "Street 1",
        city: "City",
        state: "State",
        country: "Country",
        postal_code: "1234AA"
    },
    phone: "0987654321",
    dob: "",
    password: password,
    email: email
}

const bodyRegisterWrongFormatDob = {
    first_name: "John",
    last_name: "Doe",
    address: {
        street: "Street 1",
        city: "City",
        state: "State",
        country: "Country",
        postal_code: "1234AA"
    },
    phone: "0987654321",
    dob: "30-01-1999",
    password: password,
    email: email
}

const bodyRegisterUnder18 = {
    first_name: "John",
    last_name: "Doe",
    address: {
        street: "Street 1",
        city: "City",
        state: "State",
        country: "Country",
        postal_code: "1234AA"
    },
    phone: "0987654321",
    dob: "2020-01-01",
    password: password,
    email: email
}

const bodyRegisterOver75 = {
    first_name: "John",
    last_name: "Doe",
    address: {
        street: "Street 1",
        city: "City",
        state: "State",
        country: "Country",
        postal_code: "1234AA"
    },
    phone: "0987654321",
    dob: "1900-01-01",
    password: password,
    email: email
}

const bodyRegisterNoEmail = {
    first_name: "John",
    last_name: "Doe",
    address: {
        street: "Street 1",
        city: "City",
        state: "State",
        country: "Country",
        postal_code: "1234AA"
    },
    phone: "0987654321",
    dob: "1970-01-01",
    password: password,
    email: ""
}

const bodyRegisterNoPassword = {
    first_name: "John",
    last_name: "Doe",
    address: {
        street: "Street 1",
        city: "City",
        state: "State",
        country: "Country",
        postal_code: "1234AA"
    },
    phone: "0987654321",
    dob: "1970-01-01",
    password: "",
    email: email
}

export class RegisterUtils {

    constructor(apiContext) {
        this.apiContext = apiContext
        this.bodyRegister = bodyRegister
        this.bodyRegisterNoFirstName = bodyRegisterNoFirstName
        this.bodyRegisterNoLastName = bodyRegisterNoLastName
        this.bodyRegisterNoStreetName = bodyRegisterNoStreetName
        this.bodyRegisterNoCityName = bodyRegisterNoCityName
        this.bodyRegisterNoStateName = bodyRegisterNoStateName
        this.bodyRegisterNoCountryName = bodyRegisterNoCountryName
        this.bodyRegisterNoPhoneNumber = bodyRegisterNoPhoneNumber
        this.bodyRegisterNoDobNumber = bodyRegisterNoDobNumber
        this.bodyRegisterWrongFormatDob = bodyRegisterWrongFormatDob
        this.bodyRegisterUnder18 = bodyRegisterUnder18
        this.bodyRegisterOver75 = bodyRegisterOver75
        this.bodyRegisterNoEmail = bodyRegisterNoEmail
        this.bodyRegisterNoPassword = bodyRegisterNoPassword
        this.registerURL = '/users/register'
    }

    async registerUser(statusCode){
        let statusResponse;
        let bodyResponse;

        // Generate a new random number and email for each test
        const randomNumber = Math.floor(Math.random() * 1000000);
        const emailForEachTest = `simM${randomNumber}${process.env.EMAIL}`;
        const passwordForEachTest = `${process.env.PASSWORD}${randomNumber}`;

        // Update the bodyRegister object with the new email and password
        this.bodyRegister.email = emailForEachTest;
        this.bodyRegister.password = passwordForEachTest;


        await test.step('Register new user',async ()=>{
            const response = await this.apiContext.post(this.registerURL,
                { data: this.bodyRegister }
            )
            
            statusResponse = await response.status();
            bodyResponse = await response.json();
            })

        await test.step(`The status of the request is ${statusResponse}`,async()=>{
             expect(statusResponse,`Expect status code to be ${statusCode}`).toBe(statusCode);
        })
        
    }

    async registerUserWrongBody(statusCode,body){
        let statusResponse;
        let bodyResponse;


        await test.step('Register new user',async ()=>{
            const response = await this.apiContext.post(this.registerURL,
                { data: body }
            )
            
            statusResponse = await response.status();
            bodyResponse = await response.json();
        })

        await test.step(`The status of the request is ${statusResponse}`,async()=>{
             expect(statusResponse,`Expect status code to be ${statusCode}`).toBe(statusCode);
        })
        
        return bodyResponse;

    }

}

export default RegisterUtils;