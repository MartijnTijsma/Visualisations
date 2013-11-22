'use strict';

angular.module('visualisationsApp')
.directive('adlLocations', ['D3Service', '$window', function (d3Service, $window ) {
    return {
        restrict: 'EA',
        scope: {
            locations   : '=', //bi-directional
            start       : '=', //bi-directional
            end         : '=', //bi-directional
            period      : '=', //bi-directional
        },
        link: function postLink(scope, element, attrs) {
            d3Service.d3().then(function(d3){
                //configuration variables
                var config = {}
                config.margin           = parseInt(attrs.margin) || 20;
                config.locOffset        = parseInt(attrs.offset) || 15;
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
                    scope.render(scope.locations, scope.start, scope.end, scope.period);
                });

                //watch for data changes and re-render
                scope.$watch('locations', function(newVal){
                    return scope.render(newVal, scope.start, scope.end, scope.period);
                }, true);

                //render
                scope.render = function(locations, startTime, endTime, period){
                    console.log('render');
                    //remove all previous items before render
                    svg.selectAll('*').remove();

                    //if we don't pass any data, return out of the element
                    if(!locations){ return; }
                    
                    //if we don't pass any rooms, return out of the element
                    if(!locations.rooms || locations.rooms.length == 0){ return; }
                    console.log(locations.rooms.length + ' rooms')
                    
                    //if we don't pass a start and end date, return
                    if(!startTime || !endTime){ return; }
                    console.log('startTime: '+startTime+', endTime: '+endTime);

                    //if we don't pass a period, return
                    if(!period){ return; }
                    console.log(period)

                    console.log('render locations: ', locations)

                    //configure svg size
                    var width = d3.select(element[0]).node().offsetWidth -config.margin;
                    var height = locations.rooms.length * (config.lineHeight + config.linePadding);
                    
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
                    svg.append('g')
                        .attr('class', 'roomnames')
                        .selectAll('text')
                        .data(locations.rooms)
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
                    for(var i =0; i<period; i++){
                        grid.append('rect')
                            .attr('class', 'hour')
                            .attr('height', height)
                            .attr('width', function(){
                                return (width - config.roomNameWidth) / period - 1;
                            })
                            .attr('x', function(){
                                return (config.roomNameWidth + (((width - config.roomNameWidth) / period) * i)) +1;
                            })
                            .attr('y', 0)
                            .attr('fill', function(){
                                return (i%2 == 1) ? '#fff' : "#deedf7";
                            })
                            ;
                    }

                    //draw horizontal white grid lines                    
                    grid.selectAll('line')
                        .data(locations.rooms)
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
                        .domain([parse(startTime), parse(endTime)])
                        ;

                    //draw the location bars
                    svg.append('g')
                        .attr('class','timelines')
                        ;

                    for(var r=0; r<locations.rooms.length; r++){
                        var timeline = svg.selectAll('g.timelines')
                            .append('g')
                            .attr('class', 'timeline')
                            .attr('id', 'timeline-'+locations.rooms[r].roomName);

                        timeline.selectAll('rect')
                            .data(locations.rooms[r].locations)
                            .enter()
                                .append('rect')
                                .attr('x', function(d){
                                    return timeScale(parse(d.start))
                                })
                                .attr('y', config.locOffset + (r * (config.linePadding + config.lineHeight)))
                                .attr('width', function(d){
                                    return (timeScale(parse(d.end)) - timeScale(parse(d.start)))
                                })
                                .attr('height', 15)
                                .attr('fill', 'url(#locgradient)');


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
