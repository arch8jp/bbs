<template>
  <div>
    <v-container grid-list-xl>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>{{ post.message }}</v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-list-tile-action-text>{{ post.created_at }}</v-list-tile-action-text>
          <v-btn v-if="!isWritting" flat @click="isWritting=true">返信</v-btn>
        </v-list-tile-action>
      </v-list-tile>

      <v-container v-if="post.replies.length" grid-list-xl>
        <v-list-tile v-for="(reply, i) in post.replies" :key="i">
          <v-list-tile-content>
            <v-list-tile-title>{{ reply.message }}</v-list-tile-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-list-tile-action-text>{{ reply.created_at }}</v-list-tile-action-text>
          </v-list-tile-action>
        </v-list-tile>
      </v-container>

      <v-list-tile v-if="isWritting">
        <v-list-tile-content>
          <v-text-field v-model="message" required label="返信を追加..."/>
        </v-list-tile-content>
        <v-btn depressed @click="isWritting=false">キャンセル</v-btn>
        <v-btn depressed @click="reply(post.post_id)">返信する</v-btn>
      </v-list-tile>
    </v-container>
    <v-divider/>
  </div>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  data() {
    return { isWritting: false, message: "" };
  },
  methods: {
    reply(post_id) {
      this.isWritting = false;
      this.$axios.$post("/reply", { post_id, message: this.message });
    }
  }
};
</script>
