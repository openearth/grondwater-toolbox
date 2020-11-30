import Vue from 'vue';
import VueRouter from 'vue-router';
import Selection from '@/views/selection';
import Calculation from '@/views/calculation';
import Introduction from '@/views/introduction';
import Legal from '@/views/legal';
import Results from '@/views/results';

const routes = [
  {
    path: "/",
    component: Introduction,
    name: "introduction",
  },
  {
    path: "/legal",
    component: Legal,
    name: "legal",
  },
  {
    path: "/selection",
    component: Selection,
    name: "selection",
    meta: { step: 1 },
  },
  {
    path: "/calculation",
    component: Calculation,
    name: "calculation",
    meta: { step: 2 },
  },
  {
    path: "/results",
    component: Results,
    name: "results",
    meta: { step: 3 },
  },
];

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  routes
});