import Vue from 'vue';
import VueRouter from 'vue-router';

import Calculation from '@/views/calculation';
import Home from '@/views/home';
import Introduction from '@/views/introduction';
import Legal from '@/views/legal';
import Results from '@/views/results';
import Selection from '@/views/selection';

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
    path: '/tools/:config/selection',
    component: Selection,
    name: 'tool-selection',
    meta: { step: 1 },
  },
  {
    path: '/tools/:config/calculation',
    component: Calculation,
    name: 'tool-calculation',
    meta: { step: 2 },
  },
  {
    path: '/tools/:config/results',
    component: Results,
    name: 'tool-results',
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

  const config = VALID_TOOL_CONFIGS.includes(to.params.config)
    ? to.params.config
    : VALID_TOOL_CONFIGS[0];

  if (config) {
    store.dispatch('data/getAppData', to);
  }

  if (!to.params.config) {
    return next({ ...to, path: `/tools/${ config }${ to.path }` });
  }

  next();
});

export default router;
