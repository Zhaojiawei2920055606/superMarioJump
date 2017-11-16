
var res_gaming = {
    game_ccb:"res/ccb/GameCCB.ccbi",
    game_plist:"res/img/game.plist",
    game_png:"res/img/game.png",
    role_plist:"res/img/role.plist",
    role_png:"res/img/role.png",
    begin_ccbi:"res/ccb/Begin.ccbi",
    beginFont_fnt:"res/img/beginFont.fnt",
    beginFont_png:"res/img/beginFont.png",
    /*
     *Music
     * */
    BGM_mp3:"res/music/BGM.mp3",
    DI_mp3:"res/music/DI.mp3",
    DOWN_mp3:"res/music/DOWN.mp3",
    END_mp3:"res/music/END.mp3",
    JUMP_mp3:"res/music/JUMP.mp3",
    LOST_mp3:"res/music/LOST.mp3",
    WIN_mp3:"res/music/WIN.mp3"
};

var res_loading = {
    loading_bg :"res/img/loading_1.png",
    loading_plist:"res/img/loading.plist",
    loading_png:"res/img/loading.png",
    loading_ccb:"res/ccb/LoadingCCB.ccbi",
    bg_png:"res/img/bg.png"
};
var g_resources_gaming= [];

for(var i in res_gaming){
    g_resources_gaming.push(res_gaming[i]);
}

var g_resources_loading =[];
for(var j in res_loading){
    g_resources_loading.push(res_loading[j]);
}