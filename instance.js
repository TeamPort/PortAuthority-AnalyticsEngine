var instrMap = null

function buildInstanceMap(selected)
{
    instrMap = new Map()
    for(var i = 0; i < selected.run.length; i++)
    {
        var value = 0
        var mnem = selected.run[i].m.toUpperCase()
        if(instrMap.has(mnem))
        {
            value = instrMap.get(mnem)
        }

        value++;
        instrMap.set(mnem, value)
    }
}
