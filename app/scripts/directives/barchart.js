'use strict';
//http://www.ng-newsletter.com/posts/d3-on-angular.html
angular.module('visualisationsApp')
.directive('barChart', ['D3Service', '$window', function (d3Service, $window) {
    return {
        restrict: 'EA',
        scope: {
            data: '=' // bi-directional data-binding
        },
        link: function postLink(scope, element, attrs) {
            //d3Service.d3().then(function(d3){
                //variables
                var margin = parseInt(attrs.margin) || 20;
                var barHeight = parseInt(attrs.barHeight) || 20;
                var barPadding = parseInt(attrs.barPadding) || 5;

                //select element and create svg
                var svg = d3.select(element[0])
                    .append("svg")
                    .style('width', '100%')
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
                scope.$watch('data', function(newVals, oldVals){
                    return scope.render(newVals);
                }, true);

                //render
                scope.render = function(data){
                    //remove all previous items before render
                    svg.selectAll('*').remove();

                    //if we don't pass any data, return out of the element
                    if(!data){ return; }

                    //setup variables
                    var width = d3.select(element[0]).node().offsetWidth -margin;
                    var height = scope.data.length * (barHeight + barPadding);

                    //use category20() scale function for multicolor support
                    var color =d3.scale.category20();

                    //xScale
                    var xScale = d3.scale.linear()
                        .domain([0, d3.max(data, function(d){
                            return d.score;
                        })])
                        .range([0, width])
                        ;

                    //set the height based on calculations
                    svg.attr('height', height);

                    //create rectangles for the bar chart
                    svg.selectAll('rect')
                        .data(data)
                        .enter()
                            .append('rect')
                            .attr('height', barHeight)
                            .attr('width', 140)
                            .attr('x', Math.round(margin/2))
                            .attr('y', function(d, i){
                                return i * (barHeight + barPadding);
                            })
                            .attr('fill', function(d){
                                return color(d.score);
                            })
                            .transition()
                                .duration(1000)
                                .attr('width', function(d){
                                    return xScale(d.score)
                                })
                                ;
                    //create text
                    svg.selectAll('text')
                        .data(data)
                        .enter()
                            .append('text')
                            .attr('fill', '#fff')
                            .attr('y', function(d,i){
                                return i * (barHeight + barPadding) + (0.5 * barHeight + barPadding);
                            })
                            .attr('x', 15)
                            .text(function(d){
                                return d.name+' ('+d.score+')';
                            })
                            ;

                }
            //});
        }
    };
}]);
