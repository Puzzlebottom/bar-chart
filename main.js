const drawBarChart = (data, options, element) => {
  let axisMargin = options.titleSize * 2;
  let chart = element.css({
    position: "relative",
    height: options.height,
    width: options.width,
  });

  const calculateSubdivisionsOfScale = () => {
    let divisors = [6, 5, 4];
    let sumOfSubBarValues = getSumOfSubBarValues();
    let yScaleExcessByDivisor = [];
    for (let divisor of divisors) {
      if (sumOfSubBarValues % divisor === 0) {
        return divisor;
      }
      yScaleExcessByDivisor.push(divisor - (sumOfSubBarValues % divisor));
    }
    return divisors[
      yScaleExcessByDivisor.indexOf(Math.min(...yScaleExcessByDivisor))
    ];
  };

  const getMaxValueOfScale = () => {
    let sumOfSubBarValues = getSumOfSubBarValues();
    let scaleDivisor = calculateSubdivisionsOfScale();

    if (options.maxScale) {
      return options.maxScale;
    } else if (sumOfSubBarValues % scaleDivisor === 0) {
      return sumOfSubBarValues;
    } else {
      let yScaleExcess = scaleDivisor - (sumOfSubBarValues % scaleDivisor);
      return sumOfSubBarValues + yScaleExcess;
    }
  };

  const getSumOfSubBarValues = () => {
    let max = 0;
    for (let i = 0; i < data.length; i++) {
      let dataSum = data[i]["value"].reduce((a, b) => a + b);
      if (dataSum > max) {
        max = dataSum;
      }
    }
    return max;
  };

  const renderTitle = () => {
    let fontSize = options.titleSize;
    let verticalOffset = fontSize * 0.2;

    let title = $("<div id='title'></div>")
      .appendTo(chart)
      .text(options.title)
      .css({ "font-size": fontSize });
    title.css({
      color: options.titleColor,
      top: verticalOffset,
      left: options.width / 2 - title.width() / 2,
    });
  };

  const renderBarData = (subBarElement) => {};

  const renderBar = (dataIndex) => {
    let xAxisLength = options.width - axisMargin;
    let numberOfBars = data.length;
    let barWidth = xAxisLength / numberOfBars - options.barSpacing;
    let totalNumberOfSubBars = data[dataIndex]["value"].length;
    let maxValueOfScale = getMaxValueOfScale();
    let yAxisLength = options.height - axisMargin * 2;
    let verticalOffset = yAxisLength + axisMargin;

    let bar = $("<div class='bar'></div>")
      .appendTo(chart)
      .css({
        left:
          axisMargin +
          options.barSpacing / 2 +
          (barWidth + options.barSpacing) * dataIndex,
      });

    for (let i = 0; i < totalNumberOfSubBars; i++) {
      let value = data[dataIndex]["value"][i];
      let subBarHeight = (value / maxValueOfScale) * yAxisLength;
      let subBarColor = data[dataIndex]["barColor"][i];
      verticalOffset -= subBarHeight;

      let subBar = $("<div class='sub-bar'></div>").appendTo(bar).css({
        height: subBarHeight,
        width: barWidth,
        top: verticalOffset,
        background: subBarColor,
      });

      if (options.barDataPosition) {
        let subBarValue = data[dataIndex]["value"][i];
        let fontSize = Math.floor(options.titleSize * 0.6);
        let subBarData = $("<div class='bar-data'></div>")
          .text(subBarValue)
          .appendTo(subBar)
          .css({ "font-size": fontSize });
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

    $(bar)
      .append(
        "<div class='bar-label'>" + data[dataIndex]["barLabel"] + "</div>"
      )
      .appendTo(chart);

    barLabel = bar
      .find(".bar-label")
      .css({ "font-size": Math.floor(options.titleSize * 0.6) });
    barLabel.css({
      top: options.height - axisMargin,
      left: barWidth / 2 - barLabel.width() / 2,
    });
  };

  const renderXAxis = () => {
    let xAxis = $("<div id='x-axis'></div>")
      .appendTo(chart)
      .css({
        width: options.width - axisMargin,
        top: options.height - axisMargin,
        left: axisMargin,
      });
    renderXLabel(xAxis);
  };

  const renderXLabel = (axisElement) => {
    let fontSize = Math.floor(options.titleSize * 0.8);
    let xLabel = $("<div id='x-label'></div>")
      .appendTo(axisElement)
      .text(options.xLabel)
      .css({ "font-size": fontSize });
    xLabel.css({
      top: xLabel.height(),
      left: axisElement.width() / 2 - xLabel.width() / 2,
    });
  };

  const renderYAxis = () => {
    let yAxisLength = options.height - axisMargin * 2;
    yAxis = $("<div id='y-axis'></div>").appendTo(chart).css({
      height: yAxisLength,
      top: axisMargin,
      left: axisMargin,
    });

    renderYLabel(yAxis);
    renderScale(yAxis);
  };

  const renderYLabel = (axisElement) => {
    let fontSize = Math.floor(options.titleSize * 0.8);
    let yAxisLength = options.height - axisMargin * 2;
    let yLabel = $("<div id='y-label'></div>")
      .appendTo(axisElement)
      .text(options.yLabel)
      .css({ "font-size": fontSize });
    yLabel.css({
      top: yAxisLength / 2 + yLabel.width() / 2,
      left: -(fontSize * 2),
    });
    return yLabel;
  };

  const renderScale = (axisElement) => {
    let scaleDivisor = calculateSubdivisionsOfScale();
    let maxValueOfScale = getMaxValueOfScale();
    let scaleIncrement = maxValueOfScale / scaleDivisor;
    let yAxisLength = options.height - axisMargin * 2;
    let fontSize = Math.floor(options.titleSize * 0.6);

    for (
      let scaleValue = maxValueOfScale;
      scaleValue >= 0;
      scaleValue -= scaleIncrement
    ) {
      let topOffset =
        (yAxisLength * (maxValueOfScale - scaleValue)) / maxValueOfScale;
      let mark = $("<div class='scale-mark'></div>")
        .appendTo(axisElement)
        .text(scaleValue)
        .css({ "font-size": fontSize });
      mark.css({
        top: topOffset - mark.height() / 2,
        left: -(mark.width() + fontSize * 0.2),
      });

      if (scaleValue !== 0) {
        $("<div class='scale-line'></div>")
          .appendTo(axisElement)
          .css({ width: options.width - axisMargin, top: topOffset, left: 1 });
      }
    }
  };

  renderXAxis();
  renderYAxis();
  renderTitle();
  for (let i = 0; i < data.length; i++) {
    renderBar(i);
  }
};
