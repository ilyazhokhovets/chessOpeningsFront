<template>
 <div id="app">
<!--  <Nav />-->

<!--   <Board />-->
  <router-view/>

    </div>
</template>

<style>
/*@import "assets/css/chessboard-1.0.0.css";*/
</style>
<script>
import Nav from "./components/Nav";
import Board from "./components/Board";
export default {
  components: {Board, Nav}
}
</script>