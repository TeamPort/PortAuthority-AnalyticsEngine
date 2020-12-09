var synthMap = null

function buildSyntheticInstanceMap(selected)
{
    synthMap = new Map()
    if(!selected.triple.includes("x86_64")) return

    for(var i = 0; i < selected.run.length; i++)
    {
        var mnem = ""
        var value = 0
        var first = selected.run[i].mnem.toUpperCase()
        for(var j = 0; j < x64.instr.length; j++)
        {
            if(first == x64.instr[j].toUpperCase())
            {
                mnem = aarch64.instr[j].toUpperCase()
                break
            }
        }

        /* DANGEROUS */
        if(mnem == "")
        {
            for(var j = 0; j < x64.instr.length; j++)
            {
                if(first.includes(x64.instr[j].toUpperCase()))
                {
                    mnem = aarch64.instr[j].toUpperCase()
                    break
                }
            }
        }

        if(mnem == "")
        {
//            console.log("Synthetic Match - Not Found " + first)
        }

        if(synthMap.has(mnem))
        {
            value = synthMap.get(mnem)
        }

        value++;
        synthMap.set(mnem, value)
    }
}
