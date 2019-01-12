<template>
  <div>
    <v-container grid-list-xl>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>{{ post.message }}</v-list-tile-title>
          <v-list-tile-sub-title
            v-if="post.reply_count!==0&&!isOpenReplies"
            flat
            @click="openReplies"
          >{{ post.reply_count }}件の返信を表示</v-list-tile-sub-title>
          <v-list-tile-sub-title v-if="isOpenReplies" @click="isOpenReplies=false">返信を非表示</v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-list-tile-action-text>{{ fromNowLocalTime(post.created_at) }}</v-list-tile-action-text>
          <v-btn v-if="!isWritting" flat @click="isWritting=true">返信</v-btn>
        </v-list-tile-action>
      </v-list-tile>

      <v-list-tile v-if="isWritting">
        <v-list-tile-content>
          <v-text-field v-model="message" required label="返信を追加..."/>
        </v-list-tile-content>
        <v-btn depressed @click="isWritting=false">キャンセル</v-btn>
        <v-btn depressed @click="reply">返信する</v-btn>
      </v-list-tile>

      <v-container v-if="isOpenReplies" grid-list-xl>
        <v-list-tile v-for="(reply, i) in replies" :key="i">
          <v-list-tile-content>
            <v-list-tile-title>{{ reply.message }}</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-list-tile-action-text>{{ fromNowLocalTime(reply.created_at) }}</v-list-tile-action-text>
          </v-list-tile-action>
        </v-list-tile>
        <v-btn v-if="hasMoreReplies" flat @click="loadMoreReplies">さらに返信を表示</v-btn>
      </v-container>
    </v-container>
    <v-divider/>
  </div>
</template>

<script>
import moment from "moment";
export default {
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isOpenReplies: false,
      hasMoreReplies: undefined,
      isWritting: false,
      replies: [],
      message: "",
      offset: 0,
      limit: 10
    };
  },
  methods: {
    reply() {
      this.isWritting = false;
      this.$axios.$post("/reply", {
        post_id: this.post.post_id,
        message: this.message
      });
    },
    async fetchNextReplies(limit) {
      const response = await this.$axios.$get("/replies", {
        params: { post_id: this.post.post_id, offset: this.offset, limit }
      });
      if (response.replies.length) {
        this.replies.push(...response.replies);
        this.offset += limit;
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
      datetime.add(new Date().getTimezoneOffset(), "minutes");
      datetime.locale("ja");
      return datetime.fromNow();
    }
  }
};
</script>
