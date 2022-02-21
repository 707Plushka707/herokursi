const myboard = {
  template: `
   <div>
   <div class="d-flex py-1 align-items-center border">
   <div class="flex-fill">
     <div class="font-weight-medium">
     <span :class="item.listboard[numboard].t >= highTemp ? 'highTemp' : ''">{{item.listboard[numboard].t||0}}℃</span>
      [<span :class="item.listboard[numboard].h >= highHW ? 'highTemp' : ''">{{item.listboard[numboard].h||0}}</span>,{{item.listboard[numboard].v||0}}]
      </div>
     <div class="text-muted"><span class="text-reset">
     {{item.listboard[numboard].hs||0}}MH/s</span></div>
   </div>
 </div>
   </div>
    `,
  data() {
    return {
      highTemp: 72,
      highHW: 200,
    };
  },
  props: ["item", "numboard"],
  computed: {

  },
  mounted() {

  },

  methods: {

  },

};