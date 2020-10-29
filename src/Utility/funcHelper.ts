export async function defineArrayWithQuotesLimiterv2(sentence: string): Promise<{ok: boolean;args?: string[]}> {
    let newSentence: string = ""; // The sentence who will be add to the final array, the one between quotes
    let args: string[] = []; // The array with quotes limiters returned
    let index: number = 0; // index of args
    
    let sentenceSplited = sentence.split(' ');
    
    try {
        if(sentenceSplited.length === 1) {
            if(sentenceSplited[0].startsWith('\"')) {
                sentenceSplited[0] = sentenceSplited[0].slice(1, sentenceSplited[0].length); // remove the starting quote
            }
            if(sentenceSplited[0].endsWith('\"')) {
                sentenceSplited[0] = sentenceSplited[0].slice(0, sentenceSplited[0].length - 1); // remove the ending quote
            }
            return { ok:true, args:sentenceSplited };
        }
        for(let i = 0; i <= sentenceSplited.length - 1; /*empty, incremented manually*/ ) {
            //console.log("does " +  sentenceSplited[i] + " ? : " + sentenceSplited[i].startsWith('\"'));
            
            if(sentenceSplited[i].startsWith('\"')) {
                //console.log("splited : " + sentenceSplited[i].slice(1, sentenceSplited[i].length) + " of : " + sentenceSplited[i]);
                
                sentenceSplited[i] = sentenceSplited[i].slice(1, sentenceSplited[i].length); // remove the starting quote
                while(true) {
                    if(i > sentenceSplited.length - 1) { // Prevent out of range string acces
                        //console.log("Preventing out of range string acces");
                        if(newSentence.endsWith('\"')) {
                            newSentence = newSentence.slice(0, sentenceSplited.length - 1);
                        }
                        args[index] = newSentence;
                        break;
                    }
                    if(sentenceSplited[i].endsWith('\"')) {
                        //console.log("  -  " + sentenceSplited[i] + " end with \"");
                        
                        sentenceSplited[i] = sentenceSplited[i].slice(0, sentenceSplited[i].length - 1); // remove the ending quote
                        newSentence = newSentence.concat(" " + sentenceSplited[i]);
                        args[index] = newSentence;
                        i++;
                        index++;
                        //console.log("break (ending with found)");
                        break;
                    }
                    else {
                        //console.log("concat : " + newSentence + " to : " + newSentence.concat(" " + sentenceSplited[i]));
                        
                        newSentence = newSentence.concat(" " + sentenceSplited[i]);
                    }
                    i++;
                }
            }
            else {
                args[index] = sentenceSplited[i];
                index++;
                i++;
            }
            newSentence = "";
        }
        if(args.length === 0 || args === []) {
            return { ok:false };
        }
        //console.log(args);
        
        return { ok:true, args:args };
    }
    catch (err) {
        console.log("Error : " + err);
        return { ok:false };
    }
}
