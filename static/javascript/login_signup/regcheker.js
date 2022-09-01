export function mail_syntax_checker(mailstring) {
    let reg = new RegExp(/[^A-Za-z0-9_.\-]/);
    let dot_reg = new RegExp(/\.{2,}/);
    if (mailstring.indexOf("@") === -1) {
        return false;
    }
    let split = mailstring.split("@");
    return !(split.length != 2 ||
        reg.test(split[0]) ||
        reg.test(split[1]) ||
        dot_reg.test(split[0]) ||
        dot_reg.test(split[1]));
}
export function text_syntax_checker(string) {
    if (string.length < 3) {
        return false;
    }
    let reg = new RegExp(/[^A-Za-z0-9_.\-]/);
    return !reg.test(string);
}
export function password_syntax_checker(password) {
    if (password.length < 8) {
        return false;
    }
    let reg = new RegExp(/[^!#-&*+\-.-9?-Z^_a-z]/);
    return !reg.test(password);
}
