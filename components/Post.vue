<template>
  <div>
    <v-list-tile>
      <v-list-tile-content>
        <p>{{ content }}</p>
      </v-list-tile-content>
    </v-list-tile>
    <v-divider/>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      required: true
    }
  }
};
</script>
