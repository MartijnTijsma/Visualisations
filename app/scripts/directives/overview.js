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

                    //define the gradient
                    var locGradient = svg.append('svg:defs')
                        .append('svg:linearGradient')
                            .attr('id','locgradient')
                            .attr('x1', '0%')
                            .attr('y1', '0%')
                            .attr('x2', '0%')
                            .attr('y2', '100%')
                            .attr('spreadMethod', 'pad');

                    locGradient.append('svg:stop')
                        .attr('offset', '0%')
                        .attr('stop-color', '#BDB0C4')
                        .attr('stop-opacity', 1);

                    locGradient.append('svg:stop')
                        .attr('offset', '100%')
                        .attr('stop-color', '#51196D')
                        .attr('stop-opacity', 1);

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
                            .style('font-family', 'Verdana, Arial')
                            .attr('dx', config.roomNameWidth - 15)
                            .attr('y', function(d, i){
                                return i * (config.lineHeight + config.linePadding);
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
                        .attr('class', 'background')
                        .attr('width', function(){return width - config.roomNameWidth})
                        .attr('height', height)
                        .attr('x', config.roomNameWidth)
                        .attr('fill', '#cacaca')
                        ;

                    //draw vertical backgroud rectangles, with alternating colors
                    for(var i =0; i<data.hours; i++){
                        grid.append('rect')
                            .attr('class', 'hour')
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

                    //draw horizontal white grid lines                    
                    grid.selectAll('line')
                        .data(data.rooms)
                        .enter()
                            .append('line')
                            .attr('x1', config.roomNameWidth)
                            .attr('x2', width)
                            .attr('y1', function(d,i){ return (config.lineHeight + config.linePadding) *(i+1); })
                            .attr('y2', function(d,i){ return (config.lineHeight + config.linePadding) *(i+1); })
                            .style('stroke', '#fff')
                            .style('stroke-width', '2px')


                    var parse = d3.time.format("%Y-%m-%d %H:%M:%S").parse;
                    
                    //setup a scale
                    var timeScale = d3.time.scale()
                        .range([config.roomNameWidth, width])
                        .domain([parse(data.startTime), parse(data.endTime)])
                        ;

                    //draw the location bars
                    svg.append('g')
                        .attr('class','timelines')
                        ;

                    for(var r=0; r<data.rooms.length; r++){
                        svg.selectAll('g.timelines')
                            .append('g')
                            .attr('class', 'timeline')
                            .selectAll('rect')
                            .data(data.rooms[r].locations)
                            .enter()
                                .append('rect')
                                .attr('x', function(d){
                                    return timeScale(new Date(d.start))
                                })
                                .attr('y', (20 + config.linePadding + (r * config.lineHeight)))
                                .attr('width', function(d){
                                    return (timeScale(parse(d.end)) - timeScale(parse(d.start)))
                                })
                                .attr('height', 15)
                                .attr('fill', 'url(#locgradient)')
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
