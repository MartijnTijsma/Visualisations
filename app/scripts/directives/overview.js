'use strict';

angular.module('visualisationsApp')
.directive('adlLocations', ['D3Service', '$window', function (d3Service, $window ) {
    return {
        restrict: 'EA',
        scope: {
            rooms       : '=', //bi-directional
            locations   : '=', //bi-directional
            events      : '=', //bi-directional
            start       : '=', //bi-directional
            end         : '=', //bi-directional
            period      : '=', //bi-directional
            onClick     : '&'
        },
        link: function postLink(scope, element, attrs) {
            //d3Service.d3().then(function(d3){
                //configuration variables
                var config = {}
                config.margin           = parseInt(attrs.margin) || 20; //px
                config.lineHeight       = parseInt(attrs.lineHeight) || 40; //px
                config.linePadding      = parseInt(attrs.linePadding) || 5; //px
                config.locOffset        = Math.round(.1 * config.lineHeight); //px
                config.eventOffset      = Math.round(.5 * config.lineHeight); //px
                config.duration         = parseInt(attrs.duration) || 500; //ms
                config.step             = parseInt(attrs.step) || 10; //minutes
                config.roomNameWidth    = 0;

                console.log(config);

                var parse = d3.time.format("%Y-%m-%d %H:%M:%S").parse;
                var width = d3.select(element[0]).node().offsetWidth -config.margin;
                var height = config.lineHeight + config.linePadding;

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
                    width = d3.select(element[0]).node().offsetWidth -config.margin;
                    console.log('resize, new width: '+width)
                    scope.render(scope.rooms, scope.start, scope.end, scope.period);
                    scope.drawLocations(scope.locations, scope.start, scope.end, scope.period);
                    scope.drawEvents(scope.events, scope.start, scope.end, scope.period);
                });

                //watch for rooms data changes and re-render
                scope.$watch('rooms', function(newVal){
                    console.log('Room data changed')
                    return scope.render(newVal, scope.start, scope.end, scope.period);
                }, true);

                //watch for locations data changes and re-render
                scope.$watch('locations', function(newVal){
                    console.log('Location data changed')
                    return scope.drawLocations(newVal, scope.start, scope.end, scope.period);
                }, true);

                //watch for sensor data changes and re-render
                scope.$watch('events', function(newVal){
                    console.log('Event data changed')
                    return scope.drawEvents(newVal, scope.start, scope.end, scope.period);
                }, true);

                scope.$watch('period', function(newVal){
                    console.log('Period data changed, period: '+scope.period+', start: '+scope.start+', end: '+scope.end)
                    scope.drawLocations(scope.locations, scope.start, scope.end, scope.period);
                    scope.drawEvents(scope.events, scope.start, scope.end, scope.period);
                    return;
                }, true);



                //render
                scope.render = function(rooms, startTime, endTime, period){
                    //remove all previous items before render
                    svg.selectAll('*').remove();

                    //if we don't pass any rooms, return out of the element
                    if(!rooms || rooms.length == 0){ return; }

                    //if we don't pass a start and end date, return
                    if(!startTime || !endTime){ return; }

                    if(!period){ return; }
                    console.log('render svg, rooms: ',rooms.length);

                    //configure svg size
                    height = rooms.length * (config.lineHeight + config.linePadding);

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

                    //build the background grid
                    var grid = svg.append('g')
                        .attr('class', 'grid')
                        ;

                    var lines = grid.append('rect')
                        .attr('class', 'background')
                        .attr('width', function(){return width - config.roomNameWidth})
                        .attr('height', height)
                        .attr('x', config.roomNameWidth)
                        .attr('fill', '#cacaca')
                        ;

                    grid.append('g')
                        .attr('class', 'hours')
                        .selectAll('rect')
                        .data(d3.range(period))
                        .enter()
                            .append('rect')
                            .attr('class', 'hour')
                            .attr('height', height)
                            .attr('width', function(){
                                return (width - config.roomNameWidth) / period - 2;
                            })
                            .attr('x', function(d){
                                return (config.roomNameWidth + (((width - config.roomNameWidth) / period) * d)) +1;
                            })
                            .attr('y', 0)
                            .attr('fill', function(d){
                                return (d%2 == 1) ? '#fff' : "#deedf7";
                            })
                            .on('click', function(d){
                                return scope.onClick({'time': d});
                            });

                    //draw horizontal white grid lines
                    grid.selectAll('line')
                        .data(rooms)
                        .enter()
                            .append('line')
                            .attr('x1', config.roomNameWidth)
                            .attr('x2', width)
                            .attr('y1', function(d,i){ return (config.lineHeight + config.linePadding) *(i+1); })
                            .attr('y2', function(d,i){ return (config.lineHeight + config.linePadding) *(i+1); })
                            .style('stroke', '#fff')
                            .style('stroke-width', '2px');

                }

                scope.drawLocations = function(locations, startTime, endTime, period){
                    svg.selectAll('.timelines').remove();

                    if(!locations || !locations.rooms || locations.rooms.length == 0){ return; }

                    console.log('Draw locations: ', locations);

                    console.log(startTime+' - '+endTime)
                    //setup a scale
                    var timeScale = d3.time.scale()
                        .range([config.roomNameWidth, width])
                        .domain([parse(startTime), parse(endTime)])
                        ;

                    if(locations && locations.rooms && locations.rooms.length > 0){
                        //make a group for the timelines
                        svg.append('g')
                            .attr('class','timelines')
                            ;

                        //draw the location bars
                        for(var l=0; l<locations.rooms.length; l++){
                            var timeline = svg.selectAll('g.timelines')
                                .append('g')
                                .attr('class', 'timeline')
                                .attr('id', 'timeline-'+locations.rooms[l].name);

                            timeline.selectAll('rect')
                                .data(locations.rooms[l].locations)
                                .enter()
                                    .append('rect')
                                    .attr('x', function(d){ return timeScale(parse(d.start)); })
                                    .attr('width', 0)
                                    .attr('y', config.locOffset + (l * (config.linePadding + config.lineHeight)))
                                    .attr('height', 15)
                                    .attr('fill', 'url(#locgradient)')
                                    .transition()
                                        .duration(1000)
                                        .attr('width', function(d){ return (timeScale(parse(d.end)) - timeScale(parse(d.start))); })
                        }
                    }
                }

                scope.drawEvents = function(events, startTime, endTime, period){
                    svg.selectAll('.sparklines').remove();

                    if(!events || !events.rooms || events.rooms.length == 0){ return; }

                    console.log('draw sensor data: ', events);

                    //setup a scale
                    var timeScale = d3.time.scale()
                        .range([config.roomNameWidth, width])
                        .domain([parse(startTime), parse(endTime)])
                        ;

                    //draw the sensor events
                    if(events && events.rooms && events.rooms.length > 0){

                        //make a group for the sparklines
                        svg.append('g')
                            .attr('class', 'sparklines')


                        //configure the ammount of bins
                        var bins = period * Math.round(60 / config.step);

                        for(var e=0; e<events.rooms.length; e++){
                            var timestamps = [];
                            events.rooms[e].events.forEach(function(ts){
                                timestamps.push(parse(ts));
                            });
                            //console.log(timestamps);

                            if(timestamps.length > 0){
                                var data = d3.layout.histogram()
                                    .bins(timeScale.ticks(bins))
                                    (timestamps);

                                //console.log(data);

                                //setup a scale for the y-axis (value)
                                var yScale = d3.scale.linear()
                                    .range([Math.round(.4*config.lineHeight), 0])
                                    //.domain([0, 10]);
                                    .domain([0, d3.max(data, function(d) { return d.y; })]);
                                var sparkline = svg.selectAll('g.sparklines')
                                    .append('g')
                                    .attr('class', 'sparkline')
                                    .attr('id', 'sparkline-'+events.rooms[e].name);

                                var line = d3.svg.line()
                                    .x(function(d){ return timeScale(d.x); })
                                    .y(function(d){
                                        return (e * (config.linePadding + config.lineHeight)) + yScale(d.y) + config.eventOffset;
                                    })
                                    .interpolate('cardinal')

                                sparkline.attr("transform", "translate(0," + ((e+1) * (config.linePadding + (0.4*config.lineHeight) + config.eventOffset)) + ") scale(1, 0)")
                                    .transition().duration(1000)
                                    .attr("transform", "translate(0,0) scale(1, 1)");


                                sparkline.append('path')
                                    .attr('class', 'line')
                                    .style('stroke-width', '.5px')
                                    .style('stroke', 'red')
                                    .style('fill', 'none')
                                    .datum(data)
                                    .attr('d', line)
                            }
                        }

                    }
                }

            //});
        }
    };
}]);
