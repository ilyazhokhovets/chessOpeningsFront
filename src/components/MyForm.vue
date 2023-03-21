<template>
<!--  <div id="app">-->
<!--<div>{{ message}}</div>-->
<!--  &lt;!&ndash; Canvas &ndash;&gt;-->
<!--  <canvas id="c"></canvas>-->
<!--  &lt;!&ndash; Add Rectangle Button &ndash;&gt;-->
<!--  <div>-->

<!--    <button @click="drawRect">Add Rect</button>-->
<!--    <button @click="subWidth">-</button>-->
<!--    <button @click="addWidth">+</button>-->
<!--  </div>-->
<!--  </div>-->
</template>

<script>
export default {
  name: "MyForm",

  data() {

	},
  created(){

  },
  mounted() {
      // var c = document.getElementById("c");
      // var ctx = c.getContext("2d");
      // this.vueCanvas = ctx;
  },
  methods: {
  //   drawRect() {
  //     // clear canvas
  //     this.vueCanvas.clearRect(0, 0, 400, 200);
  //
  //     // draw rect
  //     this.vueCanvas.beginPath();
  //     this.vueCanvas.rect(20, 20, this.rectWidth, 100);
  //     this.vueCanvas.stroke();
  //   },
  //   addWidth() {
  //     this.rectWidth += 10
  //     this.drawRect()
  //   },
  //   subWidth() {
  //     this.rectWidth -= 10
  //     this.drawRect()
  //   }
  },

}
</script>

<style scoped>
#app {
  padding: 20px;
  margin: 20px;
}

#c {
  height: 200px;
  width: 400px;
  border: 1px solid gray;
}
</style>