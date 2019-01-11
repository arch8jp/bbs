<template>
  <div>
    <h1>掲示板</h1>
    <v-form @submit.prevent="onSubmit">
      <v-layout row wrap>
        <v-flex xs6 md4>
          <v-text-field v-model="message" required label="メッセージ"/>
        </v-flex>
        <v-flex xs6 md4>
          <v-btn class="primary" type="submit">投稿</v-btn>
        </v-flex>
      </v-layout>
    </v-form>
    <v-list>
      <post v-for="(post, i) in posts" :post="post" :key="i"/>
    </v-list>
  </div>
</template>

<script>
import Post from "~/components/Post.vue";

export default {
  components: { Post },
  async asyncData({ res }) {
    return { posts: res ? res.data.posts : [] };
  },
  data() {
    return { message: "", posts: [] };
  },
  methods: {
    onSubmit() {
      this.$axios.$post("/", { message: this.message });
      this.message = "";
    }
  }
};
</script>
