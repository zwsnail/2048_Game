/**
 * 2020.1.27 Today Koby Bryant passed away...R.I.P
 * followed imooc class: https://www.imooc.com/video/1042
 */

var board = new Array();
var score = 0;
var startx=0;//for mobile touch screen
var starty=0;
var endx=0;
var endy=0;
var hasConflicted = new Array();//to avoid 2 2 4 8 like this. Only one left movement can get together as 16

$(document).ready(function(){
    prepareForMobile();
    newgame();
});

function prepareForMobile(){

    // for desktop vision. Avoid too big screen
    if( documentWidth > 500 ){
        gridContainerWidth = 500;
        cellSpace = 20;
        cellSideLength = 100;
    }
    
    $('#grid-container').css('width',gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('height',gridContainerWidth - 2*cellSpace);
    $('#grid-container').css('padding', cellSpace);
    $('#grid-container').css('border-radius',0.02*gridContainerWidth);

    $('.grid-cell').css('width',cellSideLength);
    $('.grid-cell').css('height',cellSideLength);
    $('.grid-cell').css('border-radius',0.02*cellSideLength);
}

function newgame(){
    //初始化棋盘格
    init();
    //在随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

function init(){

    //generate table
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 0 ; j < 4 ; j ++ ){

            var gridCell = $('#grid-cell-'+i+"-"+j);
            gridCell.css('top', getPosTop( i , j ) );
            gridCell.css('left', getPosLeft( i , j ) );
        }

    //generate the number on the table
    for( var i = 0 ; i < 4 ; i ++ ){
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for( var j = 0 ; j < 4 ; j ++ ){
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }

    updateBoardView();

    score = 0;
}

function updateBoardView(){

    $(".number-cell").remove();//every update empties the table
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 0 ; j < 4 ; j ++ ){

            //1. $("#father").append($("#child"));      
            //2. $("#child").appendTo($("#father"));
            //http://jsfiddle.net/hQKy9/      a demo
            $("#grid-container").append( '<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' );
            var theNumberCell = $('#number-cell-'+i+'-'+j);

            if( board[i][j] == 0 ){

                theNumberCell.css('width','0px');//make it "empty"
                theNumberCell.css('height','0px');
                theNumberCell.css('top',getPosTop(i,j) + cellSideLength/2 );//when pop up new one in its center
                theNumberCell.css('left',getPosLeft(i,j) + cellSideLength/2 );
        
            }
            else{
                theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor( board[i][j] ) );
                theNumberCell.css('color',getNumberColor( board[i][j] ) );
                theNumberCell.text( board[i][j] );
            }

            hasConflicted[i][j] = false;//fresh
        }

    $('.number-cell').css('line-height',cellSideLength+'px');
    $('.number-cell').css('font-size',0.6*cellSideLength+'px');
}

function generateOneNumber(){

    if( nospace( board ) )
        return false;

    //radnom the position
    var randx = parseInt( Math.floor( Math.random()  * 4 ) );
    var randy = parseInt( Math.floor( Math.random()  * 4 ) );

/*  keep finding the place if for a long time can't the empty(0) place, which drags the whole process

   var times = 0;
    while( times < 50 ){
        if( board[randx][randy] == 0 )
            break;

        randx = parseInt( Math.floor( Math.random()  * 4 ) );
        randy = parseInt( Math.floor( Math.random()  * 4 ) );

        times ++;
    }
    if( times == 50 ){
        for( var i = 0 ; i < 4 ; i ++ )
            for( var j = 0 ; j < 4 ; j ++ ){
                if( board[i][j] == 0 ){
                    randx = i;
                    randy = j;
                }
            }
    }*/
    
    // I didn't get below >_< in the tutoral showed top codes

    var count=0;
    var temporary=new Array();
    for(var i=0;i<4;i++)
    for(var j=0;j<4;j++)
    {
        if(board[i][j]==0)
        {
            temporary[count]=i*4+j;
            count++;
        }
    }
    var pos= parseInt( Math.floor( Math.random()  * count ) );
    
    randx=Math.floor(temporary[pos]/4);
    randy=Math.floor(temporary[pos]%4);
 

 
    //the new generate number is either 2 or 4
    var randNumber = Math.random() < 0.5 ? 2 : 4;

    //at a random position
    board[randx][randy] = randNumber;
    showNumberWithAnimation( randx , randy , randNumber );

    return true;
}

