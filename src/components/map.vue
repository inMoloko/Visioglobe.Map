<template>
  <div class="map">
    <div class="canvas"></div>
    <div class="map__floor-toolbar">
      <button class="map__floor-btn" :class="{'map__floor-btn_active': floor.name == currentFloor}"
              v-for="floor in floors" v-on:click="setFloor(floor.name)">
        {{floor.number}}
      </button>
    </div>
    <organization-edit-popup v-if="currentShop"
                             @close="currentShop=null"
                             @ok="modalOk"
                             :visioglobeID="currentShop"
                             :organization="organization"
                             :organizations="organizations">

    </organization-edit-popup>
  </div>
</template>

<script>
  // import '@/visioglobe/visioglobe.js'
  //import 'jquery'
  import {MyMultiBuildingView} from '@/visioglobe/MyMultiBuildingView.js'
  import OrganizationEditPopup from './organization-edit-popup.vue'
  import UserService from '@/services/user-service'
  import organizationService from '@/services/organization-service'

  export default {
    name: 'map',
    components: {OrganizationEditPopup},
    data() {
      return {
        floors: [],
        currentShop: null,
        organizations: [],
        currentFloor: String
      }
    },
    computed: {},
    methods: {
      modalOk(event) {
        this.currentShop = null;
        if (event.visioglobeID && event.organization) {
          event.organization.VisioglobeID = event.visioglobeID;
          organizationService.patch({
            OrganizationID: event.organization.OrganizationID,
            VisioglobeID: event.organization.VisioglobeID
          }).then(response => {
            this.$toaster.success('Организация сохранена', {timeout: 5000});
            this.mapviewer.setPlaceName(event.organization.VisioglobeID, event.organization.Name);
          }, error => {
            this.$toaster.error('Произошла ошибка');
            console.error(error);
          });
        }
        //Был сброс организации
        if (!event.organization && this.organization) {
          organizationService.patch({
            OrganizationID: this.organization.OrganizationID,
            VisioglobeID: null
          }).then(response => {
            this.$toaster.success('Организация сохранена', {timeout: 5000});
            this.mapviewer.setPlaceName(this.organization.VisioglobeID, '');
          }, error => {
            this.$toaster.error('Произошла ошибка');
            console.error(error);
          });
        }
      },
      setFloor(name) {
        this.mapviewer.changeFloor(name, {animationDuration: 300});
        this.currentFloor = name;
      },
      getEnd(response) {
        console.log(response);
      },
      onObjectMouseUp(event, element) {
        let shop, idSrc, self = this;
        //        console.log(element);
        if (element.vg) {
          idSrc = element.options ? element.options('id') : element.vg.id; //'KSK-15';
          shop = this.mapviewer.getPOI(idSrc);
          if (shop === false) {
            return;
          }
          let options = {
            credentials: true
          };
          const visioglobe = organizationService.get(idSrc);//this.$http.get(`${__API__}/KazanOdata/VgIds?$filter=VisioglobeID eq \'${idSrc}\'&$select=OrganizationID,Name,VisioglobeID&$expand=OrganizationImage`, options)
          Promise.all([this.organizationListPromise, visioglobe]).then(result => {
            this.currentShop = idSrc;
            this.organization = result[1].value[0];
            this.organizations = result[0].value;
          });
        }
      },
    },
    mounted() {
      let self = this;

      this.organizationListPromise = organizationService.get();

      const userService = new UserService(this.$toaster);
      this.userPromise = userService.get();// this.$http.get(`${__API__}/api/ManageUser`, {credentials: true});
      this.userPromise = this.userPromise.then(responce => {
        let mapURL = __VISIOGLOBE__ + responce.CustomerID + '/descriptor.json';
        this.mapviewer = new vg.mapviewer.Mapviewer();
        let mapviewer_parameters = {
          path: mapURL,
          onObjectMouseUp: (event, element) => self.onObjectMouseUp(event, element)
        };
        const elm = document.querySelector('.canvas');
        this.mapviewer.initialize(elm, mapviewer_parameters)
          .catch(function (error) {
            console.error(error);
          })
          .then(function () {
            self.mapviewer.start();
            let index = 1;
            self.floors = self.mapviewer.getFloors().filter(i => i.name !== 'outside').map(i => {
              return {
                name: i.name,
                number: index++
              }
            });
            self.multiBuildingView = MyMultiBuildingView.setupMultiBuilding(self.mapviewer);

            let floor = self.floors[0].name;
            let viewpoint_options = {points: Object.values(self.mapviewer.getPOFs()).filter(i => i.floor === floor)};
            let position = self.mapviewer.getViewpointFromPositions(viewpoint_options);
            position.radius -= 100;
            self.mapviewer.camera.position = position;
            self.setFloor(floor);
          });
        return true;
      });
      Promise.all([this.userPromise, this.organizationListPromise]).then(i => {
        i[1].value.filter(j => j.VisioglobeID).forEach(j => {
          this.mapviewer.setPlaceName(j.VisioglobeID, j.Name);
        });
      });
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*#28303B*/
  .map, .canvas {
    height: 100%;
    width: 100%;
  }

  .map {
    top: 0;
    left: 0;
    position: relative;
  }

  .canvas {
    overflow: hidden;
    top: 0;
    left: 0;
  }

  .map__floor-toolbar {
    position: absolute;
    right: 20px;
    top: 0;
    width: 50px;
    height: 100%;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .map__floor-btn {
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 25px;
    margin: 25px auto;
    background-color: white;
    color: #28303B;
    font-size: 1.5em;
  }

  .map__floor-btn_active {
    background-color: #28303B;
    color: white;
  }
</style>
