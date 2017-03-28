/**
 * Created by cdyf on 14-7-2.
 */
$(function () {
    return;
    $('#data_table').dataTable({
        "ajax": 'http://127.0.0.1:8080/jwms-web/configuration/systemCode/getUrl',
        "autoWidth": false
    });

    var offset = {};
    var lastEvent = null;
    var lastWidth = 0;
    var maskBlock = null;

    function onMouseMove(e) {
        var position = {
            x: e.pageX,
            y: e.pageY
        };

        var changeWidth = position.x - offset.x;
        var resultWidth = lastWidth + changeWidth;

        var ths = $('#data_table').find('th');
        for(var i=0;i<ths.length;i++) {
            if(ths[i] === lastEvent) {
                break;
            }
        }

        $('#data_table').find('tbody tr').each(function(index, row) {
            $(row).find('td').eq(i).width(resultWidth);
        });
    }

    function onMouseUp(e) {
        $(document).unbind('mousemove', onMouseMove);
        $(document).unbind('mouseup', onMouseUp);

        maskBlock.remove();
        return false;
    }

    $('#data_table').find('th').bind('mousedown', function(e) {
        offset = {
            x: e.pageX,
            y: e.pageY
        };
        lastEvent = this;
        lastWidth = $(lastEvent).width();
        maskBlock = $('<div/>').css({
            width:$(this).width() + parseInt($(this).css('padding-left'), 10) * 2,
            height:$(this).height() + parseInt($(this).css('padding-top'), 10) * 2,
            position:'absolute',
            top:$(this).offset().top,
            left:$(this).offset().left,
            opacity:0.5
        }).appendTo('body');
        $(document).bind('mousemove', onMouseMove);
        $(document).bind('mouseup', onMouseUp);
    });
});
