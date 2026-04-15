
export const loginData = {

    validUser:{
        email: process.env.VALID_EMAIL || '',
        pass : process.env.VALID_PASSWORD || ''

    },

    invalidEmail:{
        email: 'notcorrect@abc.com',
        pass : process.env.VALID_PASSWORD || ''
    },

    invalidPass:{
        email: process.env.VALID_EMAIL || '',
        pass : 'abcabc'
    },

    blankEmail:{
        email: '',
        pass: process.env.VALID_PASSWORD || ''
    },

    blankPass: {
        email:  process.env.VALID_EMAIL || '',
        pass : ''
    },

    blankBoth: {
        email: '',
        pass: ''
    },

    invalidEmailFormat:{
        email : 'abcac',
        pass : process.env.VALID_PASSWORD || ''
    }
}