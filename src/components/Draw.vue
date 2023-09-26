<template>
  <div>
  <v-stage :config="configKonva">
    <v-layer>

      <v-circle :config="configCircle"></v-circle>
      <v-text :config="text"></v-text>
    </v-layer>
  </v-stage>
    <button @click="print2">delete db</button>
<button @click="getTree">delete db</button>
    </div>

</template>

<script>
export default {
  data() {
    return {
      test: 0,
      text: {
        text: 'te12312313xt'
      },
      configKonva: {
        width: 200,
        height: 200
      },
      configCircle: {
        x: 100,
        y: 100,
        radius: 70,
        stroke: "black",
        strokeWidth: 4
      }
    };
  },
  methods:{
    print1 (){

},
    print2(){
      console.log(this.test)
    },

     async getTree(){
      let data = {

      }

      this.listMove = await fetch(
          `${this.$store.getters.getServerUrl}/getTree/`,
          {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)}
      ).then(response => response.json())
       this.test = this.listMove


    },
  }
};


</script>