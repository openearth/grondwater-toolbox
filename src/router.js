import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '@/views/home';
import Introduction from '@/views/introduction';
import Legal from '@/views/legal';
import StepOne from '@/views/step-1';
import StepThree from '@/views/step-3';
import StepTwo from '@/views/step-2';

import store from '@/store';

import { VALID_TOOL_CONFIGS } from '@/lib/constants';

const routes = [
  {
    path: '/',
    component: Home,
    name: 'home',
  },
  {
    path: '/legal',
    component: Legal,
    name: 'legal',
  },
  {
    path: '/tools/:config',
    component: Introduction,
    name: 'tool-introduction',
  },
  {
    path: '/tools/:config/step-1',
    component: StepOne,
    name: 'tool-step-1',
    meta: { step: 1 },
  },
  {
    path: '/tools/:config/step-2',
    component: StepTwo,
    name: 'tool-step-2',
    meta: { step: 2 },
  },
  {
    path: '/tools/:config/step-3',
    component: StepThree,
    name: 'tool-step-3',
    meta: { step: 3 },
  },
  {
    path: '*',
    redirect: { name: 'home' },
  },
];

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes,
});

router.beforeEach((to, from, next) => {
  if (!to.name.includes('tool-')) {
    next();
    return;
  }

  const isValidConfig = VALID_TOOL_CONFIGS.includes(to.params.config);
  const config = isValidConfig
    ? to.params.config
    : VALID_TOOL_CONFIGS[0];

  if (!isValidConfig) {
    return next({ ...to, path: `/tools/${ config }`, params: { config } });
  } else {
    store.commit('app/SET_VIEWER_CONFIG', { config });
    store.dispatch('data/getAppData', to);
  }

  next();
});

export default router;
