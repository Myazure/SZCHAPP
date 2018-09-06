import { Component , ViewChild , ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';

declare var AMap;
declare var $:any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    @ViewChild('map_container') map_container: ElementRef;
    map: any;//地图对象


    constructor(public navCtrl: NavController) {
    }
    ionViewDidLoad() {
        let map=this.map = new AMap.Map(this.map_container.nativeElement, {
            view: new AMap.View2D({//创建地图二维视口
                zoom: 11, //设置地图缩放级别
                rotateEnable: true,
                showBuildingBlock: true
            })
        });
        //禁止双击放大地图
        map.setStatus({doubleClickZoom: false});
        //按钮状态
        var point_status=0;
        var line_status=0;
        var del_point_status=0;
        var del_line_status=0;
        var edit_point=false;
        AMap.event.addDomListener(document.getElementById('addpoint'), 'click', function() {
            $('.btn button').css("background-color","#aaaaaa");
            $('#addpoint').css("background-color","red");
            point_status=1;
            line_status=0;
            del_point_status=0;
            del_line_status=0;
            edit_point=false;

            map.setStatus({dragEnable: false});
        }, false);
        AMap.event.addDomListener(document.getElementById('addline'), 'click', function() {
            $('.btn button').css("background-color","#aaaaaa");
            $('#addline').css("background-color","red");
            point_status=0;
            line_status=1;
            del_point_status=0;
            del_line_status=0;
            edit_point=false;

            map.setStatus({dragEnable: true});
        }, false);
        AMap.event.addDomListener(document.getElementById('delpoint'), 'click', function() {
            $('.btn button').css("background-color","#aaaaaa");
            $('#delpoint').css("background-color","red");
            point_status=0;
            line_status=0;
            del_point_status=1;
            del_line_status=0;
            edit_point=false;

            map.setStatus({dragEnable: true});
        }, false);
        AMap.event.addDomListener(document.getElementById('delline'), 'click', function() {
            $('.btn button').css("background-color","#aaaaaa");
            $('#delline').css("background-color","red");
            point_status=0;
            line_status=0;
            del_point_status=0;
            del_line_status=1;
            edit_point=false;

            map.setStatus({dragEnable: true});
        }, false);

        // $('#show').click(function () {
        //     alert(del_line_status);
        // })
        $('#editpoint').click(function () {
            $('.btn button').css("background-color","#aaaaaa");
            $('#editpoint').css("background-color","red");
            point_status=0;
            line_status=0;
            del_point_status=0;
            del_line_status=0;
            edit_point=true;

            map.setStatus({dragEnable: true});
        })

        var lineArr = [];
        //添加点
        map.on('click', function(e) {
            if (point_status){
                var marker = new AMap.Marker({
                    map: map,
                    icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                    position: [e.lnglat.getLng() ,e.lnglat.getLat()],
                    autoRotation: true,
                    // draggable:edit_point
                });
                marker.setMap(map);
                marker.on('click', function() {
                    console.log(edit_point);
                    //添加线
                    if (line_status){
                        if (lineArr.length>=2){
                            lineArr=[];
                        }
                        lineArr.push([e.lnglat.getLng() ,e.lnglat.getLat()]);
                        let polyline = new AMap.Polyline({
                            path: lineArr,          //设置线覆盖物路径
                            strokeColor: "#3366FF", //线颜色
                            strokeOpacity: 1,       //线透明度
                            strokeWeight: 5,        //线宽
                            strokeStyle: "solid",   //线样式
                            strokeDasharray: [10, 5] //补充线样式
                        });
                        console.log(lineArr);
                        polyline.setMap(map);
                        //删除线
                        polyline.on('click',function() {
                            if (del_line_status){
                            map.remove(polyline);
                            }
                        });
                    }
                    //删除点
                    if (del_point_status){
                        marker.setMap(null);
                    }
                    if(edit_point){
                        marker.setDraggable(true)
                    }else{
                        marker.setDraggable(false)
                    }
                });
            }
        })
    }
}
