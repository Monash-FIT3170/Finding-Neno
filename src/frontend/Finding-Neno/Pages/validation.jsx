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

export const validatePassword = (inputPassword) => {
    errorStrings = [];

    if (inputPassword.length < 8) {
        errorStrings.push("Password must be at least 8 characters long.");
    }

    if (inputPassword.length > 25) {
        errorStrings.push("Password must be at most 25 characters long.");
    }

    if (!/(?=.*[A-Z])/.test(inputPassword)) {
        errorStrings.push("Password must contain at least one uppercase letter.");
    }

    if (!/(?=.*[0-9])/.test(inputPassword)) {
        errorStrings.push("Password must contain at least one number.");
    }

    if (!/(?=.*[!-?@#$%^&*])/.test(inputPassword)) {
        errorStrings.push("Password must contain at least one special character.");
    }

    if (errorStrings.length > 0) {
        return errorStrings.join("\n");
    }
    else {
        return null; // Password is valid
    }
}