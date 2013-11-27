'use strict';

angular.module('visualisationsApp')
.directive('histogram',['D3Service', '$window', function (d3Service, $window) {
    return {
        restrict: 'EA',
        link: function postLink(scope, element, attrs) {
            //d3Service.d3().then(function(d3){
                var parse = d3.time.format("%Y-%m-%d %H:%M:%S").parse;

                var ts = [];
                ts.push(parse('2013-11-19 02:57:48'));
                ts.push(parse('2013-11-19 02:57:55'));
                ts.push(parse('2013-11-19 02:57:59'));
                ts.push(parse('2013-11-19 02:58:05'));
                ts.push(parse('2013-11-19 02:58:12'));
                ts.push(parse('2013-11-19 03:01:45'));
                ts.push(parse('2013-11-19 03:01:49'));
                ts.push(parse('2013-11-19 03:01:59'));
                ts.push(parse('2013-11-19 06:37:54'));
                ts.push(parse('2013-11-19 06:38:00'));
                ts.push(parse('2013-11-19 06:38:07'));
                ts.push(parse('2013-11-19 06:38:11'));
                ts.push(parse('2013-11-19 06:39:46'));
                ts.push(parse('2013-11-19 06:39:52'));
                ts.push(parse('2013-11-19 06:40:40'));
                ts.push(parse('2013-11-19 06:40:45'));
                ts.push(parse('2013-11-19 06:41:31'));
                ts.push(parse('2013-11-19 06:41:48'));
                ts.push(parse('2013-11-19 06:42:12'));
                ts.push(parse('2013-11-19 06:42:23'));
                ts.push(parse('2013-11-19 06:42:27'));
                ts.push(parse('2013-11-19 06:42:30'));
                ts.push(parse('2013-11-19 06:42:38'));
                ts.push(parse('2013-11-19 06:42:41'));
                ts.push(parse('2013-11-19 06:42:47'));
                ts.push(parse('2013-11-19 06:43:08'));
                ts.push(parse('2013-11-19 06:43:15'));
                ts.push(parse('2013-11-19 06:43:18'));
                ts.push(parse('2013-11-19 22:39:41'));
                ts.push(parse('2013-11-19 22:39:45'));
                ts.push(parse('2013-11-19 22:39:59'));
                ts.push(parse('2013-11-19 22:40:07'));
                ts.push(parse('2013-11-19 22:40:19'));
                ts.push(parse('2013-11-19 22:40:35'));
                ts.push(parse('2013-11-19 22:40:41'));
                ts.push(parse('2013-11-19 22:40:55'));
                ts.push(parse('2013-11-19 22:41:03'));
                ts.push(parse('2013-11-19 22:41:36'));
                ts.push(parse('2013-11-19 22:41:41'));
                ts.push(parse('2013-11-19 22:41:43'));
                ts.push(parse('2013-11-19 22:42:55'));
                ts.push(parse('2013-11-19 22:42:59'));
                ts.push(parse('2013-11-19 22:43:06'));
                ts.push(parse('2013-11-19 22:44:30'));
                ts.push(parse('2013-11-19 22:44:36'));
                ts.push(parse('2013-11-19 22:44:45'));
                ts.push(parse('2013-11-19 22:44:52'));
                ts.push(parse('2013-11-19 22:44:57'));
                ts.push(parse('2013-11-19 22:45:01'));
                ts.push(parse('2013-11-19 22:45:06'));
                ts.push(parse('2013-11-19 22:45:49'));
                ts.push(parse('2013-11-19 22:45:53'));
                ts.push(parse('2013-11-19 22:45:58'));
                ts.push(parse('2013-11-19 22:46:08'));
                ts.push(parse('2013-11-19 22:46:21'));
                ts.push(parse('2013-11-19 22:46:27'));
                ts.push(parse('2013-11-19 22:46:31'));
                ts.push(parse('2013-11-19 22:46:34'));
                ts.push(parse('2013-11-19 22:46:54'));
                ts.push(parse('2013-11-19 22:47:01'));
                ts.push(parse('2013-11-19 22:47:18'));
                ts.push(parse('2013-11-19 22:47:37'));
                ts.push(parse('2013-11-19 22:47:42'));
                ts.push(parse('2013-11-19 22:49:33'));
                ts.push(parse('2013-11-19 22:49:41'));
                ts.push(parse('2013-11-19 22:50:06'));

                //console.log(ts);
                // Generate a log-normal distribution with a median of 30 minutes.
                var values = d3.range(1000).map(d3.random.logNormal(Math.log(30), .4));
                //console.log(values)

                // Formatters for counts and times (converting numbers to Dates).
                var formatCount = d3.format(",.0f"),
                    formatTime = d3.time.format("%H"),
                    formatMinutes = function(d) { return formatTime(new Date(2012, 0, 1, 0, d)); };

                var margin = {top: 10, right: 30, bottom: 30, left: 30},
                    width = 960 - margin.left - margin.right,
                    height = 350 - margin.top - margin.bottom;

                var x = d3.time.scale()
                    .domain([parse("2013-11-19 00:00:00"), parse("2013-11-20 00:00:00")])
                    .range([0, width]);

                var bins = 24*12;
                // Generate a histogram using twenty uniformly-spaced bins.
                var data = d3.layout.histogram()
                    .bins(x.ticks(bins))
                    (ts);

                //console.log(data);
                var y = d3.scale.linear()
                    .domain([0, 25])
                    .range([height, 0]);

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    .ticks(24)
                    .tickFormat(formatTime);

                var svg = d3.select(element[0])
                    .append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var bar = svg.selectAll(".bar")
                    .data(data)
                  .enter().append("g")
                    .attr("class", "bar")
                    .attr("transform", function(d) {
                        return "translate(" + x(d.x) + "," + y(d.y) + ")";
                    });

                bar.append("rect")
                    .attr("x", function(d){
                        return x(d.x)
                    })
                    .attr("width", width/bins)
                    .attr("height", function(d) {
                        return height - y(d.y);
                    });

                bar.append("text")
                    .attr("dy", ".75em")
                    .attr("y", 6)
                    .attr("x", x(data[0].dx) / 2)
                    .attr("text-anchor", "middle")
                    .text(function(d) { return formatCount(d.y); });

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);


            //});
        }
    };
}]);
