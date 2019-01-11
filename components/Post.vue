<template>
  <div>
    <v-container grid-list-xl>
      <v-list-tile>
        <v-list-tile-content>
          <p>{{ content }}</p>
        </v-list-tile-content>
        <v-btn v-if="!writting" flat @click="writting=true">返信</v-btn>
      </v-list-tile>
      <v-list-tile v-if="writting">
        <v-list-tile-content>
          <v-text-field label="返信を追加..." required/>
        </v-list-tile-content>
        <v-btn depressed @click="writting=false">キャンセル</v-btn>
        <v-btn depressed>返信する</v-btn>
      </v-list-tile>
    </v-container>
    <v-divider/>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      required: true
    },
    writting: {
      type: Boolean,
      required: true,
      default: false
    }
  }
};
</script>
