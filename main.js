const drawBarChart = (data, options, element) => {
  let titleSize = options.titleSize;

  const getScaleDivisor = () => {
    let divisors = [6, 5, 4];
    let yAxisOverhead = [];
    for (let divisor of divisors) {
      if (maxBarDataSum % divisor === 0) {
        return divisor;
      } else {
        yAxisOverhead.push(divisor - (maxBarDataSum % divisor));
      }
    }
    return divisors[yAxisOverhead.indexOf(Math.min(...yAxisOverhead))];
  };

  const getMaxBarDataSum = () => {
    let max = 0;
    for (let i = 0; i < data.length; i++) {
      let dataSum = data[i]["value"].reduce((a, b) => a + b);
      if (dataSum > max) {
        max = dataSum;
      }
    }
    return max;
  };

  const renderBar = (dataIndex) => {
    let barHeight =
      (data[dataIndex]["value"].reduce((a, b) => a + b, 0) / maxScale) *
      maxHeight;
    let totalSubBars = data[dataIndex]["value"].length;
    let bar = "<div class='bar' id='bar" + dataIndex + "'></div>";
    let barLabel =
      "<div class='bar-label'>" + data[dataIndex]["barLabel"] + "</div>";
    let topOffset = yLength;

    $(bar)
      .append(barLabel)
      .appendTo(chart)
      .css({
        left:
          axisMargin +
          options.barSpacing / 2 +
          (barWidth + options.barSpacing) * dataIndex,
      });
    bar = $("#bar" + dataIndex);

    for (let i = 0; i < totalSubBars; i++) {
      let value = data[dataIndex]["value"][i];
      let subBarHeight = (value / maxScale) * maxHeight;
      let subBarColor = data[dataIndex]["barColor"][i];
      topOffset -= subBarHeight;

      let subBar =
        "<div class='sub-bar' id='bar" + dataIndex + "-sub" + i + "'></div>";

      subBar = $(subBar).appendTo(bar).css({
        height: subBarHeight,
        width: barWidth,
        top: topOffset,
        background: subBarColor,
      });

      if (options.barDataPosition) {
        let subBarData =
          "<div class='bar-data'>" + data[dataIndex]["value"][i] + "</div>";
        subBarData = $(subBarData)
          .appendTo(subBar)
          .css({ "font-size": Math.floor(titleSize * 0.6) });
        let dataPosition =
          options.barDataPosition === "top"
            ? 0
            : options.barDataPosition === "middle"
            ? subBarHeight / 2 - subBarData.height() / 2
            : subBarHeight - subBarData.height();
        subBarData.css({
          color: options.barLabelColor,
          top: dataPosition,
          left: barWidth / 2 - subBarData.width() / 2,
        });
      }
    }

    $(bar).append(barLabel).appendTo(chart);

    // barData = bar
    //   .find(".bar-data")
    //   .css({ "font-size": Math.floor(titleSize * 0.6) });
    // let dataPosition =
    //   options.barDataPosition === "top"
    //     ? Math.min(-barData.height(), barHeight - barData.height())
    //     : options.barDataPosition === "middle"
    //     ? Math.min(
    //         barHeight / 2 - barData.height() / 2,
    //         barHeight - barData.height()
    //       )
    //     : barHeight - barData.height();
    // barData.css({
    //   color: options.barLabelColor,
    //   top: dataPosition,
    //   left: barWidth / 2 - barData.width() / 2,
    // });

    barLabel = bar
      .find(".bar-label")
      .css({ "font-size": Math.floor(titleSize * 0.6) });
    barLabel.css({
      top: yLength,
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
      top: yLength + xLabel.height(),
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
      left: axisMargin - yLabel.height() * 2,
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
        left: -(mark.width() + titleSize * 0.1),
      });
      if (i !== 0) {
        $(line)
          .appendTo(yAxis)
          .css({ width: xLength, top: topOffset, left: 1 });
      }
    }
  };

  let axisMargin = titleSize * 2;
  let xLength = options.width - axisMargin;
  let yLength = options.height - axisMargin;
  let barWidth = xLength / data.length - options.barSpacing;
  let maxHeight = yLength - axisMargin;
  let maxBarDataSum = getMaxBarDataSum();
  let scaleDivisor = getScaleDivisor();
  let maxScale = options.maxScale
    ? options.maxScale
    : maxBarDataSum % scaleDivisor === 0
    ? maxBarDataSum
    : maxBarDataSum + scaleDivisor - (maxBarDataSum % scaleDivisor);

  let chart = element.css({
    height: options.height,
    width: options.width,
  });
  let title = $("<div id='title'></div>")
    .appendTo(chart)
    .text(options.title)
    .css({ "font-size": titleSize });
  title.css({
    color: options.titleColor,
    top: Math.min(titleSize * 0.2),
    left: options.width / 2 - title.width() / 2,
  });

  renderXAxis();
  renderYAxis();
  for (let i = 0; i < data.length; i++) {
    renderBar(i);
  }
};

$(() => {
  let data = [
    {
      value: [6, 9, 10, 3],
      barColor: ["#00f", "#44f", "#88f", "#ccf"],
      barLabel: "Potatoes",
    },
    {
      value: [8, 2, 5, 6],
      barColor: ["#00f", "#44f", "#88f", "#ccf"],
      barLabel: "Onions",
    },
    {
      value: [5, 5, 4, 3],
      barColor: ["#00f", "#44f", "#88f", "#ccf"],
      barLabel: "Tomatoes",
    },
    {
      value: [3, 11, 2, 4],
      barColor: ["#00f", "#44f", "#88f", "#ccf"],
      barLabel: "Capsicum",
    },
    {
      value: [4, 9, 4, 4],
      barColor: ["#00f", "#44f", "#88f", "#ccf"],
      barLabel: "Beans",
    },
  ];
  let options = {
    width: 450,
    height: 450,
    title: "Vegetables Bought",
    titleSize: 30,
    titleColor: "black",
    barDataPosition: "middle", // top, middle, bottom
    barLabelColor: "black",
    barSpacing: 10,
    xLabel: "Types of Vegetables",
    yLabel: "Weight of Vegetables (in kg)",
    maxScale: null,
  };
  let element = $("#bar-chart");
  drawBarChart(data, options, element);
});
