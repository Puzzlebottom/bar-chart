const drawBarChart = (data, options, element) => {
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
    let subBarValueTotal = data[dataIndex]["value"].length;
    let bar = "<div class='bar'></div>";
    let barLabel =
      "<div class='bar-label'>" + data[dataIndex]["barLabel"] + "</div>";
    let topOffset = yLength;

    bar = $(bar)
      .append(barLabel)
      .appendTo(chart)
      .css({
        left:
          axisMargin +
          options.barSpacing / 2 +
          (barWidth + options.barSpacing) * dataIndex,
      });

    for (let i = 0; i < subBarValueTotal; i++) {
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
          options.barDataPosition === "above"
            ? -subBarData.height()
            : options.barDataPosition === "top"
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

    xAxis = $(xAxis)
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

    yAxis = $(yAxis)
      .appendTo(chart)
      .css({ height: yLength - axisMargin, top: axisMargin, left: axisMargin });
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
      let topOffset = (maxHeight * (maxScale - i)) / maxScale;
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

  let titleSize = options.titleSize;
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
    position: "relative",
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
      value: [6],
      barColor: ["teal"],
      barLabel: "Gorillas",
    },
    {
      value: [2],
      barColor: ["teal"],
      barLabel: "Giraffes",
    },
    {
      value: [7],
      barColor: ["Teal"],
      barLabel: "Rhinos",
    },
    {
      value: [1],
      barColor: ["teal"],
      barLabel: "Lions",
    },
  ];
  let options = {
    width: 300,
    height: 200,
    title: "Zoo Animals",
    titleSize: 15,
    titleColor: "black",
    barDataPosition: "above", // above, top, middle, bottom
    barLabelColor: "black",
    barSpacing: 20,
    xLabel: "Types of Animals",
    yLabel: "Animal Population",
    maxScale: null,
  };
  let element = $("#bar-chart-1");
  drawBarChart(data, options, element);
  let data2 = [
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
  let options2 = {
    width: 300,
    height: 300,
    title: "Vegetables Bought",
    titleSize: 20,
    titleColor: "black",
    barDataPosition: "middle", // above, top, middle, bottom
    barLabelColor: "black",
    barSpacing: 10,
    xLabel: "Types of Vegetables",
    yLabel: "Weight of Vegetables (in kg)",
    maxScale: null,
  };
  let element2 = $("#bar-chart-2");
  drawBarChart(data2, options2, element2);
});
