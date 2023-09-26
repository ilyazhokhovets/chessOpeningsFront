<template>
<div>

<!--  <div>-->
<!--  <input type="checkbox" value="record" id="checkbox" v-model="record" />-->
<!--<label for="checkbox"> Режим обучения </label>-->
<!--    </div>-->

<!--   <div>-->
<!--  <input type="checkbox" value="" id="checkbox1" v-model="version2mode" />-->
<!--<label for="checkbox1"> Обучение версии 2 </label>-->
<!--    </div>-->

  <div v-model="cp">
    Оценка позиции: {{ cp/100 }}
  </div>

  <div v-model="stats" v-if="this.record===false">
    Статистика в этой позиции:{{stats.suc}} / {{stats.total}}

  </div>
  <div v-else> Статистика: Режим обучения</div>


<div id="myBoard" style="width: 400px"></div>
<button @click="flipBoard">Перевернуть доску</button> <br>
  <button :disabled="record" @click="sendHint">Подсказка</button> <br>
  <button @click="reset">Начать заново</button><br>
<!--   <ul>-->
<!--     <li v-for="elem in this.logs">-->
<!--       {{elem.r}}, {{elem.action || '-'}}, {{elem.status || '-'}}, {{elem.time || '-'}}, {{elem.fen}}-->

<!--     </li>-->
<!--   </ul>-->
{{pgn}}
  <div>

  <ul v-if="this.record ">
    <li v-for="elem in this.listMove">
      Ход:  {{ elem.move }}, {{ winPercent(elem).text}}  {{ winPercent(elem).value }},  Всего игр:  {{ elem.appearances }}, Оценка:  {{ elem.cp/100}}
	 </li>
    </ul>

      <a v-if="pgn.length" :href="`https://lichess.org/analysis/${this.game.fen()}`" target="_blank"> Открыть позицию на lichess</a>
    <a v-if="pgn.length===0" :href="`https://lichess.org/analysis/`" target="_blank"> Открыть позицию на lichess</a>
</div>

<p v-if="pgn.length">FEN: {{game.fen()}}</p>
  <p v-if="pgn.length===0">FEN: {{'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'}}</p>
{{record}}
  </div>

</template>

<script>

// import userimage from "@/assets/img/chesspieces/wikipedia/wK.png";
import  "@/chessboardjs/js/chessboard";
        import { Chess } from 'chess.js'
