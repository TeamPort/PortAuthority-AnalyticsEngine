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
        var address = parseInt(instruction.address)
        if(!this.addresses.has(address))
        {
            this.addresses.add(address)
            this.profiledSize += ((instruction.opcode.length-2)/2)
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
        this.dictionary = platform.includes("x86_64") ? marcher: tx2
    }

    analyze(instruction)
    {
        for(var i = 0; i < this.dictionary.instructions.length; i++)
        {
            var test = this.dictionary.instructions[i]
            if(test.name == instruction.mnem)
            {
                this.energy += parseFloat(test.joules)
                return
            }
        }

        /* DANGEROUS */
        // Give the best possible chance of an exact match before resorting to this
        for(var i = 0; i < this.dictionary.instructions.length; i++)
        {
            var test = this.dictionary.instructions[i]
            if(instruction.mnem.includes(test.name))
            {
                this.energy += parseFloat(test.joules)
                return
            }
        }

//        console.log("EnergyAnalyzer - Not Found " + instruction.mnem)
    }

    energyUsage()
    {
        return this.energy
    }
}

function analyze(selected)
{
    var analyzers = [new Coverage(selected.size), new Category(), new Energy(selected.triple)]
    for(var i = 0; i < selected.run.length; i++)
    {
        var count = analyzers.length
        var instr = selected.run[i]
        instr.mnem = instr.mnem.toUpperCase() //Everything in the framework expects upper case
        while(count--)
        {
            var a = analyzers[count]
            a.analyze(instr);
        }
    }

    document.getElementById("output").value  = "Coverage " + analyzers[0].percentCoverage() + "%\n"
    document.getElementById("output").value += "Energy Usage (J) " + analyzers[2].energyUsage() + "\n"
}

