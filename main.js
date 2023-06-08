const drawBarChart = (data, options, element) => {
  let {
    width,
    height,
    title,
    titleSize,
    titleColor,
    barValuePosition,
    barColor,
    barLabelColor,
    barSpacing,
    categories,
    xLabel,
    yLabel,
  } = options;
  let AXIS_OFFSET = width * 0.07;

  let chart = element;
  chart.css("height", height + "px").css("width", width + "px");

  let elementIds = ["x-axis", "y-axis", "title", "scale", "x-label", "y-label"];

  let barWidth = (width - AXIS_OFFSET) / data.length - barSpacing;
  let maxHeight = height - AXIS_OFFSET * 2;

  const getMaxDataValue = () => {
    let max = 0;
    for (let datum of data) {
      if (datum > max) {
        max = datum;
      }
    }
    return max;
  };
  let maxValue = getMaxDataValue();

  const getScaleDivisor = () => {
    let divisors = [6, 5, 4];
    for (let divisor of divisors) {
      if (maxValue % divisor === 0) {
        return divisor;
      }
    }
    let overShoot = [];
    for (let divisor of divisors) {
      overShoot.push(divisor - (maxValue % divisor));
    }
    return divisors[overShoot.indexOf(Math.min(...overShoot))];
  };

  let scaleDivisor = getScaleDivisor();

  const getMaxScale = () => {
    let x = maxValue;
    while (x % scaleDivisor !== 0) {
      x++;
    }
    return x;
  };

  let maxScale = getMaxScale();

  for (let i = 0; i < data.length; i++) {
    let barHeight = (data[i] / maxScale) * maxHeight;
    chart.append("<div class='bar' id='bar" + i + "'></div>");
    $("#bar" + i)
      .css("height", barHeight)
      .css("width", barWidth + "px")
      .css(
        "left",
        AXIS_OFFSET + barSpacing / 2 + (barWidth + barSpacing) * i + "px"
      )
      .css("top", height - AXIS_OFFSET - barHeight + "px")
      .css("background-color", barColor);
  }

  for (let id of elementIds) {
    chart.append("<div id='" + id + "'></div>");
  }

  let titleElement = $("#title").text(title);
  titleElement
    .css("font-size", titleSize + "px")
    .css("color", titleColor)
    .css("left", width / 2 - titleElement.width() / 2 + "px");

  let xAxis = $("#x-axis");
  xAxis
    .css("width", width - AXIS_OFFSET + "px")
    .css("top", height - AXIS_OFFSET + "px")
    .css("left", AXIS_OFFSET + "px");

  let yAxis = $("#y-axis");
  yAxis
    .css("height", height - AXIS_OFFSET + "px")
    .css("left", AXIS_OFFSET + "px");

  let yLabelElement = $("#y-label").text(yLabel);
  yLabelElement
    .css("font-size", Math.floor(titleSize * 0.6))
    .css("top", (height - AXIS_OFFSET) / 2 + yLabelElement.width() / 2 + "px");

  let xLabelElement = $("#x-label").text(xLabel);
  xLabelElement
    .css("font-size", Math.floor(titleSize * 0.6))
    .css("top", height - xLabelElement.height() - 5 + "px")
    .css(
      "left",
      AXIS_OFFSET + (width - AXIS_OFFSET) / 2 - xLabelElement.width() / 2 + "px"
    );

  let scale = $("#scale");

  let categoryElements;
  let barElements;
};

$(() => {
  let data = [6, 9, 5, 3, 4];
  let options = {
    width: 800,
    height: 500,
    title: "Vegetables Bought",
    titleSize: 25,
    titleColor: "black",
    barValuePosition: "top", // top, middle, bottom
    barColor: "teal",
    barLabelColor: "white",
    barSpacing: 30,
    categories: ["one", "two", "three", "four", "five"],
    xLabel: "Types of Vegetables",
    yLabel: "Weight of Vegetables (in kg)",
  };
  let element = $("#bar-chart");
  drawBarChart(data, options, element);
});
