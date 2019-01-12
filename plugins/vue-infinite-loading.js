import Vue from "vue";
import InfiniteLoading from "vue-infinite-loading";

Vue.use(InfiniteLoading, {
  slots: {
    noResults: "まだ投稿はありません",
    noMore: "これ以上投稿はありません"
  }
});
