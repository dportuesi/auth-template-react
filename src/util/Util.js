function hasNumber(myString) {
    return /\d/.test(myString);
}

function hasLowerCase(str) {
    return (/[a-z]/.test(str));
}

function hasUpperCase(str) {
    return (/[A-Z]/.test(str));
}

exports.hasNumber = hasNumber;
exports.hasLowerCase = hasLowerCase;
exports.hasUpperCase = hasUpperCase;