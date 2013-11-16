'use strict';

angular.module('visualisationsApp')
.directive('gauge', ['D3Service', '$window', function (d3Service, $window) {
    return {
        restrict: 'EA',
        scope: {
            data: '=', //bi-directional
        },
        link: function postLink(scope, element, attrs) {
            d3Service.d3().then(function(d3){
                //variables
                var size        = parseInt(attrs.size) || 250;
                size            = size * 0.9;
                var radius      = size * 0.97 / 2;
                var cx          = size / 2;
                var cy          = size / 2;
                var label       = attrs.label || 'gauge';
                var min         = parseInt(attrs.min) || 0;
                var max         = parseInt(attrs.max) || 100;
                var duration   = parseInt(attrs.duration) || 500;
                var minorTicks  = 5;
                var majorTicks  = 5;
                var range       = max - min;
                var greenZones  = [];
                var yellowZones = [ { from: min + range*0.75, to: min + range*0.9 } ];
                var redZones    = [ { from: min + range*0.9, to: max } ];

                //colors
                var greenColor  = "#109618";
                var yellowColor = "#FF9900";
                var redColor    = "#DC3912";

                //select element and create svg
                var svg = d3.select(element[0])
                    .append("svg")
                    //.style('width', '100%')
                    .attr('class', 'gauge')
                    ;

                //browser onresize event
                window.onresize = function(){
                    scope.$apply();
                }

                //watch for resize event
                scope.$watch(function(){
                    return angular.element($window)[0].innerWidth;
                }, function(){
                    scope.render(scope.data);
                });

                //watch for data changes and re-render
                scope.$watch('data', function(newVal){
                    return scope.redraw(newVal, duration);
                }, true);

                //render
                scope.render = function(data){
                    //remove all previous items before render
                    svg.selectAll('*').remove();

                    //if we don't pass any data, return out of the element
                    if(!data){ return; }

                    //configure the size
                    svg.attr('height', size)
                        .attr('width', size)
                        ;

                    //base circles
                    svg.append('circle')
                        .attr('cx', cx)
                        .attr('cy', cy)
                        .attr('r', radius)
                        .style('fill', '#ccc')
                        .style('stroke', '#000')
                        .style('stroke-width', '0.5px');

                    svg.append('circle')
                        .attr('cx', cx)
                        .attr('cy', cy)
                        .attr('r', radius*0.9)
                        .style('fill', '#fff')
                        .style('stroke', '#e0e0e0')
                        .style('stroke-width', '2px');

                    //colored bands
                    for(var index in greenZones){
                        drawBand(greenZones[index].from, greenZones[index].to, greenColor);
                    }

                    for(var index in yellowZones){
                        drawBand(yellowZones[index].from, yellowZones[index].to, yellowColor);
                    }
                    for(var index in redZones){
                        drawBand(redZones[index].from, redZones[index].to, redColor);
                    }

                    //label text
                    if(label){
                        var fontSize = Math.round(size / 9);
                        svg.append('text')
                            .attr('x', cx)
                            .attr('y', cy / 2 + fontSize / 2)
                            .attr('dy', fontSize / 2)
                            .attr('text-anchor', 'middle')
                            .text(label)
                            .style('font-size', fontSize+'px')
                            .style('fill', '#333')
                            .style('stroke-width', '0px');
                    }

                    //ticks
                    var fontSize = Math.round(size / 16);
                    var majorDelta = range / (majorTicks -1);
                    for(var major = min; major <= max; major += majorDelta){
                        var minorDelta = majorDelta / minorTicks;

                        for(var minor = (major + minorDelta); minor < Math.min(major + majorDelta, max); minor += minorDelta ){
                            var point1 = valueToPoint(minor, 0.75);
                            var point2 = valueToPoint(minor, 0.85);

                            svg.append('line')
                                .attr('x1', point1.x)
                                .attr('y1', point1.y)
                                .attr('x2', point2.x)
                                .attr('y2', point2.y)
                                .style('stroke', '#666')
                                .style('stroke-width', '1px');
                        }

                        var point1 = valueToPoint(major, 0.7);
                        var point2 = valueToPoint(major, 0.85);

                        svg.append('line')
                            .attr('x1', point1.x)
                            .attr('y1', point1.y)
                            .attr('x2', point2.x)
                            .attr('y2', point2.y)
                            .style('stroke', '#333')
                            .style('stroke-width', '2px');

                        //label min & max
                        if (major == min || major == max){
                            var point = valueToPoint(major, 0.63);

                            svg.append("svg:text")
                                        .attr("x", point.x)
                                        .attr("y", point.y)
                                        .attr("dy", fontSize / 3)
                                        .attr("text-anchor", major == min ? "start" : "end")
                                        .text(major)
                                        .style("font-size", fontSize + "px")
                                        .style("fill", "#333")
                                        .style("stroke-width", "0px");
                        }
                    }

                    //pointer
                    var pointerContainer = svg.append('g').attr('class', 'pointerContainer');

                    var midValue = (min + max) / 2;

                    var pointerPath = buildPointerPath(midValue);

                    var pointerLine = d3.svg.line()
                                        .x(function(d) { return d.x})
                                        .y(function(d) { return d.y})
                                        .interpolate('basis');

                    pointerContainer.selectAll('path')
                        .data([pointerPath])
                        .enter()
                            .append('path')
                                .attr('d', pointerLine)
                                .style('fill', '#dc3912')
                                .style("stroke", "#c63310")
                                .style("fill-opacity", 0.7)

                    pointerContainer.append('circle')
                        .attr('cx', cx)
                        .attr('cy', cy)
                        .attr('r', 0.12*radius)
                        .style("fill", "#4684EE")
                        .style("stroke", "#666")
                        .style("opacity", 1);

                    var fontSize = Math.round(size / 10);
                    pointerContainer.selectAll("text")
                            .data([midValue])
                            .enter()
                                .append("svg:text")
                                    .attr("x", cx)
                                    .attr("y", size - cy / 4 - fontSize)
                                    .attr("dy", fontSize / 2)
                                    .attr("text-anchor", "middle")
                                    .style("font-size", fontSize + "px")
                                    .style("fill", "#000")
                                    .style("stroke-width", "0px");


                    //intial draw call
                    scope.redraw(data);

                }
                //-------------------------------------------------------
                //--------------------- Functions -----------------------
                //-------------------------------------------------------
                //draw a band
                function drawBand(start, end, color){
                    if(end - start <= 0) { return; }

                    svg.append('path')
                        .style('fill', color)
                        .attr('d', d3.svg.arc()
                            .startAngle(valueToRadians(start))
                            .endAngle(valueToRadians(end))
                            .innerRadius(0.65 * radius)
                            .outerRadius(0.85 * radius)
                        )
                        .attr('transform', function(){return "translate(" + cx + ", " + cy + ") rotate(270)"})
                }

                //
                function valueToPoint(value, factor){
                    var point = {
                        x : cx - radius * factor * Math.cos(valueToRadians(value)),
                        y : cy - radius * factor * Math.sin(valueToRadians(value)),
                    };
                    return point
                }

                function valueToRadians(value){
                    return valueToDegrees(value) * Math.PI / 180;
                }

                function valueToDegrees(value){
                    return (value / range * 270) - (min / range * 270 + 45);
                }

                //pointer path
                function buildPointerPath(value){
                    var delta = range / 13;

                    var head = pathValueToPoint(value, 0.85);
                    var head1 = pathValueToPoint(value - delta, 0.12);
                    var head2 = pathValueToPoint(value + delta, 0.12);

                    var tailValue = value - (range * (1/(270/360)) / 2);
                    var tail = pathValueToPoint(tailValue, 0.28);
                    var tail1 = pathValueToPoint(tailValue - delta, 0.12);
                    var tail2 = pathValueToPoint(tailValue + delta, 0.12);

                    return [head, head1, tail2, tail, tail1, head2, head];

                    function pathValueToPoint(value, factor)
                    {
                        var point = valueToPoint(value, factor);
                        point.x -= cx;
                        point.y -= cy;
                        return point;
                    }
                }


                scope.redraw = function(value, duration){
                    var pointerContainer = svg.select(".pointerContainer");
                    pointerContainer.selectAll("text").text(Math.round(value));

                    var pointer = pointerContainer.selectAll("path");

                    pointer.transition()
                        .duration(duration)
                        //.delay(0)
                        //.ease("linear")
                        //.attr("transform", function(d)
                        .attrTween("transform", function()
                        {
                            var pointerValue = value;
                            if (value > max) pointerValue = max + 0.02*range;
                            else if (value < min) pointerValue = min - 0.02*range;
                            var targetRotation = (valueToDegrees(pointerValue) - 90);
                            var currentRotation = self._currentRotation || targetRotation;
                            self._currentRotation = targetRotation;

                            return function(step)
                            {
                                var rotation = currentRotation + (targetRotation-currentRotation)*step;
                                return "translate(" + cx + ", " + cy + ") rotate(" + rotation + ")";
                            }
                        });
                }
            });
        }
    };
}]);
