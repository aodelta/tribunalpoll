// Quotes Split
export function qSplit(sentence: string): string[] {
    let buffer: string = ""; // The sentence who will be add to the final array, the one between quotes

    let isInQuotes: boolean = false;

    let args: string[] = []; // The array with quotes limiters returned
    let index: number = 0; // index of args
    
    for(let i = 0; i < sentence.length; i++) {
        let letter = sentence[i]
        if(letter === '\"' && (i === 0 || sentence.length === i + 1 || sentence[i + 1] === ' ' || sentence[i - 1] === ' ')) {
            if(isInQuotes) {
                args[index] = buffer;
                index++
                buffer = ""
                i++ // Skip next space
            }
            isInQuotes = !isInQuotes
        }
        else if(letter === ' ') {
            if(isInQuotes)
                buffer += letter
            else {
                args[index] = buffer
                index++
                buffer = ""
            }
        }
        else {
            buffer += letter
        }
        if(letter !== '\"' && i === sentence.length - 1) {
            args[index] = buffer
        }
    }
    return args;
}
