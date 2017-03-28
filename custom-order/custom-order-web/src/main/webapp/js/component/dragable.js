/**
 * author: liq
 * date  : 2014-5-21
 * make popup windows dragable
 */

(function($){

    var Dragable = function(element){
         this.el = element;
         this.header = $(element).find('.modal-header');
         this._canMove = false;
         this._init();
         this._firstMouseDown = true;
    };

    Dragable.prototype = {
         _init: function(){
             $(this.header).bind('mousedown', $.proxy(this._mousedown,this));
             $(this.header).bind('mousemove', $.proxy(this._mousemove,this));
             $(this.header).bind('mouseup',   $.proxy(this._mouseup,this));
             $(this.el).on('click','.close_modal_tab',$.proxy(this._closemodal,this));
             $(this.el).on('click','.close',$.proxy(this._closemodal,this));
         },
        _mousedown: function(e){
            e.preventDefault ? e.preventDefault() : e.returnValue = false;
            if(this._firstMouseDown){
                this._startx = $(this.el).position().left;
                this._starty = $(this.el).position().top;
            }
            this._canMove = true;
            this._firstMouseDown = false;
            this._posx = $(this.el).position().left;
            this._posy = $(this.el).position().top;
            this._clickx = e.pageX;
            this._clicky = e.pageY;
        },
        _mousemove: function(e){
            if(this._canMove){
                this._absx = e.pageX - this._clickx;
                this._absy = e.pageY - this._clicky;

                var x = this._posx + this._absx;
                var y = this._posy + this._absy;
                $(this.el).css({'left': x ,'top' : y});
            }
        },
        _mouseup: function(){
            this._canMove = false;
        },
        _closemodal: function(){
            var startx = this._startx;
            var starty = this._starty;
            $(this.el).css({'left':startx , 'top':starty}).hide();
            $('.modal-backdrop').remove();
        }
    };

    $.fn.dragable = function(){
        this.each(function(){
            var $this = $(this),
                data = $(this).data('dragable');
            if(!data){
                $this.data('dragable',(data = new Dragable(this)));
            }
        });
        return this;
    };
})(window.jQuery);