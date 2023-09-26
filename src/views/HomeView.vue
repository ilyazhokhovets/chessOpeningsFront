<template>
  <div >
<!--<testcase />-->
    <Socket />
    <Settings />
<!--<Draw />-->
  </div>
</template>

<script>

 import Socket from "@/components/Socket";
 import Settings from "@/components/Settings";
import Draw from "@/components/Draw";
 import testcase from "@/components/testcase";
    export default {
        name: 'HomeView',
      components: {testcase, Socket, Settings, Draw},



    }
</script>
