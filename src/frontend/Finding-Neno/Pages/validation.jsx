export const validEmail = (inputEmail) => {
    emailRegex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
    if (inputEmail.match(emailRegex)) {
        return true
    }
    return false
}

export const validPhoneNumber = (inputPhoneNumber) => {
    phoneNumberRegex = new RegExp(/^0[45]\d{8}$/)
    return inputPhoneNumber.match(phoneNumberRegex);
}