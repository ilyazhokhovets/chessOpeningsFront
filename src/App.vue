<template>
 <div id="app">

  <router-view/>

    </div>
</template>

<style>

</style>
<script>
import testcase from "@/components/testcase";
import Socket from "@/components/Socket";
import Settings from "@/components/Settings";
import Draw from "@/components/Draw";
export default {
  components: {Socket, Settings, Draw, testcase}
}
</script>