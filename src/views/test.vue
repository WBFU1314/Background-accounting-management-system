<template>
  <div>
    {{ flag }}
  </div>
</template>
<script>

export default{
  data () {
    return {
      date: new Date().toLocaleDateString().replace(/\//g, '-'),
      shilaohua: true,
      value1: null,
      value2: 1,
      value3: null,
      flag: false
    }
  },
  mounted () {
    if (this.shilaohua && (this.value1 === 1 || this.value2 === 1)) {
      this.flag = true
    }
    if (!this.shilaohua && this.value2 === 2) {
      this.flag = true
    }
    console.log(this.flag)
  }
}
</script>
<style scoped>
div {
  width: 100%;
  height: 1em;
  overflow: hidden;
  line-height: 1em;
  display: inline-block;
}
span {
  position: relative;
}
.animate {
  -webkit-animation: spinit 0.2s 5;
  -moz-animation: spinit 0.2s 5;
  animation: spinit 0.2s 5;
  /* animation-iteration-count: infinite; */
}

/* @-webkit-keyframes spinit {
  0% {
    top: 0em;
  }
  50% {
    top: -5em;
  }
  100% {
    top: -9em;
  }
} */

/* Setting the required value to top will make the spinner end at that number */

#digit1 {
  top: -4em;
  /* -4em means 5 will be the number */
}
#digit2 {
  top: -2em;
}
#digit3 {
  top: 0em;
}
</style>
