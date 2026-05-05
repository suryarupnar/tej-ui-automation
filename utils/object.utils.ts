export type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;

/**
 * Simple deep merge function to merge partial overrides into a base template.
 * This ensures that passing { cargo: { weight: '20' } } doesn't erase other cargo properties.
 */
export function deepMerge<T>(base: T, overrides?: DeepPartial<T>): T {
    if (!overrides) return base;
    
    const result = { ...base } as any;
    
    for (const key in overrides) {
        if (Object.prototype.hasOwnProperty.call(overrides, key)) {
            const overrideValue = overrides[key];
            const baseValue = result[key];
            
            if (
                typeof overrideValue === 'object' && 
                overrideValue !== null && 
                !Array.isArray(overrideValue) &&
                typeof baseValue === 'object' && 
                baseValue !== null && 
                !Array.isArray(baseValue)
            ) {
                result[key] = deepMerge(baseValue, overrideValue);
            } else {
                result[key] = overrideValue;
            }
        }
    }
    
    return result;
}
