

(function($){
   $.fn.MyMailForm = function(options) {
      var settings = $.extend( {
                      'button_check'  : '送信内容の確認 &Gt;',
                      'button_back'   : '&Lt; 訂正',
                      'button_send'   : 'メール送信 &Gt;',
                     }, options);
                     
      var load_page = function(obj){
        /*
         * フォーム要素の下にボタンを追加する
         */
          var html = '<div style="padding:10px" id="MyMailForm_button">';
              html += '<button type="submit" id="button_default">'+settings.button_check+'</button>';
              html += '</div>';
          $(obj).append(html);
      };
      
      var form  = $(this);
      
        jQuery(form).validationEngine( 'attach', {
              ajaxFormValidation: true
            , onBeforeAjaxFormValidation: beforeCall
            , promptPosition:"bottomLeft"
        });
        
         function beforeCall(){
            $(form).find('input,select,textarea').each( function() {

                switch( $(this).prop("type") ){
                  case 'text':
                    var val = $('<div/>').text( $(this).val() ).html();
                    $(this).after('<span class="MyMailForm_value">'+val+'</span>'); 
                  break;
                  case 'select-one':
                    var val = $('<div/>').text( $(this).val() ).html();
                    $(this).after('<span class="MyMailForm_value">'+val+'</span>'); 
                  break;
                  case 'select-multiple':
                    var arr = $(this).val();
                    if(arr){
                      for(var i=0; i<arr.length; i++){
                        val = $('<div/>').text( arr[i] ).html();
                        $(this).after('<span class="MyMailForm_value">'+val+'<br /></span>'); 
                      }
                    }
                  break;
                  case 'checkbox':
                  case 'radio':
                    $(this).next('label').hide(); //labelを隠す
                    var id = $(this).attr('id');
                    var val = $("#"+id+":checked");

                    if( $(val).prop('checked') ) {
                      val = $('<div/>').text( $(this).val() ).html();
                      $(this).after('<span class="MyMailForm_value">'+val+'<br /></span>'); 
                    }
                  break;
                  case 'textarea':
                    var val = $('<div/>').text( $(this).val() ).html();
                    val = val.replace(/\n/g, "<br />");
                    $(this).after('<span class="MyMailForm_value">'+val+'</span>'); 
                  break;
                }

                $(this).hide(); 
            });

                var $button = $("#button_default");
                var button_html  = '<button type="button" class="MyMailForm_btn" id="back">'+settings.button_back+'</button> &nbsp';
                    button_html += '<button type="button" class="MyMailForm_btn" id="send">'+settings.button_send+'</button>';

                    $($button).after(button_html); //ボタンの下に戻る・送信ボタンを追加
                    $button.hide(); //最初のボタンを隠す
         }
         
      
  /*
   * 訂正ボタンを押したとき
   */
      $(document).on('click','#back',function(){
        //フォームを表示
            $(form).find('input,select,textarea').show();
        //確認画面で追加した文字部分を削除
            $(".MyMailForm_value").remove();
        //labelを表示する
            $('input[type=\"radio\"]').next('label').show();
            $('input[type=\"checkbox\"]').next('label').show();

            $(form).find('button').hide();
            $("#button_default").show();
      });
      
  /*
   * 送信ボタンを押したとき
   */
      $(document).on('click','#send',function(){
        var data = form.serialize(); //フォームの内容を全て取得する
          $.ajax({
                type: "POST",
                url: "sendmail.php",
                data: data,
                async: false, //同期通信に
          }).done(function(){
            form.html('<div class="text-success">メールを送信しました</div>');
          }).fail(function(){
            form.html('<div class="text-danger">エラーが発生しました</div>');
          });
      });
      
  /*
   * 初期画面 *ボタンを挿入
   */
      return load_page( $(this) );
      
  };
})(jQuery);
