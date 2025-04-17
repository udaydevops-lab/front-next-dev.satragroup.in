/**
 * Removes the data URL prefix from a Base64 string.
 *
 * @param base64String - The Base64 string with a data URL prefix.
 * @returns The Base64 string without the data URL prefix.
 */
const removeBase64Prefix = (base64String: string): string => {
    const prefix = 'data:application/pdf;base64,';
    return base64String.replace(prefix, '');
};

export default removeBase64Prefix;
