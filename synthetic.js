var usedMap = null
var synthMap = null
function emit(ngram)
{
    var test = bigrams[ngram]
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

function buildSyntheticInstanceMap(selected)
{
    usedMap = new Map()
    synthMap = new Map()
    if(!selected.triple.includes("x86_64")) return

    for(var i = 0; i < selected.run.length-1; i+=2)
    {
        var first = selected.run[i].m.toUpperCase()
        var second = selected.run[i+1].m.toUpperCase()
        var ngram = emit(first + "-" + second)

        if(ngram == "")
        {
            ngram = "UNKNOWN-UNKNOWN"
        }

        var instructions = ngram.split("-");
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
