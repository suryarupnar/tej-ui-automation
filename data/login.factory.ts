
export const loginData = {

    validUser:{
        email: process.env.VALID_EMAIL || 'neha.jadhav@nimapinfotech.com',
        pass : process.env.VALID_PASSWORD || 'Nimap@123'

    },

    invalidEmail:{
        email: 'notcorrect@abc.com',
        pass : process.env.VALID_PASSWORD || 'Nimap@123'
    },

    invalidPass:{
        email: process.env.VALID_EMAIL || 'neha.jadhav@nimapinfotech.com',
        pass : 'abcabc'
    },

    blankEmail:{
        email: '',
        pass: process.env.VALID_PASSWORD || 'Nimap@123'
    },

    blankPass: {
        email:  process.env.VALID_EMAIL || 'neha.jadhav@nimapinfotech.com',
        pass : ''
    },

    blankBoth: {
        email: '',
        pass: ''
    },

    invalidEmailFormat:{
        email : 'abcac',
        pass : process.env.VALID_PASSWORD || 'Nimap@123'
    }
}