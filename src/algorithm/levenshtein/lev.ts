// Calculate the Levenstein Distance of two strings a of length i and b of length j
function levenshtein(a: string, b: string, i: number, j: number): number {
    // Basisfall
    if (Math.min(i, j) === 0) {
        return Math.max(i, j);
    }

    // Called when the two substrings are the same
    // Return 1, when the last character of both substrings are *not*
    // the same. 0 if they are.
    const one = (_i: number, _j: number) => {
        return a[_i] === b[_j] ? 0 : 1;
    };

    // If |a| > |b|: Reduce the length of a by 1, call levenstein recursively and add 1
    // If |b| > |a|: Reduce the length of b by 1, call levenstein recursively and add 1
    // If |a| == |b|: Reduce both strings by one, call levenstein recursively and add the value of one
    if (i > j) return levenshtein(a, b, i - 1, j) + 1;
    else if (j > i) return levenshtein(a, b, i, j - 1) + 1;
    else return levenshtein(a, b, i - 1, j - 1) + one(i - 1, j - 1);
}

// Calculate the distance between two strings using the Levenstein distance, but already
// calculate i and j.
function levWrapper(a: string, b: string): number {
    return levenshtein(a, b, a.length, b.length);
}

export { levenshtein, levWrapper };
