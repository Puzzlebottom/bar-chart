const drawBarChart = (data, options, element) => {
  let {
    width,
    height,
    titleSize,
    titleColor,
    barDataPosition,
    barColor,
    barLabelColor,
    barSpacing,
    barLabels,
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
    let barLabel = "<div class='bar-label'>" + barLabels[dataIndex] + "</div>";

    $(bar)
      .append(barData, barLabel)
      .appendTo(chart)
      .css({
        height: barHeight,
        width: barWidth,
        left: axisMargin + barSpacing / 2 + (barWidth + barSpacing) * dataIndex,
        top: yLength - barHeight,
        background: barColor,
      });

    bar = $("#bar" + dataIndex);

    barData = bar
      .find(".bar-data")
      .css({ "font-size": Math.floor(titleSize * 0.6) });
    let dataPosition =
      barDataPosition === "top"
        ? Math.min(-barData.height(), barHeight - barData.height())
        : barDataPosition === "middle"
        ? Math.min(
            barHeight / 2 - barData.height() / 2,
            barHeight - barData.height()
          )
        : barHeight - barData.height();
    barData.css({
      color: barLabelColor,
      top: dataPosition,
      left: barWidth / 2 - barData.width() / 2,
    });

    barLabel = bar
      .find(".bar-label")
      .css({ "font-size": Math.floor(titleSize * 0.6) });
    barLabel.css({
      top: barHeight,
      left: barWidth / 2 - barLabel.width() / 2,
    });
  };

  const renderXAxis = () => {
    let xAxis = "<div id='x-axis'></div>";
    let xLabel = "<div id='x-label'></div>";

    $(xAxis)
      .appendTo(chart)
      .css({ width: xLength, top: yLength, left: axisMargin });
    xLabel = $(xLabel)
      .appendTo(chart)
      .text(options.xLabel)
      .css({ "font-size": Math.floor(titleSize * 0.8) });
    xLabel.css({
      top: height - xLabel.height() - 5,
      left: axisMargin + xLength / 2 - xLabel.width() / 2,
    });
  };

  const renderYAxis = () => {
    let yAxis = "<div id='y-axis'></div>";
    let yLabel = "<div id='y-label'></div>";

    yAxis = $(yAxis).appendTo(chart).css({ height: yLength, left: axisMargin });
    yLabel = $(yLabel)
      .appendTo(chart)
      .text(options.yLabel)
      .css({ "font-size": Math.floor(titleSize * 0.8) });
    yLabel.css({
      top: yLength / 2 + yLabel.width() / 2,
    });

    for (let i = maxScale; i >= 0; i -= maxScale / scaleDivisor) {
      let mark = "<div class='scale-mark'>" + i + "</div>";
      let line = "<div class='scale-line'></div>";
      let topOffset = axisMargin + (maxHeight * (maxScale - i)) / maxScale;
      mark = $(mark)
        .appendTo(yAxis)
        .css({ "font-size": Math.floor(titleSize * 0.6) });
      mark.css({
        top: topOffset - mark.height() / 2,
        left: -(mark.width() + 2),
      });
      if (i !== 0) {
        $(line)
          .appendTo(yAxis)
          .css({ width: xLength, top: topOffset, left: 1 });
      }
    }
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

  let chart = element.css({ height: height, width: width });
  let title = $("<div id='title'></div>")
    .appendTo(chart)
    .text(options.title)
    .css({ "font-size": titleSize });
  title.css({
    color: titleColor,
    left: width / 2 - title.width() / 2,
  });

  renderXAxis();
  renderYAxis();
  for (let i = 0; i < data.length; i++) {
    renderBar(i);
  }
};

$(() => {
  let data = [6, 8, 5, 3, 4];
  let options = {
    width: 150,
    height: 150,
    title: "Vegetables Bought",
    titleSize: 10,
    titleColor: "black",
    barDataPosition: "top", // top, middle, bottom
    barColor: "teal",
    barLabelColor: "black",
    barSpacing: 8,
    barLabels: ["Potatoes", "Onions", "Tomatoes", "Capsicum", "Beans"],
    xLabel: "Types of Vegetables",
    yLabel: "Weight of Vegetables (in kg)",
  };
  let element = $("#bar-chart");
  drawBarChart(data, options, element);
});
