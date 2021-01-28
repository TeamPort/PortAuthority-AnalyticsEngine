var usedMap = null
var synthMap = null
function emit(ngram)
{
    var test = null
    var n = ngram.split("-").length;
    switch(n)
    {
        case 2:
            test = bigrams[ngram]
            break;
        case 3:
            test = trigrams[ngram]
            break;
    }
    if(test == null) return ""

    var key = Object.keys(test)[0]
    if(usedMap.has(test))
    {
        var ndx = 0;
        var value = test[key]
        var current = usedMap.get(test)
        while(current >= value && current < 100)
        {
            ++ndx;
            if(ndx < Object.keys(test).length)
            {
                value += test[Object.keys(test)[ndx]]
            }
            else
            {
                ndx = 0
                current = 0
                break;
            }
        }
        key = Object.keys(test)[ndx];
        usedMap.set(test, current+1)
    }
    else
    {
        usedMap.set(test, 1)
    }

    return key
}

function buildSyntheticInstanceMap(selected, n)
{
    synthMap = new Map()
    if(!selected.triple.includes("x86_64")) return

    usedMap = new Map()
    var parts = ["", "", "", ""];
    for(var i = 0; i < selected.run.length-(n-1); i+=n)
    {
        for(var k = 0; k < n; k++)
        {
            parts[k] = selected.run[i + k].m.toUpperCase()
        }

        var ngram = ""
        for(var k = 0; k < n-1; k++)
        {
            ngram += parts[k] + "-"
        }
        ngram += parts[n-1]

        var generated = emit(ngram)
        if(generated == "")
        {
            // Aid transistion points not served by the static ngram generation tool
            if(ngram.charAt(0) == 'J')
            {
                generated = "B.NE-" + Math.floor(Math.random() * 1) == 0 ? "MOV": "ADD"
                for(var l = 0; l < n-2; l++)
                {
                    generated += "-UNKNOWN"
                }
            }
            else if(ngram.split('-')[0] == 'RET')
            {
                generated = "RET-ADD"
                for(var l = 0; l < n-2; l++)
                {
                    generated += "-UNKNOWN"
                }
            }
            else
            {
                for(var k = 0; k < n-1; k++)
                {
                    generated += "UNKNOWN-"
                }
                generated += "UNKNOWN"
            }
        }

        var instructions = generated.split("-");
        for(var j = 0; j < instructions.length; j++)
        {
            var value = 0
            var instruction = instructions[j];
            if(synthMap.has(instruction))
            {
                value = synthMap.get(instruction)
            }

            value++;
            synthMap.set(instruction, value)
        }
    }
}
