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
            d3Service.d3().then(function(d3){
                //setup the variables
                var config = {}
                config.margin           = parseInt(attrs.margin) || 20;
                config.height           = parseInt(attrs.height) || 60;
                config.padding          = parseInt(attrs.padding) || 5;
                config.duration         = parseInt(attrs.duration) || 500;
                config.roomNameWidth    = 150;

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
                    var width = d3.select(element[0]).node().offsetWidth -config.margin;

                    svg.attr('height', config.height)
                        .attr('width', width);


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
                    var grid = svg.append('g')
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

                    for(var lineNr=0; lineNr<=gridLines; lineNr++){
                        grid.append('line')
                            .attr('x1', config.padding + (lineNr * (width - (config.padding*2)) / gridLines))
                            .attr('x2', config.padding + (lineNr * (width - (config.padding*2)) / gridLines))
                            .attr('y1', 0)
                            .attr('y2', config.height)
                            .style('stroke', '#ddd')
                            .style('stroke-width', '2px')
                    }

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

                    svg.append("path")
                        .attr('class', 'line')
                        .datum(data)
                        .attr("d", line)
                        .style('stroke', '#428BCA')


                }
            });
        }
    };
}]);
