var CHART   = null;

window.addEventListener("load" , function(){

    let d       = new Date();
    let year    = d.getFullYear();
    let month   = ('0' + (d.getMonth() +1)).slice(-2);
    let day     = ('0' + d.getDate()).slice(-2);
    let dt      = year + "-" + month + "-" + day + " 05:00";

    let conflg_dt = {
        defaultDate: dt,
        enableTime: true,
        dateFormat: "Y-m-d H:i",
        "locale": "ja"
    }

    flatpickr("#pay_dt", conflg_dt);


    //グラフのボタンを押した時、モーダルダイアログを表示させ、ラジオボタンの値を元にグラフを描画する。
    $(".pie_chart").on("click", function(){ pie_chart(); });


    //モーダルの領域外が押されたときの処理
    $('#modal').on('click', function(event) {
        //#modalがクリックされた時、クリック位置が#modal_contentではない時、モーダルを非表示にする。
        if(!($(event.target).closest($('#modal_content')).length)){
            $('#modal').hide();
        }
    });

});

function pie_chart(){
    draw_graph();
    $("#modal").show();
}


//FIXME:収入と支出が一緒くたになっているので事実上グラフが機能していない
function draw_graph(){

    let ctx     = $("#graph");

    //現在表示中のタブのデータを抜き取る(チェックされたラジオボタンのvalueを引数に指定)
    let balance_data    = get_data( $("[name=tab_system]:checked").val() );

    console.log(Object.keys(balance_data));
    console.log(Object.values(balance_data));

    //ランダムに色を設定する。
    let color           = []
    let color_length    = Object.keys(balance_data).length
    
    var randomColor = "rgb(" + (~~(256 * Math.random())) + ", " + (~~(256 * Math.random())) + ", " + (~~(256 * Math.random())) + ")" ;

    for (let i=0;i<color_length;i++){
        color.push("rgb(" + (~~(256 * Math.random())) + ", " + (~~(256 * Math.random())) + ", " + (~~(256 * Math.random())) + ")");
    }

    /* data 
     *
     * labels グラフ上部に表示するラベル
     *
     * datasets 
     *
     * data 表示するデータ
     * backgroundColor 色
     *
     *
     */
    let data    = {
        labels: Object.keys(balance_data),
        datasets: [ {
            data: Object.values(balance_data),
            backgroundColor: color, 
            borderWidth: 1
        } ]
    };  
    let options = {
        responsive: true,
        maintainAspectRatio: false,
    };


    if (CHART) {
        CHART.destroy();
    }
    CHART   = new Chart(ctx, {
        type: "pie",
        data: data,
        options: options,
    });

}

function get_data(val){

    //labelタグのfor属性からテーブル内にある全データを抽出
    //カテゴリごとに計算して、返却する。

    console.log($("#tab_area_" + val + " > table > tbody > tr > .balance_category"));

    let category    = $("#tab_area_" + val + " > table > tbody > tr > .balance_category")
    let income      = $("#tab_area_" + val + " > table > tbody > tr > .balance_income  ")
    let spending    = $("#tab_area_" + val + " > table > tbody > tr > .balance_spending")

    let length      = category.length

    let balance_data    = {}

    for (let i=0;i<length;i++){

        let category_name   = category.eq(i).text();

        //カテゴリごとの計算結果が格納されていれば追加加算、なければ新たに定義
        if (category_name in balance_data){
            balance_data[category_name] += Number(income.eq(i).text().replace(/,/g,"")) - Number(spending.eq(i).text().replace(/,/g,""));
        }
        else{
            balance_data[category_name] = Number(income.eq(i).text().replace(/,/g,"")) - Number(spending.eq(i).text().replace(/,/g,""));
        }

    }

    console.log(balance_data);

    return balance_data;

}



/*
 * サイドバーのクローズ処理はHTMLのラベルタグで成立しているのでJSは削除でOK
$(function(){
    $("#r_sidebar_closer").on("click",function(){
       $("#r_sidebar").prop("checked",false);
    });
});
*/
