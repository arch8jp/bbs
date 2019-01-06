<template>
  <div>
    <h1>bbs</h1>
    <form @submit.prevent="onSubmit">
      <input v-model="message" type="text" required>
      <input type="submit">
    </form>
    <post v-for="(message, i) in messages" :content="message" :key="i"/>
  </div>
</template>

<script>
import Post from "~/components/Post.vue";

export default {
  components: { Post },
  async asyncData({ res }) {
    return { messages: res.data.messages };
  },
  data() {
    return { message: "", messages: [] };
  },
  methods: {
    onSubmit() {
      this.$axios.$post("/", { message: this.message });
      this.message = "";
    }
  }
};
</script>
