<template>
  <v-navigation-drawer
    clipped
    app
    permanent
    class="pa-2"
    width="560"
  >
    <v-row dense class="fill-height">
      <v-col :cols="12">
        <sidebar-progress v-if="this.$route.meta.step" class="px-4"/>

        <transition :name="transitionName" mode="out-in">
          <router-view class="flex-grow-1" />
        </transition>
      </v-col>
    </v-row>
  </v-navigation-drawer>
</template>

<script>
  import { mapGetters } from 'vuex';

  import SidebarProgress from '@/components/sidebar-progess';

  export default {
    components: { SidebarProgress },
    computed: {
      ...mapGetters('selections', [ 'selections' ]),
    },
    data() {
      return {
        transitionName: 'slide-right',
      };
    },
    created() {
      this.$router.beforeEach((to, from, next) => {
        if (!isNaN(to.meta.step) && !isNaN(from.meta.step)) {
          this.transitionName = to.meta.step < from.meta.step
            ? 'slide-right'
            : 'slide-left';
        } else if (isNaN(to.meta.step) && !isNaN(from.meta.step)) {
          this.transitionName = 'slide-right';
        } else if (!isNaN(to.meta.step) && isNaN(from.meta.step)) {
          this.transitionName = 'slide-left';
        } else {
          this.transitionName = 'slide-left';
        }

        next();
      });
    },
  };
</script>

<style>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition-duration: 0.3s;
  transition-property: height, opacity, transform;
  transition-timing-function: ease;
  overflow: hidden;
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(2em, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-2em, 0);
}
</style>
