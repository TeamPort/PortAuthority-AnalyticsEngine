var synthMap = null

function buildSyntheticInstanceMap(selected)
{
    synthMap = new Map()
    if(!selected.triple.includes("x86_64")) return

    for(var i = 0; i < selected.run.length; i++)
    {
        var mnem = ""
        var value = 0
        var first = selected.run[i].m.toUpperCase()
        for(var j = 0; j < x64.instr.length; j++)
        {
            if(first == x64.instr[j].toUpperCase())
            {
                mnem = aarch64.instr[j].toUpperCase()
                break
            }
        }

        /* DANGEROUS */
        // x86-64 has multiple mnemonics for the same instruction
        // Our internal dictionary is based on the short form
        if(mnem == "")
        {
            for(var j = 0; j < x64.instr.length; j++)
            {
                if(first.slice(0,-1) == x64.instr[j].toUpperCase())
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