import Settings from "@/components/Settings";
export default {
  name: "Socket",
  components: {
    Settings
  },
  created() {
    this.connect()
  },
  mounted() {
  this.SuperPuper()

  },

  data() {
    return {
      username: '23232',
      source_fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      new_fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      move_uci: '',
      who_moved: '',
      record: false,
      listMove: [],
      game: '',
      board: '',
      color: 'w',
      status: 'disconnected',
      settings: '',
      cp: '0',
      pgn: '',
      win_percent: '',
      consecutiveFails: 0,
      version2mode: true,
      logs: [],
      stats: {
        total: 0,
        suc: 0
      }
    }
    },

watch: {

    new_fen(){

      this.pgn = this.game.pgn()
      if (this.record && this.game.turn() === this.board.orientation().slice(0,1)) {

        this.sendSuggest()
      }
    },
  status(){
      if (this.status === 'connected') {
        this.reset()
      }
  },
  record(){
      var settings = this.$store.getters.getSettings
      if (this.record && settings.noStudy) {
        // console.log('settings',settings.noStudy)
        this.reset()
      }
  }


},

  methods: {
    printLogs(){
      console.log(this.logs)
    },
    winPercent (elem){
      if (this.board.orientation()==='white'){
        return {text: 'Побед белых %',
          value: Math.round(elem.white_win*1000)/10
        }
      }
      return  {text: 'Побед черных %',
          value: Math.round(elem.black_win*1000)/10
        }
    },
    reset (){
      let fen = this.$store.getters.getSettings
      this.game.load(fen.startingFen)
      this.board.position(this.game.fen())

      this.record = false
      this.source_fen = fen
      this.new_fen = this.game.fen()
      console.log(this.game.turn(), this.board.orientation().slice(0,1))
      if (this.game.turn() !== this.board.orientation().slice(0,1)){

        this.new_fen = this.game.fen()
        this.sendMove()

      }
      else{

      this.sendReset()
        }
    },
    sendHint (){
    let data = {
         action: 'hint',
        fen: this.new_fen,
      }
      this.connect(data)
      // this.chessSocket.send(JSON.stringify(data))
    },
    flipBoard(){
      this.board.flip()

      this.reset()
    },
  compMove (move_uci){
     var next_move = this.game.move({
            from: move_uci.slice(0, 2),
            to: move_uci.slice(2, 4),
            promotion: 'q'
          })
      this.fen = this.game.fen()
      this.board.position(this.game.fen())
    },

  onDrop (source, target) {
  // see if the move is legal
  this.source_fen = this.game.fen()
  try {
    var move = this.game.move({
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
  this.new_fen = this.game.fen()
  this.move_uci = source+target
    this.listMove = []
    // this.sendCP()
  this.sendMove()
},


editCastleMove(uci){
   if (this.game.board()[0][4]!=null && this.game.board()[0][4]['type'] === 'k' && uci === 'e8h8') {
          uci= 'e8g8'
       }
   if (this.game.board()[0][4]!=null && this.game.board()[0][4]['type'] === 'k' && uci === 'e8a8') {
          uci= 'e8c8'
       }
   if (this.game.board()[7][4]!=null && this.game.board()[0][4]['type'] === 'k' && uci === 'e1h1') {
          uci= 'e1g1'
       }
   if (this.game.board()[7][4]!=null && this.game.board()[0][4]['type'] === 'k' && uci === 'e1a1') {
          uci= 'e1c1'
       }

   return uci
},


SuperPuper(){


  var board = null
var game = new Chess()



function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over) return false

  // only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}




// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(game.fen())
}


var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: this.onDrop,
  onSnapEnd: onSnapEnd
}

this.game = game
board = Chessboard('myBoard', config)
this.board = board

},

        async connect(data) {
            var recieved_data = await fetch(
          `${this.$store.getters.getServerUrl}/connect/`,
          {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)}
      ).then(response => response.json())


       recieved_data = JSON.parse(recieved_data)

      recieved_data.r = 'response'
      console.log(recieved_data)
        this.logs.push(recieved_data)

        if (recieved_data.status === 'move') {
          this.consecutiveFails = 0
      this.getMove(recieved_data)
          }
         if (recieved_data.status === 'cp'){

       this.getCP(recieved_data)
        }
         if (recieved_data.status === 'hint'){
       this.printHint(recieved_data)
        }
         if (recieved_data.status === 'suggest'){
       this.getSuggest(recieved_data)
        }
         if (recieved_data.status === 'fail'){
           console.log('fail')
           this.game.undo()
             this.board.position(this.game.fen())
           this.new_fen = this.game.fen()
           this.consecutiveFails += 1
           if (this.consecutiveFails >= 3) {
             this.sendHint()
           }

       }
           if( recieved_data.status === 'success' ){
             console.log('this.reset')
             this.consecutiveFails = 0
             this.reset()
           }


         if (recieved_data.status === 'reset'){
       this.getReset(recieved_data)
        }


    },

    // connect() {
    //   this.chessSocket = new WebSocket(
    //       'ws://' + '127.0.0.1:8000/ws/chess/'
    //   );
    //   this.chessSocket.onopen = () => {
    //     this.status = "connected";
    //
    //   }
    //
    //   this.chessSocket.onmessage =  ({data}) => {
    //   var recieved_data = JSON.parse(data)
    //
    //   recieved_data.r = 'response'
    //   console.log(recieved_data)
    //     this.logs.push(recieved_data)
    //
    //     if (recieved_data.status === 'move') {
    //       this.consecutiveFails = 0
    //   this.getMove(recieved_data)
    //       }
    //      if (recieved_data.status === 'cp'){
    //
    //    this.getCP(recieved_data)
    //     }
    //      if (recieved_data.status === 'hint'){
    //    this.printHint(recieved_data)
    //     }
    //      if (recieved_data.status === 'suggest'){
    //    this.getSuggest(recieved_data)
    //     }
    //      if (recieved_data.status === 'fail'){
    //        console.log('fail')
    //        this.game.undo()
    //          this.board.position(this.game.fen())
    //        this.new_fen = this.game.fen()
    //        this.consecutiveFails += 1
    //        if (this.consecutiveFails >= 3) {
    //          this.sendHint()
    //        }
    //
    //    }
    //        if( recieved_data.status === 'success' ){
    //          console.log('this.reset')
    //          this.consecutiveFails = 0
    //          this.reset()
    //        }
    //
    //
    //      if (recieved_data.status === 'reset'){
    //    this.getReset(recieved_data)
    //     }
    // }
    //
    // },

     printHint(recieved_data){

    //   var canvas=document.getElementById('myCanvas');
    // var ctx=canvas.getContext('2d');
    //   const element1 = document.querySelectorAll(".square-f5");
    //   const element2 = document.querySelectorAll(".square-a7");
    //   const l1 = this.getOffset(element1[0]).left
    //    const t1 = this.getOffset(element1[0]).top
    //    const l2 = this.getOffset(element2[0]).left
    //    const t2 = this.getOffset(element2[0]).top
    //
    //    this.drawArrow(ctx, l1, t1, l2, t2, 10, 'red')
      alert(recieved_data.move_uci)




    },
     getMove(recieved_data){


       this.record = recieved_data.record
        this.source_fen = this.new_fen
        this.compMove(recieved_data.move_uci)
        this.new_fen = this.game.fen()
        this.who_moved = 'comp'
       if (recieved_data.stats)
       {
         this.stats.total = recieved_data.stats[1]

       this.stats.suc = recieved_data.stats[0]
         }
           this.sendCP()

        // else {
        //   this.reset()
        // }
    },



     getCP(recieved_data){

        this.cp = recieved_data.cp

    },

     sendCP(){
        let data = {
         action: 'sendCP',
        fen: this.new_fen,
      }
      data.r = 'request'
        this.logs.push(data)
       // this.chessSocket.send(JSON.stringify(data))
       this.connect(data)
    },
     sendSuggest(){
        let data = {
         action: 'sendSuggest',
        fen: this.new_fen,
          orientation: this.board.orientation()
      }
      data.r = 'request'
        this.logs.push(data)
        this.connect(data)
       // this.chessSocket.send(JSON.stringify(data))
    },
     getSuggest(recieved_data){
      this.listMove = recieved_data.listMove
    },
     sendReset(){
        let data = {
         action: 'reset',
        fen: this.new_fen,
      }
      data.r = 'request'
        this.logs.push(data)
       this.connect(data)
       // this.chessSocket.send(JSON.stringify(data))
    },
     getReset(recieved_data){
      this.record = recieved_data.record
       if (this.record){
         this.sendSuggest()
       }
    },

     sendMove (){

       let data = {
         action: 'sendMove',
        fen: this.new_fen,
        move: this.move_uci,
        source_fen: this.source_fen,
        record: this.record,
         version2mode: this.version2mode,
         settings: this.$store.getters.getSettings
      }
      data.r = 'request'
        this.logs.push(data)
       this.connect(data)
       // this.chessSocket.send(JSON.stringify(data))
    },


    getOffset(el) {
      console.log(el)
  const rect = el.getBoundingClientRect();
  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY
  }
},

    drawArrow(ctx, fromx, fromy, tox, toy, arrowWidth, color){
    //variables to be used when creating the arrow
    var headlen = 10;
    var angle = Math.atan2(toy-fromy,tox-fromx);

    ctx.save();
    ctx.strokeStyle = color;

    //starting path of the arrow from the start square to the end square
    //and drawing the stroke
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.lineWidth = arrowWidth;
    ctx.stroke();

    //starting a new path from the head of the arrow to one of the sides of
    //the point
    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
               toy-headlen*Math.sin(angle-Math.PI/7));

    //path from the side point of the arrow, to the other side point
    ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),
               toy-headlen*Math.sin(angle+Math.PI/7));

    //path from the side point back to the tip of the arrow, and then
    //again to the opposite side point
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
               toy-headlen*Math.sin(angle-Math.PI/7));

    //draws the paths created above
    ctx.stroke();
    ctx.restore();
}


  }



}
</script>

<style scoped>
@import "@/assets/css/chessboard-1.0.0.css"
</style>