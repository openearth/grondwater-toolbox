import Vue from 'vue';
import VueRouter from 'vue-router';
import Selection from '@/views/selection';
import Calculation from '@/views/calculation';

const routes = [{
    path: '/',
    redirect: '/selection'
  },
  {
    path: '/selection',
    component: Selection,
    name: 'selection',
    meta: { step: 1 }
  },
  {
    path: '/calculation',
    component: Calculation,
    name: 'calculation',
    meta: { step: 2 }
  }
];

Vue.use(VueRouter);

export default new VueRouter({ routes });