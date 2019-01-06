<template>
  <div>
    <h1>bbs</h1>
    <form 
      action="/" 
      method="post">
      <input 
        type="text" 
        name="message">
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
  }
}
</script>
