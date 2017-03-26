/**
 * Created by artist on 14-2-26.
 */

/* API method to get paging information */
$.fn.dataTableExt.oApi.fnPagingInfo = function ( oSettings )
{
    return {
        "iStart":         oSettings._iDisplayStart,
        "iEnd":           oSettings.fnDisplayEnd(),
        "iLength":        oSettings._iDisplayLength,
        "iTotal":         oSettings.fnRecordsTotal(),
        "iFilteredTotal": oSettings.fnRecordsDisplay(),
        "iPage":          Math.ceil( oSettings._iDisplayStart / oSettings._iDisplayLength ),
        "iTotalPages":    Math.ceil( oSettings.fnRecordsDisplay() / oSettings._iDisplayLength )
    };
};

/* Bootstrap style pagination control */
$.extend( $.fn.dataTableExt.oPagination, {
    "bootstrap": {
        "fnInit": function( oSettings, nPaging, fnDraw ) {
            var oLang = oSettings.oLanguage.oPaginate;
            var fnClickHandler = function ( e ) {
                e.preventDefault();
                if ( oSettings.oApi._fnPageChange(oSettings, e.data.action) ) {
                    fnDraw( oSettings );
                }
            };

            $(nPaging).append('<form class="page_form">'+
                    '<span>跳转到 <input type="text" style="width: 30px; height: 20px;" class="page_input"  /> 页</span>'+
                    '<ul class="pagination">'+
                    '<li class="first_page disabled"><a href="#">'+oLang.sFirst+'</a></li>'+
                    '<li class="prev disabled"><a href="#"> '+oLang.sPrevious+'</a></li>'+
                    '<li class="next disabled"><a href="#">'+oLang.sNext+' </a></li>'+
                    '<li class="last_page disabled"><a href="#">'+oLang.sLast+'</a></li>'+
                    '</ul></form>'
            );
            var els = $('a', nPaging);
			var nFirst = els[0],
				nPrev = els[1],
				nNext = els[2],
				nLast = els[3];
			$(nFirst).bind('click.DT', { action: "first" }, fnClickHandler );
			$(nPrev).bind('click.DT', { action: "previous" }, fnClickHandler );
			$(nNext).bind('click.DT', { action: "next" }, fnClickHandler );
			$(nLast).bind('click.DT', { action: "last" }, fnClickHandler );
//            var inputEls=$('input',nPaging),form=$('form',nPaging);
			var inputEls=$('.page_input',nPaging),form=$('.page_form',nPaging);
            var inputNum=inputEls[0];
            //绑定跳转到指定页事件
            form.bind('submit.DT',{action: inputNum},fnClickHandler);
            return false;
        },

        "fnUpdate": function ( oSettings, fnDraw ) {
            var iListLength = 5;
            var oPaging = oSettings.oInstance.fnPagingInfo();
            var an = oSettings.aanFeatures.p;
            var i, j, sClass, iStart, iEnd, iHalf=Math.floor(iListLength/2);

            if ( oPaging.iTotalPages < iListLength) {
                iStart = 1;
                iEnd = oPaging.iTotalPages;
            }
            else if ( oPaging.iPage <= iHalf ) {
                iStart = 1;
                iEnd = iListLength;
            } else if ( oPaging.iPage >= (oPaging.iTotalPages-iHalf) ) {
                iStart = oPaging.iTotalPages - iListLength + 1;
                iEnd = oPaging.iTotalPages;
            } else {
                iStart = oPaging.iPage - iHalf + 1;
                iEnd = iStart + iListLength - 1;
            }

            for ( i=0, iLen=an.length ; i<iLen ; i++ ) {
                // Remove the middle elements
                $('li:gt(1)', an[i]).filter(':not(:last)').filter(":not(.next)").remove();

                // Add the new list items and their event handlers
                for ( j=iStart ; j<=iEnd ; j++ ) {
                    sClass = (j==oPaging.iPage+1) ? 'class="active"' : '';
                    $('<li '+sClass+'><a href="#">'+j+'</a></li>')
                        .insertBefore( $('li.next', an[i])[0] )
                        .bind('click', function (e) {
                            e.preventDefault();
                            oSettings._iDisplayStart = (parseInt($('a', this).text(),10)-1) * oPaging.iLength;
                            fnDraw( oSettings );
                        } );
                }

                // Add / remove disabled classes from the static elements
                if ( oPaging.iPage === 0 ) {
                    $('li:first', an[i]).addClass('disabled');
                    $('li.prev',an[i]).addClass('disabled');
                } else {
                    $('li:first', an[i]).removeClass('disabled');
                    $('li.prev',an[i]).removeClass('disabled');
                }

                if ( oPaging.iPage === oPaging.iTotalPages-1 || oPaging.iTotalPages === 0 ) {
                    $('li:last', an[i]).addClass('disabled');
                    $('li.next',an[i]).addClass('disabled');
                } else {
                    $('li:last', an[i]).removeClass('disabled');
                    $('li.next',an[i]).removeClass('disabled');
                }
            }
        }
    }
} );

$.fn.dataTableExt.oApi.fnStandingRedraw = function(oSettings,flag) {
    //redraw to account for filtering and sorting
    // concept here is that (for client side) there is a row got inserted at the end (for an add)
    // or when a record was modified it could be in the middle of the table
    // that is probably not supposed to be there - due to filtering / sorting
    // so we need to re process filtering and sorting
    // BUT - if it is server side - then this should be handled by the server - so skip this step
    if(oSettings.oFeatures.bServerSide === false){
        var before = oSettings._iDisplayStart;
        oSettings.oApi._fnReDraw(oSettings);
        //iDisplayStart has been reset to zero - so lets change it back
        oSettings._iDisplayStart = before;
        oSettings.oApi._fnCalculateEnd(oSettings);
    }
   
    totalRecords =  oSettings._iRecordsDisplay;//实际的数据条数
    if(flag){
    	//判断当前页只有一条数据
    	if(oSettings._iDisplayStart===(totalRecords-1)){
			var before = oSettings._iDisplayStart;
			oSettings._iDisplayStart = (before - oSettings._iDisplayLength) > 0 ? before - oSettings._iDisplayLength : 0;
			oSettings.oApi._fnCalculateEnd(oSettings);
    	}
    }  	
    // draw the 'current' page
    oSettings.oApi._fnDraw(oSettings);
};
