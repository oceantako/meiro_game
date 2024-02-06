//n
let side_s;

//盤面用
let flowerBox = [];

//異動用定数
const move_stay = [[-1,0],[1,0],[0,1],[0,-1]];

//異動定数
let next_kabe = [1,0,3,2];

/////n*nのテーブルを作成/////
function tablecreate() {
    let side_size = document.getElementById('side_size');
    side_s = side_size.value;

    let meiro_table = document.getElementById("meiro_table");
    meiro_table.innerHTML = "";

    for (let i = 1; i <= side_s; i++) {
        $(".meiro_table").append("<tr></tr>");
    }
    for (let i = 1; i <= side_s; i++) {
        $(".meiro_table tr").append('<td class="b_top b_bottom b_left b_right"></td>');
    }

    meiro_create();
}

/////迷路を作成/////
function meiro_create() {

    flower_create();

    //今のマス
    let now_r = 1;
    let now_c = 1;

    //次を探す
    let isnext = true;

    outloop: while(true) {

        if (isnext) {
            let result = next_mas();

            if (result[2] == 1) {
                break outloop;
            }else{
                now_r = result[0];
                now_c = result[1];
                isnext = false;
            }
        }

        //上下左右各方向に行けるか確認/[上,下,右,左]/0:不可,1:可
        let go_able = [0,0,0,0];

        //上に進めるか
        if ( flowerBox[now_r-1][now_c][4] == "y" ) {
            go_able[0] = 1;
        }else{
            go_able[0] = 0;
        }

        //下に進めるか
        if (flowerBox[now_r + 1][now_c][4] == "y") {
            go_able[1] = 1;
        }else{
            go_able[1] = 0;
        }        

        //右に進めるか
        if (flowerBox[now_r][now_c + 1][4] == "y") {
            go_able[2] = 1;
        }else{
            go_able[2] = 0;
        }

        //左に進めるか
        if (flowerBox[now_r][now_c-1][4] == "y") {
            go_able[3] = 1;
        }else{
            go_able[3] = 0;
        }

        //今のマスから行けるマスの総数を取得（go_ableをすべて足す）
        let max = go_able.reduce((sum, element) => sum + element, 0);

        if (max == 0){
            isnext = true;
            flowerBox[now_r][now_c][4] = "n";
            continue outloop;
        }

        //どこに移動するかランダム
        let will_go_int = getRandomInt(max);

        let i_2 = -1;
        let res = 0

        for ( ;res <= will_go_int; ) {
            i_2 = i_2 + 1;
            if (go_able[i_2] == 1) {
                res = res + 1;
            }
        }

        flowerBox[now_r][now_c][i_2] = 0;
        flowerBox[now_r][now_c][4] = "n";



        now_r = now_r + move_stay[i_2][0];
        now_c = now_c + move_stay[i_2][1];

        flowerBox[now_r][now_c][next_kabe[i_2]] = 0;

        FlowerToTable();

    }

    
}

/////迷路用配列の作成///////[top,bottom,right,left,すでに通ったか] 0:未確定 1:実線 2:空白 y:yes n:no nn:外壁
function flower_create() {
side1 = Number(side_s) + 1;
    for (let r = 0; r <= side1; r++) {
        flowerBox[r] = [];
        for (let c = 0; c <= side1; c++) {
                if (r == 0 || c == 0 || r == side1 || c == side1) {
                    flowerBox[r][c] = [1,1,1,1,"nn"];
                }else{
                    flowerBox[r][c] = [1,1,1,1,"y"];
                }
        }
    }

    flowerBox[0][1] = [1,1,1,1,"n"];
}

function next_mas() {
    let is_loop = 1;
    inLoop: for (let r = 1; r <= side_s; r++) {
        for (let c = 1; c <= side_s; c++) {
            for (let i = 0; i < 4; i++) {
                top_under = move_stay[i][0];
                rig_lef = move_stay[i][1];
                if (flowerBox[r + top_under][c + rig_lef][4] == "n" && flowerBox[r][c][4] == "y") {
                    flowerBox[r + top_under][c + rig_lef][next_kabe[i]] = 0;
                    flowerBox[r][c][i] = 0;
                    now_r = r;
                    now_c = c;
                    is_loop = 0;
                    break inLoop;
                }else{
                    is_loop = 1;
                }
            }
        }
    }

    return [now_r,now_c,is_loop];
}

/////Flowerをテーブルに転写/////
function FlowerToTable() {
    for (let r = 1; r <= side_s; r++) {
        for (let c = 1; c <= side_s; c++) {
            let setrow = r - 1;
            let setcol = c - 1;
            if (flowerBox[r][c][0] == 0) {
                $(".meiro_table tr").eq(setrow).children().eq(setcol).removeClass("b_top");
            }
            if (flowerBox[r][c][1] == 0) {
                $(".meiro_table tr").eq(setrow).children().eq(setcol).removeClass("b_bottom");
            }
            if (flowerBox[r][c][2] == 0) {
                $(".meiro_table tr").eq(setrow).children().eq(setcol).removeClass("b_right");
            }
            if (flowerBox[r][c][3] == 0) {
                $(".meiro_table tr").eq(setrow).children().eq(setcol).removeClass("b_left");
            }
        }
    }
}

/////0以上max未満のランダムな整数を返す/////
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
