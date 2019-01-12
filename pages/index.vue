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
    <v-list two-line>
      <post v-for="(post, $index) in posts" :key="$index" :post="post" @refresh="refresh"/>
      <infinite-loading spinner="spiral" @infinite="infinitePostsHandler"/>
    </v-list>
  </div>
</template>

<script>
import Post from "~/components/Post.vue";
import InfiniteLoading from "vue-infinite-loading";
const LIMIT = 10;
export default {
  components: { Post, InfiniteLoading },
  async asyncData({ res }) {
    return res ? { posts: [...res.data.posts] } : { posts: [] };
  },
  data() {
    return { message: "", posts: [] };
  },
  methods: {
    async onSubmit() {
      this.$axios.$post("/", { message: this.message });
      this.refresh();
    },
    async refresh() {
      const response = await this.$axios.$get("/posts", {
        params: { offset: 0, limit: LIMIT }
      });
      this.message = "";
      this.posts = [...response.posts];
    },
    async infinitePostsHandler($state) {
      const response = await this.$axios.$get("/posts", {
        params: { offset: this.posts.length, limit: LIMIT }
      });
      if (response.posts.length) {
        this.posts.push(...response.posts);
        $state.loaded();
      } else {
        $state.complete();
      }
    }
  }
};
</script>
