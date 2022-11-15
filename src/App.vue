<template>
  <home-layout v-if="$route.name === 'home'" />
  <tool-layout v-else />
</template>

<script>
  import HomeLayout from '@/layouts/home';
  import ToolLayout from '@/layouts/tool';

  export default {
    components: {
      HomeLayout,
      ToolLayout,
    },
  };
</script>

<style src="./components/app-core/index.css"></style>
