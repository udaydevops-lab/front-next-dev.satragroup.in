// utils/sanitizeObject.ts
const escapeHtml = (unsafe: string): string =>
    unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

export const sanitizeObject = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
    }

    return Object.keys(obj).reduce((acc, key) => {
        const value = obj[key];
        acc[key] = typeof value === 'string' ? escapeHtml(value) : sanitizeObject(value);
        return acc;
    }, {} as { [key: string]: any });
};
