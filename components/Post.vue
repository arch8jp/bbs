<template>
  <div>
    <p>{{ content }}</p>
    <hr>
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
}
</script>
