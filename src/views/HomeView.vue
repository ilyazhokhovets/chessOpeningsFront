<template>
  <div >
<!--    <div v-for="move in listMove" :key="move.id">-->
<!--    {{move.move}}-->
<!--      </div>-->
    <MyForm />
    <Board />
<!--    <Settings />-->
<!--    <Parent />-->
  </div>
</template>

<script>
 import MyForm from "@/components/MyForm";
 import Board from "@/components/Board";
 // import Settings from "@/components/Settings";
 // import Parent from "@/components/Parent";
    export default {
        name: 'HomeView',
      components: {Board, MyForm},
      data(){
          // return {
          //   listMove: []
          // }
      },


    }
</script>
