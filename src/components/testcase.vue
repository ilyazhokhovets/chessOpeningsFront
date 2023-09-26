<template>
  <div>
<canvas id="c"></canvas>
<v-color-input
  v-model="backgroundColor"
  label="background color"
/>
    </div>

</template>



<script>
import VColorInput from 'vuetify-color-input';
export default {
  components: {
    VColorInput,
  },
  data (){
    return {
      bgColor: '#000000',
      fontColor: '#FFFFFF'
    }
  },
mounted() {
  var c = document.getElementById("c");
var ctx = c.getContext("2d");
var rectHeight = 100;
var rectWidth = 100;

ctx.lineWidth = 0;

ctx.font="20px Georgia";
ctx.textAlign="center";
ctx.textBaseline = "hanging";


var rectX = 10;
var rectY = 10;
ctx.fillStyle = this.bgColor;
ctx.fillRect(rectX, rectY, rectX+rectWidth, rectY+rectHeight);
ctx.fillStyle = this.fontColor;
ctx.fillText("Test",rectX+(rectWidth/2),rectY+(rectHeight/2));

ctx.stroke();
}

}
</script>
<style>
 .syleObject {
  width: 150px;
  height: 150px;
  float: left;
  margin: 10px;
}

.square {
  position:relative;
  border: 1px solid blue;
  width: 100px;
  height: 100px;
}

.square::after {
  position:absolute;
  content: '';
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border: 1px solid blue;
}
</style>