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
}

class Energy extends Analyser
{
    constructor(platform)
    {
        super()
        this.energy = 0
        this.defaultValue = 0.0
        this.x86 = platform.includes("x86_64")
        this.dictionary =  this.x86 ? marcher: tx2
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

var analyzers = null

function analyze(selected)
{
    for(var i = 0; i < selected.run.length; i++)
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

    document.getElementById("output").value  = "Coverage " + analyzers[0].percentCoverage() + "%\n"
    document.getElementById("output").value += "Energy Usage (J) " + analyzers[2].energyUsage() + "\n"
}