export const validEmail = (inputEmail) => {
    emailRegex = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
    if (inputEmail.match(emailRegex)) {
        return true
    }
    return false
}

export const validPhoneNumber = (inputPhoneNumber) => {
    phoneNumberRegex = new RegExp(/^0[45]\d{8}$/);
    return inputPhoneNumber.match(phoneNumberRegex);
}
  
export const validateCoordinates = (inputCoordinates) => {
    const coordinatesRegex = new RegExp(/^[-+]?(180(\.\d{1,7})?|((1[0-7]\d)|([1-9]?\d))(\.\d{1,7})?),\s*[-+]?([1-8]?\d(\.\d{1,7})?|90(\.\d{1,7})?)$/);
    return inputCoordinates.match(coordinatesRegex);
}
