const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const encodeBase62 = (num) => {

    if (num === 0) return "0";

    let encoded = "";

    while (num > 0) {

        encoded = chars[num % 62] + encoded;

        num = Math.floor(num / 62);

    }

    return encoded;
};