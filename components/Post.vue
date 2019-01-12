<template>
  <div>
    <v-list-tile>
      <v-list-tile-content>
        <v-list-tile-title>{{ post.message }}</v-list-tile-title>
        <v-list-tile-sub-title v-if="post.reply_count!==0&&!isOpenReplies" @click="openReplies">
          {{ post.reply_count }}件の返信を表示
          <v-icon>expand_more</v-icon>
        </v-list-tile-sub-title>
        <v-list-tile-sub-title v-if="isOpenReplies" @click="isOpenReplies=false">返信を非表示
          <v-icon>expand_less</v-icon>
        </v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-list-tile-action-text>{{ fromNowLocalTime(post.created_at) }}</v-list-tile-action-text>
        <v-btn v-if="!isWritting" flat small @click="isWritting=true">返信</v-btn>
      </v-list-tile-action>
    </v-list-tile>

    <v-list-tile v-if="isWritting">
      <v-list-tile-content>
        <v-text-field v-model="message" required autofocus label="返信を追加..."/>
      </v-list-tile-content>
      <v-btn depressed @click="isWritting=false">キャンセル</v-btn>
      <v-btn depressed @click="reply">返信する</v-btn>
    </v-list-tile>
    <v-container v-if="isOpenReplies">
      <v-list two-line dense subheader>
        <template v-for="(reply, i) in replies">
          <div :key="`${post.post_id}_${i}`">
            <v-divider/>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>{{ reply.message }}</v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-list-tile-action-text>{{ fromNowLocalTime(reply.created_at) }}</v-list-tile-action-text>
              </v-list-tile-action>
            </v-list-tile>
          </div>
        </template>
        <v-btn v-if="hasMoreReplies" flat @click="loadMoreReplies">さらに返信を表示</v-btn>
      </v-list>
    </v-container>
    <v-divider/>
  </div>
</template>

<script>
import moment from "moment";
export default {
  props: { post: { type: Object, required: true } },
  data() {
    return {
      isOpenReplies: false,
      hasMoreReplies: undefined,
      isWritting: false,
      replies: [],
      message: ""
    };
  },
  methods: {
    reply() {
      this.isWritting = false;
      this.$axios.$post("/reply", {
        post_id: this.post.post_id,
        message: this.message
      });
      this.$emit("refresh");
    },
    async fetchNextReplies(limit) {
      const response = await this.$axios.$get("/replies", {
        params: {
          post_id: this.post.post_id,
          offset: this.replies.length,
          limit
        }
      });
      if (response.replies.length) {
        this.replies.push(...response.replies);
      }
      if (response.replies.length === limit) {
        this.hasMoreReplies = true;
      } else {
        this.hasMoreReplies = false;
      }
    },
    async openReplies() {
      if (!this.replies.length) {
        await this.fetchNextReplies(5);
      }
      this.isOpenReplies = true;
    },
    async loadMoreReplies() {
      await this.fetchNextReplies(5);
    },
    fromNowLocalTime(timestamp) {
      const datetime = moment(timestamp);
      datetime.subtract(new Date().getTimezoneOffset(), "minutes");
      datetime.locale("ja");
      return datetime.fromNow();
    }
  }
};
</script>
