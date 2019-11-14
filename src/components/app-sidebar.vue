<template>
  <v-navigation-drawer clipped app permanent class="pa-2" width="350">
    <v-row dense class="fill-height">
      <v-col :cols="12" class="fill-height">
        <transition :name="transitionName" mode="out-in">
          <router-view />
        </transition>
      </v-col>
    </v-row>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      selections: state => state.selections.selections
    })
  },
  data() {
    return {
      transitionName: 'slide-right'
    };
  },
  created() {
    this.$router.beforeEach((to, from, next) => {
      this.transitionName =
        to.meta.step < from.meta.step ? 'slide-right' : 'slide-left';

      next();
    });
  }
};
</script>

<style>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition-duration: 0.5s;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
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