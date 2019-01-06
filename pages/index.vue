<template>
  <div>
    <h1>bbs</h1>
    <form @submit.prevent="onSubmit">
      <input 
        v-model="message"
        type="text"
        required>
      <input type="submit">
    </form>
    <post content="hoge" />
    <post content="fuga" />
    <post content="piyo" />
  </div>
</template>

<script>
import Post from '~/components/Post.vue'

export default {
  components: {
    Post
  },
  data() {
    return {
      message: ''
    }
  },
  methods: {
    onSubmit() {
      this.$axios.$post('/', {
        message: this.message
      })
      this.message = ''
    }
  }
}
</script>
