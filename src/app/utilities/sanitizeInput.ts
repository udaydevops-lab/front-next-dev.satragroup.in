// utils/sanitizeInput.ts
export const sanitizeInput = (input: string): string => {
    return input.replace(/[&<>"'`]/g, (match) => {
        const escape: { [key: string]: string } = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '`': '&#96;'
        };
        return escape[match];
    });
};
