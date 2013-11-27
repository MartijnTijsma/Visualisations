'use strict';

angular.module('visualisationsApp')
.directive('chart',  ['D3Service', '$window', function (d3Service, $window ) {
    return {
        restrict: 'EA',
        scope: {
            data    : '=', //bi-directional
            start   : '=',
            end     : '=',
            period  : '='
        },
        link: function postLink(scope, element, attrs) {
            //d3Service.d3().then(function(d3){
                //setup the variables
                var config = {}
                config.margin           = parseInt(attrs.margin) || 25;
                config.height           = parseInt(attrs.height) || 60;
                config.padding          = parseInt(attrs.padding) || 5;
                config.duration         = parseInt(attrs.duration) || 500;

                //setup a datetime parser
                var parse = d3.time.format("%Y-%m-%d %H:%M:%S").parse;


                //select element and create svg
                var svg = d3.select(element[0])
                    .append("svg")
                    //.style('width', '100%')
                    .attr('class', 'chart')
                    ;

                //browser onresize event
                window.onresize = function(){
                    scope.$apply();
                }

                //watch for resize event
                scope.$watch(function(){
                    return angular.element($window)[0].innerWidth;
                }, function(){
                    scope.render(scope.data, scope.start, scope.end, scope.period);
                });

                //watch for data changes and re-render
                scope.$watch('data', function(newVal){
                    return scope.render(newVal, scope.start, scope.end, scope.period);
                }, true);

                //render
                scope.render = function(data, startTime, endTime, period){
                    //remove all previous items before render
                    svg.selectAll('*').remove();

                    //if we don't pass any data, return out of the element
                    if(!data){ return; }

                    //if we don't pass a start and end date, return
                    if(!startTime || !endTime){ return; }

                    //setup the period
                    config.period = period || 24;

                    //configure svg size
                    var width = d3.select(element[0]).node().offsetWidth - (config.margin *2);

                    var chart = svg.attr('height', config.height + (config.margin *2))
                        .attr('width', width + (config.margin *2))
                        .append("g")
                            .attr("transform", "translate(" + (config.margin *2) + "," + config.margin+ ")");;


                    //setup a scale for the x-axis (time)
                    var timeScale = d3.time.scale()
                        .range([config.padding, (width - config.padding ) ])
                        //.domain([new Date(data[0]*1000), new Date(data[data.length-1]*1000)])
                        .domain([parse(scope.start), parse(scope.end)])
                        ;

                    //setup a scale for the y-axis (value)
                    var yScale = d3.scale.linear()
                        .range([config.height, 0])
                        //.domain(d3.extent(data, function(d){return d.maximum;}));
                        .domain([0, 1000])

                    //draw the grid
                    var grid = chart.append('g')
                        .attr('class', 'grid');

                    //setup a base rectangle, whole width & height
                    grid.append('rect')
                        .attr('x', 0)
                        .attr('y', 0)
                        .attr('height', config.height)
                        .attr('width', width)
                        .attr('fill', '#fff')

                    //draw the vertical grid
                    var gridLines;
                    if(config.period == 1) { //1 hour period, line per quarter
                        gridLines = 4;
                    } else if(config.period > 1 && config.period <= 24){ // line per hour
                        gridLines = config.period;
                    } else { // line per day
                        gridLines = Math.round(config.period / 24);
                    }

                    //vertical lines
                    grid.selectAll(".vline").data(d3.range(gridLines)).enter()
                        .append("line")
                        .attr("x1", function (d) {
                            return config.padding + (d * (width - (config.padding*2)) / gridLines);
                        })
                        .attr("x2", function (d) {
                            return config.padding + (d * (width - (config.padding*2)) / gridLines);
                        })
                        .attr("y1", function (d) {
                            return 0;
                        })
                        .attr("y2", function (d) {
                            return config.height;
                        })
                        .style("stroke", "#ddd")
                        .style('stroke-width', '2px');

                    //draw the area
                    var area = d3.svg.area()
                        .x(function(d){
                            return timeScale(parse(d.timestamp));
                        })
                        .y0(function(d){
                            return yScale(d.maximum);
                        })
                        .y1(function(d){
                            return yScale(d.minimum);
                        });

                    chart.append("path")
                        .attr('class', 'area')
                        .datum(data)
                        .attr("d", area)
                        .style('fill', '#428BCA')
                        .style('fill-opacity', '0.25');

                    //draw the line
                    var line = d3.svg.line()
                        .x(function(d){
                            return timeScale(parse(d.timestamp));
                        })
                        .y(function(d){
                            return yScale(d.average);
                        })
                        //.interpolate('basis');
                        .interpolate('linear');

                    chart.append("path")
                        .attr('class', 'line')
                        .datum(data)
                        .attr("d", line)
                        .style('stroke', '#428BCA')


                    var yAxis = d3.svg.axis().scale(yScale)
                        .orient("left").ticks(3);

                    chart.append('g')
                        .attr('class', 'y axis')
                        .call(yAxis)

                    var xAxis = d3.svg.axis()
                        .scale(timeScale)
                        .orient("bottom")
                        .tickFormat(d3.time.format('%H:%M'))

                    chart.append('g')
                        .attr('class', 'x axis')
                        .attr('transform', 'translate(0,'+config.height+')')
                        .call(xAxis)
                }
            //});
        }
    };
}]);
