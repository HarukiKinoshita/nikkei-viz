import Vue from 'vue'
import App from './App.vue'
import router from './router'

import { LMap, LTileLayer, LMarker, LControl, LCircle, LCircleMarker, LTooltip, LPolyline } from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

import { Icon } from 'leaflet';
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);
Vue.component('l-control', LControl);
Vue.component('l-circle', LCircle);
Vue.component('l-circle-marker', LCircleMarker);
Vue.component('l-tooltip', LTooltip);
Vue.component('l-polyline', LPolyline);
Vue.use(Buefy)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
