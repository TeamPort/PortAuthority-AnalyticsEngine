var max_width = 480;
var width = screen.width > max_width ? max_width: screen.width;

var hostChartCanvas = null;
var hostFillPercentage = 0;

var targetChartCanvas = null;
var targetFillPercentage = 0;

var percentAdjustment = Math.PI/50;

var hostLegend;
var targetLegend;
function addRange(host, percentage, label, color)
{
    var legend = null
    var canvas = null
    var fillPercentage = null
    if(host)
    {
        legend = hostLegend
        canvas = hostChartCanvas
        fillPercentage = hostFillPercentage
    }
    else
    {
        legend = targetLegend
        canvas = targetChartCanvas
        fillPercentage = targetFillPercentage
    }

    if(percentage > 0)
    {
        legend.set(label, color)
    }

    var context = canvas.getContext("2d");
    context.fillStyle = color;

    context.beginPath();
    context.moveTo(width/2, width/2);

    var previousFill = fillPercentage*percentAdjustment;
    context.arc(width/2, width/2, width/2, previousFill, previousFill + (percentage*percentAdjustment));
    context.closePath();

    context.fill();

    if(host)
    {
        hostFillPercentage += percentage
    }
    else
    {
        targetFillPercentage += percentage
    }
}

function initialize()
{
    var hostCanvas = document.createElement('canvas');
    var targetCanvas = document.createElement('canvas');

    hostCanvas.width = width;
    hostCanvas.height = width;
    targetCanvas.width = width;
    targetCanvas.height = width;

    hostChartCanvas = hostCanvas;
    targetChartCanvas = targetCanvas

    hostFillPercentage = 0;
    targetFillPercentage = 0;

    var hostChart = document.getElementById('hostChart');
    hostChart.appendChild(hostCanvas);
    var targetChart = document.getElementById('targetChart');
    targetChart.appendChild(targetCanvas);
}

function wipe()
{
    hostLegend = new Map()
    targetLegend = new Map()
    hostFillPercentage = 0;
    targetFillPercentage = 0;

    var hostContext = hostChartCanvas.getContext("2d");
    hostContext.clearRect(0, 0, hostChartCanvas.width, hostChartCanvas.height);  
    var targetContext = targetChartCanvas.getContext("2d");
    targetContext.clearRect(0, 0, targetChartCanvas.width, targetChartCanvas.height);

    addRange(true, 100, "unknown", "gray");
    addRange(false, 100, "unknown", "gray");
    hostFillPercentage = 0;
    targetFillPercentage = 0;
}

