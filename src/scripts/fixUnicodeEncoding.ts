import fs from 'fs';
import path from 'path';

/**
 * Recursively fixes Unicode escape sequences in an object
 * @param obj The object to fix
 * @returns The fixed object
 */
function fixUnicodeEncoding(obj: any): any {
    if (obj === null || obj === undefined) {
        return obj;
    }

    // If it's a string, decode Unicode escape sequences
    if (typeof obj === 'string') {
        try {
            // This will properly decode Unicode escape sequences
            return JSON.parse(`"${obj.replace(/"/g, '\\"')}"`);
        } catch (error) {
            console.warn(`Failed to decode string: ${obj}`);
            return obj;
        }
    }

    // If it's an array, fix each element
    if (Array.isArray(obj)) {
        return obj.map(item => fixUnicodeEncoding(item));
    }

    // If it's an object, fix each property
    if (typeof obj === 'object') {
        const result: Record<string, any> = {};

        for (const [key, value] of Object.entries(obj)) {
            // Fix both the key and the value
            const fixedKey = fixUnicodeEncoding(key);
            const fixedValue = fixUnicodeEncoding(value);
            result[fixedKey] = fixedValue;
        }

        return result;
    }

    // For other types (number, boolean, etc.), return as is
    return obj;
}

/**
 * Processes a JSON file to fix Unicode encoding issues
 * @param filePath Path to the JSON file
 */
function processJsonFile(filePath: string): void {
    try {
        console.log(`Processing file: ${filePath}`);

        // Read the file
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        // Fix Unicode encoding
        const fixedData = fixUnicodeEncoding(data);

        // Write the fixed data back to the file
        fs.writeFileSync(
            filePath,
            JSON.stringify(fixedData, null, 2),
            'utf-8'
        );

        console.log(`Successfully fixed Unicode encoding in: ${filePath}`);
    } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
    }
}

// Main function
function main(): void {
    // Get the file path from command line arguments
    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.error('Please provide a path to the JSON file');
        console.log('Usage: ts-node fixUnicodeEncoding.ts path/to/file.json');
        process.exit(1);
    }

    const filePath = path.resolve(args[0]);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
    }

    // Process the file
    processJsonFile(filePath);
}

// Run the script
main(); 