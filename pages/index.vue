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
      <infinite-loading spinner="spiral" @infinite="infinitePostsHandler"/>
    </v-list>
  </div>
</template>

<script>
import Post from "~/components/Post.vue";
import InfiniteLoading from "vue-infinite-loading";

export default {
  components: { Post, InfiniteLoading },
  async asyncData({ res }) {
    return res
      ? { posts: res.data.posts, last: res.data.posts.length }
      : { posts: [], last: 0 };
  },
  data() {
    return { message: "", posts: [], last: 0 };
  },
  methods: {
    onSubmit() {
      this.$axios.$post("/", { message: this.message });
      this.message = "";
    },
    async infinitePostsHandler($state) {
      const LIMIT = 10;
      const response = await this.$axios.$get("/posts", {
        params: { offset: this.last, limit: LIMIT }
      });
      if (response.posts.length) {
        this.posts.push(...response.posts);
        this.last += LIMIT;
        $state.loaded();
      } else {
        $state.complete();
      }
    }
  }
};
</script>
