const drawBarChart = (data, options, element) => {
  element.append("chart");
};

$(() => {
  let data = [1, 2, 3, 4, 5];
  let options = {
    title: "Bar Chart",
    titleSizePx: 40,
    titleColor: "black",
    barValuePosition: "top", // top, middle, bottom
    barColor: "red",
    barLabelColor: "black",
    barSpacingPx: 10,
    xLabels: ["one", "two", "three", "four", "five"],
  };
  let element = $("#bar-chart");
  drawBarChart(data, options, element);
});