$(document).keydown( function( event ){

	event.preventDefault();   // so when press down↓, it will prevent its default "go down" function
    switch( event.keyCode ){
        case 37: //left
            if( moveLeft() ){
                setTimeout("generateOneNumber()",210);//generate number there is 200, so to wait. Without it, suddenly will give a new number out.
                setTimeout("isgameover()",300);
            }
            break;
        case 38: //up
            if( moveUp() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 39: //right
            if( moveRight() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 40: //down
            if( moveDown() ){
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        default: //default
            break;
    }
});

//for mobile no ↑↓←→
document.addEventListener('touchstart',function(event)//touchstart, touchend are events in js
{
	startx=event.touches[0].pageX;//touches can be 3 fingers. Here only 1. Get it's position
	starty=event.touches[0].pageY;
});

document.addEventListener('touchend',function(event)
{
	endx=event.changedTouches[0].pageX;//changedTouches here also only 1
	endy=event.changedTouches[0].pageY;
	var deltax=endx-startx;//check it's horital or vertical side
    var deltay=endy-starty;
    
    //to avoid the figer didn't move, just touched by accident
	if(Math.abs(deltax)<0.3*documentWidth&&Math.abs(deltay)<0.3*documentWidth)
    return;
    
    //check it's horital or vertical side
	if(Math.abs(deltax)>=Math.abs(deltay))
	{
		if(deltax>0)//right
		{
			if(moveRight())
		    {
                setTimeout("generateOneNumber()",210);
			    setTimeout("isGameOver()",300);
		    }  
		}else//left
		{
			if(moveLeft())
		    {
			    setTimeout("generateOneNumber()",210);
			    setTimeout("isGameOver()",300);
		    }
		}
	}
	else
	{
		if(deltay>0)//down
		{
			
			if(moveDown())
		    {
                setTimeout("generateOneNumber()",210);
			    setTimeout("isGameOver()",300);
		    }
		}else//up
		{
			if(moveUp())
		    {
                setTimeout("generateOneNumber()",210);
			    setTimeout("isGameOver()",300);
		    }
		}
		
	}
			
		
});

function isgameover(){
    if( nospace( board ) && nomove( board ) ){
        gameover();
    }
}

function gameover(){
    alert('Game Over!📺');
}



function moveLeft(){

    if( !canMoveLeft( board ) )
        return false;

    //moveLeft
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 1 ; j < 4 ; j ++ ){
            if( board[i][j] != 0 ){

                for( var k = 0 ; k < j ; k ++ ){
                    if( board[i][k] == 0 && noBlockHorizontal( i , k , j , board ) ){
                        //move to an empty position 
                        showMoveAnimation( i , j , i , k );
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                       
                    }
                    else if( board[i][k] == board[i][j] && noBlockHorizontal( i , k , j , board ) && !hasConflicted[i][k] ){
                        //move and can add one time
                        showMoveAnimation( i , j , i , k );
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore( score );

                        //to avoid like this   2   2   4   8 move left to 16....
                        //which should be      4   4   8
                        hasConflicted[i][k] = true;
                        
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveRight(){
    if( !canMoveRight( board ) )
        return false;

    //moveRight
    for( var i = 0 ; i < 4 ; i ++ )
        for( var j = 2 ; j >= 0 ; j -- ){
            if( board[i][j] != 0 ){
                for( var k = 3 ; k > j ; k -- ){

                    if( board[i][k] == 0 && noBlockHorizontal( i , j , k , board ) ){
                        //move
                        showMoveAnimation( i , j , i , k );
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[i][k] == board[i][j] && noBlockHorizontal( i , j , k , board ) && !hasConflicted[i][k] ){
                        //move
                        showMoveAnimation( i , j , i , k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore( score );

                        hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveUp(){

    if( !canMoveUp( board ) )
        return false;

    //moveUp
    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 1 ; i < 4 ; i ++ ){
            if( board[i][j] != 0 ){
                for( var k = 0 ; k < i ; k ++ ){

                    if( board[k][j] == 0 && noBlockVertical( j , k , i , board ) ){
                        //move
                        showMoveAnimation( i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[k][j] == board[i][j] && noBlockVertical( j , k , i , board ) && !hasConflicted[k][j] ){
                        //move
                        showMoveAnimation( i , j , k , j );
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore( score );

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}

function moveDown(){
    if( !canMoveDown( board ) )
        return false;

    //moveDown
    for( var j = 0 ; j < 4 ; j ++ )
        for( var i = 2 ; i >= 0 ; i -- ){
            if( board[i][j] != 0 ){
                for( var k = 3 ; k > i ; k -- ){

                    if( board[k][j] == 0 && noBlockVertical( j , i , k , board ) ){
                        //move
                        showMoveAnimation( i , j , k , j );
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if( board[k][j] == board[i][j] && noBlockVertical( j , i , k , board ) && !hasConflicted[k][j] ){
                        //move
                        showMoveAnimation( i , j , k , j );
                        //add
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore( score );

                        hasConflicted[k][j] = true;
                        continue;
                    }
                }
            }
        }

    setTimeout("updateBoardView()",200);
    return true;
}