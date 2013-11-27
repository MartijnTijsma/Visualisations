'use strict';

angular.module('visualisationsApp')
.directive('roomNames',['D3Service', '$window', function (d3Service, $window ) {
    return {
        restrict: 'EA',
        scope: {
            data: '='
        },
        link: function postLink(scope, element, attrs) {
            //d3Service.d3().then(function(d3){
                //configuration variables
                var config = {}
                config.margin           = parseInt(attrs.margin) || 20; //px
                config.lineHeight       = parseInt(attrs.lineHeight) || 40; //px
                config.linePadding      = parseInt(attrs.linePadding) || 5; //px

                //select element and create svg
                var svg = d3.select(element[0])
                    .append("svg")
                    //.style('width', '100%')
                    .attr('class', 'roomNames')
                    ;

                //browser onresize event
                window.onresize = function(){
                    return scope.$apply();
                }

                //watch for resize event
                scope.$watch(function(){
                    return angular.element($window)[0].innerWidth;
                }, function(){
                    return scope.render(scope.data);
                });

                scope.$watch('data', function(newVal){
                    return scope.render(newVal)
                },true);

                scope.render = function(rooms){
                    console.log('render rooms')
                    //remove all previous items before render
                    svg.selectAll('*').remove();

                    //if we don't pass any rooms, return out of the element
                    if(!rooms || rooms.length == 0){ return; }
                    //configure svg size
                    var width = d3.select(element[0]).node().offsetWidth -config.margin;
                    var height = rooms.length * (config.lineHeight + config.linePadding);

                    svg.attr('height', height)
                        .attr('width', width);

                    //display the room names
                    var fontSize = 16;
                    svg.append('g')
                        .attr('class', 'roomnames')
                        .selectAll('text')
                        .data(rooms)
                        .enter()
                            .append('text')
                            .attr('fill', '#333')
                            .attr('text-anchor', 'end')
                            .style('font-size', fontSize+'px')
                            .style('text-align', 'right')
                            .style('font-family', 'Verdana, Arial')
                            .attr('dx', width - 15)
                            .attr('y', function(d, i){
                                return i * (config.lineHeight + config.linePadding);
                            })
                            .attr('dy', config.lineHeight / 2 + config.linePadding)
                            .text(function(d){
                                return d.transName;
                            });
                }
            //});
        }
    };
}]);
