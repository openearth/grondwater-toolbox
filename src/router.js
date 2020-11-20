import Vue from 'vue';
import VueRouter from 'vue-router';
import Selection from '@/views/selection';
import Calculation from '@/views/calculation';
import Introduction from '@/views/introduction';
import Legal from '@/views/legal';

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
];

Vue.use(VueRouter);

export default new VueRouter({ routes });