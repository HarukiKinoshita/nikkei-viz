<template>
  <div class="home columns is-gapless">
    <div class="column is-12-tablet is-9-desktop">
      <l-map id="map" :zoom="zoom" :center="center">
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
        <l-control position="topleft" />

        <!-- Path  -->
        <l-polyline v-for="(group, index) in groups" :key="`path-`+index" :lat-lngs="group.latlngs" :opacity="0.5" color="#CC415A" :weight="0.5" :renderer="myRenderer">
          <l-tooltip>
            <strong>{{ groups[index].lastaddress }} ▶︎ {{ groups[index].w_assemblycenter }} ▶︎ {{ groups[index].m_camp }}</strong>: {{ groups[index].pop.toLocaleString() }}
          </l-tooltip>
        </l-polyline>

        <!-- Last address -->
        <l-circle
          v-for="(item, index) in lastaddress"
          :key="`lastaddress-`+index"
          :lat-lng="item.latlng"
          :radius="item.radius"
          :stroke="false"
          fillColor="darkmagenta"
          :fillOpacity="0.4"
          v-on:mouseover="mouseOverAction('lastaddress', index)"
        >
          <!-- <l-tooltip>
            <strong>{{ lastaddress[index].lastaddress }}</strong>: {{ lastaddress[index].pop.toLocaleString() }}
          </l-tooltip> -->
        </l-circle>

        <!-- Assembly Center -->
        <!-- <l-circle zIndexOffset="10" v-for="(ac, index) in assemblycenters" :key="`ac-`+index" :lat-lng="ac.latlng" :radius="ac.radius" :stroke="false" fillColor="darkgoldenrod" :fillOpacity="0.4">
          <l-tooltip>
            <strong>{{ assemblycenters[index].w_assemblycenter }}</strong>: {{ assemblycenters[index].pop.toLocaleString() }}
          </l-tooltip>
        </l-circle> -->

        <!-- Camp -->
        <l-circle
          v-for="(camp, index) in m_camp"
          :key="index"
          :lat-lng="camp.latlng"
          :radius="camp.radius"
          :stroke="false"
          fillColor="darkgoldenrod"
          :fillOpacity="0.4"
          v-on:mouseover="mouseOverAction('m_camp', index)"
        >
          <!-- <l-tooltip>
            <strong>{{ m_camp[index].m_camp }}</strong>: {{ m_camp[index].pop.toLocaleString() }}
          </l-tooltip> -->
        </l-circle>

        <!-- <l-circle v-for="city, index in wra_master_grouped" :key="index" :lat-lng="`L.latlng(${city.m_originalstate_lat}, ${city.m_originalstate_lng})`" :radius="100000" :stroke="false" fillColor="yellowgreen" fillOpacity="0.7" /> -->
      </l-map>
      <button v-if="targetLocationName" class="button is-rounded is-small mt-2" @click="removeTarget()">Reset</button>
    </div>
    <!-- <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <div class="column">
      <div v-if="targetLocationInfo" class="mb-6">
        <p class="mb-4 is-family-serif">
          <span class="has-text-weight-bold is-family-sans-serif">{{ targetLocationInfo.pop.toLocaleString() }}</span> people were
          <span v-if="targetLocationInfo.type == 'Place of Residence'">residing in</span>
          <span v-else>relocated to</span>
        </p>
        <p class="title is-3">{{ targetLocationName }}</p>
        <p class="subtitle" v-if="targetLocationInfo.type !== 'Place of Residence'">{{ targetLocationInfo.type }}</p>
      </div>

      <div class="my-6" v-if="mode !== 'DEBUG'">
        <table class="table is-bordered" style="margin: auto;">
          <tr v-for="(value, key) in targetLocationInfo" :key="key">
            <td>{{ key }}</td>
            <td>{{ value }}</td>
          </tr>
        </table>
      </div>

      <div v-if="targetLocationCategory == 'm_camp'">
        <p class="is-family-serif">They came from ...</p>
        <table class="table is-narrow my-4" style="margin: auto;">
          <tr v-for="(item, index) in groups" :key="index" class="has-text-right">
            <td>{{ item.lastaddress }}, {{ item.m_originalstate }}</td><td>{{ item.pop.toLocaleString() }}</td>
          </tr>
        </table>
      </div>
      <div v-if="targetLocationCategory == 'lastaddress'">
        <p class="is-family-serif">They were sent to ...</p>
        <table class="table is-narrow my-4" style="margin: auto;">
          <tr v-for="(item, index) in groups" :key="index" class="has-text-right">
            <td>{{ item.m_camp }}</td><td>{{ item.pop.toLocaleString() }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import wra_master_grouped from '../datasets/wra-master-grouped-lastaddress-camp.json'
import wra_master_lastaddress from '../datasets/wra-master-lastaddress.json'
import wra_master_camp from '../datasets/wra-master-camp.json'
import wra_master_assemblycenter from '../datasets/wra-master-assemblycenter.json'

export default {
  name: 'HomeView',
  components: {
    HelloWorld,
  },
  data () {
    return {
      mode: process.env.VUE_APP_DEV_MODE,
      wra_master_grouped: wra_master_grouped,
      wra_master_lastaddress: wra_master_lastaddress,
      wra_master_camp: wra_master_camp,
      wra_master_assemblycenter: wra_master_assemblycenter,
      url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 5,
      center: [40, -110],
      markerLatLng: [40, -110],
      radius: 600,
      polyline: {
        defaultColor: 'silver'
      },
      myRenderer: "L.canvas({ padding: 0.5, tolerance: 20 })",
      colorScale1: [ "#de425b", "#e9747e", "#f09fa2", "#f3c8c9", "silver", "#bed6ce", "#8cbcac", "#57a18b", "#488f31" ],
      colorScale2: [ "#ef5675", "#bc5090", "#7a5195", "#374c80", "#003f5c" ],
      colorScale3: [ "#004c6d", "#255e7e", "#3d708f", "#5383a1", "#6996b3", "#7faac6", "#94bed9", "#abd2ec", "#c1ef77", "#cccccc" ],
      colorScale4: [ "#CC415A", "#ED9AB0", "#92B2DE", "#2F74B3"],
      targetLocationName: "",
      targetLocationInfo: "",
      targetLocationCategory: ""
    }
  },
  methods: {
    mouseOverAction(cat, index) {
      this.targetLocationCategory = cat
      this.targetLocationName = this[cat][index][cat]
      this.targetLocationInfo = this[cat][index]
    },
    removeTarget() {
      this.targetLocationCategory = ""
      this.targetLocationName = ""
      this.targetLocationInfo = ""
    },
    // getLineColor(index) {
    //   return this.colorScale4[(index/400).toFixed()]
    // },
    getLineWeight(index) {
      return (index/400).toFixed()*0.05*this.zoom
    }
  },
  mounted() {
    console.log(process.env.VUE_APP_DEV_MODE);
  },
  computed: {
    groups() {
      return this.wra_master_grouped
        .filter(el => el[this.targetLocationCategory] == this.targetLocationName && el.w_assemblycenter_lat !== 0 && el.w_assemblycenter_lng !== 0 && el.m_camp_lat !== 0 && el.m_camp_lng !== 0 && el.lastaddresses_lat !== 0 && el.lastaddress_lng !== 0)
        .map(el => ({
          ...el,
          latlngs: [[el.lastaddress_lat, el.lastaddress_lng], [el.m_camp_lat, el.m_camp_lng]]
          // latlngs: [[el.lastaddress_lat, el.lastaddress_lng], [el.w_assemblycenter_lat, el.w_assemblycenter_lng], [el.m_camp_lat, el.m_camp_lng]]
        }))
    },
    lastaddress() {
      return this.wra_master_lastaddress
        .filter(el => el.lastaddress_lat && el.lastaddress_lng && el.pop)
        .map(el => ({
          ...el,
          latlng: [el.lastaddress_lat, el.lastaddress_lng],
          radius: Math.sqrt(el.pop/Math.PI)*1000,
          type: "Place of Residence"
        }))
    },
    assemblycenters() {
      return this.wra_master_assemblycenter
        .map(el => ({
          ...el,
          latlng: [el.w_assemblycenter_lat, el.w_assemblycenter_lng],
          radius: Math.sqrt(el.pop/Math.PI)*1000,
          type: "Assembly Center"
        }))
    },
    m_camp() {
      return this.wra_master_camp
        // .filter(el => el.m_camp_lat && el.m_camp_lng && el.pop)
        .map(el => ({
          ...el,
          latlng: [el.m_camp_lat, el.m_camp_lng],
          radius: Math.sqrt(el.pop/Math.PI)*1000,
          type: "Internment Camp"
        }))
    }
  }
}
</script>

<style scoped>
  #map {
    height: 75vh;
  }
  #map_lastaddress {
    height: 75vh;
  }
  .is-family-serif {
    font-family: Georgia, Times, 'Times New Roman', serif
  }
</style>