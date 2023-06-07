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
    .css("font-size", Math.floor(titleSize * 0.4))
    .css("top", (height - AXIS_OFFSET) / 2 + yLabelElement.width() / 2 + "px");

  let xLabelElement = $("#x-label").text(xLabel);
  xLabelElement
    .css("font-size", Math.floor(titleSize * 0.4))
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
  let data = [1, 2, 3, 4, 5];
  let options = {
    width: 200,
    height: 125,
    title: "Vegetables Bought",
    titleSize: 10,
    titleColor: "blue",
    barValuePosition: "top", // top, middle, bottom
    barColor: "red",
    barLabelColor: "black",
    barSpacing: 10,
    categories: ["one", "two", "three", "four", "five"],
    xLabel: "Types of Vegetables",
    yLabel: "Weight of Vegetables (in kg)",
  };
  let element = $("#bar-chart");
  drawBarChart(data, options, element);
});
