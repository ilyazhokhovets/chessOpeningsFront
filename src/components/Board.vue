<template>
<div>
  <div>
  <input type="checkbox" value="record" id="checkbox" v-model="record" />
<label for="checkbox"> record </label>
    </div>



<div id="myBoard" style="width: 600px"></div>
<!--  <canvas id="myBoard" style="width: 500px">-->

<!--    </canvas>-->
<label>Status:</label>
<div id="status"></div>
<label>FEN:</label>
<div id="fen"></div>
<label>PGN:</label>
<div id="pgn"></div>
<div>
    <li v-for="elem in listMove">
  	Move:  {{ elem.move }},    White_win%:  {{ Math.round(elem.white_win*1000)/10 }},  appearances:  {{ elem.appearances }}, eval:  {{ elem.cp/100}}
	 </li>
</div>
<!--<div> <img :src="require('../assets/img/chesspieces/wikipedia/wR.png')" alt="" /> </div>-->

  </div>

</template>

<script>

// import userimage from "@/assets/img/chesspieces/wikipedia/wK.png";
import "@/chessboardjs/js/chessboard";
import { Chess } from 'chess.js'
export default {
  name: "Board",

  mounted() {

    var callSendMove = this.sendMove
    var kek = this.loadListMoves


    var board = null
var game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')



function editCastleMove(uci){
   if (game.board()[0][4]!=null && game.board()[0][4]['type'] === 'k' && uci === 'e8h8') {
          uci= 'e8g8'
       }
   if (game.board()[0][4]!=null && game.board()[0][4]['type'] === 'k' && uci === 'e8a8') {
          uci= 'e8c8'
       }
   if (game.board()[7][4]!=null && game.board()[0][4]['type'] === 'k' && uci === 'e1h1') {
          uci= 'e1g1'
       }
   if (game.board()[7][4]!=null && game.board()[0][4]['type'] === 'k' && uci === 'e1a1') {
          uci= 'e1c1'
       }
   return uci
}


function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over) return false

  // only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function onDrop (source, target) {
  // see if the move is legal
  var old_fen = game.fen()
  try {
    var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })
  }
  catch (error){
    move = null
  }


  // illegal move
  if (move === null) return 'snapback';

     callSendMove('numaze',  game.fen(), source+target, old_fen).then((res_move) => {

       var movee = res_move['move']
       movee = editCastleMove(movee)
    console.log(res_move)
    if (res_move['status'] !== 'move'){

      game.reset()
    }
    else {

      var next_move = game.move({
            from: movee.slice(0, 2),
            to: movee.slice(2, 4),
            promotion: 'q'
          }
      )

      kek(game.fen())
      board.position(game.fen())
    }
  }
  )

  updateStatus()
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(game.fen())
}

function updateStatus () {
  var status = ''

  var moveColor = 'White'
  if (game.turn() === 'b') {
    moveColor = 'Black'
  }

  // checkmate?
  if (game.in_checkmate) {
    status = 'Game over, ' + moveColor + ' is in checkmate.'
  }

  // draw?
  else if (game.in_draw) {
    status = 'Game over, drawn position'
  }

  // game still on
  else {
    status = moveColor + ' to move'

    // check?
    if (game.in_check) {
      status += ', ' + moveColor + ' is in check'
    }
  }

  $status.html(status)
  $fen.html(game.fen())
  $pgn.html(game.pgn())
}

var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
}
board = Chessboard('myBoard', config)

updateStatus()

  },

  data() {
    return {
      username: '23232',
      fen1: '',
      move: '',
      record: false,
      listMove: [],
    }
    },



  methods: {
     async sendMove(u1, f1, m1, ini_fen){
      let data = {
        username: u1,
        fen: f1,
        move: m1,
        source_fen: ini_fen,
        record: this.record
      }
      console.log('move')
      this.moveMove = await fetch(`${this.$store.getters.getServerUrl}/move/`,
          {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)

      }).then(response => response.json())
       this.record = this.moveMove['record']
       return this.moveMove
    },

    async loadListMoves(f1){
      let data = {
        fen: f1,
        record: this.record
      }
      console.log('list')
      this.listMove = []
      this.listMove = await fetch(
          `${this.$store.getters.getServerUrl}/offer/`,
          {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)}
      ).then(response => response.json())
      console.log(this.listMove)
    }

  }

}
</script>

<style scoped>
@import "@/assets/css/chessboard-1.0.0.css"
</style>