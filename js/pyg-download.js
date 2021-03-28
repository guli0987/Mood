;(function($,window,document,undefined){
	
    $.fn.downloadJS=function(options){
		$(".p-QRcode_down").click(function(){
			$('#item-QRcode').popup({
			  time: 1000,
			  classAnimateShow: 'flipInX',
			  classAnimateHide: 'hinge',
			  onPopupClose: function e() {
			    // console.log('0')
			  },
			  onPopupInit: function e() {
			    // console.log('1')
			  }
			});
		});	
	}
})(jQuery,window,document);