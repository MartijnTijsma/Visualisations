'use strict';

angular.module('visualisationsApp')
.directive('adlLocations', ['D3Service', '$window', function (d3Service, $window ) {
    return {
        restrict: 'EA',
        scope: {
            data: '=', //bi-directional
        },
        link: function postLink(scope, element, attrs) {
            d3Service.d3().then(function(d3){
                //configuration variables
                var config = {}
                config.margin           = parseInt(attrs.margin) || 20;
                config.lineHeight       = parseInt(attrs.lineHeight) || 40;
                config.linePadding      = parseInt(attrs.linePadding) || 5;
                config.duration         = parseInt(attrs.duration) || 500;
                config.roomNameWidth    = 150;

                //select element and create svg
                var svg = d3.select(element[0])
                    .append("svg")
                    //.style('width', '100%')
                    .attr('class', 'overview')
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
                    return scope.render(newVal);
                }, true);

                //render
                scope.render = function(data){
                    console.log('render ', data);
                    //remove all previous items before render
                    svg.selectAll('*').remove();

                    //if we don't pass any data, return out of the element
                    if(!data){ return; }
                    //if we don't pass any rooms, return out of the element
                    if(!data.rooms || data.rooms.length == 0){ return; }
                    console.log('render data')

                    //configure svg size
                    var width = d3.select(element[0]).node().offsetWidth -config.margin;
                    var height = data.rooms.length * (config.lineHeight + config.linePadding);
                    
                    svg.attr('height', height)
                        .attr('width', width);

                    //display the room names
                    var fontSize = 16;
                    svg.selectAll('text')
                        .data(data.rooms)
                        .enter()
                            .append('text')
                            .attr('fill', '#333')
                            .attr('text-anchor', 'end')
                            .style('font-size', fontSize+'px')
                            .style('text-align', 'right')
                            //.attr('x', 25)
                            .attr('dx', config.roomNameWidth - 15)
                            .attr('y', function(d, i){
                                return i * config.lineHeight;
                            })
                            .attr('dy', config.lineHeight / 2 + config.linePadding)
                            .text(function(d){
                                return d.transRoomName;
                            })
                            ;

                    //build the background grid
                    var grid = svg.append('g')
                        .attr('class', 'grid')
                        ;
                        
                    var timelines = grid.append('rect')
                        .attr('class', 'timelines')
                        .attr('width', function(){return width - config.roomNameWidth})
                        .attr('height', height)
                        .attr('x', config.roomNameWidth)
                        .attr('fill', '#cacaca')
                        ;

                    for(var i =0; i<data.hours; i++){
                        grid.append('rect')
                            .attr('height', height)
                            .attr('width', function(){
                                return (width - config.roomNameWidth) / data.hours - 1;
                            })
                            .attr('x', function(){
                                return (config.roomNameWidth + (((width - config.roomNameWidth) / data.hours) * i)) +1;
                            })
                            .attr('y', 0)
                            .attr('fill', function(){
                                return (i%2 == 1) ? '#fff' : "#deedf7";
                            })
                            ;

                    }
                    

                }

                //redraw
                scope.redraw = function(data, duration){
                    if(!data || !data.rooms){return;}
                    console.log('redraw')
                }

                //-------------------------------------------------------
                //--------------------- Functions -----------------------
                //-------------------------------------------------------

            });
        }
    };
}]);
