 <?php 
    if(!isset($_SESSION))
    session_start();

//     $user_id = $_SESSION['user_id'];
//     $token = $_SESSION['user_token'];
//     $res = null;

//     $api_base_url = 'https://api.s4upro.com/';

//     $headr = array();
//     $headr[] = 'Content-Type: application/json';
// // if($encoded)
// //     $headr[] = 'Content-Length: ' . strlen($encoded);

// $headr[] = 'Authorization: JWT '.$token;


//     $url = 'https://api.s4upro.com/v1/video_editor/individual_actions/';
//     $ch = curl_init();
//     curl_setopt($ch, CURLOPT_URL, $url);
//     curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
//     curl_setopt($ch, CURLOPT_HTTPHEADER, $headr);
//     curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
//     curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

//     $actions = curl_exec($ch);
//     $ind_act = json_encode($actions);
    
//     $url = 'https://api.s4upro.com/v1/video_editor/individual_action_types/';
//     $ch = curl_init();
//     curl_setopt($ch, CURLOPT_URL, $url);
//     curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
//     curl_setopt($ch, CURLOPT_HTTPHEADER, $headr);
//     curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
//     curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

//     $action_types = curl_exec($ch);

//     $url = 'https://api.s4upro.com/v1/video_editor/individual_action_results/';
//     $ch = curl_init();
//     curl_setopt($ch, CURLOPT_URL, $url);
//     curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
//     curl_setopt($ch, CURLOPT_HTTPHEADER, $headr);
//     curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
//     curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

//     $action_results = curl_exec($ch);


//     if(isset($_GET['pname'])){
//         $url = 'https://api.s4upro.com/v1/players/?name='.urlencode($_GET['pname']);
//         $ch = curl_init();
//         curl_setopt($ch, CURLOPT_URL, $url);
//         curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
//         curl_setopt($ch, CURLOPT_HTTPHEADER, $headr);
//         curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
//         curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

//         $playerinfo = curl_exec($ch);
//         //print_r(json_decode($playerinof));    
//     }
    


    //include 'get_search_data_api.php';
