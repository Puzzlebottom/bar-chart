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

  const getScaleDivisor = () => {
    let divisors = [6, 5, 4];
    let yAxisOverhead = [];
    for (let divisor of divisors) {
      if (maxDataValue % divisor === 0) {
        return divisor;
      } else {
        yAxisOverhead.push(divisor - (maxDataValue % divisor));
      }
    }
    return divisors[yAxisOverhead.indexOf(Math.min(...yAxisOverhead))];
  };

  const renderBar = (dataIndex) => {
    let barHeight = (data[dataIndex] / maxScale) * maxHeight;
    let bar = "<div class='bar' id='bar" + dataIndex + "'></div>";
    let barData = "<div class='bar-data'>" + data[dataIndex] + "</div>";
    let barLabel = "<div class='bar-label'>" + categories[dataIndex] + "</div>";
    let barCSS = {
      height: barHeight,
      width: barWidth,
      left: axisMargin + barSpacing / 2 + (barWidth + barSpacing) * dataIndex,
      top: yLength - barHeight,
      background: barColor,
    };

    $(bar).append(barData, barLabel).appendTo(chart).css(barCSS);

    bar = $("#bar" + dataIndex);

    barData = bar.find(".bar-data");
    let dataPosition =
      barValuePosition === "top"
        ? Math.min(-barData.height(), barHeight - barData.height())
        : barValuePosition === "middle"
        ? Math.min(
            barHeight / 2 - barData.height() / 2,
            barHeight - barData.height()
          )
        : barHeight - barData.height();
    let barDataCSS = {
      "font-size": Math.floor(titleSize * 0.6),
      color: barLabelColor,
      top: dataPosition,
      left: barWidth / 2 - barData.width() / 2,
    };
    barData.css(barDataCSS);

    barLabel = bar.find(".bar-label");
    let barLabelCSS = {
      "font-size": Math.floor(titleSize * 0.6),
      top: barHeight,
      left: barWidth / 2 - barLabel.width() / 2,
    };
    barLabel.css(barLabelCSS);
  };

  let axisMargin = titleSize * 2;
  let xLength = width - axisMargin;
  let yLength = height - axisMargin;
  let barWidth = xLength / data.length - barSpacing;
  let maxHeight = yLength - axisMargin;
  let maxDataValue = Math.max(...data);
  let scaleDivisor = getScaleDivisor();
  let maxScale =
    maxDataValue % scaleDivisor === 0
      ? maxDataValue
      : maxDataValue + scaleDivisor - (maxDataValue % scaleDivisor);

  let chart = element.css("height", height + "px").css("width", width + "px");
  let elementIds = ["x-axis", "y-axis", "title", "scale", "x-label", "y-label"];
  for (let id of elementIds) {
    chart.append("<div id='" + id + "'></div>");
  }

  for (let i = 0; i < data.length; i++) {
    renderBar(i);
  }

  let titleElement = $("#title").text(title);
  titleElement
    .css("font-size", titleSize + "px")
    .css("color", titleColor)
    .css("left", width / 2 - titleElement.width() / 2 + "px");

  let xAxis = $("#x-axis");
  xAxis
    .css("width", xLength + "px")
    .css("top", yLength + "px")
    .css("left", axisMargin + "px");

  let yAxis = $("#y-axis");
  yAxis.css("height", yLength + "px").css("left", axisMargin + "px");

  let yLabelElement = $("#y-label").text(yLabel);
  yLabelElement
    .css("font-size", Math.floor(titleSize * 0.8))
    .css("top", yLength / 2 + yLabelElement.width() / 2 + "px");

  let xLabelElement = $("#x-label").text(xLabel);
  xLabelElement
    .css("font-size", Math.floor(titleSize * 0.8))
    .css("top", height - xLabelElement.height() - 5 + "px")
    .css("left", axisMargin + xLength / 2 - xLabelElement.width() / 2 + "px");

  let scale = $("#scale");

  let categoryElements;
  let barElements;
};

$(() => {
  let data = [6, 8, 5, 3, 4];
  let options = {
    width: 800,
    height: 500,
    title: "Vegetables Bought",
    titleSize: 25,
    titleColor: "black",
    barValuePosition: "top", // top, middle, bottom
    barColor: "teal",
    barLabelColor: "black",
    barSpacing: 30,
    categories: ["Potatoes", "Onions", "Tomatoes", "Capsicum", "Beans"],
    xLabel: "Types of Vegetables",
    yLabel: "Weight of Vegetables (in kg)",
  };
  let element = $("#bar-chart");
  drawBarChart(data, options, element);
});
