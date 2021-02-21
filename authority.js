class Analyser
{
    analyze(instruction){}
}

class Coverage extends Analyser
{
    constructor(size)
    {
        super()
        this.size = size
        this.profiledSize = 0
        this.addresses = new Set()
    }

    analyze(instruction)
    {
        var address = parseInt(instruction.a)
        if(!this.addresses.has(address))
        {
            this.addresses.add(address)
            this.profiledSize += ((instruction.o.length-2)/2)
        }
    }

    percentCoverage()
    {
        return (this.profiledSize/this.size)*100
    }
}

class Category extends Analyser
{
    constructor(platform)
    {
        super()
        this.categories = new Map()
        this.categories.set("datamov", 0)
        this.categories.set("arith", 0)
        this.categories.set("logical", 0)
        this.categories.set("bit", 0)
        this.categories.set("branch", 0)
        this.categories.set("control", 0)
        this.categories.set("stack", 0)
        this.categories.set("conver", 0)
        this.categories.set("binary", 0)
        this.categories.set("decimal", 0)
        this.categories.set("shftrot", 0)
        this.categories.set("cond", 0)
        this.categories.set("break", 0)
        this.categories.set("string", 0)
        this.categories.set("inout", 0)
        this.categories.set("flgctrl", 0)
        this.categories.set("segreg", 0)
    }

    analyze(instruction)
    {
        var mnem = parseInt(instruction.m)
        this.dictionary =  this.x86 ? x86_category: aarch64_category
        for(var i = 0; i < this.dictionary.parameters.length; i++)
        {
            var test = this.dictionary.parameters[i]
            if(instruction.m == test.mnemonic.toUpperCase())
            {
                var value = this.categories.get(test.subgroup)
                this.categories.set(test.subgroup, value +1)
                return
            }
        }
    }

    drawChart(host)
    {
        var total = 0;
        for (const [key, value] of this.categories)
        {
            total += value;
        }

        addRange(host, (this.categories.get("datamov")/total)*100, "datamov", "red");
        addRange(host, (this.categories.get("arith")/total)*100, "arith", "orange");
        addRange(host, (this.categories.get("logical")/total)*100, "logical", "yellow");
        addRange(host, (this.categories.get("bit")/total)*100, "bit", "green");
        addRange(host, (this.categories.get("branch")/total)*100, "branch", "blue");
        addRange(host, (this.categories.get("control")/total)*100, "control", "indigo");
        addRange(host, (this.categories.get("stack")/total)*100, "stack", "violet");
        addRange(host, (this.categories.get("conver")/total)*100, "conver", "white");
        addRange(host, (this.categories.get("binary")/total)*100, "binary", "silver");
        addRange(host, (this.categories.get("decimal")/total)*100, "decimal", "gray");
        addRange(host, (this.categories.get("shftrot")/total)*100, "shrfrot", "darkred");
        addRange(host, (this.categories.get("cond")/total)*100, "cond", "maroon");
        addRange(host, (this.categories.get("break")/total)*100, "break", "olive");
        addRange(host, (this.categories.get("string")/total)*100, "string", "lime");
        addRange(host, (this.categories.get("inout")/total)*100, "inout", "aqua");
        addRange(host, (this.categories.get("flgctrl")/total)*100, "flgctrl", "fuchsia");
        addRange(host, (this.categories.get("segreg")/total)*100, "segreg", "purple");
    }
}

class Energy extends Analyser
{
    constructor(platform)
    {
        super()
        this.energy = 0
        this.defaultValue = 0.0
        this.x86 = platform.includes("x86_64")
        this.dictionary =  this.x86 ? marcher_energy: tx2_energy
        for(var i = 0; i < this.dictionary.instructions.length; i++)
        {
            var instr = this.dictionary.instructions[i]
            this.defaultValue += parseFloat(instr.joules)
        }

        this.defaultValue /= this.dictionary.instructions.length
    }

    analyze(instruction)
    {
        for(var i = 0; i < this.dictionary.instructions.length; i++)
        {
            var test = this.dictionary.instructions[i]
            if(instruction.m == test.name)
            {
                this.energy += parseFloat(test.joules)
                return
            }
        }

        if(this.x86)
        {
            /* DANGEROUS */
            // x86-64 has multiple mnemonics for the same instruction
            // Our internal dictionary is based on the short form
            for(var i = 0; i < this.dictionary.instructions.length; i++)
            {
                var test = this.dictionary.instructions[i]
                if(instruction.m.slice(0,-1) == test.name)
                {
                    this.energy += parseFloat(test.joules)
                    return
                }
            }
        }

//        console.log("EnergyAnalyzer - Not Found " + instruction.mnem)
// Best guess
        this.energy += this.defaultValue
    }

    energyUsage()
    {
        return this.energy
    }
}

class AArch64Memory extends Analyser
{
    constructor()
    {
        super()
        this.access = 0
        this.store = 0
    }

    analyze(instruction)
    {
        if(instruction.m == "STR")
        {
            this.store += 4
        }
        if(instruction.m == "STRH")
        {
            this.store += 2
        }
        if(instruction.m == "STRB")
        {
            this.store += 1
        }

        if(instruction.m == "LDR")
        {
            this.access += 4
        }
        if(instruction.m == "LDRH")
        {
            this.access += 2
        }
        if(instruction.m == "LDRB")
        {
            this.access += 1
        }
    }

    accesses()
    {
        return this.access
    }

    stores()
    {
        return this.store
    }
}

var analyzers = null
var predicted = null

function analyze(selected)
{
    var bias = sessionStorage.bias //Runtime bias
    for(var i = bias; i < selected.run.length; i++)
    {
        var count = analyzers.length
        var instr = selected.run[i]
        instr.m = instr.m.toUpperCase() //Everything in the framework expects upper case
        if(instr.m == "NONE") continue;

        while(count--)
        {
            var a = analyzers[count]
            a.analyze(instr);
        }
    }

    buildSyntheticInstanceMap(run, 2)
    for (const [key, value] of synthMap)
    {
        var count = predicted.length
        while(count--)
        {
            var instrs = value
            var a = predicted[count]
            while(instrs--)
            {
                var instr = {a: 0x0, m: key, o: 0}
                a.analyze(instr)
            }
        }
    }
}