?>
<div style="height:50px;"></div>
<div class="container" style="padding: 20px 0px; display:none;">
    <div class="row">
        <div class="col-lg-12">
            <nav class="navbar navbar-default">
                <ul class="nav navbar-nav" style="float: right;">                        
                    <li class="float-right">
                        <div class="navbar-form">
                            <div class="input-group add-on" style="position: relative;">
                                <input type="hidden" name="pid" value="0" id="player_id">                                
                              <input class="form-control" placeholder="Search Player" name="player" id="srch-player" type="text" autocomplete="off" autofocus="true" style="float: right;height: 34px;">
                              <div class="input-group-btn">
                                <button ng-click="searchPlayer()" class="btn btn-default" id="submit-btn"><i class="glyphicon glyphicon-search"></i></button>
                              </div>
                              <ul id="searched">
                                  
                              </ul>
                            </div>
                        </div>                     
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</div>
<div class="container">
      <div class="row">
            
          <div class="col-lg-6 player_info">
             <div class="col-lg-4">
                <div class="player_img_wpr">
                    <img class="player_img" src="https://s3.amazonaws.com/s4usitesimages/upload/player-img (2).png" width="100%">
                </div>
                <input type="hidden" name="" value="<?php echo $token; ?>">
             </div>
             <div class="col-lg-8 right_side">
                <div class="p_wpr">
                    <h4 class="player_name"></h4>
                    <p class="player_height"></p>
                    <p class="player_dob"></p>
                    <p class="player_position"></p>
                    <p class="player_nationality"></p> 
                      
                </div>
                <div class="play_player_clips">
                </div>
             </div>
          </div>
          <div class="col-lg-6 text-right">
            <button class="btn btn-default" id="print_data"><i class="glyphicon glyphicon-print"></i> Print</button> 
          </div>
          <div class="col-lg-12" style="margin-top: 15px;">
              <div id="player-tabs" class="player_tabs">
                  <ul>
                    <li><a href="#tabs-1">Career</a></li>
                    <li><a href="#tabs-2">Rank</a></li>
                    <li><a href="#tabs-3">Stats Analysis</a></li>
                    <li><a href="#tabs-4">Best/Worst</a></li>
                    <li><a href="#tabs-5">Game by Game</a></li>
                    <li><a href="#tabs-6">Watch Games</a></li>
                    <li><a href="#tabs-7" style="display: none;">You Tube Clips</a></li>
                    <li class="pl_tendency"><a href="#tabs-8">Tendency</a></li>
                    
                  </ul>
                  <div id="tabs-1" class="tab_content_wpr ui-tabs-panel ui-corner-bottom ui-widget-content" style="padding:0px;">
                        <div id="chartContainerTab1" style="min-height: 400px; width: 100%;">Career</div>
                  </div>
                  <div id="tabs-2" class="tab_content_wpr">
                        <div class="col-lg-12">    
                            <div class="col-lg-6 form-group">
                                <select id="rank_pslt" class="" onchange="playerRanks()"></select>
                            </div>
                        </div>
                        <div id="chartContainerTab2" class="row">
                            <?php for($r = 0;$r<24;$r++) {?>
                                <div id="rank_<?php echo $r; ?>" class="col-lg-3 each_field_ranks"><div class="draw_rank_chart"  style="height: 250px;"></div></div>
                            <?php } ?>
                        </div>
                  </div>
                  <div id="tabs-3" class="tab_content_wpr">
                        <div class="col-lg-12">    
                            <div class="col-lg-6 form-group">
                                <select id="stat_analysis_s"></select>
                            </div>
                        </div>
                        <div id="chartContainerTab3" style="height: 400px; width: 100%;margin-top: 30px;">state ananlysis</div>
                  </div>
                  <div id="tabs-4" class="tab_content_wpr">
                        <div class="col-lg-12">    
                            <div class="col-lg-6 form-group">
                                <select id="best_worst_pslt" class="form-control"></select>
                            </div>
                        </div>
                        <div id="chartContainerTab4" style="height: 400px; width: 100%;">Best/worst</div>
                  </div>
                  <div id="tabs-5" class="tab_content_wpr">
                        <div class="col-lg-12">    
                            <div class="col-lg-6 form-group">
                                <select id="game_by_pslt" class=""></select>
                            </div>
                        </div>
                        <div id="chartContainerTab5" style="height: 400px; width: 100%;">game by game</div>
                  </div>
                  <div id="tabs-6" class="tab_content_wpr">
                        <div id="chartContainerTab6" style="height: 400px; width: 100%;">watch game</div>
                  </div>
                  <div id="tabs-7" class="tab_content_wpr">
                        <div id="chartContainerTab7" style="height: 400px; width: 100%;">you tube clips</div>
                  </div>
                  <div id="tabs-8" class=" tab_content_wpr row">
                    <div class="col-lg-8 combos_wpr">
                        <div class="col-lg-4 ccsg">
                            <select class="ccsg " id="ccsg_id" onchange="filterValues();" data-live-search="false">
                                
                            </select>
                        </div>
                        <div class="col-lg-6 game_list">
                            <select disabled="true" class="" id="player_games_id" data-live-search="true" multiple="" onchange="fetch_games(false);" data-selected-text-format="count > 1">
                                
                            </select>
                        </div>
                    </div>
                    <div class="col-lg-2 float-right">
                        <button id="playPlayerVideos" type="button" class="btn btn-default btn-sm"  >
                            <i class="glyphicon glyphicon-play-circle"></i>
                            <span>Play Clips</span>
                        </button>    
                    </div>
                    <div class="col-lg-12">
                        <div class="graphs_row clearfix">
                            <div id="chartContainer" style="height: 350px; width: 100%;"></div>    
                        </div>
                        <div class="graphs_row clearfix">
                            <div id="all_actions" style="margin-top: 20px;"></div>
                        </div>
                        <div class="graphs_row clearfix">
                            <div id="chart12" style="width: 33%; height: 200px;float: left;"></div>
                            <div id="direction_tendency" style="width: 33%; height: 200px;float: left;border-left: 1px solid #ccc;border-right: 1px solid #ccc;"></div>
                            <div id="baskets_points" style="width: 33%; height: 200px;float: right;"></div>
                        </div>
                        <div class="graphs_row clearfix">
                            <div id="shortAnalysis" style="height: 300px; width: 100%;"></div>
                        </div>
                        <div class="graphs_row clearfix">
                            <div id="shorts_status" style="height: 300px; width: 100%;"></div>
                        </div>
                        
                        <div class="graphs_row clearfix">
                            <div id="assistsAnalysis" style="height: 300px; width: 100%;"></div>
                        </div>
                        <div class="graphs_row clearfix">
                            <div id="turnoverAnalysis" style="height: 300px; width: 100%;"></div>
                        </div>

                    </div>
                  </div>
              </div>
          </div>
      </div>
     
  </div>
<!-- <script type="text/javascript" src="modules/player/player_script.js"></script> -->

<script>
//alert("hello");
    $( function() {
      $('#srch-player').keyup(function(e){
          if(e.which == 38 || e.which == 40 || e.which == 13) return;
          if($('#srch-player').val().length>=2){
              searchPlayers();
          }
      });

      function searchPlayers(){
        console.log('sessionStorage : ',sessionStorage);
          $.post("functions.php",
              {
                  "operation":"player_search_api",
                  "name":$("#srch-player").val(),
              },
              function(data){
                  ob = JSON.parse(data);
                  if(data == 'null'){
                      //console.log('null');  
                  } 
                  else if(ob.length == 0) {
                      //console.log('0');   
                  }
                  else{
                      var list =  '';
                      for(var i = 0; i<ob.length; i++){
                          list = list+'<li data-id="'+ob[i].id+'">'+ob[i].first_name+' '+ob[i].last_name+'</li>';
                      }
                    $('#searched').html(list).show(); 
                  }
              }
          );
      }
      // $('#player_games_id').selectmenu();
      // $('#ccsg_id').selectmenu();
      
      // $( "#acc-players" ).accordion(); 
      // $( "input[type='checkbox']" ).checkboxradio();
      // $( "input[type='radio']" ).checkboxradio();

      $("#player-tabs").tabs().show();
      $( "#player-tabs" ).on( "tabsactivate", function( event, ui ) {
         if($( "#player-tabs" ).tabs( "option", "active") == 0)
            playerCareerData();

          else if($( "#player-tabs" ).tabs( "option", "active") == 1)
            playerRanks();

          else if($( "#player-tabs" ).tabs( "option", "active") == 7)
            fetch_games(false);

          else if($( "#player-tabs" ).tabs( "option", "active") == 2)
            statAnalysis();  
          
      });
     // drawGraph();
    } );
  </script>