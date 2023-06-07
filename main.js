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
  let axesOffset = width * 0.07;

  const appendStyle = (element, attribute, value) => {
    if (!element.attr("style")) {
      element.attr("style", attribute + ":" + value + ";");
    } else {
      element.attr(
        "style",
        element.attr("style") + " " + attribute + ":" + value + ";"
      );
    }
  };

  let chart = element;
  appendStyle(chart, "height", height + "px");
  appendStyle(chart, "width", width + "px");
  appendStyle(chart, "border", "thin solid black");

  let elementIds = ["x-axis", "y-axis", "title", "scale", "x-label", "y-label"];
  for (let id of elementIds) {
    chart.append("<div id='" + id + "'></div>");
  }

  let titleElement = $("#title").text(title);
  appendStyle(titleElement, "font-size", titleSize + "px");
  appendStyle(titleElement, "top", height * 0.01 + "px");
  appendStyle(
    titleElement,
    "left",
    width / 2 - titleElement.width() / 2 + "px"
  );

  let xAxis = $("#x-axis");
  appendStyle(xAxis, "height", "1px");
  appendStyle(xAxis, "width", width - axesOffset + "px");
  appendStyle(xAxis, "background", "black");
  appendStyle(xAxis, "top", height - axesOffset + "px");
  appendStyle(xAxis, "left", axesOffset + "px");

  let yAxis = $("#y-axis");
  appendStyle(yAxis, "height", height - axesOffset + "px");
  appendStyle(yAxis, "width", "1px");
  appendStyle(yAxis, "background", "black");
  appendStyle(yAxis, "top", 0 + "px");
  appendStyle(yAxis, "left", axesOffset + "px");

  let yLabelElement = $("#y-label").text(yLabel);
  appendStyle(
    yLabelElement,
    "top",
    (height - axesOffset) / 2 + yLabelElement.width() / 2 + "px"
  );
  appendStyle(yLabelElement, "left", "5px");

  let xLabelElement = $("#x-label").text(xLabel);
  appendStyle(xLabelElement, "top", height - xLabelElement.height() - 5 + "px");
  appendStyle(
    xLabelElement,
    "left",
    axesOffset + (width - axesOffset) / 2 - xLabelElement.width() / 2 + "0px"
  );

  let scale = $("#scale");

  let categoryElements;
  let barElements;
};

$(() => {
  let data = [1, 2, 3, 4, 5];
  let options = {
    width: 800,
    height: 500,
    title: "Bar Chart",
    titleSize: 25,
    titleColor: "black",
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
